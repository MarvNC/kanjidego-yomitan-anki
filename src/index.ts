import { WIKI_PAGES_ARR } from './constants';
// import fs from 'fs';
import { getPageDocument } from './scrape/getPageDocument';

(async () => {
  // console.log(WIKI_PAGES_ARR);
  for (const pageUrl of WIKI_PAGES_ARR) {
    await scrapePageData(pageUrl);
  }
})();

/**
 * Gets the data from the page
 * @param pageUrl
 */
async function scrapePageData(pageUrl: string) {
  const document = await getPageDocument(pageUrl);

  const headers = [...document.querySelectorAll('#wikibody > h3')];
  const termData = [];
  for (const header of headers) {
    const termReading = getTermReadingFromHeader(header);
    const term = {
      term: termReading.term,
      reading: termReading.reading,
      // TODO
      // meaning: '',
      // level: 0,
      // image: '',
    };
    termData.push(term);
  }
}

function getTermReadingFromHeader(header: Element) {
  const rb = header.querySelector('rb');
  const rt = header.querySelector('rt');
  if (!rb || !rt) {
    return {
      term: '',
      reading: header.textContent,
    };
  }
  return {
    term: rb.textContent,
    reading: rt.textContent,
  };
}
