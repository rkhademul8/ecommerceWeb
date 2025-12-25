import "server-only";

import fs from "node:fs";
import path from "node:path";

import { getEnvValue, getPublicAppUrl } from "./env";

const DEFAULT_ENV_KEYS = ["NEXT_PUBLIC_APP_URL", "DESHMART_API_ENDPOINT"];
const ENV_EXAMPLE_PATH = path.join(process.cwd(), ".env.example");

const normalizeOrigin = (value: string) => value.replace(/\/+$/, "");

const readEnvKeysFromExample = (): string[] => {
  try {
    const contents = fs.readFileSync(ENV_EXAMPLE_PATH, "utf8");
    const keys: string[] = [];
    const seen = new Set<string>();

    contents.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) return;
      const key = trimmed.slice(0, separatorIndex).trim();
      if (!key || seen.has(key)) return;
      seen.add(key);
      keys.push(key);
    });

    return keys;
  } catch {
    return DEFAULT_ENV_KEYS;
  }
};

const getOrderedEnvKeys = (): string[] => {
  const keys = readEnvKeysFromExample();
  return keys.length ? keys : DEFAULT_ENV_KEYS;
};

const logEnvValues = (keys: string[]) => {
  console.log("Environment variables (ordered by .env.example):");
  keys.forEach((key) => {
    const value = getEnvValue(key) ?? "";
    console.log(`- ${key}=${value}`);
  });
};

const checkEndpoint = async (url: string) => {
  const attempt = async (method: "HEAD" | "GET") => {
    try {
      const response = await fetch(url, {
        method,
        redirect: "follow",
      });
      return {
        reachable: true,
        status: response.status,
        response,
      };
    } catch (error) {
      return {
        reachable: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  };

  const headResult = await attempt("HEAD");
  if (headResult.reachable) {
    return headResult;
  }

  return attempt("GET");
};

const isCorsAllowed = (allowOrigin: string | null, origin: string) => {
  if (!allowOrigin) return false;
  if (allowOrigin === "*") return true;
  return allowOrigin
    .split(",")
    .map((value) => value.trim())
    .includes(origin);
};

const checkCors = async (url: string, appOrigin: string) => {
  const attemptOptions = async () => {
    try {
      const response = await fetch(url, {
        method: "OPTIONS",
        redirect: "follow",
        headers: {
          Origin: appOrigin,
          "Access-Control-Request-Method": "GET",
        },
      });
      return {
        status: response.status,
        allowOrigin: response.headers.get("access-control-allow-origin"),
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : String(error),
      };
    }
  };

  const optionsResult = await attemptOptions();
  if ("error" in optionsResult) {
    return optionsResult;
  }

  if (optionsResult.allowOrigin) {
    return optionsResult;
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: {
        Origin: appOrigin,
      },
    });
    return {
      status: response.status,
      allowOrigin: response.headers.get("access-control-allow-origin"),
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

const fetchLatestBunVersion = async (): Promise<string | null> => {
  try {
    const response = await fetch(
      "https://api.github.com/repos/oven-sh/bun/releases/latest",
      {
        headers: {
          "User-Agent": "deshmart-ecommerce",
          Accept: "application/vnd.github+json",
        },
      }
    );
    if (!response.ok) return null;
    const payload = (await response.json()) as { tag_name?: string };
    const tag = payload.tag_name ?? "";
    if (!tag) return null;
    return tag.replace(/^bun-?/i, "").replace(/^v/i, "");
  } catch {
    return null;
  }
};

const compareVersions = (current: string, latest: string) => {
  const parse = (value: string) =>
    value
      .replace(/^v/, "")
      .split(".")
      .map((part) => Number(part));
  const currentParts = parse(current);
  const latestParts = parse(latest);
  const length = Math.max(currentParts.length, latestParts.length);

  for (let index = 0; index < length; index += 1) {
    const currentValue = currentParts[index] ?? 0;
    const latestValue = latestParts[index] ?? 0;
    if (currentValue < latestValue) return -1;
    if (currentValue > latestValue) return 1;
  }

  return 0;
};

const logRuntimeChecks = async () => {
  const bunVersion = (
    process.versions as NodeJS.ProcessVersions & { bun?: string }
  )?.bun;
  if (!bunVersion) {
    console.warn(
      "[runtime] Bun was not detected. Use Bun to run this project (https://bun.sh)."
    );
    return;
  }

  const latestVersion = await fetchLatestBunVersion();
  if (!latestVersion) {
    console.warn(
      `[runtime] Unable to verify the latest Bun version. Current: ${bunVersion}.`
    );
    return;
  }

  if (compareVersions(bunVersion, latestVersion) < 0) {
    console.warn(
      `[runtime] Bun ${bunVersion} is not the latest (${latestVersion}). Update with: curl -fsSL https://bun.sh/install | bash`
    );
  } else {
    console.log(`[runtime] Bun ${bunVersion} is up to date.`);
  }
};

const runStartupChecks = async () => {
  const envKeys = getOrderedEnvKeys();
  logEnvValues(envKeys);

  const apiKeys = envKeys.filter((key) => key.endsWith("API_ENDPOINT"));
  if (!apiKeys.length) {
    console.log("API endpoint checks: none found.");
    await logRuntimeChecks();
    return;
  }

  console.log("API endpoint checks:");
  const appUrl = getPublicAppUrl();
  const appOrigin = appUrl ? normalizeOrigin(appUrl) : null;

  for (const key of apiKeys) {
    const url = getEnvValue(key);
    if (!url) {
      console.warn(`- ${key}: missing`);
      continue;
    }

    const reachability = await checkEndpoint(url);
    if (!reachability.reachable) {
      console.warn(`- ${key}: unreachable (${reachability.error})`);
      continue;
    }

    console.log(`- ${key}: reachable (status ${reachability.status})`);

    if (!appOrigin) {
      console.warn(`- ${key} CORS: skipped (NEXT_PUBLIC_APP_URL not set)`);
      continue;
    }

    const corsResult = await checkCors(url, appOrigin);
    if ("error" in corsResult) {
      console.warn(`- ${key} CORS: check failed (${corsResult.error})`);
      continue;
    }

    if (isCorsAllowed(corsResult.allowOrigin, appOrigin)) {
      console.log(`- ${key} CORS: allowed for ${appOrigin}`);
    } else {
      const allowOrigin = corsResult.allowOrigin ?? "missing header";
      console.warn(`- ${key} CORS: not allowed (${allowOrigin})`);
    }
  }

  await logRuntimeChecks();
};

declare global {
  var __startupLogRan: boolean | undefined;
}

if (!globalThis.__startupLogRan) {
  globalThis.__startupLogRan = true;
  void runStartupChecks();
}
