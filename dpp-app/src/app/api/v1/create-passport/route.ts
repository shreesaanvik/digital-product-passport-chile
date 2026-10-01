import { NextResponse } from "next/server";

/**
 * Mock "plug-and-play" ingestor — POST /api/v1/create-passport
 * Mirrors brief: Pehchan ID + cluster + product → passport URL + hash.
 */
export async function POST(request: Request) {
  let body: {
    artisan_id?: string;
    cluster?: string;
    product_type?: string;
  } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Expected JSON body" },
      { status: 400 },
    );
  }

  const artisan_id = body.artisan_id ?? "DEMO-ID";
  const cluster = body.cluster ?? "Varanasi";
  const product_type = body.product_type ?? "Silk Saree";

  const raw = `${artisan_id}:${cluster}:${Date.now()}`;
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(raw),
  );
  const hex = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 24);
  const hash = `0x${hex}`;

  return NextResponse.json({
    passport_url: `https://dpp.fm/demo/${hash.slice(0, 10)}`,
    content_hash: hash,
    origin_geo: "25.3176,82.9739",
    artisan_verified: true,
    timestamp_handshake: new Date().toISOString(),
    esg_score: product_type.toLowerCase().includes("silk") ? "A" : "B",
    cluster_auto_meta: {
      gi_hint: cluster === "Kutch" ? "Ajrakh" : "Heritage silk corridor",
    },
  });
}
