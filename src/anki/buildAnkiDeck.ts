import { termData } from '../types';
import path from 'path';
import { createObjectCsvWriter } from 'csv-writer';
import { EXPORT_DIRECTORY } from '../constants';

/**
 * Prints the data to a csv file
 * It prints in the following format:
 * 問題ID, term, reading, 意味, 別解, 別表記, 追記, level, image
 * @param termDataArr
 */
export async function buildAnkiDeck(termDataArr: termData[]) {
  console.log('Building Anki deck');

  const csvPath = path.join(process.cwd(), EXPORT_DIRECTORY, 'ankiDeck.csv');

  console.log('Writing to csv:', csvPath);

  const csvWriter = createObjectCsvWriter({
    path: csvPath,
    header: [
      { id: 'id', title: '問題ID' },
      { id: 'term', title: 'term' },
      { id: 'reading', title: 'reading' },
      { id: 'meaning', title: '意味' },
      { id: 'alt', title: '別解' },
      { id: 'altSpellings', title: '別表記' },
      { id: 'notes', title: '追記' },
      { id: 'level', title: 'level' },
      { id: 'image', title: 'image' },
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
