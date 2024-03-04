export const WIKI_PAGES_ARR = [
  // level 6
  'https://w.atwiki.jp/kanjidego/pages/63.html',
  'https://w.atwiki.jp/kanjidego/pages/64.html',
  'https://w.atwiki.jp/kanjidego/pages/65.html',
  'https://w.atwiki.jp/kanjidego/pages/66.html',
  'https://w.atwiki.jp/kanjidego/pages/67.html',
  'https://w.atwiki.jp/kanjidego/pages/68.html',
  'https://w.atwiki.jp/kanjidego/pages/78.html',
  'https://w.atwiki.jp/kanjidego/pages/90.html',
  // level 7
  'https://w.atwiki.jp/kanjidego/pages/17.html',
  'https://w.atwiki.jp/kanjidego/pages/61.html',
  'https://w.atwiki.jp/kanjidego/pages/73.html',
];
export const KANJI_IMAGE_URL = (ID: string) =>
  `https://html5.plicy.net/GameFilesUpdate/155561/234/img/pictures/${ID}.png`;
export const PAGES_DIRECTORY = '/pages';
export const IMAGES_DIRECTORY = '/images';
export const JSON_DIRECTORY = '/json';
export const JSON_FILE_NAME = 'termData.json';
export const INFO_CATEGORIES = [
  '意味',
  '別解',
  '別表記',
  '問題ID',
  '追記',
] as const;
