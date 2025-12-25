import "server-only";

import fs from "node:fs";
import path from "node:path";

import { getEnvValue, getPublicAppUrlList } from "./env";

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

const logEnvironmentSummary = (keys: string[], runtime: string) => {
  const maxKeyLength = keys.reduce(
    (max, key) => Math.max(max, key.length),
    0
  );
  const startTime = new Date().toISOString();

  console.log("=====================================");
  console.log("==  Runtime Environment Variables  ==");
  console.log("=====================================");
  console.log(`Started: ${startTime}`);
  console.log(`Runtime: ${runtime}`);
  console.log(`Total:   ${keys.length}`);
  console.log("-------------------------------------");
  console.log("Configured Environment Variables:");
  keys.forEach((key) => {
    const value = getEnvValue(key) ?? "";
    console.log(`${key.padEnd(maxKeyLength)} : ${value}`);
  });
  console.log("=====================================");
};

const formatEndpointLabel = (url: string) => {
  if (!url || !/^https?:\/\//i.test(url)) return url || "missing";
  return `[${url}](${url})`;
};

const logEndpointSummary = (
  key: string,
  url: string,
  status: "ok" | "warning" | "error",
  lines: string[]
) => {
  const icon = status === "ok" ? "✅" : status === "warning" ? "⚠️" : "❌";
  const label = `${icon} **${key}:** ${formatEndpointLabel(url)}`;
  console.log(label);
  lines.forEach((line) => console.log(line));
  console.log("----------");
};

export const runStartupChecks = async () => {
  const envKeys = getOrderedEnvKeys();
  const runtime = (
    process.versions as NodeJS.ProcessVersions & { bun?: string }
  )?.bun
    ? "bun"
    : "nodejs";

  console.log("--------- Start of Log ---------");
  logEnvironmentSummary(envKeys, runtime);

  const apiKeys = envKeys.filter((key) => key.endsWith("API_ENDPOINT"));
  if (!apiKeys.length) {
    console.log("Resource Availability Checks");
    console.log("-------------------------------");
    console.log("No API endpoints configured.");
    console.log("--------- END OF LOG ---------");
    return;
  }

  console.log("");
  console.log("Resource Availability Checks");
  console.log("-------------------------------");
  const appOrigins = getPublicAppUrlList().map(normalizeOrigin);

  for (const key of apiKeys) {
    const url = getEnvValue(key);
    if (!url) {
      logEndpointSummary(key, "", "warning", [
        "* ⚠️ Reachable: NO (missing URL)",
      ]);
      continue;
    }

    const reachability = await checkEndpoint(url);
    if (!reachability.reachable) {
      logEndpointSummary(
        key,
        url,
        "error",
        [`* ❌ Reachable: NO (${reachability.error})`]
      );
      continue;
    }

    const corsLines: string[] = [
      `* ✅ Reachable: YES (status ${reachability.status})`,
    ];

    if (!appOrigins.length) {
      corsLines.push(
        "* ⚠️ CORS Policy: skipped (NEXT_PUBLIC_APP_URL not set)"
      );
    } else {
      for (const appOrigin of appOrigins) {
        const corsResult = await checkCors(url, appOrigin);
        if ("error" in corsResult) {
          corsLines.push(
            `* ⚠️ CORS Policy: check failed (${corsResult.error})`
          );
          continue;
        }

        if (isCorsAllowed(corsResult.allowOrigin, appOrigin)) {
          corsLines.push(`* ✅ CORS Policy: OK (\`${appOrigin}\`)`);
        } else {
          const allowOrigin = corsResult.allowOrigin ?? "missing header";
          corsLines.push(
            `* ⚠️ CORS Policy: not allowed (\`${appOrigin}\`) [${allowOrigin}]`
          );
        }
      }
    }

    const hasCorsWarning = corsLines.some((line) => line.includes("⚠️"));
    logEndpointSummary(key, url, hasCorsWarning ? "warning" : "ok", corsLines);
  }
  console.log("--------- END OF LOG ---------");
};
