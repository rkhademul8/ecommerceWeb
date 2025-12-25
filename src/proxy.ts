import { NextResponse, type NextRequest } from "next/server";

import { parseEnvList } from "@/lib/env-list";

const normalizeOrigin = (value: string) => value.replace(/\/+$/, "");

const getAllowedHosts = () => {
  const entries = parseEnvList(process.env.NEXT_PUBLIC_APP_URL);
  return entries
    .map((entry) => {
      try {
        const url = new URL(normalizeOrigin(entry));
        return {
          host: url.host.toLowerCase(),
          protocol: url.protocol.replace(":", ""),
        };
      } catch {
        return null;
      }
    })
    .filter(
      (entry): entry is { host: string; protocol: string } => entry !== null
    );
};

export function proxy(request: NextRequest) {
  const allowedHosts = getAllowedHosts();
  if (!allowedHosts.length) return NextResponse.next();

  const hostHeader =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    "";
  const requestHost = hostHeader.split(",")[0]?.trim().toLowerCase();
  if (!requestHost) return NextResponse.next();

  const protocolHeader =
    request.headers.get("x-forwarded-proto") ??
    request.nextUrl.protocol.replace(":", "");

  const isAllowed = allowedHosts.some(
    (entry) =>
      entry.host === requestHost &&
      (!protocolHeader || entry.protocol === protocolHeader)
  );

  if (isAllowed) return NextResponse.next();

  return new NextResponse("Host not allowed.", { status: 403 });
}
