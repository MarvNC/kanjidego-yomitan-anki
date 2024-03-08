import fs from 'fs';
import path from 'path';
import { EXPORT_DIRECTORY, JSON_FILE_NAME, WIKI_PAGES } from '../constants';
import { getPageDocument } from './getPageDocument';
import { termData, termReading } from '../types';
import { scrapeAllImages } from './scrapeAllImages';
import { cleanStr } from '../util/textUtils';
import { addTermInfo } from './getTermInfo';

export async function scrapeAllPagesData() {
  const termDataArr: termData[] = [];
  for (const level of Object.keys(WIKI_PAGES)) {
    for (const pageUrl of WIKI_PAGES[level]) {
      const data = await scrapePageData(pageUrl, level);
      termDataArr.push(...data);
    }
  }
  console.log(`Scraped ${termDataArr.length} terms`);
  const jsonDirectory = path.join(process.cwd(), EXPORT_DIRECTORY);
  if (!fs.existsSync(jsonDirectory)) {
    fs.mkdirSync(jsonDirectory);
  }
  const jsonFilePath = path.join(jsonDirectory, JSON_FILE_NAME);
  fs.writeFileSync(jsonFilePath, JSON.stringify(termDataArr, null, 2));
  console.log(`Wrote JSON to ${jsonFilePath}`);

  await scrapeAllImages(termDataArr);
  return termDataArr;
}

export async function scrapePageData(pageUrl: string, level: string) {
  const document = await getPageDocument(pageUrl);

  const headers = [...document.querySelectorAll('#wikibody > h3')];
  const termData: termData[] = [];
  for (const header of headers) {
    const termReading = getTermReadingFromHeader(header);
    const ulsText = getNextULsText(header);
    const termInfo = addTermInfo(ulsText, termReading.term, level);
    termData.push({ termReading, termInfo, termLevel: level });
  }
  return termData;
}

export function lineForCategory(line: string, category: string) {
  return line.startsWith(category) || line.substring(1).startsWith(category);
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
    } else {
      if (nextElem.textContent) {
        ulsText.push(nextElem.textContent.trim());
      }
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
  term = cleanStr(term);
  reading = cleanStr(reading);
  return { term, reading };
}
