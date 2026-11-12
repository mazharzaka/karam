import payloadPrimary from "@/private/app-payload-8f92x.json";

const DEFAULT_PROFILE_ID = "8f92x";

/**
 * Dynamic Profile Switcher via Environment Variable:
 * Set `NEXT_PUBLIC_ACTIVE_PROFILE_ID=<id>` in `.env.local` (for local dev)
 * or `.env` / Vercel Environment Variables to load `src/private/app-payload-<id>.json`.
 */
export function getActiveProfileId(): string {
  const envProfileId = process.env.NEXT_PUBLIC_ACTIVE_PROFILE_ID;
  return typeof envProfileId === "string" && envProfileId.trim().length > 0
    ? envProfileId.trim()
    : DEFAULT_PROFILE_ID;
}

export function getActiveProfileFilename(
  profileId: string = getActiveProfileId()
): string {
  return `app-payload-${profileId}.json`;
}

export function getActiveProfileKey(): string {
  return getActiveProfileId();
}

export function loadActiveStaticConfig(): Record<string, unknown> {
  const profileId = getActiveProfileId();
  if (profileId === DEFAULT_PROFILE_ID) {
    return payloadPrimary;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    const loaded = require(`@/private/app-payload-${profileId}.json`);
    return (loaded?.default ?? loaded ?? payloadPrimary) as Record<
      string,
      unknown
    >;
  } catch (error) {
    console.warn(
      `[configLoader] Failed to load src/private/app-payload-${profileId}.json; falling back to ${DEFAULT_PROFILE_ID}.`,
      error
    );
    return payloadPrimary;
  }
}
