import { CROPPED_IMAGE_NAME, TRIMMED_DIRECTORY } from '../constants';
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
  addImage(scArray, termData);
  addHeadWord(scArray, termData);
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

function addHeadWord(scArray: StructuredContent[], termData: termData) {
  const alternatives = termData.termInfo.別表記?.join('・');
  const readings = [
    termData.termReading.reading,
    ...(termData.termInfo.別解 || []),
  ].join('・');
  scArray.push({
    tag: 'div',
    data: {
      'kanji-de-go': 'headword',
    },
    content: `【${termData.termReading.term}${
      termData.termInfo.別表記 && termData.termInfo.別表記.length > 0
        ? `・${alternatives}`
        : ''
    }】${readings}`,
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

function addImage(scArray: StructuredContent[], termData: termData) {
  const levelID = termData.termInfo.問題ID;
  if (!levelID) {
    return;
  }
  const imageFileName = CROPPED_IMAGE_NAME(levelID);
  const sourceImageFilePath = path.join(
    process.cwd(),
    TRIMMED_DIRECTORY,
    imageFileName
  );
  if (fs.existsSync(sourceImageFilePath)) {
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
