import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('scout', Path(__file__).with_name('crawl-ai-watch.py'))
scout = importlib.util.module_from_spec(spec)
spec.loader.exec_module(scout)

class DiscoveryTests(unittest.TestCase):
    def test_canonical_urls_reject_unsafe_schemes_and_credentials(self):
        self.assertEqual(scout.normalize_url('/blog/a?utm_source=x&edition=1#part', 'https://example.com'), 'https://example.com/blog/a?edition=1')
        for url in ['javascript:alert(1)', 'http://example.com/a', 'https://user:pass@example.com/a', 'https://example.com:8080/a']:
            self.assertIsNone(scout.normalize_url(url, 'https://example.com'))

    def test_discovery_deduplicates_and_bounds_domains(self):
        source = {'kind': 'index', 'url': 'https://example.com/blog', 'hosts':['example.com'], 'pathPrefix':'/blog/'}
        html = '<a href="/blog/a">A</a><a href="/blog/a#p">A again</a><a href="https://evil.test/blog/b">Other</a><a href="/privacy">Policy</a>'
        self.assertEqual(scout.discover(html, source), [('https://example.com/blog/a','')])

    def test_rss_and_atom(self):
        source = {'kind':'feed','url':'https://example.com/feed','hosts':['example.com'],'pathPrefix':'/blog/'}
        rss='<rss><channel><item><title>Agents at work</title><link>https://example.com/blog/a</link></item></channel></rss>'
        atom='<feed xmlns="http://www.w3.org/2005/Atom"><entry><title>New model</title><link href="https://example.com/blog/b" /></entry></feed>'
        self.assertEqual(scout.discover(rss, source)[0][1], 'Agents at work')
        self.assertEqual(scout.discover(atom, source)[0][0], 'https://example.com/blog/b')

    def test_all_editorial_lanes_are_discoverable(self):
        import json
        lanes = json.loads((scout.ROOT/'config/ai-watch-discovery.json').read_text())['lanes']
        self.assertIn('agent-capabilities', scout.classify('An agent gets a paid commission', lanes))
        self.assertIn('collective-risks', scout.classify('Bank run simulation and herding', lanes))
        self.assertIn('models-and-technologies', scout.classify('New multimodal model', lanes))
        self.assertIn('everyday-impact', scout.classify('AI in education', lanes))

    def test_metadata_does_not_collect_article_body(self):
        page=scout.Metadata();page.feed('<title>AI news</title><meta property="og:image" content="/image.png"><img src="/image.png" alt><p>Do not copy this article</p>')
        self.assertEqual(page.title,'AI news')
        self.assertEqual(page.meta['og:image'],'/image.png')
        self.assertNotIn('Do not copy',str(vars(page)))

if __name__ == '__main__':
    unittest.main()
