export const parseEnvList = (
  value: string | undefined | null
): string[] => {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};
