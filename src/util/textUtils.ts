export function cleanStr(str: string) {
  // eslint-disable-next-line no-irregular-whitespace
  return str.replace(/[・() 　]|\*1|\*2/g, '');
}
export function removeFromEnd(str: string, stringsToRemove: string[]): string {
  for (const stringToRemove of stringsToRemove) {
    if (str.endsWith(stringToRemove)) {
      return str.slice(0, -stringToRemove.length);
    }
  }
  return str;
}
