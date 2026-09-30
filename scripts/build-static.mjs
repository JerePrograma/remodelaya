import { cp, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const source = fileURLToPath(new URL("../site/", import.meta.url));
const output = fileURLToPath(new URL("../dist/", import.meta.url));

// Only generated output is replaced; site/ is the versioned source of truth.
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });
console.log("Static build copied site/ to dist/ without transforming source files.");
