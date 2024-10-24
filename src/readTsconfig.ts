import * as fs from "node:fs";
import stripJsonComments from "strip-json-comments";
import { z } from "zod";

/**
 * Schema representing the structure of the TypeScript configuration object.
 */
const CompilerOptionsSchema = z.object({
  paths: z.record(z.array(z.string())), // Optional paths property
  baseUrl: z.string(), // Optional baseUrl property
});

const TsconfigSchema = z.object({
  compilerOptions: CompilerOptionsSchema, // Only including compilerOptions for now
});

export type Tsconfig = z.infer<typeof TsconfigSchema>;

/**
 * Reads and parses a TypeScript configuration file (tsconfig.json).
 *
 * @param tsconfigPath - The path to the tsconfig.json file.
 * @returns The parsed tsconfig object.
 * @throws Error if the tsconfig does not have the necessary fields.
 */
export default async function readTsconfig(
  tsconfigPath: string
): Promise<Tsconfig> {
  const tsconfig = await fs.promises.readFile(tsconfigPath, "utf8");
  const tsconfigJson = stripJsonComments(tsconfig);
  const tsconfigObject = JSON.parse(tsconfigJson);
  const parsedTsconfig = TsconfigSchema.parse(tsconfigObject);

  return parsedTsconfig;
}
