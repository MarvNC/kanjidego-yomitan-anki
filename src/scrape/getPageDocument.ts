import fs from 'fs';
import path from 'path';
import util from 'util';
import jsdom from 'jsdom';
import { PAGES_DIRECTORY } from '../constants';

const fsExists = util.promisify(fs.exists);
const fsReadFile = util.promisify(fs.readFile);
const fsWriteFile = util.promisify(fs.writeFile);

/**
 * Gets the document from the page
 * Caches the page in the /pages directory
 * @param pageUrl
 * @returns
 */
export async function getPageDocument(pageUrl: string) {
  const fileName = pageUrl.replace(/\W/g, '_') + '.html';
  const filePath = path.join(process.cwd(), PAGES_DIRECTORY, fileName);

  let text;
  if (await fsExists(filePath)) {
    console.log('Reading from cache:', filePath);
    text = await fsReadFile(filePath, 'utf-8');
  } else {
    console.log('Fetching:', pageUrl);
    const response = await fetch(pageUrl);
    text = await response.text();
    // Create directory if it doesn't exist
    const dir = path.dirname(filePath);
    if (!(await fsExists(dir))) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
    await fsWriteFile(filePath, text);
  }

  const dom = new jsdom.JSDOM(text);
  const document = dom.window.document;
  return document;
}
