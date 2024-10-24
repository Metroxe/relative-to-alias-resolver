import * as fsSync from "node:fs";
import * as fs from "node:fs/promises";
import * as recast from "recast";
import parser from "recast/parsers/typescript";
import { resolve } from "node:path";
import { log } from "@/log";

export default async function processFiles(
  fileList: string[],
  paths: { [key: string]: string[] },
  dryRun: boolean
) {
  async function processFile(filePath: string) {
    log("Processing file:", filePath);

    // 1. read the file contents
    const fileContents = await fs.readFile(filePath, "utf8");

    const currentDir = resolve(filePath, "..");
    log("Current directory:", currentDir);

    // 2. parse the file contents into an AST
    const ast = recast.parse(fileContents, {
      parser,
    });
    log("Parsed AST for file:", filePath);

    let fileModified = false;

    // 3. modify the import statements in the AST
    recast.visit(ast, {
      visitImportDeclaration(path) {
        log("Visiting import declaration in file:", filePath);
        log("Original import path:", path.node.source.value);

        let importPath = resolve(currentDir, path.node.source.value as string);

        // check to see if the import path exists on the file system
        if (
          !fsSync.existsSync(importPath) &&
          !fsSync.existsSync(importPath + ".ts") &&
          !fsSync.existsSync(importPath + ".tsx")
        ) {
          log("Import path does not exist on the file system:", importPath);
          this.traverse(path);
          return;
        }

        Object.entries(paths).forEach(([alias, aliasPaths]) => {
          for (const pathPattern of aliasPaths) {
            // check that the path regex matches the import path
            const regex = new RegExp(pathPattern.replace("*", "(.*)"));
            const match = importPath.match(regex);
            if (match) {
              // replace the matching part of the import path with the alias
              importPath = alias.replace("*", match[1]);
              log("Modified import path to:", importPath);

              // update the import path in the AST
              fileModified = true;
              path.node.source.value = importPath;
              break;
            }
          }
        });

        this.traverse(path);
      },
    });

    // 4. print the modified AST back to code
    if (fileModified) {
      const modifiedContents = recast.print(ast).code;
      log("Modified file contents for:", filePath);

      // 5. write the modified contents back to the file
      if (!dryRun) {
        log("Writing modified file:", filePath);
        await fs.writeFile(filePath, modifiedContents);
      } else {
        log("Dry run enabled, not writing file:", filePath);
      }
    } else {
      log("No changes made to file:", filePath);
    }
  }

  await Promise.all(fileList.map(processFile));
  log("Finished processing all files.");
}
