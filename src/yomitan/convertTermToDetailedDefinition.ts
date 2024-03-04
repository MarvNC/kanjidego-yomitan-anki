import { PROCESSED_DIRECTORY } from '../constants';
import { termData } from '../types';
import {
  DetailedDefinition,
  StructuredContent,
} from 'yomichan-dict-builder/dist/types/yomitan/termbank';
import path from 'path';
import fs from 'fs';

export function convertTermToDetailedDefinition(
  termData: termData
): DetailedDefinition {
  const scArray: StructuredContent[] = [];
  addImage(termData, scArray);
  addMeaning(scArray, termData);
  return {
    type: 'structured-content',
    content: scArray,
  };
}

function addMeaning(scArray: StructuredContent[], termData: termData) {
  scArray.push({
    tag: 'ul',
    content: {
      tag: 'li',
      content: termData.termInfo.意味,
    },
  });
}

function addImage(termData: termData, scArray: StructuredContent[]) {
  const levelID = termData.termInfo.問題ID;
  const imageFileName = `${levelID}.png`;
  const imageFilePath = path.join(
    process.cwd(),
    PROCESSED_DIRECTORY,
    imageFileName
  );
  if (fs.existsSync(imageFilePath)) {
    scArray.push({
      tag: 'div',
      content: {
        tag: 'img',
        path: `img/${imageFileName}`,
        alt: termData.termReading.term,
        height: 4,
        sizeUnits: 'em',
        collapsed: false,
        collapsible: false,
        background: false,
      },
    });
  }
}
