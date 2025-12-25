import "server-only";

const REQUIRED_BUN_VERSION = "1.3.5";

const compareVersions = (current: string, required: string) => {
  const parse = (value: string) =>
    value
      .replace(/^v/, "")
      .split(".")
      .map((part) => Number(part));
  const currentParts = parse(current);
  const requiredParts = parse(required);
  const length = Math.max(currentParts.length, requiredParts.length);

  for (let index = 0; index < length; index += 1) {
    const currentValue = currentParts[index] ?? 0;
    const requiredValue = requiredParts[index] ?? 0;
    if (currentValue < requiredValue) return -1;
    if (currentValue > requiredValue) return 1;
  }

  return 0;
};

const formatBunGuardMessage = (details: string[]) => [
  "=====================================",
  "==        Bun Runtime Required     ==",
  "=====================================",
  ...details,
  "-------------------------------------",
  `Required Bun version: ${REQUIRED_BUN_VERSION}`,
  "Install/Update: curl -fsSL https://bun.sh/install | bash",
  "=====================================",
].join("\n");

export const enforceBunRuntime = () => {
  const bunVersion = (
    process.versions as NodeJS.ProcessVersions & { bun?: string }
  )?.bun;

  if (!bunVersion) {
    const message = formatBunGuardMessage([
      "This project must be run with Bun.",
      "Detected runtime: nodejs",
    ]);
    console.error(message);
    process.exit(1);
  }

  if (compareVersions(bunVersion, REQUIRED_BUN_VERSION) < 0) {
    const message = formatBunGuardMessage([
      "Bun is installed but not up to date.",
      `Detected Bun version: ${bunVersion}`,
    ]);
    console.error(message);
    process.exit(1);
  }
};
