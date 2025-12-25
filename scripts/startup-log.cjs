const fs = require("node:fs");
const path = require("node:path");

const DEFAULT_ENV_KEYS = ["NEXT_PUBLIC_APP_URL", "DESHMART_API_ENDPOINT"];
const ENV_EXAMPLE_PATH = path.join(process.cwd(), ".env.example");

const normalizeOrigin = (value) => value.replace(/\/+$/, "");

const parseEnvList = (value) => {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const readEnvKeysFromExample = () => {
  try {
    const contents = fs.readFileSync(ENV_EXAMPLE_PATH, "utf8");
    const keys = [];
    const seen = new Set();

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

const getOrderedEnvKeys = () => {
  const keys = readEnvKeysFromExample();
  return keys.length ? keys : DEFAULT_ENV_KEYS;
};

const logEnvironmentSummary = (keys, runtime) => {
  const maxKeyLength = keys.reduce((max, key) => Math.max(max, key.length), 0);
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
    const value = process.env[key] ?? "";
    console.log(`${key.padEnd(maxKeyLength)} : ${value}`);
  });
  console.log("=====================================");
};

const checkEndpoint = async (url) => {
  const attempt = async (method) => {
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

const isCorsAllowed = (allowOrigin, origin) => {
  if (!allowOrigin) return false;
  if (allowOrigin === "*") return true;
  return allowOrigin
    .split(",")
    .map((value) => value.trim())
    .includes(origin);
};

const checkCors = async (url, appOrigin) => {
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

const formatEndpointLabel = (url) => {
  if (!url || !/^https?:\/\//i.test(url)) return url || "missing";
  return `[${url}](${url})`;
};

const logEndpointSummary = (key, url, status, lines) => {
  const icon = status === "ok" ? "✅" : status === "warning" ? "⚠️" : "❌";
  const label = `${icon} **${key}:** ${formatEndpointLabel(url)}`;
  console.log(label);
  lines.forEach((line) => console.log(line));
  console.log("----------");
};

const runStartupChecks = async () => {
  const envKeys = getOrderedEnvKeys();
  const runtime = process?.versions?.bun ? "bun" : "nodejs";

  console.log("--------- Start of Log ---------");
  logEnvironmentSummary(envKeys, runtime);

  const apiKeys = envKeys.filter((key) => key.endsWith("API_ENDPOINT"));
  if (!apiKeys.length) {
    console.log("");
    console.log("Resource Availability Checks");
    console.log("-------------------------------");
    console.log("No API endpoints configured.");
    return;
  }

  console.log("");
  console.log("Resource Availability Checks");
  console.log("-------------------------------");
  const appOrigins = parseEnvList(process.env.NEXT_PUBLIC_APP_URL).map(
    normalizeOrigin
  );

  for (const key of apiKeys) {
    const url = process.env[key];
    if (!url) {
      logEndpointSummary(key, "", "warning", [
        "* ⚠️ Reachable: NO (missing URL)",
      ]);
      continue;
    }

    const reachability = await checkEndpoint(url);
    if (!reachability.reachable) {
      logEndpointSummary(key, url, "error", [
        `* ❌ Reachable: NO (${reachability.error})`,
      ]);
      continue;
    }

    const corsLines = [
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

};

module.exports = {
  runStartupChecks,
};
