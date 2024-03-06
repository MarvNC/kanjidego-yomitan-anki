import { termData } from '../types';
import path from 'path';
import { createObjectCsvWriter } from 'csv-writer';
import {
  CROPPED_IMAGE_NAME,
  EXPORT_DIRECTORY,
  IMAGE_NAME,
  KANJI_DE_GO_NAME,
} from '../constants';

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
      { id: 'origTerm', title: '元単語' },
      { id: 'id', title: '問題ID' },
      { id: 'reading', title: '読み方' },
      { id: 'alt', title: '別解' },
      { id: 'altSpellings', title: '別表記' },
      { id: 'meaning', title: '意味' },
      { id: 'notes', title: '追記' },
      { id: 'level', title: 'レベル' },
      { id: 'image', title: '画像' },
      { id: 'croppedImage', title: '切り抜き画像' },
      { id: 'tags', title: 'Tags' },
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
    const altSpellingsString = altSpellings ? altSpellings.join('・') : '';
    const altString = alt ? alt.join('・') : '';

    const level = termData.termLevel;

    const image = id ? `<img src="${IMAGE_NAME(id)}">` : '';
    const croppedImage = id ? `<img src="${CROPPED_IMAGE_NAME(id)}">` : '';

    let tags = `${KANJI_DE_GO_NAME}-${level}`;

    const records = [];

    const record: {
      id?: string;
      term: string;
      origTerm?: string;
      reading: string;
      meaning?: string;
      alt: string;
      altSpellings: string;
      notes?: string;
      level: string;
      image: string;
      croppedImage: string;
      tags?: string;
    } = {
      id,
      term,
      reading,
      meaning,
      alt: altString,
      altSpellings: altSpellingsString,
      notes,
      level,
      image,
      croppedImage,
      tags,
    };

    records.push({ ...record });

    // Add alternates with tag '別表記'
    record.origTerm = term;
    tags += ` ${KANJI_DE_GO_NAME}-別表記`;

    for (const altTerm of altSpellings ?? []) {
      // Set term to altTerm and set origTerm
      records.push({ ...record, term: altTerm, origTerm: term, tags });
    }

    await csvWriter.writeRecords(records);
  }
}
