import { WIKI_PAGES_ARR } from './constants';
import jsdom from 'jsdom';
import fs from 'fs';

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

function getTermReadingFromHeader(header: HTMLHeadingElement) {
  const rb = header.querySelector('rb');
  const rt = header.querySelector('rt');
  if (!rb || !rt) {
    return {
      term: header.textContent,
      reading: '',
    };
  }
  return {
    term: rb.textContent,
    reading: rt.textContent,
  };
}

async function getPageDocument(pageUrl: string) {
  const response = await fetch(pageUrl);
  const text = await response.text();
  const dom = new jsdom.JSDOM(text);
  const document = dom.window.document;
  return document;
}
