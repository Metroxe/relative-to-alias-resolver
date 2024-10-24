import * as fs from "node:fs/promises";
import * as path from "node:path";
import { Options } from "@/index";

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
  ignorePatterns: string[],
): Promise<string[]> {
  const fileList: string[] = [];

  async function readDirectory(directory: string) {
    const entries = await fs.readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);

      if (ignorePatterns.some((pattern) => new RegExp(pattern).test(fullPath))) {
        continue;
      }

      if (entry.isDirectory()) {
        await readDirectory(fullPath);
      } else if (entry.isFile() && (fullPath.endsWith(".ts") || fullPath.endsWith(".tsx"))) {
        fileList.push(fullPath);
      }
    }
  }

  await readDirectory(projectPath);

  return fileList;
}
