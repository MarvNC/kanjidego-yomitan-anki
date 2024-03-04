import {
  INFO_CATEGORIES,
  JSON_DIRECTORY,
  JSON_FILE_NAME,
  WIKI_PAGES_ARR,
} from './constants';
import fs from 'fs';
import path from 'path';
import { getPageDocument } from './scrape/getPageDocument';
import { termData, termInfo, termReading } from './types';

(async () => {
  const termDataArr: termData[] = [];
  for (const pageUrl of WIKI_PAGES_ARR) {
    const data = await scrapePageData(pageUrl);
    termDataArr.push(...data);
  }
  console.log(`Scraped ${termDataArr.length} terms`);
  const jsonDirectory = path.join(process.cwd(), JSON_DIRECTORY);
  if (!fs.existsSync(jsonDirectory)) {
    fs.mkdirSync(jsonDirectory);
  }
  const jsonFilePath = path.join(jsonDirectory, JSON_FILE_NAME);
  fs.writeFileSync(jsonFilePath, JSON.stringify(termDataArr, null, 2));
})();

/**
 * Gets the data from the page
 * @param pageUrl
 */
async function scrapePageData(pageUrl: string) {
  const document = await getPageDocument(pageUrl);

  const headers = [...document.querySelectorAll('#wikibody > h3')];
  const termData: termData[] = [];
  for (const header of headers) {
    const termReading = getTermReadingFromHeader(header);
    const ulElem = getNextUL(header);
    const termInfo = getTermInfo(ulElem);
    termData.push({ termReading, termInfo });
  }
  return termData;
}

function getTermInfo(ulElem: Element): termInfo {
  const lines: string[] = [];
  for (const li of ulElem.querySelectorAll('li')) {
    const line = li.textContent;
    if (!line) {
      throw new Error('li must have text content');
    }
    lines.push(line);
  }
  const termInfo: termInfo = {};
  for (const category of INFO_CATEGORIES) {
    const line = lines.find((line) => line.startsWith(category));
    if (line) {
      termInfo[category] = line.slice(category.length + 1);
    } else {
      termInfo[category] = '';
    }
  }
  return termInfo;
}

function getNextUL(header: Element): Element {
  let nextEl = header.nextElementSibling;
  while (nextEl && nextEl.tagName !== 'UL') {
    nextEl = nextEl.nextElementSibling;
  }
  if (!nextEl) {
    throw new Error('No UL found after header');
  }
  return nextEl;
}

function getTermReadingFromHeader(header: Element): termReading {
  const rb = header.querySelector('rb');
  const rt = header.querySelector('rt');
  if (!rb && !rt) {
    if (!header.textContent) {
      throw new Error('header must have text content');
    }
    return {
      term: '',
      reading: header.textContent,
    };
  }
  if (!rb || !rt) {
    throw new Error('rb and rt must both exist');
  }
  if (!rb.textContent || !rt.textContent) {
    throw new Error('rb and rt must have text content');
  }
  return {
    term: rb.textContent,
    reading: rt.textContent,
  };
}
