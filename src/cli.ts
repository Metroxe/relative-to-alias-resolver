import { Command } from "commander";
import main, { Options } from "./index";
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
  .option("-d, --dry-run", "Whether to run the command in dry run mode.", false)
  .option(
    "-i, --ignore <patterns>",
    "A comma-separated list of regex patterns for paths to ignore.",
    (value) => value.split(","),
    ["node_modules"]
  )
  .option("-v, --verbose", "Enable verbose logging.", false)
  .action(async () => {
    const options = program.opts();

    console.log(options);

    const opts: Options = {
      project: options.project,
      tsconfig: options.tsconfig,
      dryRun: options.dryRun === true,
      ignore: options.ignore,
      verbose: options.verbose === true,
    };

    await main(opts);
  });

program.parse(process.argv);
