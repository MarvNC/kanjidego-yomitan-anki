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
  addHeadWord(termData, scArray);
  addMeaning(scArray, termData);
  addNotes(scArray, termData);
  return {
    type: 'structured-content',
    content: scArray,
  };
}

function addNotes(scArray: StructuredContent[], termData: termData) {
  if (termData.termInfo.追記 && termData.termInfo.追記 !== 'なし') {
    scArray.push({
      tag: 'div',
      data: {
        'kanji-de-go': 'notes',
      },
      content: [
        {
          tag: 'span',
          style: {
            fontSize: '0.8em',
            verticalAlign: 'text-bottom',
            borderStyle: 'solid',
            borderRadius: '0.15em',
            borderWidth: '0.05em',
            marginRight: '0.25em',
            padding: '0.1em 0.3em',
          },
          content: '追記',
        },
        termData.termInfo.追記,
      ],
    });
  }
}

function addHeadWord(termData: termData, scArray: StructuredContent[]) {
  // Clean the alt
  let alternatives = termData.termInfo.別表記;
  // Strip など from end if it exists
  if (alternatives && alternatives.endsWith('など')) {
    alternatives = alternatives.slice(0, -2);
  }
  scArray.push({
    tag: 'div',
    data: {
      'kanji-de-go': 'headword',
    },
    content: `【${termData.termReading.term}${
      termData.termInfo.別表記 && termData.termInfo.別表記 !== 'なし'
        ? `・${alternatives}`
        : ''
    }】`,
  });
}

function addMeaning(scArray: StructuredContent[], termData: termData) {
  scArray.push({
    tag: 'ul',
    data: {
      'kanji-de-go': 'meaning',
    },
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
      data: {
        'kanji-de-go': 'image',
      },
      style: {
        marginBottom: '0.5em',
      },
    });
  }
}
