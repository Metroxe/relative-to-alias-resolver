import * as path from "node:path";
import { fileURLToPath } from "node:url";
import main, { Options } from "../src/index";
import * as fs from "node:fs/promises";
import { expect } from "chai";

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("End to end test", () => {
  const tmpDir = path.resolve(__dirname, "tmp");
  const projectDir = path.resolve(tmpDir, Date.now().toString());

  beforeEach(async () => {
    await fs.mkdir(projectDir, { recursive: true });
    await fs.cp(
      path.resolve(__dirname, "test-project-relative-imports"),
      projectDir,
      { recursive: true }
    );
  });

  after(async () => {
    // await fs.rm(tmpDir, { recursive: true });
  });

  it("should be able to turn the test project into alias imports", async () => {
    // run the main to cause an edit to the project
    await main({
      project: projectDir,
      tsconfig: path.resolve(projectDir, "tsconfig.json"),
      dryRun: false,
      ignore: [],
    });

    // get the path of all the files in the project recursively
    async function getAllFiles(dir) {
      const dirents = await fs.readdir(dir, { withFileTypes: true });
      const files = await Promise.all(dirents.map((dirent) => {
        const res = path.resolve(dir, dirent.name);
        return dirent.isDirectory() ? getAllFiles(res) : res;
      }));
      return Array.prototype.concat(...files);
    }

    const filePaths = await getAllFiles(projectDir);

    // check to see that each file is equal to the same file in the test-project-alias-imports
    for (const filePath of filePaths) {
      const originalFilePath = path.resolve(
        __dirname,
        "test-project-alias-imports",
        filePath.replace(projectDir + "/", "")
      );


      const originalFile = await fs.readFile(originalFilePath, "utf8");
      const newFile = await fs.readFile(filePath, "utf8");

      expect(newFile).to.equal(originalFile, `File ${filePath.replace(projectDir + "/", "")} is not equal`);
    }
  });
});
