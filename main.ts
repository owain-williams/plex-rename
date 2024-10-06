import {
  getFilmFileName,
  getSubtitleFileNames,
  parseFilmYearCharAt,
  parseFilmYear,
  parseFilmName,
} from "./utils.ts";
const contents = Deno.readDirSync(Deno.cwd());
const filmFilename = getFilmFileName(contents);
const fileExtension = filmFilename?.split(".").pop();

const filmYearCharAt = parseFilmYearCharAt(filmFilename ?? "");
let correctYear = false;
let yearIndex = 0;

while (!correctYear && yearIndex < filmYearCharAt.length) {
  const currentYear = parseFilmYear(
    filmFilename ?? "",
    filmYearCharAt[yearIndex]
  );
  const userInput = prompt(`Is ${currentYear} the correct year? (Y/n)`);

  if (userInput?.toLowerCase() === "y" || userInput === "") {
    correctYear = true;
  } else {
    yearIndex++;
  }
}

if (!correctYear) {
  console.error("Error: No correct year found. Exiting...");
  Deno.exit(1);
}

const filmYear = parseFilmYear(filmFilename ?? "", filmYearCharAt[0]);

const filmName = parseFilmName(filmFilename ?? "", filmYearCharAt[0]);
let finalFilmName = filmName;
const isCorrectName = prompt(`Is "${filmName}" the correct film name? (Y/n)`);

if (isCorrectName?.toLowerCase() !== "y" || isCorrectName === "") {
  const userInput = prompt("Please enter the correct film name:");
  if (userInput && userInput.trim() !== "") {
    finalFilmName = userInput.trim();
  } else {
    console.error("Error: No valid film name provided. Exiting...");
    Deno.exit(1);
  }
}

const subtitleFileNames = getSubtitleFileNames(contents);
if (subtitleFileNames.length === 0) {
  console.log("No subtitle files found");
} else {
  console.log("Subtitle files found:");
  subtitleFileNames.forEach((file) => {
    console.log(file);
  });
}

const renameConfirmation = prompt(
  "Do you want to rename files and folders? (Y/n)"
);

if (renameConfirmation?.toLowerCase() !== "y" && renameConfirmation !== "") {
  console.log("Renaming operation cancelled. Exiting...");
  Deno.exit(0);
}

const folderName = Deno.cwd();

console.log(`folderName: ${folderName}`);
console.log(`newFileName: ${finalFilmName} (${filmYear}).${fileExtension}`);
