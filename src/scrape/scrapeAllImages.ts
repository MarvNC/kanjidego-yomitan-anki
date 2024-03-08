import { termData } from '../types';
import {
  CROPPED_IMAGE_NAME,
  CROPPED_IMG_DIR,
  IMAGES_DIRECTORY,
  IMAGE_NAME,
  KANJI_IMAGE_URL,
  TRIMMED_DIRECTORY,
} from '../constants';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import cliProgress from 'cli-progress';

export async function scrapeAllImages(termDataArr: termData[]) {
  const sourceImageDir = path.join(process.cwd(), IMAGES_DIRECTORY);
  const processedImageDir = path.join(process.cwd(), TRIMMED_DIRECTORY);
  const croppedImageDir = path.join(process.cwd(), CROPPED_IMG_DIR);

  const processImagePromises = [];

  const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

  console.log('Scraping images');
  bar.start(termDataArr.length, 0);
  for (const termData of termDataArr) {
    const levelID = termData.termInfo.問題ID;
    if (!levelID) {
      console.error(`No level ID found for term ${termData.termReading.term}`);
      continue;
    }
    const imageURL = KANJI_IMAGE_URL(levelID);
    const imageFilePath = path.join(sourceImageDir, IMAGE_NAME(levelID));

    // Check if image already exists
    if (!fs.existsSync(imageFilePath)) {
      try {
        const response = await fetch(imageURL);
        const buffer = await response.arrayBuffer();
        if (!fs.existsSync(sourceImageDir)) {
          fs.mkdirSync(sourceImageDir);
        }
        fs.writeFileSync(imageFilePath, Buffer.from(buffer));
      } catch (error) {
        console.error(`An error occurred: ${error}`);
      }
    }

    // Create the processed and cropped directories if they don't exist
    await createDirectoryIfNotExists(processedImageDir);
    await createDirectoryIfNotExists(croppedImageDir);

    // Add promise to process the image
    processImagePromises.push(
      processImage(sourceImageDir, processedImageDir, croppedImageDir, levelID)
    );

    bar.increment();
  }
  bar.stop();
  await Promise.all(processImagePromises);
  return;
}

/**
 * Process a single image by trimming transparency and cropping it.
 * The processed image will be saved in the processed directory,
 * and the cropped image will be saved in the cropped directory.
 * @param sourceImageDir The directory containing the source images.
 * @param processedImageDir The directory where the processed images will be saved.
 * @param croppedImageDir The directory where the cropped images will be saved.
 * @param ID The ID of the image.
 */
async function processImage(
  sourceImageDir: string,
  processedImageDir: string,
  croppedImageDir: string,
  ID: string
) {
  const sourceImagePath = path.join(sourceImageDir, IMAGE_NAME(ID));
  const processedImagePath = path.join(processedImageDir, IMAGE_NAME(ID));
  const croppedImagePath = path.join(croppedImageDir, CROPPED_IMAGE_NAME(ID));

  // Check if the processed image already exists
  if (!(await checkIfImageExists(processedImagePath))) {
    // Trim the image and save it
    await trimImage(sourceImagePath, processedImagePath);
  }

  // Check if the cropped image already exists
  if (!(await checkIfImageExists(croppedImagePath))) {
    // Crop the trimmed image
    await cropImage(processedImagePath, croppedImagePath);
  }
}

async function checkIfImageExists(imagePath: string): Promise<boolean> {
  return fs.existsSync(imagePath);
}

async function createDirectoryIfNotExists(directory: string): Promise<void> {
  if (!fs.existsSync(directory)) {
    await fs.promises.mkdir(directory);
  }
}

/**
 * Trims the transparency from an image.
 * @param imagePath The path to the image file.
 * @returns A Promise that resolves to a Sharp instance representing the trimmed image.
 */
async function trimImage(imagePath: string, outputPath: string): Promise<void> {
  await sharp(imagePath).trim().toFile(outputPath);
}

/**
 * Crops an image to a maximum height of 280 pixels, starting from the bottom.
 * @param imagePath The path to the image file.
 * @param destFilePath The path where the cropped image should be saved.
 */
async function cropImage(imagePath: string, destFilePath: string) {
  const MAX_ANKI_IMG_HEIGHT = 280;
  const image = sharp(imagePath);
  const metadata = await image.metadata();
  if (!metadata?.height || !metadata?.width) {
    console.error(`Error reading metadata for image ${destFilePath}`);
    return;
  }
  const top = Math.max(metadata.height - MAX_ANKI_IMG_HEIGHT, 0);
  const height = Math.min(metadata.height, MAX_ANKI_IMG_HEIGHT);

  await image
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
        `Error processing image ${destFilePath}: ${err}. top: ${top}, left: 0, width: ${metadata.width}, height: ${MAX_ANKI_IMG_HEIGHT}`
      );
    });
}
