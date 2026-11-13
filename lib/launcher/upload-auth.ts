import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";
import type { StoreResult } from "./release-store";

/**
 * The release upload (publish.cmd --upload of the game client) is for the publisher only:
 * `Authorization: Bearer <LAUNCHER_UPLOAD_TOKEN>`. Without a token configured the upload is off.
 */
export const isUploadAuthorized = (request: Request) => {
  const token = process.env.LAUNCHER_UPLOAD_TOKEN?.trim();
  const header = request.headers.get("authorization") ?? "";
  if (!token || !header.startsWith("Bearer ")) return false;

  // Compared as digests: equal lengths, in constant time.
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(
    digest(header.slice("Bearer ".length).trim()),
    digest(token),
  );
};

/** The answer that ends an upload request before its work: none when it may go on. */
export const refuseUpload = (request: Request): Response | null => {
  if (!process.env.LAUNCHER_UPLOAD_TOKEN?.trim()) {
    return new Response("Not found", { status: 404 });
  }
  if (!isUploadAuthorized(request)) {
    return Response.json({ message: "Not authorized." }, { status: 401 });
  }
  return null;
};

/** The request's body, when it says and has at most `maxBytes`; null otherwise. */
export const readBody = async (request: Request, maxBytes: number) => {
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > maxBytes) return null;

  const bytes = new Uint8Array(await request.arrayBuffer());
  return bytes.byteLength <= maxBytes ? bytes : null;
};

export const storeResponse = (result: StoreResult) =>
  result.ok
    ? Response.json({ ok: true })
    : Response.json({ message: result.message }, { status: result.status });

/** The publisher's public key the manifests must be signed with; null when it is not configured. */
export const getPublisherKey = () =>
  process.env.LAUNCHER_PUBLIC_KEY?.trim() || null;
