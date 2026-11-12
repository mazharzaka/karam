import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getActiveProfileKey } from "@/data/configLoader";

const PRIMARY_CONFIG_PATH = path.join(
  process.cwd(),
  "src",
  "private",
  "app-payload-8f92x.json"
);

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

function nonEmptyString(val: unknown, fallback: string): string {
  return typeof val === "string" && val.trim().length > 0 ? val.trim() : fallback;
}

/**
 * Static Bundled Configuration Endpoint
 * GET keeps payload details private; POST persists Admin edits directly into
 * `src/private/app-payload-8f92x.json` without losing structure or names.
 */
export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      mode: "static-bundled",
      profile: getActiveProfileKey(),
    },
    { status: 200 }
  );
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

    let existing: JsonRecord = {};
    if (fs.existsSync(PRIMARY_CONFIG_PATH)) {
      const rawFile = fs.readFileSync(PRIMARY_CONFIG_PATH, "utf8");
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
      PRIMARY_CONFIG_PATH,
      `${JSON.stringify(merged, null, 2)}\n`,
      "utf8"
    );

    return NextResponse.json(
      {
        success: true,
        message: "Configuration saved directly to src/private/app-payload-8f92x.json.",
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
