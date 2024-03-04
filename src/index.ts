import { scrapeAllPagesData } from './scrapePageData';
import { buildDictionary } from './buildDictionary';
import { termData } from './types';
import { IMAGES_DIRECTORY, KANJI_IMAGE_URL } from './constants';
import path from 'path';
import fs from 'fs';

(async () => {
  const termDataArr = await scrapeAllPagesData();
  await scrapeAllImages(termDataArr);
  await buildDictionary(termDataArr);
})();

async function scrapeAllImages(termDataArr: termData[]) {
  const imageDir = path.join(process.cwd(), IMAGES_DIRECTORY);
  for (const termData of termDataArr) {
    const levelID = termData.termInfo.問題ID;
    if (!levelID) {
      throw new Error('termInfo.問題ID must be defined');
    }
    const imageURL = KANJI_IMAGE_URL(levelID);
    const imageFilePath = path.join(imageDir, `${levelID}.png`);

    // Check if image already exists
    if (fs.existsSync(imageFilePath)) {
      console.log(`Image already exists at ${imageFilePath}`);
      continue;
    }

    console.log(`Scraping image from ${imageURL}`);
    const response = await fetch(imageURL);
    const buffer = await response.arrayBuffer();
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir);
    }
    fs.writeFileSync(imageFilePath, Buffer.from(buffer));
  }
}
