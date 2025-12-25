import "server-only";

import { getPublicAppUrl } from "@/server/env";

const siteUrl = getPublicAppUrl();

export const projectConfig = {
  title:
    "DeshMart- Sourcing, Seamless Delivery - Bringing Chinese Products to Bangladesh",
  description:
    "DeshMart: Sourcing, Seamless Delivery - Bringing Chinese Products to Bangladesh",
  siteUrl,
};

export type ProjectConfig = typeof projectConfig;
