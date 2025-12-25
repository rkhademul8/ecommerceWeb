const { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_SERVER } = require("next/constants");
const {
  enforceBunRuntime,
} = require("./scripts/runtime-guard.cjs");
const { runStartupChecks } = require("./scripts/startup-log.cjs");

const imageHosts = [
  "flagcdn.com",
  "cbu01.alicdn.com",
  "deshmart-office-upload-live.s3.ap-south-1.amazonaws.com",
];

const nextConfig = {
  output: "standalone",
  reactStrictMode: false,
  images: {
    remotePatterns: imageHosts.map((hostname) => ({
      protocol: "https",
      hostname,
    })),
  },
};

module.exports = (phase) => {
  enforceBunRuntime();

  if (
    (phase === PHASE_DEVELOPMENT_SERVER ||
      phase === PHASE_PRODUCTION_SERVER) &&
    !globalThis.__startupLogRan
  ) {
    globalThis.__startupLogRan = true;
    void runStartupChecks();
  }

  return nextConfig;
};
