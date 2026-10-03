# AI Watch API cost note

Review this note before AI Watch goes live. Prices change, so update the figures against the current provider rate cards before enabling scheduled crawling.

## Planning estimate

The working medium scenario is:

- 200 articles per scan
- Two scans per day
- 400 articles per day, or about 12,000 articles per month
- About 3,000 input tokens and 3,000 output tokens per article for classification, summary, and translation

At that volume, DeepSeek Flash is estimated at about **$7–$14 per month**, depending on peak versus off-peak pricing. Qwen Plus is estimated at about **$11–$30 per month**, depending on region, model, and context tier. These estimates cover model API usage only.

Using Google Cloud NMT for full article translation could cost roughly **$700+ per month** at the same volume because it meters characters rather than tokens. Translating only titles, summaries, and excerpts lowers this substantially.

## Provider decision

Use DeepSeek Flash for crawling analysis, deduplication, categorization, summaries, and a first-pass translation. Before go-live, compare DeepSeek and Qwen on a representative Thai sample. Use Qwen for translation if its Thai output is materially better; otherwise keep DeepSeek for both tasks to minimize cost and operational complexity.

## Go-live checklist

1. Recheck the current [DeepSeek pricing](https://api-docs.deepseek.com/quick_start/pricing/) and [Qwen pricing](https://help.aliyun.com/en/model-studio/model-pricing).
2. Measure actual articles per scan, average input/output tokens, cache-hit rate, and retry rate in the sandbox.
3. Decide whether to translate full articles or only the title, summary, and excerpt.
4. Run a Thai translation quality review and record the selected provider and model.
5. Set monthly spend alerts and a hard usage limit before enabling twice-daily production crawling.

The estimate excludes crawler infrastructure, article extraction, Cloudflare Workers, storage, retries, and image processing.
