#!/usr/bin/env node
import { spawnSync, spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import fs from "fs";


const __dirname = dirname(fileURLToPath(import.meta.url));

// This is essential for running the script from anywhere
const projectRoot = resolve(__dirname);

// The direct script
const entry = resolve(projectRoot, "Tui.tsx");

// Intsalling all the dependecies
if (!fs.existsSync(resolve(projectRoot, "node_modules"))) 
{
  console.log("Currently Installing Dependencies");
  spawnSync("npm", ["install"], { cwd: projectRoot, stdio: "inherit" });
}


const child = spawn("npx", ["tsx", entry], 
{
  cwd: projectRoot,  // Always changing the current working directory
  stdio: "inherit"
});


child.on("exit", (code) => process.exit(code));
