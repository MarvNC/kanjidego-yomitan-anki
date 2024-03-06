import { termData } from '../types';
import path from 'path';
import { createObjectCsvWriter } from 'csv-writer';
import {
  CROPPED_IMAGE_NAME,
  EXPORT_DIRECTORY,
  IMAGE_NAME,
  KANJI_DE_GO_NAME,
} from '../constants';

export async function buildAnkiDeck(termDataArr: termData[]) {
  console.log('Building Anki deck');

  const csvPath = path.join(process.cwd(), EXPORT_DIRECTORY, 'ankiDeck.csv');

  console.log('Writing to csv:', csvPath);

  const csvWriter = createObjectCsvWriter({
    path: csvPath,
    header: [
      { id: '単語', title: '単語' },
      { id: '元単語', title: '元単語' },
      { id: '問題ID', title: '問題ID' },
      { id: '読み方', title: '読み方' },
      { id: '別解', title: '別解' },
      { id: '別表記', title: '別表記' },
      { id: '意味', title: '意味' },
      { id: '追記', title: '追記' },
      { id: 'レベル', title: 'レベル' },
      { id: '画像', title: '画像' },
      { id: '切り抜き画像', title: '切り抜き画像' },
      { id: 'Tags', title: 'Tags' },
    ],
  });

  for (const termData of termDataArr) {
    const { term, reading } = termData.termReading;
    const { 別表記, 別解, 意味, 追記, 問題ID } = termData.termInfo;

    const level = termData.termLevel;

    let tags = `${KANJI_DE_GO_NAME}-${level}`;

    const record: {
      問題ID?: string;
      単語: string;
      元単語?: string;
      読み方: string;
      意味?: string;
      別解: string;
      別表記: string;
      追記?: string;
      レベル: string;
      画像: string;
      切り抜き画像: string;
      Tags?: string;
    } = {
      問題ID,
      単語: term,
      読み方: reading,
      意味,
      別解: 別解 ? 別解.join('・') : '',
      別表記: 別表記 ? 別表記.join('・') : '',
      追記,
      レベル: level,
      画像: 問題ID ? `<img src="${IMAGE_NAME(問題ID)}">` : '',
      切り抜き画像: 問題ID ? `<img src="${CROPPED_IMAGE_NAME(問題ID)}">` : '',
      Tags: tags,
    };

    const records: (typeof record)[] = [];

    records.push({ ...record });

    record.元単語 = term;
    tags += ` ${KANJI_DE_GO_NAME}-別表記`;

    for (const altForm of 別表記 ?? []) {
      records.push({
        ...record,
        単語: altForm,
        元単語: term,
        Tags: tags,
      });
    }

    await csvWriter.writeRecords(records);
  }
}
