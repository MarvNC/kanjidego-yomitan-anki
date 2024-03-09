import { CROPPED_IMAGE_NAME, CROPPED_IMG_DIR } from '../constants';
import { TermData } from '../types';
import {
  DetailedDefinition,
  StructuredContent,
} from 'yomichan-dict-builder/dist/types/yomitan/termbank';
import path from 'path';
import fs from 'fs';

export function convertTermToDetailedDefinition(
  termData: TermData
): DetailedDefinition {
  const scArray: StructuredContent[] = [];
  addImage(scArray, termData);
  addHeadWord(scArray, termData);
  addMeaning(scArray, termData);
  addNotes(scArray, termData);
  addReferences(scArray, termData);
  return {
    type: 'structured-content',
    content: scArray,
  };
}

function addReferences(scArray: StructuredContent[], termData: TermData) {
  const attributionSCArray: StructuredContent[] = [];
  const { 問題ID } = termData.termInfo;
  if (問題ID) {
    attributionSCArray.push({
      tag: 'a',
      href: `https://w.atwiki.jp/kanjidego/search?andor=and&keyword=${問題ID}`,
      content: '漢字でGO!@ウィキ',
    });
  }
  const { termReference } = termData;
  if (termReference && termReference.text && termReference.url) {
    // Add divider if there's a previous reference
    if (attributionSCArray.length > 0) {
      attributionSCArray.push(' | ');
    }
    // Make sure URL is valid
    try {
      new URL(termReference.url);
      attributionSCArray.push({
        tag: 'a',
        href: termReference.url,
        content: termReference.text,
      });
    } catch (e) {
      // NOP
    }
  }
  scArray.push({
    tag: 'div',
    data: {
      'kanji-de-go': 'references',
    },
    style: {
      fontSize: '0.7em',
      textAlign: 'right',
    },
    content: attributionSCArray,
  });
}

function addNotes(scArray: StructuredContent[], termData: TermData) {
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

function addHeadWord(scArray: StructuredContent[], termData: TermData) {
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

function addMeaning(scArray: StructuredContent[], termData: TermData) {
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

function addImage(scArray: StructuredContent[], termData: TermData) {
  const levelID = termData.termInfo.問題ID;
  if (!levelID) {
    return;
  }
  const imageFileName = CROPPED_IMAGE_NAME(levelID);
  const sourceImageFilePath = path.join(
    process.cwd(),
    CROPPED_IMG_DIR,
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
