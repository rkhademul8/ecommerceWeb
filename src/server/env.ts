import "server-only";

export const getEnvValue = (key: string): string | undefined =>
  process.env[key];

export const getPublicAppUrl = (): string | undefined =>
  getEnvValue("NEXT_PUBLIC_APP_URL");

export const getDeshmartApiEndpoint = (): string | undefined =>
  getEnvValue("DESHMART_API_ENDPOINT");
