import { INFO_CATEGORIES } from './constants';

export type TermReading = {
  term: string;
  reading: string;
};

export type InfoCategory = (typeof INFO_CATEGORIES)[number];

export type TermInfo = {
  [K in InfoCategory]?: K extends '別表記' | '別解' ? string[] : string;
};

export type TermReference = {
  text: string;
  url: string;
};

export type TermData = {
  termReading: TermReading;
  termInfo: TermInfo;
  termLevel: string;
  termReference?: TermReference;
};

export type CsvRecord = {
  問題ID?: string;
  単語: string;
  元単語?: string;
  読み方: string;
  意味?: string;
  別解: string;
  別表記: string;
  追記?: string;
  典拠?: string;
  典拠リンク?: string;
  レベル: string;
  画像: string;
  切り抜き画像: string;
  Tags?: string;
};
