import { DeepcrawlApp } from 'deepcrawl';
const dc = new DeepcrawlApp({ apiKey: process.env.DEEPCRAWLER_API_KEY! });
async function run() {
    const res = await dc.getMarkdown('https://example.com');
    console.log(typeof res, res);
}
run();
