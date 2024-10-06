import { assertEquals } from "jsr:@std/assert";
import {
  getFilmFileName,
  getSubtitleFileNames,
  getLargestFile,
  parseFilmYearCharAt,
  parseFilmYear,
  parseFilmName,
} from "./utils.ts";

Deno.test("getFilmFileName", () => {
  const mockContents = [
    {
      name: "movie.mp4",
      isFile: true,
      isDirectory: false,
      isSymlink: false,
    },
    {
      name: "file1.txt",
      isFile: true,
      isDirectory: false,
      isSymlink: false,
    },
    {
      name: "folder",
      isFile: false,
      isDirectory: false,
      isSymlink: false,
    },
  ];
  assertEquals(getFilmFileName(mockContents), "movie.mp4");
});

Deno.test("getSubtitleFileNames", () => {
  const mockContents = [
    { name: "movie.mp4", isFile: true, isDirectory: false, isSymlink: false },
    {
      name: "subtitle1.srt",
      isFile: true,
      isDirectory: false,
      isSymlink: false,
    },
    {
      name: "subtitle2.sub",
      isFile: true,
      isDirectory: false,
      isSymlink: false,
    },
    { name: "folder", isFile: false, isDirectory: false, isSymlink: false },
  ];
  assertEquals(getSubtitleFileNames(mockContents), [
    "subtitle1.srt",
    "subtitle2.sub",
  ]);
});

Deno.test("getLargestFile", () => {
  const mockFiles = [
    { name: "file1.txt", size: 1000 },
    { name: "file2.txt", size: 2000 },
    { name: "file3.txt", size: 1500 },
  ];

  // Mock the Deno.statSync function
  const originalStatSync = Deno.statSync;
  Deno.statSync = (path: string | URL) => {
    const mockFile = mockFiles.find(
      (f) => f.name === (path instanceof URL ? path.pathname : path)
    );
    if (!mockFile) {
      throw new Error(`File not found: ${path}`);
    }
    return { size: mockFile.size } as Deno.FileInfo;
  };

  try {
    const largest = getLargestFile(mockFiles.map((f) => f.name));
    assertEquals(largest, "file2.txt");
  } finally {
    // Restore the original Deno.statSync function
    Deno.statSync = originalStatSync;
  }
});

Deno.test("parseFilmYearCharAt", () => {
  const filmFileName = "Great Movie (2023) HD.mp4";
  assertEquals(parseFilmYearCharAt(filmFileName), [13]);
});

Deno.test("parseFilmYear", () => {
  const filmFileName = "Great Movie (2023) HD.mp4";
  assertEquals(parseFilmYear(filmFileName, 13), "2023");
});

Deno.test("parseFilmName", () => {
  const filmFileName = "Great Movie (2023) HD.mp4";
  assertEquals(parseFilmName(filmFileName, 13), "Great Movie");
});
