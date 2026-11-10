import { NextResponse } from "next/server";
import fs from "fs/promises";
import os from "os";
import path from "path";

const CONFIG_FILE_PATH = path.join(os.tmpdir(), "karam-wedding-config.json");

declare global {
  // eslint-disable-next-line no-var
  var __weddingSiteConfig: Record<string, unknown> | undefined;
}

async function readPersistedConfig(): Promise<Record<string, unknown> | null> {
  if (globalThis.__weddingSiteConfig) {
    return globalThis.__weddingSiteConfig;
  }
  try {
    const raw = await fs.readFile(CONFIG_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    globalThis.__weddingSiteConfig = parsed;
    return parsed;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const payload = {
      ...body,
      lastUpdated: new Date().toISOString(),
    };

    globalThis.__weddingSiteConfig = payload;

    try {
      await fs.writeFile(CONFIG_FILE_PATH, JSON.stringify(payload, null, 2), "utf-8");
    } catch (fsErr) {
      console.warn("[API /api/config] Temp file write skipped:", fsErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Wedding site configuration saved successfully.",
        timestamp: payload.lastUpdated,
        config: payload,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API /api/config] Error processing configuration:", error);
    return NextResponse.json(
      { success: false, error: "Failed to parse configuration payload." },
      { status: 400 }
    );
  }
}

export async function GET() {
  const saved = await readPersistedConfig();
  return NextResponse.json(
    {
      status: "online",
      endpoint: "/api/config",
      config: saved,
    },
    { status: 200 }
  );
}
