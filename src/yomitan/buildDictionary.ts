import {
  EXPORT_DIRECTORY,
  KANJI_DE_GO_NAME,
  CROPPED_IMG_DIR,
} from '../constants';
import { Dictionary, TermEntry } from 'yomichan-dict-builder';
import { TermData } from '../types';
import path from 'path';
import { convertTermToDetailedDefinition } from './convertTermToDetailedDefinition';
import fs from 'fs';

export async function buildDictionary(termDataArr: TermData[]) {
  console.log('Building Yomitan dictionary');

  const dateString = new Date().toISOString().split('T')[0];
  const dictionary = new Dictionary({
    fileName: `${KANJI_DE_GO_NAME}.zip`,
  });

  dictionary.setIndex({
    title: `漢字でGo! [${dateString}]`,
    author: 'Marv',
    attribution: `https://formidi.github.io/KanzideGoFAQ/
https://w.atwiki.jp/kanjidego/`,
    description: `From the Kanji de Go! unofficial wiki.
Built with https://github.com/MarvNC/yomichan-dict-builder`,
    revision: dateString,
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

function addTermToDictionary(termData: TermData, dictionary: Dictionary) {
  const { term, reading } = termData.termReading;
  // Some terms have an empty term string because they're too rare
  const termEntry = new TermEntry(term || reading);
  termEntry.setReading(reading);

  const detailedDefinition = convertTermToDetailedDefinition(termData);
  termEntry.addDetailedDefinition(detailedDefinition);

  termEntry.setTermTags('漢字でGo!');

  dictionary.addTerm(termEntry.build());

  // Deprioritize alternates
  termEntry.setPopularity(-5);

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
  const imageDir = path.join(process.cwd(), CROPPED_IMG_DIR);
  const imageFiles = fs.readdirSync(imageDir);
  for (const imageFile of imageFiles) {
    const imageFilePath = path.join(imageDir, imageFile);
    dictionary.addFile(imageFilePath, `img/${imageFile}`);
  }
  console.log(`Added ${imageFiles.length} images to dictionary`);
}
