import { INFO_CATEGORIES } from './constants';

type termReading = {
  term: string;
  reading: string;
};

type InfoCategory = typeof INFO_CATEGORIES[number];

type termInfo = {
  [K in InfoCategory]?: string;
};

type termData = {
  termReading: termReading;
  termInfo: termInfo;
};
