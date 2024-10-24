import { Tsconfig } from "./readTsconfig";
import { resolve } from "node:path";
/**
 * Determines the aliases from the provided tsconfig object.
 *
 * @param tsconfigObject - The parsed tsconfig object.
 * @param baseUrl - The baseUrl from the tsconfig object (this is an absolute path).
 * @returns The paths defined in the tsconfig.
 * @throws Error if no paths are found in the tsconfig.
 */
export default function determineAliases(
  tsconfigObject: Tsconfig,
  baseUrl: string
): {
  [key: string]: string[];
} {
  if (!tsconfigObject.compilerOptions.paths) {
    throw new Error("No paths found in tsconfig.json");
  }

  Object.entries(tsconfigObject.compilerOptions.paths).forEach(
    ([key, value]) => {
      value.forEach((path, index) => {
        tsconfigObject.compilerOptions.paths[key][index] = resolve(baseUrl, path);
      });
    }
  );

  return tsconfigObject.compilerOptions.paths;
}
