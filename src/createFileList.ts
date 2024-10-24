import * as fs from "node:fs/promises";
import * as path from "node:path";
import { Options } from "@/index";
import { log } from "@/log";

/**
 * Creates a list of all the files in the specified project directory.
 *
 * @param projectPath - The path to the project directory.
 * @param ignorePatterns - An array of regex patterns for paths to ignore.
 * @returns An array of file paths.
 * @throws Error if the project directory does not exist or cannot be read.
 */
export default async function createFileList(
  projectPath: string,
  ignore: string[]
): Promise<string[]> {
  const fileList: string[] = [];

  log(`Starting to create file list from project path: ${projectPath}`);

  async function readDirectory(directory: string) {
    log(`Reading directory: ${directory}`);
    const entries = await fs.readdir(directory, { withFileTypes: true });
    log(`Entries in ${directory}: ${entries.map(entry => entry.name).join(', ')}`);

    for (const entry of entries) {
      log(`Processing entry: ${entry.name}`);
      const fullPath = path.join(directory, entry.name);
      log(`Full path: ${fullPath}`);

      if (ignore.some((pattern) => new RegExp(pattern).test(fullPath))) {
        log(`Ignoring path: ${fullPath} based on ignore patterns`);
        continue;
      }

      if (entry.isDirectory()) {
        log(`Recursing into directory: ${fullPath}`);
        await readDirectory(fullPath);
      } else if (
        entry.isFile() &&
        (fullPath.endsWith(".ts") || fullPath.endsWith(".tsx"))
      ) {
        log(`Adding file to list: ${fullPath}`);
        fileList.push(fullPath);
      } else {
        log(`Skipping non-TypeScript file: ${fullPath}`);
      }
    }
  }

  await readDirectory(projectPath);

  log(`Completed creating file list. Total files found: ${fileList.length}`);

  return fileList;
}
