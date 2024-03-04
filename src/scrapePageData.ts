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
    const ulsText = getNextULsText(header);
    const termInfo = getTermInfo(ulsText, termReading.term);
    termData.push({ termReading, termInfo });
  }
  return termData;
}

function getTermInfo(ulText: string[], term: string): termInfo {
  const termInfo: termInfo = {};
  const importantCategories = ['問題ID', '意味'];
  for (const category of INFO_CATEGORIES) {
    const line = ulText.find((line) => {
      return line.startsWith(category)
        ? true
        : category === '問題ID'
        ? line.startsWith('問題')
        : false;
    });
    if (line) {
      termInfo[category] = line.slice(category.length + 1);
    } else {
      termInfo[category] = '';
      if (importantCategories.includes(category)) {
        throw new Error(`${term}: Category ${category} not found`);
      }
    }
  }
  return termInfo;
}

/**
 * Gets all the text of the ULs after the header until the next h3 elem or
 * there are no more siblings
 * @param header
 * @returns
 */
function getNextULsText(header: Element): string[] {
  const ulsText: string[] = [];
  let nextElem = header.nextElementSibling;
  while (nextElem && nextElem.nodeName !== 'H3') {
    if (nextElem.nodeName === 'UL') {
      ulsText.push(
        ...[...nextElem.querySelectorAll('li')].map(
          (li) => li.textContent || ''
        )
      );
    }
    nextElem = nextElem.nextElementSibling;
  }
  return ulsText;
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
