import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getActiveConfigTarget() {
  const profileId = process.env.NEXT_PUBLIC_ACTIVE_PROFILE_ID?.trim();
  if (!profileId) {
    throw new Error(
      "NEXT_PUBLIC_ACTIVE_PROFILE_ID environment variable is missing."
    );
  }
  const filename = `app-payload-${profileId}.json`;
  const filePath = path.join(process.cwd(), "src/private", filename);
  return { profileId, filename, filePath };
}

const SECTION_FIELD_MAP = {
  pharaonic: {
    groomKey: "pharaonicGroomUrl",
    brideKey: "pharaonicBrideUrl",
    audioKey: "audioPharaonic",
  },
  saidi: {
    groomKey: "saidiGroomUrl",
    brideKey: "saidiBrideUrl",
    audioKey: "audioSaidi",
  },
  cinema: {
    groomKey: "cinemaGroomUrl",
    brideKey: "cinemaBrideUrl",
    audioKey: "audioCinema",
  },
  falahi: {
    groomKey: "falahiGroomUrl",
    brideKey: "falahiBrideUrl",
    audioKey: "audioFalahi",
  },
  zamalek: {
    groomKey: "zamalekGroomUrl",
    brideKey: "zamalekBrideUrl",
    audioKey: "audioZamalek",
  },
  ahly: {
    groomKey: "ahlyGroomUrl",
    brideKey: "ahlyBrideUrl",
    audioKey: "audioAhly",
  },
  indian: {
    groomKey: "indianGroomUrl",
    brideKey: "indianBrideUrl",
    audioKey: "audioIndian",
  },
  fatimid: {
    groomKey: "fatimidGroomUrl",
    brideKey: "fatimidBrideUrl",
    audioKey: "audioFatimid",
  },
  mexican: {
    groomKey: "mexicanGroomUrl",
    brideKey: "mexicanBrideUrl",
    audioKey: "audioMexican",
  },
} as const;

type JsonRecord = Record<string, unknown>;

export interface CardItemPayload {
  id?: string;
  num?: string;
  url?: string;
  photo?: string;
  title?: string;
  caption?: string;
  date?: string;
  flipHorizontal?: boolean;
}

function nonEmptyString(val: unknown, fallback: string): string {
  return typeof val === "string" && val.trim().length > 0 ? val.trim() : fallback;
}

/**
 * Static Bundled Configuration Endpoint
 * GET keeps payload details private; POST persists Admin edits directly into
 * `src/private/app-payload-${NEXT_PUBLIC_ACTIVE_PROFILE_ID}.json` without losing structure or names.
 */
export async function GET() {
  try {
    const { profileId, filename, filePath } = getActiveConfigTarget();
    let activeConfig: JsonRecord | null = null;
    if (fs.existsSync(filePath)) {
      const rawFile = fs.readFileSync(filePath, "utf8");
      activeConfig = JSON.parse(rawFile) as JsonRecord;
    }

    return NextResponse.json(
      {
        status: "ok",
        mode: "dynamic-env-json",
        profile: profileId,
        filename,
        config: activeConfig,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Missing NEXT_PUBLIC_ACTIVE_PROFILE_ID environment variable.";
    return NextResponse.json(
      { status: "error", error: message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const incoming = (await request.json()) as JsonRecord;
    if (!incoming || typeof incoming !== "object" || Array.isArray(incoming)) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON configuration payload." },
        { status: 400 }
      );
    }

    const { profileId, filename, filePath } = getActiveConfigTarget();

    let existing: JsonRecord = {};
    if (fs.existsSync(filePath)) {
      const rawFile = fs.readFileSync(filePath, "utf8");
      existing = JSON.parse(rawFile) as JsonRecord;
    }

    const existingSections =
      (existing.sections as Record<string, JsonRecord> | undefined) || {};
    const incomingSections =
      (incoming.sections as Record<string, JsonRecord> | undefined) || {};

    const merged: JsonRecord = {
      ...existing,
      ...incoming,
      profileName: nonEmptyString(
        incoming.profileName,
        nonEmptyString(existing.profileName, "Mohamed & Manal Wedding Profile")
      ),
      groomName: nonEmptyString(
        incoming.groomName,
        nonEmptyString(existing.groomName, "Mohamed")
      ),
      brideName: nonEmptyString(
        incoming.brideName,
        nonEmptyString(existing.brideName, "Manal")
      ),
      activeThemes:
        Array.isArray(incoming.activeThemes) && incoming.activeThemes.length > 0
          ? incoming.activeThemes
          : existing.activeThemes,
      gallery: Array.isArray(incoming.gallery)
        ? incoming.gallery
        : existing.gallery,
      punishmentsGroom: Array.isArray(incoming.punishmentsGroom)
        ? incoming.punishmentsGroom
            .filter((item): item is string => typeof item === "string")
            .map((item) => item.trim())
            .filter((item) => item.length > 0)
        : Array.isArray(existing.punishmentsGroom)
        ? existing.punishmentsGroom
        : [],
      punishmentsBride: Array.isArray(incoming.punishmentsBride)
        ? incoming.punishmentsBride
            .filter((item): item is string => typeof item === "string")
            .map((item) => item.trim())
            .filter((item) => item.length > 0)
        : Array.isArray(existing.punishmentsBride)
        ? existing.punishmentsBride
        : [],
      imageFlips: (() => {
        const rawFlips =
          incoming.imageFlips && typeof incoming.imageFlips === "object"
            ? (incoming.imageFlips as Record<string, unknown>)
            : existing.imageFlips && typeof existing.imageFlips === "object"
            ? (existing.imageFlips as Record<string, unknown>)
            : {};
        const sanitized: Record<string, boolean> = {};
        for (const [k, v] of Object.entries(rawFlips)) {
          if (typeof v === "boolean") sanitized[k] = v;
        }
        return sanitized;
      })(),
      lastUpdated:
        typeof incoming.lastUpdated === "string" && incoming.lastUpdated
          ? incoming.lastUpdated
          : new Date().toISOString(),
    };

    const nextSections: Record<string, JsonRecord> = {};
    const sectionKeys = Array.from(
      new Set([
        ...Object.keys(existingSections),
        ...Object.keys(incomingSections),
      ])
    );

    for (const themeKey of sectionKeys) {
      const baseSec = existingSections[themeKey] || {};
      const patchSec = incomingSections[themeKey] || {};
      const fieldMap =
        SECTION_FIELD_MAP[themeKey as keyof typeof SECTION_FIELD_MAP];

      const syncedSection: JsonRecord = {
        ...baseSec,
        ...patchSec,
      };

      if (fieldMap) {
        if (typeof merged[fieldMap.groomKey] === "string" && merged[fieldMap.groomKey]) {
          syncedSection.groomImage = merged[fieldMap.groomKey];
        }
        if (typeof merged[fieldMap.brideKey] === "string" && merged[fieldMap.brideKey]) {
          syncedSection.brideImage = merged[fieldMap.brideKey];
        }
        if (typeof merged[fieldMap.audioKey] === "string" && merged[fieldMap.audioKey]) {
          syncedSection.audioSrc = merged[fieldMap.audioKey];
        }
      }

      nextSections[themeKey] = syncedSection;
    }

    merged.sections = nextSections;

    fs.writeFileSync(
      filePath,
      `${JSON.stringify(merged, null, 2)}\n`,
      "utf8"
    );

    return NextResponse.json(
      {
        success: true,
        profileId,
        filename,
        message: `Configuration saved directly to src/private/${filename}.`,
        timestamp: merged.lastUpdated,
        config: merged,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API /api/config POST] Failed to save config:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to persist configuration to JSON file.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
