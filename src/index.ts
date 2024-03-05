import { scrapeAllPagesData } from './scrape/scrapePageData';
import { termData } from './types';
import { buildDictionary } from './yomitan/buildDictionary';
import yargs from 'yargs';

yargs
  .scriptName('kanjidego-yomitan-anki')
  .command('yomitan', 'Scrape Yomitan data and build Anki deck', () => {
    scrapeDataAndExecute(buildDictionary);
  })
  .command('anki', 'Scrape data and build Anki deck', () => {
    scrapeDataAndExecute(buildAnkiDeck);
  })
  .help().argv;

async function scrapeDataAndExecute(
  callback: (data: termData[]) => Promise<void>
) {
  const termDataArr = await scrapeAllPagesData();
  callback(termDataArr);
}

async function buildAnkiDeck(data: termData[]) {
  console.log('Building Anki deck');
  // TODO
}
