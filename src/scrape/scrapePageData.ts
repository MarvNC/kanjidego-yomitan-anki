import fs from 'fs';
import path from 'path';
import { EXPORT_DIRECTORY, JSON_FILE_NAME, WIKI_PAGES } from '../constants';
import { getPageDocument } from './getPageDocument';
import { termData, termReading, termReference } from '../types';
import { scrapeAllImages } from './scrapeAllImages';
import { cleanStr } from '../util/textUtils';
import { getTermInfo } from './getTermInfo';

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

  const termHeaders = [...document.querySelectorAll('#wikibody > h3')];
  const termDataArr: termData[] = [];
  for (const termHeader of termHeaders) {
    const termReading = getTermReadingFromHeader(termHeader);
    const termData: termData = {
      termReading: termReading,
      termInfo: getTermInfo(
        getNextULsText(termHeader),
        termReading.term,
        level
      ),
      termLevel: level,
    };
    const reference = getReference(getNextULs(termHeader));
    if (reference) {
      termData.termReference = reference;
    }
    termDataArr.push(termData);
  }
  return termDataArr;
}

/**
 * Gets the 典拠 text and URL if present.
 */
function getReference(uls: Element[]): termReference | null {
  // Find li starting with 典拠：
  const referenceLi = uls
    .map((ul) => [...ul.querySelectorAll('li')])
    .flat()
    .find((li) => li.textContent?.startsWith('典拠：'));
  if (referenceLi) {
    const anchor = referenceLi.querySelector('a');
    if (anchor && anchor.href && anchor.textContent !== null) {
      return { text: anchor.textContent, url: anchor.href };
    }
  }
  return null;
}

function getNextULs(header: Element): Element[] {
  const uls: Element[] = [];
  let nextElem = header.nextElementSibling;
  while (nextElem && nextElem.nodeName !== 'H3') {
    if (nextElem.nodeName === 'UL') {
      uls.push(nextElem);
    }
    nextElem = nextElem.nextElementSibling;
  }
  return uls;
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
