import { Command } from "commander";
import main from "./index";
const program = new Command();

program
  .version("0.0.1")
  .description("Generate alias imports from a project of relative imports.")
  .option(
    "-p, --project <path>",
    "The path to the project to generate alias imports for.",
    "."
  )
  .option(
    "-t, --tsconfig <path>",
    "The path to the tsconfig.json file to use for the project.",
    "./tsconfig.json"
  )
  .option("-d, --dry-run", "Whether to run the command in dry run mode.", true)
  .option(
    "-i, --ignore <patterns>",
    "A comma-separated list of regex patterns for paths to ignore.",
    (value) => value.split(","),
    ["node_modules"]
  )
  .action(main);

program.parse(process.argv);
