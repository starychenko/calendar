import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const cli = fileURLToPath(
  new URL("../node_modules/vitest/vitest.mjs", import.meta.url),
);
for (const TZ of [
  "UTC",
  "Europe/Kyiv",
  "America/Los_Angeles",
  "Pacific/Kiritimati",
  "Australia/Sydney",
]) {
  console.log("Calendar tests in " + TZ);
  const result = spawnSync(process.execPath, [cli, "run"], {
    stdio: "inherit",
    env: { ...process.env, TZ },
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
