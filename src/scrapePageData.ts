import fs from 'fs';
import path from 'path';
import {
  INFO_CATEGORIES,
  EXPORT_DIRECTORY,
  JSON_FILE_NAME,
  WIKI_PAGES_ARR,
} from './constants';
import { getPageDocument } from './scrape/getPageDocument';
import { termData, termInfo, termReading } from './types';

export async function scrapeAllPagesData() {
  const termDataArr: termData[] = [];
  for (const pageUrl of WIKI_PAGES_ARR) {
    const data = await scrapePageData(pageUrl);
    termDataArr.push(...data);
  }
  console.log(`Scraped ${termDataArr.length} terms`);
  const jsonDirectory = path.join(process.cwd(), EXPORT_DIRECTORY);
  if (!fs.existsSync(jsonDirectory)) {
    fs.mkdirSync(jsonDirectory);
  }
  const jsonFilePath = path.join(jsonDirectory, JSON_FILE_NAME);
  fs.writeFileSync(jsonFilePath, JSON.stringify(termDataArr, null, 2));
  console.log(`Wrote JSON to ${jsonFilePath}`);
  return termDataArr;
}

export async function scrapePageData(pageUrl: string) {
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
  if (header.childNodes.length === 0) {
    throw new Error('Header has no children');
  }
  let term = '';
  let reading = '';
  for (const child of header.childNodes) {
    // If text node, add to term and reading
    if (child.nodeType === 3) {
      term += child.textContent;
      reading += child.textContent;
    }
    // If ruby text, add rb to term and rt to reading
    if (child.nodeName === 'RUBY') {
      const rubyElem = child as Element;
      const rb = rubyElem.querySelector('rb');
      const rt = rubyElem.querySelector('rt');
      if (!rb || !rt) {
        throw new Error('Ruby element must have rb and rt children');
      }
      term += rb.textContent;
      reading += rt.textContent;
    }
  }
  function cleanStr(str: string) {
    return str.replace(/[・()]/g, '');
  }
  term = cleanStr(term);
  reading = cleanStr(reading);
  return { term, reading };
}
