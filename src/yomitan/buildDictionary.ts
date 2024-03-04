import { EXPORT_DIRECTORY, YOMITAN_FILE_NAME } from '../constants';
import { Dictionary, TermEntry } from 'yomichan-dict-builder';
import { termData } from '../types';
import path from 'path';
import { convertTermToDetailedDefinition } from './convertTermToDetailedDefinition';

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

  addAllImagesToDictionary();

  for (const termData of termDataArr) {
    addTermToDictionary(termData, dictionary);
  }

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
  if (termData.termInfo.別解 && termData.termInfo.別解 !== 'なし') {
    termEntry.setReading(termData.termInfo.別解);
    if (!termData.termReading.term) {
      termEntry.setTerm(termData.termInfo.別解);
    }
    dictionary.addTerm(termEntry.build());
  }
}

function addAllImagesToDictionary() {
  // TODO
}
