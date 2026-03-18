import { NextRequest } from "next/server";

const BACKEND =
  (process.env.BACKEND_API_URL || "http://localhost:3500").replace(/\/$/, "");

async function proxy(req: NextRequest) {
  const { pathname, search } = new URL(req.url);
  const target = `${BACKEND}${pathname}${search}`;
  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("connection");

  const init: RequestInit & { duplex?: string } = {
    method: req.method,
    headers,
    redirect: "manual",
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = req.body;
    init.duplex = "half";
  }

  try {
    const upstream = await fetch(target, init);
    const respHeaders = new Headers(upstream.headers);
    respHeaders.delete("transfer-encoding");

    return new Response(upstream.body, {
      status: upstream.status,
      headers: respHeaders,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Proxy failed", detail: String(err) }), {
      status: 502,
    });
  }
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const PUT = proxy;
export const DELETE = proxy;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
