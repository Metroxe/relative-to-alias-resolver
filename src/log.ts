import { verbose } from "@/index";

export function log(...args: any[]) {
  if (verbose) {
    console.log(...args);
  }
}
