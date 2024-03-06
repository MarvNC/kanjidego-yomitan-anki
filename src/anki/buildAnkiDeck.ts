import { csvRecord, termData } from '../types';
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
  const records: csvRecord[] = [];

  for (const termData of termDataArr) {
    records.push(...getRecordsForTerm(termData));
  }

  // 単語 as key, list of Record as value
  const recordsMap = new Map<string, csvRecord[]>();

  // Add all records
  for (const record of records) {
    const { 単語 } = record;
    if (!recordsMap.has(単語)) {
      recordsMap.set(単語, [record]);
    } else {
      recordsMap.get(単語)?.push(record);
    }
  }

  // Remove duplicates
  for (const [, recordList] of recordsMap) {
    // Find the best one
    const bestRecord = getBestRecord(recordList);
    await csvWriter.writeRecords([bestRecord]);
  }
}

function getBestRecord(records: csvRecord[]): csvRecord {
  if (records.length === 1) return records[0];

  let bestRecord = records[0];
  let bestScore = recordHeuristic(bestRecord);

  for (const record of records) {
    const score = recordHeuristic(record);
    if (score > bestScore) {
      bestRecord = record;
      bestScore = score;
    }
  }

  return bestRecord;
}

/**
 * Evaluates how good this term is relatively
 * Higher is better
 * @param record
 */
function recordHeuristic(record: csvRecord): number {
  let score = 0;
  // Prefer original term
  if (!record.元単語) {
    score += 5000;
  }
  // Prefer existence of alternate readings
  if (record.別解) {
    score += 500;
  }
  // Prefer longer definition
  if (record.意味) {
    score += record.意味.length + 100;
  }
  // Prefer longer note
  if (record.追記) {
    score += record.追記.length + 100;
  }
  // Prefer longer alt terms list
  if (record.別表記) {
    score += record.別表記.length + 50;
  }
  return score;
}

function getRecordsForTerm(termData: termData) {
  const records: csvRecord[] = [];

  const { term, reading } = termData.termReading;
  const { 別表記, 別解, 意味, 追記, 問題ID } = termData.termInfo;

  const level = termData.termLevel;

  let tags = `${KANJI_DE_GO_NAME}-${level}`;

  const record: csvRecord = {
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

  records.push({ ...record });

  record.元単語 = term;
  tags += ` ${KANJI_DE_GO_NAME}-別表記`;

  if (!別表記) return records;

  for (const altForm of 別表記 ?? []) {
    // Remove this alt form from array and add back original term
    const newAlts = 別表記.filter((alt) => alt !== altForm);
    newAlts.unshift(term);

    records.push({
      ...record,
      単語: altForm,
      元単語: term,
      別表記: newAlts.join('・'),
      Tags: tags,
    });
  }
  return records;
}
