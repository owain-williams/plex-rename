const ALLOWED_VIDEO_EXTENSIONS = ["mp4", "mkv", "avi", "mov"];
const ALLOWED_SUBTITLE_EXTENSIONS = ["srt", "sub"];

export const getFilmFileName = (contents: Iterable<Deno.DirEntry>) => {
  const result: string[] = [];
  for (const file of contents) {
    if (
      ALLOWED_VIDEO_EXTENSIONS.includes(
        file.name.split(".")[file.name.split(".").length - 1].toLowerCase()
      )
    ) {
      result.push(file.name);
    }
  }
  if (result.length === 0) {
    return null;
  }
  if (result.length > 1) {
    return getLargestFile(result);
  }
  return result[0];
};

export const getSubtitleFileNames = (
  contents: Iterable<Deno.DirEntry>
): string[] => {
  const result: string[] = [];
  for (const file of contents) {
    if (
      ALLOWED_SUBTITLE_EXTENSIONS.includes(
        file.name.split(".")[file.name.split(".").length - 1].toLowerCase()
      )
    ) {
      result.push(file.name);
    }
  }
  return result;
};

export const getLargestFile = (files: string[]): string => {
  const largestFile = files.reduce((largest, current) => {
    return Deno.statSync(largest).size > Deno.statSync(current).size
      ? largest
      : current;
  });
  return largestFile;
};

export const parseFilmYearCharAt = (filmFileName: string): number[] => {
  let results: number[] = [];
  for (let i = 0; i < filmFileName.length - 3; i++) {
    const fourDigits = filmFileName.slice(i, i + 4);
    if (!/^\d{4}$/.test(fourDigits)) {
      continue;
    }
    if (parseInt(fourDigits) > 1900 && parseInt(fourDigits) < 2100) {
      results.push(i);
    }
  }
  return results.reverse();
};

export const parseFilmYear = (filmFilename: string, charAt: number): string => {
  return filmFilename.substring(charAt, charAt + 4);
};

export const parseFilmName = (filmFilename: string, charAt: number): string => {
  const filmName = filmFilename
    .substring(0, charAt)
    .split("]")
    .pop()
    ?.replace(/^[^a-zA-Z0-9]+/, "")
    ?.replaceAll(".", " ")
    .replaceAll("(", " ")
    .replaceAll(")", " ")
    .trim();
  return filmName ?? "";
};
