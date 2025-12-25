import { NextRequest, NextResponse } from "next/server";

import { getDeshmartApiEndpoint } from "@/server/env";

const normalizeEndpoint = (value: string) => value.replace(/\/+$/, "");

const hopByHopHeaders = new Set([
  "connection",
  "host",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
]);

const filterHeaders = (headers: Headers) => {
  const filtered = new Headers();
  headers.forEach((value, key) => {
    if (hopByHopHeaders.has(key.toLowerCase())) return;
    filtered.set(key, value);
  });
  return filtered;
};

const proxyRequest = async (
  request: NextRequest,
  pathSegments: string[]
) => {
  const apiEndpoint = getDeshmartApiEndpoint();
  if (!apiEndpoint) {
    return NextResponse.json(
      { error: "DESHMART_API_ENDPOINT is not configured." },
      { status: 500 }
    );
  }

  const targetUrl = new URL(normalizeEndpoint(apiEndpoint));
  const basePath = targetUrl.pathname.replace(/\/+$/, "");
  const combinedPath = [basePath, ...pathSegments]
    .filter(Boolean)
    .join("/");
  targetUrl.pathname = combinedPath.startsWith("/")
    ? combinedPath
    : `/${combinedPath}`;
  targetUrl.search = new URL(request.url).search;

  const method = request.method.toUpperCase();
  const body =
    method === "GET" || method === "HEAD" ? undefined : await request.arrayBuffer();

  const upstream = await fetch(targetUrl, {
    method,
    headers: filterHeaders(request.headers),
    body,
    redirect: "follow",
  });

  const responseHeaders = filterHeaders(upstream.headers);
  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: { path?: string[] } }
) {
  return proxyRequest(request, context.params.path ?? []);
}

export async function POST(
  request: NextRequest,
  context: { params: { path?: string[] } }
) {
  return proxyRequest(request, context.params.path ?? []);
}

export async function PUT(
  request: NextRequest,
  context: { params: { path?: string[] } }
) {
  return proxyRequest(request, context.params.path ?? []);
}

export async function PATCH(
  request: NextRequest,
  context: { params: { path?: string[] } }
) {
  return proxyRequest(request, context.params.path ?? []);
}

export async function DELETE(
  request: NextRequest,
  context: { params: { path?: string[] } }
) {
  return proxyRequest(request, context.params.path ?? []);
}

export async function OPTIONS(
  request: NextRequest,
  context: { params: { path?: string[] } }
) {
  return proxyRequest(request, context.params.path ?? []);
}
