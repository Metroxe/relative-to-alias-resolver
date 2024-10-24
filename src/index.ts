import readTsconfig from "@/readTsconfig";
import determineAliases from "@/determineAliases";
import findBaseUrl from "@/findBaseUrl";
import createFileList from "@/createFileList";
import processFiles from "@/processFiles";

export interface Options {
  project: string;
  tsconfig: string;
  dryRun: boolean;
  ignoreDirectories: string[];
}

export default async function main(options: Options) {
  // 1. read the JSON from the tsconfig file
  const tsconfigObject = await readTsconfig(options.tsconfig);

  // 2. Find the baseUrl
  const baseUrl = await findBaseUrl(tsconfigObject, options.project);

  // 3. Determine the aliases
  const paths = determineAliases(tsconfigObject, baseUrl);

  // 4. Create a list of all the files in the project
  const fileList = await createFileList(
    options.project,
    options.ignoreDirectories,
  );

  // 5. process the files
  await processFiles(fileList, paths, options.dryRun);
}