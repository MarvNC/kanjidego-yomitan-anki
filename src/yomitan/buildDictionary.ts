import {
  EXPORT_DIRECTORY,
  PROCESSED_DIRECTORY,
  YOMITAN_FILE_NAME,
} from '../constants';
import { Dictionary, TermEntry } from 'yomichan-dict-builder';
import { termData } from '../types';
import path from 'path';
import { convertTermToDetailedDefinition } from './convertTermToDetailedDefinition';
import fs from 'fs';

export async function buildDictionary(termDataArr: termData[]) {
  const dictionary = new Dictionary({
    fileName: YOMITAN_FILE_NAME,
  });

  dictionary.setIndex({
    title: '漢字でGo!',
    author: 'Marv',
    attribution: `https://formidi.github.io/KanzideGoFAQ/
    https://w.atwiki.jp/kanjidego/`,
    description: `From the Kanji de Go! unofficial wiki.`,
    revision: new Date().toISOString().split('T')[0],
    url: 'https://github.com/MarvNC/kanjidego-yomitan-anki',
  });

  const addImagesPromise = addAllImagesToDictionary(dictionary);

  for (const termData of termDataArr) {
    addTermToDictionary(termData, dictionary);
  }

  await addImagesPromise;

  const exportDir = path.join(process.cwd(), EXPORT_DIRECTORY);
  const stats = await dictionary.export(exportDir);
  console.log(`Exported ${stats.termCount} terms to ${exportDir}!`);
}

function addTermToDictionary(termData: termData, dictionary: Dictionary) {
  const { term, reading } = termData.termReading;
  // Some terms have an empty term string because they're too rare
  const termEntry = new TermEntry(term || reading);
  termEntry.setReading(reading);
  const detailedDefinition = convertTermToDetailedDefinition(termData);
  termEntry.addDetailedDefinition(detailedDefinition);
  dictionary.addTerm(termEntry.build());
  // Add alternate terms
  if (termData.termInfo.別表記) {
    for (const altTerm of termData.termInfo.別表記) {
      termEntry.setTerm(altTerm);
      dictionary.addTerm(termEntry.build());
    }
  }
  // Add alternate readings
  if (termData.termInfo.別解) {
    for (const altReading of termData.termInfo.別解) {
      termEntry.setReading(altReading);
      // If the term and reading was the same
      if (term === reading) {
        termEntry.setTerm(altReading);
      }
      dictionary.addTerm(termEntry.build());
    }
  }
}

async function addAllImagesToDictionary(dictionary: Dictionary) {
  const imageDir = path.join(process.cwd(), PROCESSED_DIRECTORY);
  const imageFiles = fs.readdirSync(imageDir);
  for (const imageFile of imageFiles) {
    const imageFilePath = path.join(imageDir, imageFile);
    dictionary.addFile(imageFilePath, `img/${imageFile}`);
  }
  console.log(`Added ${imageFiles.length} images to dictionary`);
}
