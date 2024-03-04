import { scrapeAllPagesData } from './scrapePageData';

(async () => {
  const termDataArr = await scrapeAllPagesData();
  console.log(termDataArr);
})();
