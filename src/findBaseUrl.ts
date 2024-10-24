import * as fs from "node:fs/promises";
import * as path from "node:path";
import { Tsconfig } from "./readTsconfig";
/**
 * Finds the baseUrl from the provided tsconfig object and checks if the directory exists.
 *
 * @param tsconfigObject - The parsed tsconfig object.
 * @param relativePath - The relative path to check for existence.
 * @returns The absolute path of the baseUrl defined in the tsconfig.
 * @throws Error if the directory does not exist at the specified relative path.
 */
export default async function findBaseUrl(
  tsconfigObject: Tsconfig,
  relativePath: string
) {
  const baseUrl = tsconfigObject.compilerOptions.baseUrl;

  // Resolve the absolute path from the relative path
  const absolutePath = path.resolve(process.cwd(), relativePath);

  // Check if the directory exists
  try {
    const stats = await fs.stat(absolutePath);
    if (!stats.isDirectory()) {
      throw new Error(`The path is not a directory: ${absolutePath}`);
    }
  } catch (error) {
    throw new Error(
      `Directory does not exist at the specified path: ${absolutePath}`
    );
  }

  // Convert baseUrl to absolute path
  const absoluteBaseUrl = path.resolve(absolutePath, baseUrl);

  return absoluteBaseUrl;
}
