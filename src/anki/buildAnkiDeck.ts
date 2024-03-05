import { termData } from '../types';
import path from 'path';
import { createObjectCsvWriter } from 'csv-writer';
import { EXPORT_DIRECTORY } from '../constants';

/**
 * Prints the data to a csv file
 * @param termDataArr
 */
export async function buildAnkiDeck(termDataArr: termData[]) {
  console.log('Building Anki deck');

  const csvPath = path.join(process.cwd(), EXPORT_DIRECTORY, 'ankiDeck.csv');

  console.log('Writing to csv:', csvPath);

  const csvWriter = createObjectCsvWriter({
    path: csvPath,
    header: [
      { id: 'term', title: '単語' },
      { id: 'id', title: '問題ID' },
      { id: 'reading', title: '読み方' },
      { id: 'alt', title: '別解' },
      { id: 'altSpellings', title: '別表記' },
      { id: 'meaning', title: '意味' },
      { id: 'notes', title: '追記' },
      { id: 'image', title: '画像' },
      { id: 'level', title: 'レベル' },
    ],
  });

  // Loop thru
  for (const termData of termDataArr) {
    // Print to csv
    const { term, reading } = termData.termReading;
    const {
      別表記: altSpellings,
      別解: alt,
      意味: meaning,
      追記: notes,
      問題ID: id,
    } = termData.termInfo;
    const level = termData.termLevel;
    const image = `${id}.png`;
    await csvWriter.writeRecords([
      {
        id,
        term,
        reading,
        meaning,
        alt,
        altSpellings,
        notes,
        level,
        image,
      },
    ]);
  }
}
