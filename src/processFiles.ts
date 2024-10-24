import * as fs from "node:fs/promises";
import * as recast from "recast";
import parser from "recast/parsers/typescript";
import { resolve } from "node:path";

export default async function processFiles(
  fileList: string[],
  paths: { [key: string]: string[] }
) {
  async function processFile(filePath: string) {
    // 1. read the file contents
    const fileContents = await fs.readFile(filePath, "utf8");
    const currentDir = resolve(filePath, "..");

    // 2. parse the file contents into an AST
    const ast = recast.parse(fileContents, {
      parser,
    });

    // 3. modify the import statements in the AST
    recast.visit(ast, {
      visitImportDeclaration(path) {
        let importPath = resolve(currentDir, path.node.source.value as string);

        Object.entries(paths).forEach(([alias, paths]) => {
          for (const path of paths) {
            // check that the path regex matches the import path
            const regex = new RegExp(path.replace("*", "(.*)"));
            const match = importPath.match(regex);
            if (match) {
              // replace the matching part of the import path with the alias
              importPath = alias.replace("*", match[1]);
            }
          }
        });

        path.node.source.value = importPath;
        this.traverse(path);
      },
    });

    // 4. print the modified AST back to code
    const modifiedContents = recast.print(ast).code;

    // 5. write the modified contents back to the file
    await fs.writeFile(filePath, modifiedContents);
  }

  await Promise.all(fileList.map(processFile));
}
