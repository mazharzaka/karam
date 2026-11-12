import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ACTIVE_PROFILE_COOKIE = "active_profile_id";
let inMemoryActiveProfileId: string | null = null;

const PROFILE_ARABIC_LABELS: Record<string, string> = {
  "8f92x": "محمد ومنال",
  "9c34v": "كريم وفرح",
};

function isValidProfileId(id: string | undefined | null): id is string {
  return typeof id === "string" && /^[a-zA-Z0-9_-]+$/.test(id.trim());
}

function getProfileFilePath(profileId: string) {
  const filename = `app-payload-${profileId}.json`;
  const filePath = path.join(process.cwd(), "src/private", filename);
  return { profileId, filename, filePath };
}

function listAvailableProfiles() {
  const privateDir = path.join(process.cwd(), "src/private");
  if (!fs.existsSync(privateDir)) return [];

  const files = fs
    .readdirSync(privateDir)
    .filter((f) => /^app-payload-[a-zA-Z0-9_-]+\.json$/.test(f))
    .sort();

  return files.map((filename) => {
    const id = filename.replace(/^app-payload-/, "").replace(/\.json$/, "");
    let label = PROFILE_ARABIC_LABELS[id] || id;
    let groomName = "";
    let brideName = "";
    try {
      const parsed = JSON.parse(
        fs.readFileSync(path.join(privateDir, filename), "utf8"),
      ) as Record<string, unknown>;
      groomName = typeof parsed.groomName === "string" ? parsed.groomName : "";
      brideName = typeof parsed.brideName === "string" ? parsed.brideName : "";
      if (!PROFILE_ARABIC_LABELS[id] && groomName && brideName) {
        label = `${groomName} & ${brideName}`;
      }
    } catch {
      // ignore malformed JSON
    }
    return { id, filename, label, groomName, brideName };
  });
}

function persistEnvProfileId(profileId: string) {
  try {
    const envPath = path.join(process.cwd(), ".env");
    if (!fs.existsSync(envPath)) return;
    const raw = fs.readFileSync(envPath, "utf8");
    const nextLine = `NEXT_PUBLIC_ACTIVE_PROFILE_ID=${profileId}`;
    const updated = /^NEXT_PUBLIC_ACTIVE_PROFILE_ID=.*$/m.test(raw)
      ? raw.replace(/^NEXT_PUBLIC_ACTIVE_PROFILE_ID=.*$/m, nextLine)
      : `${raw.trimEnd()}\n${nextLine}\n`;
    fs.writeFileSync(envPath, updated, "utf8");
  } catch {
    // Non-fatal on read-only filesystems (e.g. serverless)
  }
}

function getActiveConfigTarget(explicitProfileId?: string) {
  if (isValidProfileId(explicitProfileId)) {
    return getProfileFilePath(explicitProfileId.trim());
  }

  let cookieProfileId: string | undefined;
  try {
    cookieProfileId = cookies().get(ACTIVE_PROFILE_COOKIE)?.value?.trim();
  } catch {
    // cookies() unavailable outside request context
  }

  if (isValidProfileId(cookieProfileId)) {
    const target = getProfileFilePath(cookieProfileId);
    if (fs.existsSync(target.filePath)) {
      return target;
    }
  }

  if (isValidProfileId(inMemoryActiveProfileId)) {
    const target = getProfileFilePath(inMemoryActiveProfileId);
    if (fs.existsSync(target.filePath)) {
      return target;
    }
  }

  const profileId = process.env.NEXT_PUBLIC_ACTIVE_PROFILE_ID?.trim();
  if (!profileId) {
    throw new Error(
      "NEXT_PUBLIC_ACTIVE_PROFILE_ID environment variable is missing."
    );
  }
  return getProfileFilePath(profileId);
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
        availableProfiles: listAvailableProfiles(),
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

    // Handle dynamic profile switching from Admin Panel
    if (
      incoming.action === "switchProfile" &&
      typeof incoming.profileId === "string"
    ) {
      const requestedId = incoming.profileId.trim();
      if (!isValidProfileId(requestedId)) {
        return NextResponse.json(
          { success: false, error: "Invalid profileId format." },
          { status: 400 }
        );
      }
      const target = getProfileFilePath(requestedId);
      if (!fs.existsSync(target.filePath)) {
        return NextResponse.json(
          {
            success: false,
            error: `Profile file src/private/${target.filename} was not found.`,
          },
          { status: 404 }
        );
      }

      inMemoryActiveProfileId = target.profileId;
      persistEnvProfileId(target.profileId);

      const switchedConfig = JSON.parse(
        fs.readFileSync(target.filePath, "utf8"),
      ) as JsonRecord;

      const response = NextResponse.json(
        {
          success: true,
          profileId: target.profileId,
          filename: target.filename,
          config: switchedConfig,
          availableProfiles: listAvailableProfiles(),
        },
        {
          status: 200,
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        }
      );
      response.cookies.set(ACTIVE_PROFILE_COOKIE, target.profileId, {
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
      });
      return response;
    }

    const explicitProfileId =
      typeof incoming.targetProfileId === "string"
        ? incoming.targetProfileId
        : undefined;
    const { profileId, filename, filePath } =
      getActiveConfigTarget(explicitProfileId);

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
