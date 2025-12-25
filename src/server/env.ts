import "server-only";

import { parseEnvList } from "@/lib/env-list";

export const getEnvValue = (key: string): string | undefined =>
  process.env[key];

export const getPublicAppUrlList = (): string[] =>
  parseEnvList(getEnvValue("NEXT_PUBLIC_APP_URL"));

export const getPublicAppUrl = (): string | undefined =>
  getPublicAppUrlList()[0];

export const getDeshmartApiEndpoint = (): string | undefined =>
  getEnvValue("DESHMART_API_ENDPOINT");
