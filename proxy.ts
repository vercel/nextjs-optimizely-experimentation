import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { precompute } from "flags/next";
import { precomputeFlags } from "./lib/flags";

export const config = {
  matcher: ["/", "/product/:path*", "/cart", "/success"],
};

export async function proxy(request: NextRequest, event: NextFetchEvent) {
  let response = NextResponse.next();

  const context = {
    /* pass context on whatever your flag will need */
    event,
  };

  // decide precompute flags for the homepage only
  if (request.nextUrl.pathname === "/") {
    const code = await precompute(precomputeFlags);

    // rewrites the request to the variant for this flag combination
    const nextUrl = new URL(
      `/${code}${request.nextUrl.pathname}${request.nextUrl.search}`,
      request.url
    );
    response = NextResponse.rewrite(nextUrl, { request });
  }

  // set a shopper cookie if one doesn't exist or has been cleared
  if (!request.cookies.has("shopper")) {
    const newShopperId = Math.random().toString(36).substring(2);
    response.cookies.set("shopper", newShopperId);
  }

  return response;
}
