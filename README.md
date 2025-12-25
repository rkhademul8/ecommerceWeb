# DeshMart E-commerce (Next.js 16 + Bun)

This project runs on Next.js 16 with Bun as the runtime. All environment values are read at runtime, and only `NEXT_PUBLIC_APP_URL` is exposed to the browser. The server exits early if Bun is missing or older than v1.3.5.

## Prerequisites

- Bun (required, latest: v1.3.5)

The server logs will warn if Bun is not detected or if the installed version is behind the latest release.

## Environment

Copy the example file and update values as needed:

```bash
cp .env.example .env
```

Variables (ordered as `.env.example`):

- `NEXT_PUBLIC_APP_URL`: comma-separated list of allowed base URLs (only these hosts are accepted).
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

All API calls from the client go to `/api/*`. The server proxy forwards them to `DESHMART_API_ENDPOINT`, so the external API URL stays private.

## Allowed hosts

Requests are only accepted for hosts listed in `NEXT_PUBLIC_APP_URL`. Use a comma-separated list if you need multiple allowed origins.

## Startup diagnostics

On server start:

1. Environment values are printed in `.env.example` order.
2. Each `*_API_ENDPOINT` is checked for reachability.
3. If reachable, a CORS check is performed against each `NEXT_PUBLIC_APP_URL`.

## Docker

Build and run with:

```bash
bun run docker
```

The container reads `NEXT_PUBLIC_APP_URL` and `DESHMART_API_ENDPOINT` from `docker-compose.yml`.
