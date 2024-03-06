export const WIKI_PAGES: {
  [key: string]: string[];
} = {
  '05': [
    'https://w.atwiki.jp/kanjidego/pages/33.html',
    'https://w.atwiki.jp/kanjidego/pages/34.html',
    'https://w.atwiki.jp/kanjidego/pages/35.html',
    'https://w.atwiki.jp/kanjidego/pages/36.html',
    'https://w.atwiki.jp/kanjidego/pages/37.html',
    'https://w.atwiki.jp/kanjidego/pages/39.html',
    'https://w.atwiki.jp/kanjidego/pages/40.html',
    'https://w.atwiki.jp/kanjidego/pages/41.html',
    'https://w.atwiki.jp/kanjidego/pages/42.html',
    'https://w.atwiki.jp/kanjidego/pages/59.html',
    'https://w.atwiki.jp/kanjidego/pages/60.html',
    'https://w.atwiki.jp/kanjidego/pages/71.html',
    'https://w.atwiki.jp/kanjidego/pages/79.html',
    'https://w.atwiki.jp/kanjidego/pages/80.html',
    'https://w.atwiki.jp/kanjidego/pages/89.html',
    'https://w.atwiki.jp/kanjidego/pages/93.html',
    'https://w.atwiki.jp/kanjidego/pages/94.html',
  ],
  '06': [
    'https://w.atwiki.jp/kanjidego/pages/63.html',
    'https://w.atwiki.jp/kanjidego/pages/64.html',
    'https://w.atwiki.jp/kanjidego/pages/65.html',
    'https://w.atwiki.jp/kanjidego/pages/66.html',
    'https://w.atwiki.jp/kanjidego/pages/67.html',
    'https://w.atwiki.jp/kanjidego/pages/68.html',
    'https://w.atwiki.jp/kanjidego/pages/78.html',
    'https://w.atwiki.jp/kanjidego/pages/90.html',
  ],
  '07': [
    'https://w.atwiki.jp/kanjidego/pages/17.html',
    'https://w.atwiki.jp/kanjidego/pages/61.html',
    'https://w.atwiki.jp/kanjidego/pages/73.html',
  ],
};
export const KANJI_IMAGE_URL = (ID: string) =>
  `https://html5.plicy.net/GameFilesUpdate/155561/234/img/pictures/${ID}.png`;

export const PAGES_DIRECTORY = '/pages';
export const IMAGES_DIRECTORY = '/images';
export const TRIMMED_DIRECTORY = `${IMAGES_DIRECTORY}/trimmed`;
export const CROPPED_IMG_DIR = `${IMAGES_DIRECTORY}/cropped`;
export const EXPORT_DIRECTORY = '/export';
export const IMAGE_NAME = (ID: string) => `${ID}.png`;
export const CROPPED_IMAGE_NAME = (ID: string) => `${ID}_cropped.png`;

export const JSON_FILE_NAME = 'termData.json';
export const KANJI_DE_GO_NAME = '漢字でGO!';
export const INFO_CATEGORIES = [
  '意味',
  '別解',
  '別表記',
  '問題ID',
  '追記',
] as const;
