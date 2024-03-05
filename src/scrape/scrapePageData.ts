import fs from 'fs';
import path from 'path';
import {
  INFO_CATEGORIES,
  EXPORT_DIRECTORY,
  JSON_FILE_NAME,
  WIKI_PAGES,
} from '../constants';
import { getPageDocument } from './getPageDocument';
import { termData, termInfo, termReading } from '../types';
import { scrapeAllImages } from './scrapeAllImages';

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
    const termInfo = getTermInfo(ulsText, termReading.term, level);
    termData.push({ termReading, termInfo, termLevel: level });
  }
  return termData;
}

function lineForCategory(line: string, category: string) {
  return line.startsWith(category) || line.substring(1).startsWith(category);
}

function getTermInfo(ulText: string[], term: string, level: string): termInfo {
  const termInfo: termInfo = {};
  const importantCategories = ['問題ID', '意味'];
  for (const category of INFO_CATEGORIES) {
    const line = ulText.find((line) => {
      return (
        lineForCategory(line, category) ||
        (category === '問題ID' &&
          (lineForCategory(line, '問題') || lineForCategory(line, '問顺ID')))
      );
    });
    if (line) {
      let info = line.slice(category.length + 1).trim();
      if (info === 'なし') {
        continue;
      }
      if (category === '別表記' || category === '別解') {
        // Remove など from end if it exists for 別表記
        if (category === '別表記' && info.endsWith('など')) {
          info = info.slice(0, -2);
        }
        termInfo[category] = info
          .split(/[ 、,，]/)
          .map((term) => term.trim())
          .filter((term) => term);
      } else if (category === '問題ID') {
        // Add 'Lv' at start if it doesn't exist
        if (!info.startsWith('Lv')) {
          info = `Lv${info}`;
        }

        // Some terms had erroneous IDs
        const levelRegex = /Lv\d\d/;
        const levelString = `Lv${level}`;

        if (!info.includes(levelString)) {
          console.log(
            `Term ${term} has wrong level ID: ${info}. Changing to ${levelString}`
          );
          info = info.replace(levelRegex, levelString);
        }
        termInfo[category] = info;
      } else {
        termInfo[category] = info;
      }
    } else {
      if (importantCategories.includes(category)) {
        console.error(`${term}: Category ${category} not found`);
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
  function cleanStr(str: string) {
    return str.replace(/[・()]/g, '');
  }
  term = cleanStr(term);
  reading = cleanStr(reading);
  return { term, reading };
}
