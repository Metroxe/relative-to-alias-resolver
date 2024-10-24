import { Tsconfig } from "./readTsconfig";
import { resolve } from "node:path";
import { log } from "./log";
/**
 * Determines the aliases from the provided tsconfig object.
 *
 * @param tsconfigObject - The parsed tsconfig object.
 * @param baseUrl - The baseUrl from the tsconfig object (this is an absolute path).
 * @returns The paths defined in the tsconfig.
 * @throws Error if no paths are found in tsconfig.json
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

  log(`Base URL: ${baseUrl}`);
  log("Initial paths from tsconfig:", tsconfigObject.compilerOptions.paths);

  Object.entries(tsconfigObject.compilerOptions.paths).forEach(
    ([key, value]) => {
      log(`Processing alias '${key}' with paths: ${JSON.stringify(value)}`);
      value.forEach((path, index) => {
        const resolvedPath = resolve(baseUrl, path);
        log(`Resolving path '${path}' to '${resolvedPath}'`);
        tsconfigObject.compilerOptions.paths[key][index] = resolvedPath;
      });
    }
  );

  log("Updated paths after resolving:", tsconfigObject.compilerOptions.paths);

  return tsconfigObject.compilerOptions.paths;
}
