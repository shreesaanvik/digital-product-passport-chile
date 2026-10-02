import { NextResponse } from "next/server";
import { CLUSTERS, CLUSTER_PASSPORTS, clusterById } from "@/lib/data";

/**
 * Mock plug-and-play ingestor. POST /api/v1/create-passport
 * Pehchan ID + cluster + product returns a passport URL and hash.
 */
export async function POST(request: Request) {
  let body: {
    artisan_id?: string;
    cluster?: string;
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
  const requested = (body.cluster ?? "Kutch").trim().toLowerCase();
  const cluster =
    CLUSTERS.find((item) => item.name.toLowerCase() === requested) ??
    clusterById("kutch");
  const passport = CLUSTER_PASSPORTS[cluster.id];
  const product = passport.product;

  const raw = `${artisan_id}:${cluster.name}:${Date.now()}`;
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
    passport_url: `https://dpp.fm/p/${hex.slice(0, 10)}`,
    content_hash: hash,
    origin_geo: passport.origin_geo,
    product,
    stages: passport.stages,
    artisan_verified: true,
    timestamp_handshake: new Date().toISOString(),
    esg_score: product.toLowerCase().includes("silk") ? "A" : "B",
    cluster_auto_meta: {
      gi_hint: cluster.name === "Kutch" ? "Ajrakh" : "Heritage silk corridor",
    },
  });
}
