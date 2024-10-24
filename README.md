# Relative to Alias Resolver

## Overview

The **Relative to Alias Resolver** is a tool designed to convert a TypeScript project from using relative imports to alias imports. This can help improve the readability and maintainability of your codebase by using more descriptive import paths.

## Features

- Converts relative imports to alias imports based on your `tsconfig.json` configuration.
- Supports both CommonJS and ES Module formats.
- Provides a CLI for easy integration into your build process.
- Includes options for dry runs and concurrency control.

## Installation

To install the package cli, use npm:

```bash
npm install -g relative-to-alias-resolver
```

if you intend to use the library in your project, you can install it locally:

```bash
npm install relative-to-alias-resolver
```

## Usage

### CLI

The package provides a command-line interface to perform the conversion. You can use it as follows:

```bash
relative-to-alias-resolver --project <path-to-project> --tsconfig <path-to-tsconfig>
```

#### Options

- `-p, --project <path>`: The path to the project to generate alias imports for. Defaults to the current directory.
- `-t, --tsconfig <path>`: The path to the `tsconfig.json` file to use for the project. Defaults to `./tsconfig.json`.
- `-d, --dry-run`: Run the command in dry run mode. Defaults to `true`.
- `-i, --ignore <patterns>`: A comma-separated list of regex patterns for paths to ignore. Defaults to `["node_modules"]`.
- `-c, --concurrency <number>`: The number of promises to allow at once when editing the project. Defaults to `5`.

#### Example

```bash
relative-to-alias-resolver --project ./src --tsconfig ./tsconfig.json
```

### Library

The library can be used to convert relative imports to alias imports in a TypeScript project.

```typescript
import { resolveRelativeToAlias } from "relative-to-alias-resolver";

resolveRelativeToAlias({
  projectPath: "./src",
  tsconfigPath: "./tsconfig.json",
  dryRun: true,
  ignore: ["node_modules"],
});
```

## Configuration

The tool relies on the `tsconfig.json` file to determine the base URL and paths for aliasing. Ensure your `tsconfig.json` is correctly configured with the `baseUrl` and `paths` properties.

Example `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```