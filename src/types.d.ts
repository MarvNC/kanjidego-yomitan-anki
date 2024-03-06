import { INFO_CATEGORIES } from './constants';

type termReading = {
  term: string;
  reading: string;
};

type InfoCategory = (typeof INFO_CATEGORIES)[number];

type termInfo = {
  [K in InfoCategory]?: K extends '別表記' | '別解' ? string[] : string;
};

type termData = {
  termReading: termReading;
  termInfo: termInfo;
  termLevel: string;
};

type csvRecord = {
  問題ID?: string;
  単語: string;
  元単語?: string;
  読み方: string;
  意味?: string;
  別解: string;
  別表記: string;
  追記?: string;
  レベル: string;
  画像: string;
  切り抜き画像: string;
  Tags?: string;
};
