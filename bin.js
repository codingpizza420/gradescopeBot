#!/usr/bin/env node
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const entry = resolve(__dirname, "Tui.tsx");

// ternary for windows and mac
const entryArg = process.platform === "win32" ? `"${entry}"` : entry;

const child = spawn("npx", ["tsx", entryArg], {
  stdio: "inherit",
  shell: process.platform === "win32", // shell only if it's on windows
});

child.on("exit", (code) => process.exit(code));
