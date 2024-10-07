import {
  getFilmFileName,
  getSubtitleFileNames,
  parseFilmYearCharAt,
  parseFilmYear,
  parseFilmName,
} from "./utils.ts";
import * as mod from "jsr:@std/path";

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

const filmYear = parseFilmYear(filmFilename ?? "", filmYearCharAt[yearIndex]);

const filmName = parseFilmName(filmFilename ?? "", filmYearCharAt[yearIndex]);
let finalFilmName = filmName;
const isCorrectName = prompt(`Is "${filmName}" the correct film name? (Y/n)`);

if (isCorrectName?.toLowerCase() !== "y" && isCorrectName !== "") {
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

for (const subtitleFileName of subtitleFileNames) {
  const subtitleFilePath = Deno.cwd() + "/" + subtitleFileName;
  const newSubtitleFilePath =
    Deno.cwd() +
    "/" +
    finalFilmName +
    " (" +
    filmYear +
    ")." +
    subtitleFileName.split(".")[subtitleFileName.split(".").length - 1];
  Deno.renameSync(subtitleFilePath, newSubtitleFilePath);
}
Deno.renameSync(
  Deno.cwd() + "/" + filmFilename,
  finalFilmName + " (" + filmYear + ")." + fileExtension
);

function deleteUnwantedItems(directory: string) {
  for (const entry of Deno.readDirSync(directory)) {
    const itemPath = mod.join(directory, entry.name);
    const isVideoFile = entry.name === filmFilename;
    const isSubtitleFile = subtitleFileNames.includes(entry.name);

    if (!isVideoFile && !isSubtitleFile) {
      try {
        if (entry.isDirectory) {
          Deno.removeSync(itemPath, { recursive: true });
          console.log(`Deleted directory: ${entry.name}`);
        } else if (entry.isFile) {
          Deno.removeSync(itemPath);
          console.log(`Deleted file: ${entry.name}`);
        }
      } catch (error) {
        console.error(`Error deleting ${entry.name}: ${error.message}`);
      }
    }
  }
}

// Replace the existing deletion loop with this function call
deleteUnwantedItems(Deno.cwd());

// Rename the folder
const newFolderName = `${finalFilmName} (${filmYear})`;
const parentDir = Deno.cwd()
  .split(mod.SEPARATOR)
  .slice(0, -1)
  .join(mod.SEPARATOR);
const newFolderPath = mod.join(parentDir, newFolderName);

try {
  Deno.renameSync(Deno.cwd(), newFolderPath);
  console.log(`Folder renamed to: ${newFolderName}`);
} catch (error) {
  console.error(`Error renaming folder: ${error.message}`);
}
