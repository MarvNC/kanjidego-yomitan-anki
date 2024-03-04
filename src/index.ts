import { scrapeAllPagesData } from './scrape/scrapePageData';
import { buildDictionary } from './yomitan/buildDictionary';
import { scrapeAllImages } from './scrape/scrapeAllImages';

(async () => {
  const termDataArr = await scrapeAllPagesData();
  await scrapeAllImages(termDataArr);
  await buildDictionary(termDataArr);
})();
