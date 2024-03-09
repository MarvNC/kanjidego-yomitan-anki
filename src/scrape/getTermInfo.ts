import {
  INFO_CATEGORIES,
  END_STRINGS_TO_REMOVE,
  EMPTY_STRING,
} from '../constants';
import { InfoCategory, termInfo } from '../types';
import { cleanStr } from '../util/textUtils';
import { removeFromEnd } from '../util/textUtils';

/**
 * Adds term information to the termInfo object.
 *
 * @param ulText - The array of strings containing the term information.
 * @param term - The term to add information for.
 * @param level - The level of the term.
 * @returns The updated termInfo object.
 */
export function getTermInfo(
  ulText: string[],
  term: string,
  level: string
): termInfo {
  const termInfo: termInfo = {};

  for (const category of INFO_CATEGORIES) {
    const line = findLineForCategory(ulText, category);
    if (line) {
      const info = extractInfo(line, category);
      if (isValidInfo(info)) {
        addCategoryInfo(info, category, term, level, termInfo);
      }
    } else {
      handleMissingCategory(category, term);
    }
  }

  return termInfo;
}

function lineForCategory(line: string, category: string) {
  return line.startsWith(category) || line.substring(1).startsWith(category);
}

/**
 * Finds the line containing the specified category in the given array of lines.
 * @param ulText - The array of lines to search.
 * @param category - The category to find.
 * @returns The line containing the specified category, or undefined if not found.
 */
function findLineForCategory(
  ulText: string[],
  category: string
): string | undefined {
  return ulText.find((line) => {
    return (
      lineForCategory(line, category) ||
      (category === '問題ID' &&
        (lineForCategory(line, '問題') || lineForCategory(line, '問顺ID')))
    );
  });
}

/**
 * Extracts information from a line based on the specified category.
 * Ex. "意味: ～をする人。" -> "～をする人。"
 *
 * @param line - The line containing the information.
 * @param category - The category of the information.
 * @returns The extracted information.
 */
function extractInfo(line: string, category: string): string {
  let info = line.slice(category.length + 1).trim();
  if (category === '別表記') {
    info = removeFromEnd(info, END_STRINGS_TO_REMOVE);
  }
  return info;
}

/**
 * Checks if the provided info is valid, filtering out なし and etc.
 * @param info - The info to be checked.
 * @returns A boolean indicating whether the info is valid or not.
 */
function isValidInfo(info: string): boolean {
  return !EMPTY_STRING.includes(info);
}

/**
 * Adds category information to the termInfo object based on the provided category.
 * @param info - The information to be added.
 * @param category - The category of the information.
 * @param term - The term associated with the information.
 * @param level - The level associated with the term.
 * @param termInfo - The termInfo object to which the information will be added.
 */
function addCategoryInfo(
  info: string,
  category: InfoCategory,
  term: string,
  level: string,
  termInfo: termInfo
): void {
  if (category === '別表記' || category === '別解') {
    const altArray = processAltInfo(info);
    if (altArray.length > 0) {
      termInfo[category] = altArray;
    }
  } else if (category === '問題ID') {
    const problemId = processProblemIdInfo(info, term, level);
    if (problemId) {
      termInfo[category] = problemId;
    }
  } else {
    termInfo[category] = info;
  }
}

/**
 * Processes the alternative info string and returns an array of cleaned terms.
 *
 * @param info - The alternative info string to process.
 * @returns An array of cleaned terms.
 */
function processAltInfo(info: string): string[] {
  const altArray = info
    .split(/[ 、,，]/)
    .map((term) => cleanStr(term.trim()))
    .filter((term) => term && !EMPTY_STRING.includes(term));
  return altArray;
}

/**
 * Processes the problem ID info by ensuring it starts with 'Lv' and matches the specified level.
 * If the info does not start with 'Lv', it is prefixed with 'Lv'.
 * If the info does not match the specified level, it is replaced with the specified level.
 *
 * @param info - The problem ID info to process.
 * @param term - The term associated with the problem ID info.
 * @param level - The level to match against the problem ID info.
 * @returns The processed problem ID info.
 */
function processProblemIdInfo(
  info: string,
  term: string,
  level: string
): string {
  if (!info.startsWith('Lv')) {
    info = `Lv${info}`;
  }

  const levelRegex = /Lv\d\d/;
  const levelString = `Lv${level}`;

  if (!info.includes(levelString)) {
    console.log(
      `Term ${term} has wrong level ID: ${info}. Changing to ${levelString}`
    );
    info = info.replace(levelRegex, levelString);
  }

  return info;
}

/**
 * Handles the case when a category is missing for a term.
 * If the category is important, it logs an error message.
 * @param category - The missing category.
 * @param term - The term for which the category is missing.
 */
function handleMissingCategory(category: string, term: string): void {
  const importantCategories = ['問題ID', '意味'];
  if (importantCategories.includes(category)) {
    console.error(`${term}: Category ${category} not found`);
  }
}
