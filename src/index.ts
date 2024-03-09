import { buildAnkiDeck } from './anki/buildAnkiDeck';
import { scrapeAllPagesData } from './scrape/scrapePageData';
import { TermData } from './types';
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
  callback: (data: TermData[]) => Promise<void>
) {
  const termDataArr = await scrapeAllPagesData();
  callback(termDataArr);
}
