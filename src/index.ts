import { YOMITAN_FILE_NAME } from './constants';
import { scrapeAllPagesData } from './scrapePageData';
import { Dictionary } from 'yomichan-dict-builder';
import { termData } from './types';

(async () => {
  const termDataArr = await scrapeAllPagesData();
  console.log(termDataArr);
})();

async function buildDictionary(termDataArr: termData[]) {
  const dictionary = new Dictionary({
    fileName: YOMITAN_FILE_NAME,
  });
  for (const termData of termDataArr) {
    const { term, reading } = termData.termReading;
    // TODO
  }
  return dictionary;
}
