# DeshMart E-commerce (Next.js 16 + Bun)

This project runs on Next.js 16 with Bun as the runtime. All environment values are read at runtime, and only `NEXT_PUBLIC_APP_URL` is exposed to the browser.

## Prerequisites

- Bun (latest recommended)

The server logs will warn if Bun is not detected or if the installed version is behind the latest release.

## Environment

Copy the example file and update values as needed:

```bash
cp .env.example .env
```

Variables (ordered as `.env.example`):

- `NEXT_PUBLIC_APP_URL`: public base URL for the app.
- `DESHMART_API_ENDPOINT`: server-only API base URL used by the Next.js proxy.

## Running locally

```bash
bun install
bun dev
```

Open `http://localhost:3000` in your browser.

## Build + start

```bash
bun run build
bun start
```

## API proxying

All API calls from the client go to `/api/*`. Next.js rewrites those requests to `DESHMART_API_ENDPOINT` on the server, so the external API URL stays private.

## Startup diagnostics

On server start:

1. Environment values are printed in `.env.example` order.
2. Each `*_API_ENDPOINT` is checked for reachability.
3. If reachable, a CORS check is performed against `NEXT_PUBLIC_APP_URL`.

## Docker

Build and run with:

```bash
bun run docker
```

The container reads `NEXT_PUBLIC_APP_URL` and `DESHMART_API_ENDPOINT` from `docker-compose.yml`.
