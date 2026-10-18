#!/usr/bin/env node
const { execFileSync, spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");

function projectDevProcesses(processes, projectRoot) {
  const normalized =
    projectRoot.replaceAll("\\", "/").toLowerCase().replace(/\/$/, "") + "/";
  return processes.filter((p) => {
    const command = (p.command || "").replaceAll("\\", "/").toLowerCase();
    return (
      command.includes(normalized + "node_modules/next/") &&
      /\bdev\b/.test(command)
    );
  });
}
function listProcesses() {
  if (process.platform === "win32") {
    const json = execFileSync(
      "powershell.exe",
      [
        "-NoProfile",
        "-NonInteractive",
        "-Command",
        "Get-CimInstance Win32_Process -Filter \"Name = 'node.exe'\" | Select-Object @{Name='pid';Expression={$_.ProcessId}},@{Name='command';Expression={$_.CommandLine}} | ConvertTo-Json -Compress",
      ],
      { encoding: "utf8" },
    );
    const result = json.trim() ? JSON.parse(json) : [];
    return Array.isArray(result) ? result : [result];
  }
  return execFileSync("ps", ["-eo", "pid=,args="], { encoding: "utf8" })
    .trim()
    .split("\n")
    .map((line) => {
      const [, pid, command] = line.match(/^\s*(\d+)\s+(.*)$/) || [];
      return { pid: Number(pid), command: command || "" };
    });
}
function prepareDev(projectRoot, processes, removeStaleLock = false) {
  const running = projectDevProcesses(processes, projectRoot);
  if (running.length)
    throw new Error(
      "Stop this project's dev server first. PIDs: " +
        running.map((p) => p.pid).join(", "),
    );
  const lock = path.resolve(projectRoot, ".next/dev/lock");
  if (!fs.existsSync(lock)) return;
  if (processes.some((p) => /next-server/i.test(p.command || ""))) {
    throw new Error(
      "A next-server process has ambiguous ownership. The lock was preserved.",
    );
  }
  if (!removeStaleLock)
    throw new Error(
      "Lock preserved. After confirming the old server is stopped, run npm run dev:clean -- --remove-stale-lock",
    );
  fs.unlinkSync(lock); // Only this known project lock; never kill another process.
}
if (require.main === module) {
  try {
    prepareDev(
      root,
      listProcesses(),
      process.argv.includes("--remove-stale-lock"),
    );
    const child = spawn(
      process.execPath,
      [require.resolve("next/dist/bin/next"), "dev", "--turbopack"],
      { cwd: root, stdio: "inherit" },
    );
    child.on("error", (error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
    child.on("exit", (code) => {
      process.exitCode = code ?? 1;
    });
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
module.exports = { projectDevProcesses, prepareDev };
