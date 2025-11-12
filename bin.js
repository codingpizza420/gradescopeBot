#!/usr/bin/env node
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import fs from "fs";


const __dirname = dirname(fileURLToPath(import.meta.url));

// This is essential for running the script from anywhere
const projectRoot = resolve(__dirname);

// The direct script
const entry = resolve(projectRoot, "Tui.tsx");

// !!!correct dependencies installed !!!
if (!fs.existsSync(resolve(projectRoot, "node_modules"))) 
{
  console.log("Installing dependencies...");
  const installCmd = process.platform === "win32" ? "npm.cmd" : "npm";
  spawn(installCmd, ["install"], { cwd: projectRoot, stdio: "inherit" });
}


// firguring out windows and macos command
const npxCmd = process.platform === "win32" ? "npx.cmd" : "npx";


const child = spawn(npxCmd, ["tsx", entry], {
  cwd: projectRoot,
  stdio: "inherit",
  shell: false,
});

child.on("exit", (code) => process.exit(code));

