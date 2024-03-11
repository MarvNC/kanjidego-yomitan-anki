# Kanji de Go for Yomitan and Anki <!-- omit from toc -->

[Kanji de Go (漢字で Go!)](https://plicy.net/GamePlay/155561) is a fun game
quizzing people on rare/exotic kanji terms. In this repository I have scraped
the terms from the game with information from
[the fan wiki](https://w.atwiki.jp/kanjidego/) for use in
[Yomitan](https://github.com/themoeway/yomitan) (formerly Yomichan) and as an
Anki deck.

## Download <!-- omit from toc -->

|                                                                                    Github Releases                                                                                    |                                                         AnkiWeb                                                          |
| :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------: |
| [![](https://img.shields.io/github/v/tag/marvnc/kanjidego-yomitan-anki?style=for-the-badge&label=Github%20Release)](https://github.com/MarvNC/kanjidego-yomitan-anki/releases/latest) | [![](https://img.shields.io/badge/Download-AnkiWeb-blue?style=for-the-badge)](https://ankiweb.net/shared/info/657072844) |

- [Yomitan Dictionary](#yomitan-dictionary)
  - [Usage](#usage)
  - [Screenshots](#screenshots)
- [Anki Deck](#anki-deck)
  - [Usage](#usage-1)
  - [Limitations](#limitations)
  - [Screenshots](#screenshots-1)
  - [Info](#info)

## Yomitan Dictionary

Built using
[yomichan-dict-builder](https://github.com/MarvNC/yomichan-dict-builder).

### Usage

Simply download from the latest [Github release](#download) and import into
Yomitan.

> <!-- prettier-ignore -->
> [!IMPORTANT]
>
> This is tested to work with the latest versions of Yomitan (currently
> 2024.01.14.0). If you are using an older version or are using Yomichan/baba,
> you may run into issues with importing the dictionary, so please update to the
> latest version.

### Screenshots

|   ![chrome_𬻿_-_Yomitan_Search_-_Google_Chrome_2024-03-08_22-39-00](https://github.com/MarvNC/kanjidego-yomitan-anki/assets/17340496/0a9a814a-7df9-4d4b-aee7-aac0ea14e21e)   | ![chrome_おおいちざ_-_Yomitan_Search_-_Google_Chrome_2024-03-08_22-39-09](https://github.com/MarvNC/kanjidego-yomitan-anki/assets/17340496/41eff046-548c-4236-bb25-24b34db56b66) |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| ![chrome_たまう_-_Yomitan_Search_-_Google_Chrome_2024-03-08_22-39-24](https://github.com/MarvNC/kanjidego-yomitan-anki/assets/17340496/1c22f489-3c16-4d57-a4f3-bd68d27e4f44) |  ![chrome_かくれる_-_Yomitan_Search_-_Google_Chrome_2024-03-08_22-39-45](https://github.com/MarvNC/kanjidego-yomitan-anki/assets/17340496/c51e2164-6001-43bf-8cfe-675554bf0913)  |
|  ![chrome_丶部_-_Yomitan_Search_-_Google_Chrome_2024-03-08_22-40-03](https://github.com/MarvNC/kanjidego-yomitan-anki/assets/17340496/1496d689-4ae3-4ccc-8993-b4ce48d74bd0)  |     ![chrome_𠙴_-_Yomitan_Search_-_Google_Chrome_2024-03-08_22-40-16](https://github.com/MarvNC/kanjidego-yomitan-anki/assets/17340496/a5be3625-7feb-42a1-a106-bd0daaa9bc30)     |

## Anki Deck

Download from the latest [Github release or from AnkiWeb](#download).

[Kanji de Go (漢字で Go!)](https://plicy.net/GamePlay/155561) is a fun game
quizzing people on rare/exotic kanji terms. This deck has terms/information
sourced from the fan wiki: [漢字で GO!@ウィキ](https://w.atwiki.jp/kanjidego/).

The 漢字で GO! Anki deck contains the same information available in the
[Yomitan Dictionary](https://github.com/MarvNC/kanjidego-yomitan-anki?tab=readme-ov-file#yomitan-dictionary).

### Usage

The Anki deck is split into four subdecks: レベル 05, レベル 06, レベル 07, and
別表記. The first three are the levels in the game, and the last is for
alternate readings that were added from the 別表記 that were listed in the wiki.
Over 4,000 of the 7,000+ cards in the deck are alternate readings and they might
not be as useful to some as they don't show up in the actual 漢字で GO! game.
However they still contain many kanji alternate forms that you may enjoy
learning.

Features:

- Hover over the image to see the hint image (if available)
- Click on the text version of the term or the reading to copy it to the
  clipboard.
- Click on the links at the bottom (漢字で GO!@ウィキ and sometimes another
  site) to view more information.

For reference, according to
[Kuuube's kanji grid](https://github.com/Kuuuube/kanjigrid), the three main
levels contain 3,353 unique kanji in the main terms. Adding the 別表記 subdeck
brings the total up to 5,504 unique kanji.

### Limitations

- The source data from the wiki and the 別表記 s are not perfect, so there are
  some cards where the reading is not fully given or the headword is strange
  when there exists no unicode character for it.
- The hint images are not cropped perfectly, so you may see some cut-off dots at
  the top of the images.
- In order to ensure the characters are rendered across all devices, a few fonts
  are included with the deck: `Simsun`, `Simsun-ExtB`, and `Noto Sans JP`. If
  you find that card loading speed is an issue on your mobile device, you may in
  the card styling css remove the `@font-face` declarations for these fonts, but
  keep in mind that some characters may no longer render correctly.

### Screenshots

| ![anki_Preview_2024-03-08_23-18-15](https://github.com/MarvNC/kanjidego-yomitan-anki/assets/17340496/b0ff9be9-5813-4410-b95c-285409a6b312) | ![anki_Preview_2024-03-08_23-18-34](https://github.com/MarvNC/kanjidego-yomitan-anki/assets/17340496/0baa87d2-6da3-45b7-a164-8c2c5634ecec) |
| :----------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------: |
| ![anki_Preview_2024-03-08_23-18-44](https://github.com/MarvNC/kanjidego-yomitan-anki/assets/17340496/68075c5d-ea18-4fe3-8b26-3237c2ff5561) | ![anki_Preview_2024-03-08_23-18-50](https://github.com/MarvNC/kanjidego-yomitan-anki/assets/17340496/bc2f65e9-a09c-4374-a99a-2a73479c7648) |

### Info

[GitHub Repository](https://github.com/MarvNC/kanjidego-yomitan-anki)

[Issues Tracker](https://github.com/MarvNC/kanjidego-yomitan-anki/issues)
