import { enforceBunRuntime } from "@/server/runtime-guard";
import { runStartupChecks } from "@/server/startup-log";

declare global {
  var __startupLogRan: boolean | undefined;
}

export async function register() {
  enforceBunRuntime();

  if (!globalThis.__startupLogRan) {
    globalThis.__startupLogRan = true;
    await runStartupChecks();
  }
}
