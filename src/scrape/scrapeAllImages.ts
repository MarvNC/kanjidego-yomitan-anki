import { termData } from '../types';
import {
  CROPPED_IMG_DIR,
  IMAGES_DIRECTORY,
  KANJI_IMAGE_URL,
  PROCESSED_DIRECTORY,
} from '../constants';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import cliProgress from 'cli-progress';

export async function scrapeAllImages(termDataArr: termData[]) {
  const sourceImageDir = path.join(process.cwd(), IMAGES_DIRECTORY);
  const processedImageDir = path.join(process.cwd(), PROCESSED_DIRECTORY);

  const processImagePromises = [];

  const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

  bar.start(termDataArr.length, 0);
  console.log('Scraping images');
  for (const termData of termDataArr) {
    const levelID = termData.termInfo.問題ID;
    if (!levelID) {
      console.error(`No level ID found for term ${termData.termReading.term}`);
      continue;
    }
    const imageURL = KANJI_IMAGE_URL(levelID);
    const imageFilePath = path.join(sourceImageDir, `${levelID}.png`);

    // Check if image already exists
    if (!fs.existsSync(imageFilePath)) {
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

    bar.increment();
  }
  bar.stop();
  await Promise.all(processImagePromises);
  return cropAllImages();
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

  await sharp(sourceImagePath)
    .trim()
    .toFile(processedImagePath)
    .catch((err) => {
      console.error(`Error processing image at ${sourceImagePath}: ${err}`);
    });
}

export async function cropAllImages() {
  // Read all processed images
  const processedImageDir = path.join(process.cwd(), PROCESSED_DIRECTORY);
  const processedImages = fs.readdirSync(processedImageDir).filter((file) => {
    return file.endsWith('.png');
  });

  // Create the cropped image directory if it doesn't exist
  const croppedImageDir = path.join(process.cwd(), CROPPED_IMG_DIR);
  if (!fs.existsSync(croppedImageDir)) {
    fs.mkdirSync(croppedImageDir);
  }
  console.log('Cropped image directory:', croppedImageDir);

  const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  bar.start(processedImages.length, 0);
  console.log('Cropping images');

  for (const image of processedImages) {
    // Check if the image has already been processed
    const destFilePath = path.join(croppedImageDir, image);
    if (fs.existsSync(destFilePath)) {
      bar.increment();
      continue;
    }

    const sourceImagePath = path.join(processedImageDir, image);

    // Trim to bottom 285 pixels of image
    const metadata = await sharp(sourceImagePath).metadata();
    if (!metadata?.height || !metadata?.width) {
      console.error(`Error reading metadata for image ${image}`);
      continue;
    }
    const MAX_ANKI_IMG_HEIGHT = 280;
    const top = Math.max(metadata.height - MAX_ANKI_IMG_HEIGHT, 0);
    const height = Math.min(metadata.height, MAX_ANKI_IMG_HEIGHT);

    await sharp(sourceImagePath)
      .extract({
        top: top,
        left: 0,
        width: metadata.width,
        height: height,
      })
      .trim()
      .toFile(destFilePath)
      .catch((err) => {
        console.error(
          `Error processing image ${image}: ${err}. top: ${top}, left: 0, width: ${metadata.width}, height: ${MAX_ANKI_IMG_HEIGHT}`
        );
      });
    bar.increment();
  }
  bar.stop();
  console.log('Finished cropping images.');
}
