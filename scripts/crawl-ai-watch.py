#!/usr/bin/env python3
"""Bounded manual source discovery. Metadata candidates only; never publishes."""
import hashlib
import json
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
import time
import urllib.error
import urllib.parse
import urllib.request
import urllib.robotparser
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
AGENT = 'NewHorizonNewsScout'
MAX_BYTES = 2_000_000
MAX_PER_SOURCE = 3


def normalize_url(raw, base):
    value = urllib.parse.urlsplit(urllib.parse.urljoin(base, raw))
    if value.scheme != 'https' or not value.hostname or value.username or value.password or value.port not in (None, 443):
        return None
    query = urllib.parse.urlencode([(k, v) for k, v in urllib.parse.parse_qsl(value.query) if not k.startswith('utm_')])
    return urllib.parse.urlunsplit((value.scheme, value.netloc.lower(), value.path, query, ''))


def allowed(url, source):
    return url and urllib.parse.urlsplit(url).hostname in source['hosts']


def classify(text, lanes):
    text = text.casefold()
    return [lane for lane, terms in lanes.items() if any(term in text for term in terms)]


class Metadata(HTMLParser):
    def __init__(self):
        super().__init__()
        self.meta, self.links, self.images, self.videos = {}, [], [], []
        self.title, self.in_title = '', False

    def handle_starttag(self, tag, attrs):
        attrs = {key: value or '' for key, value in attrs}
        if tag == 'title':
            self.in_title = True
        if tag == 'meta':
            self.meta[attrs.get('property', attrs.get('name', '')).lower()] = attrs.get('content', '')
        if tag == 'a' and attrs.get('href'):
            self.links.append(attrs['href'])
        if tag == 'img' and attrs.get('src'):
            self.images.append({'url': attrs['src'], 'alt': attrs.get('alt', '')[:300]})
        if tag in ('video', 'source', 'iframe') and attrs.get('src'):
            self.videos.append(attrs['src'])

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data


class Fetcher:
    def __init__(self, source):
        self.source, self.robots = source, {}
        outer = self

        class SafeRedirect(urllib.request.HTTPRedirectHandler):
            def redirect_request(self, req, fp, code, msg, headers, newurl):
                newurl = normalize_url(newurl, req.full_url)
                if not allowed(newurl, source):
                    raise ValueError('Redirect outside source allowlist')
                if not newurl.endswith('/robots.txt'):
                    outer.check_robots(newurl)
                return super().redirect_request(req, fp, code, msg, headers, newurl)
        self.opener = urllib.request.build_opener(SafeRedirect())

    def raw(self, url):
        if not allowed(url, self.source):
            raise ValueError('URL outside source allowlist')
        request = urllib.request.Request(url, headers={'User-Agent': AGENT, 'Accept': 'text/html,application/rss+xml,application/atom+xml,application/xml,text/plain'})
        with self.opener.open(request, timeout=12) as response:
            body = response.read(MAX_BYTES + 1)
            if len(body) > MAX_BYTES:
                raise ValueError('Response exceeds 2 MB cap')
            return body.decode('utf-8', errors='replace')

    def check_robots(self, url):
        parts = urllib.parse.urlsplit(url)
        origin = f'{parts.scheme}://{parts.netloc}'
        if origin not in self.robots:
            parser = urllib.robotparser.RobotFileParser()
            try:
                parser.parse(self.raw(origin + '/robots.txt').splitlines())
            except urllib.error.HTTPError as error:
                if error.code != 404:
                    raise
                parser.parse([])
            self.robots[origin] = parser
        parser = self.robots[origin]
        if not parser.can_fetch(AGENT, url):
            raise ValueError('Disallowed by robots.txt')
        delay = parser.crawl_delay(AGENT) or parser.crawl_delay('*') or 1
        if delay > 10:
            raise ValueError('Source crawl delay exceeds this manual run budget')
        time.sleep(max(1, delay))

    def get(self, url):
        self.check_robots(url)
        return self.raw(url)


def discover(body, source):
    if source['kind'] == 'page':
        return [(source['url'], '')]
    if source['kind'] == 'feed':
        root = ET.fromstring(body)
        records = []
        for item in root.iter():
            if item.tag.split('}')[-1] not in ('item', 'entry'):
                continue
            fields = {child.tag.split('}')[-1]: child for child in item}
            link = fields.get('link')
            title = fields.get('title')
            if link is not None:
                records.append((link.get('href') or link.text or '', ''.join(title.itertext()) if title is not None else ''))
    else:
        page = Metadata(); page.feed(body)
        records = [(link, '') for link in page.links]
    result, seen = [], set()
    for raw, title in records:
        # RSS publishers sometimes provide an HTTP canonical URL; fetch only its HTTPS form.
        raw = raw.replace('http://arxiv.org/', 'https://arxiv.org/')
        url = normalize_url(raw, source['url'])
        if allowed(url, source) and urllib.parse.urlsplit(url).path.startswith(source['pathPrefix']) and url not in seen:
            result.append((url, title)); seen.add(url)
    return result


def main():
    config = json.loads((ROOT / 'config/ai-watch-discovery.json').read_text())
    now = datetime.now(timezone.utc).isoformat()
    output = ROOT / '.agent-drafts/ai-watch'
    output.mkdir(parents=True, exist_ok=True)
    previous_path = output / 'latest.json'
    previous = json.loads(previous_path.read_text()) if previous_path.exists() else {'candidates': []}
    candidates = {item['id']: item for item in previous['candidates']}
    reports, found, changes = [], [], 0
    for source in config['sources'][:8]:
        report = {'source': source['id'], 'url': source['url'], 'fetched': 0, 'candidates': 0, 'errors': []}
        try:
            fetcher = Fetcher(source)
            body = fetcher.get(source['url'])
            records = discover(body, source)
            report['discoveredLinks'] = len(records)
            if not records:
                report['errors'].append({'url': source['url'], 'error': 'No eligible links found; source adapter needs review'})
            # Prefer matching feed titles but retain broad coverage for index pages.
            records.sort(key=lambda item: not bool(classify(item[1], config['lanes'])))
            for url, feed_title in records[:MAX_PER_SOURCE]:
                try:
                    html = body if url == source['url'] else fetcher.get(url)
                    page = Metadata(); page.feed(html); report['fetched'] += 1
                    title = (page.meta.get('og:title') or page.title or feed_title).strip()[:300]
                    lanes = classify(title + ' ' + page.meta.get('description', '') + ' ' + page.meta.get('og:description', ''), config['lanes'])
                    if not title or not lanes:
                        continue
                    images = ([{'url': page.meta['og:image'], 'alt': ''}] if page.meta.get('og:image') else []) + page.images[:4]
                    media = [{'kind': 'image', 'url': normalize_url(item['url'], url), 'alt': item['alt'], 'reviewStatus': 'unverified'} for item in images]
                    videos = ([page.meta['og:video']] if page.meta.get('og:video') else []) + page.videos[:3]
                    media += [{'kind': 'video', 'url': normalize_url(raw, url), 'reviewStatus': 'unverified'} for raw in videos]
                    media = [item for item in media if item['url']][:8]
                    identity = hashlib.sha256(url.encode()).hexdigest()[:24]
                    content = {'title': title, 'url': url, 'publishedAt': page.meta.get('article:published_time') or page.meta.get('citation_date') or None, 'media': media}
                    fingerprint = hashlib.sha256(json.dumps(content, sort_keys=True).encode()).hexdigest()
                    old = candidates.get(identity)
                    changed = not old or old['fingerprint'] != fingerprint
                    changes += int(changed)
                    candidates[identity] = {**content, 'id': identity, 'publisher': source['publisher'], 'lanes': lanes, 'fingerprint': fingerprint, 'firstSeenAt': old['firstSeenAt'] if old else now, 'lastCheckedAt': now, 'status': 'needs-editorial-review', 'summary': None, 'awarenessHook': None, 'evidenceType': 'unverified', 'mediaPlacement': 'inline-in-story', 'sourceReferences': [url], 'instructionsVersion': config['version']}
                    found.append(identity); report['candidates'] += 1
                except Exception as error:
                    report['errors'].append({'url': url, 'error': str(error)[:300]})
        except Exception as error:
            report['errors'].append({'url': source['url'], 'error': str(error)[:300]})
        reports.append(report)
    result = {'runAt': now, 'mode': 'manual-discovery-only', 'instructionsVersion': config['version'], 'newOrChanged': changes, 'observedIds': sorted(set(found)), 'sources': reports, 'candidates': sorted(candidates.values(), key=lambda item: item['id'])}
    serialized = json.dumps(result, ensure_ascii=False, indent=2) + '\n'
    temporary = output / 'latest.tmp'
    temporary.write_text(serialized); temporary.replace(previous_path)
    (output / (now.replace(':', '-') + '.json')).write_text(serialized)
    print(json.dumps({'report': str(previous_path), 'observedCandidates': len(set(found)), 'newOrChanged': changes, 'sourceErrors': sum(len(item['errors']) for item in reports), 'published': 0}))
    if not found:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
