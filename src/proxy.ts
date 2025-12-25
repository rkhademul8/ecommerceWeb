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
          hostname: url.hostname.toLowerCase(),
          port: url.port,
        };
      } catch {
        return null;
      }
    })
    .filter(
      (entry): entry is { hostname: string; port: string } => entry !== null
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

  const [requestHostname, requestPort] = requestHost.split(":");
  const hostname = requestHostname?.trim();
  const port = requestPort?.trim();
  if (!hostname) return NextResponse.next();

  const isAllowed = allowedHosts.some((entry) => {
    if (entry.hostname !== hostname) return false;
    if (entry.port && port) {
      return entry.port === port;
    }
    if (entry.port && !port) {
      return true;
    }
    return true;
  });

  if (isAllowed) return NextResponse.next();

  return new NextResponse("Host not allowed.", { status: 403 });
}
