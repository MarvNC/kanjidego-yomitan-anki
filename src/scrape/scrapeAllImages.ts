import { termData } from '../types';
import {
  IMAGES_DIRECTORY,
  KANJI_IMAGE_URL,
  PROCESSED_DIRECTORY,
} from '../constants';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

export async function scrapeAllImages(termDataArr: termData[]) {
  const sourceImageDir = path.join(process.cwd(), IMAGES_DIRECTORY);
  const processedImageDir = path.join(process.cwd(), PROCESSED_DIRECTORY);

  const processImagePromises = [];

  for (const termData of termDataArr) {
    const levelID = termData.termInfo.問題ID;
    if (!levelID) {
      throw new Error(
        `Error on term ${termData.termReading.term}: 問題ID must be defined`
      );
    }
    const imageURL = KANJI_IMAGE_URL(levelID);
    const imageFilePath = path.join(sourceImageDir, `${levelID}.png`);

    // Check if image already exists
    if (!fs.existsSync(imageFilePath)) {
      console.log(`Scraping image from ${imageURL}`);
      const response = await fetch(imageURL);
      const buffer = await response.arrayBuffer();
      if (!fs.existsSync(sourceImageDir)) {
        fs.mkdirSync(sourceImageDir);
      }
      fs.writeFileSync(imageFilePath, Buffer.from(buffer));
    }

    // Add promise to process the image
    processImagePromises.push(
      processImage(sourceImageDir, processedImageDir, `${levelID}.png`)
    );
  }
  return Promise.all(processImagePromises);
}
/**
 * Process a single image by trimming transparency.
 * The processed image will be saved in the processed directory.
 * @param sourceImageDir The directory containing the source images.
 * @param processedImageDir The directory where the processed images will be saved.
 * @param imageName The name of the image file to process.
 */

async function processImage(
  sourceImageDir: string,
  processedImageDir: string,
  imageName: string
) {
  const sourceImagePath = path.join(sourceImageDir, imageName);
  const processedImagePath = path.join(processedImageDir, imageName);

  // Create the processed directory if it doesn't exist
  if (!fs.existsSync(processedImageDir)) {
    fs.mkdirSync(processedImageDir);
  }

  // Check if the image has already been processed
  if (fs.existsSync(processedImagePath)) {
    return;
  }

  console.log(`Processing image at ${sourceImagePath}`);
  await sharp(sourceImagePath)
    .trim()
    .toFile(processedImagePath)
    .catch((err) => {
      console.error(`Error processing image at ${sourceImagePath}: ${err}`);
    });
}
