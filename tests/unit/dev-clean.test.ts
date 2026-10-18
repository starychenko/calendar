import { createRequire } from "node:module";
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  existsSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "vitest";
const { projectDevProcesses, prepareDev } = createRequire(import.meta.url)(
  "../../scripts/dev-clean.cjs",
);
test("dev cleanup matches only this project's Next dev command", () => {
  const processes = [
    {
      pid: 1,
      command:
        "node C:\\GIT\\calendar\\node_modules\\next\\dist\\bin\\next dev",
    },
    {
      pid: 2,
      command:
        "node C:\\GIT\\calendar-other\\node_modules\\next\\dist\\bin\\next dev",
    },
    { pid: 3, command: "node C:\\GIT\\calendar\\scripts\\unrelated.js" },
    {
      pid: 4,
      command:
        "node C:\\GIT\\calendar\\node_modules\\next\\dist\\bin\\next start",
    },
  ];
  expect(
    projectDevProcesses(processes, "C:\\GIT\\calendar").map(
      (p: { pid: number }) => p.pid,
    ),
  ).toEqual([1]);
});
test("lock survives active/ambiguous servers and requires explicit stale-lock removal", () => {
  const root = mkdtempSync(join(tmpdir(), "calendar-clean-test-"));
  mkdirSync(join(root, ".next/dev"), { recursive: true });
  const lock = join(root, ".next/dev/lock");
  writeFileSync(lock, "");
  try {
    expect(() =>
      prepareDev(
        root,
        [
          {
            pid: 1,
            command: "node " + root + "/node_modules/next/dist/bin/next dev",
          },
        ],
        true,
      ),
    ).toThrow();
    expect(() =>
      prepareDev(root, [{ pid: 2, command: "next-server" }], true),
    ).toThrow();
    expect(() => prepareDev(root, [], false)).toThrow();
    expect(existsSync(lock)).toBe(true);
    prepareDev(
      root,
      [{ pid: 3, command: "node /other-project/server.js" }],
      true,
    );
    expect(existsSync(lock)).toBe(false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
