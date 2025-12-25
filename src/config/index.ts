const siteUrl = process.env.NEXT_PUBLIC_APP_URL;
const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

export const projectConfig = {
  title:
    "DeshMart- Sourcing, Seamless Delivery - Bringing Chinese Products to Bangladesh",
  description:
    "DeshMart: Sourcing, Seamless Delivery - Bringing Chinese Products to Bangladesh",
  siteUrl,
  apiBaseUrl,
};

export type ProjectConfig = typeof projectConfig;
