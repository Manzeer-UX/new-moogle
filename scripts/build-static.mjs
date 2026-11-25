// Cross-platform `NEXT_OUTPUT=export next build` (no cross-env needed on Windows).
import { spawnSync } from "node:child_process";

const result = spawnSync("npx", ["next", "build"], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, NEXT_OUTPUT: "export" },
});

process.exit(result.status ?? 1);
