import { cpSync, existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const standalone = join(root, ".next", "standalone");
const server = join(standalone, "server.js");
if (!existsSync(server))
  throw new Error("Run npm run build before starting the production server");
cpSync(join(root, "public"), join(standalone, "public"), { recursive: true });
cpSync(join(root, ".next", "static"), join(standalone, ".next", "static"), {
  recursive: true,
});
process.env.PORT ??= "3000";
process.env.HOSTNAME ??= "127.0.0.1";
process.chdir(standalone);
await import(pathToFileURL(server).href);
