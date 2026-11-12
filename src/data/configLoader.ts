import payloadPrimary from "@/private/app-payload-8f92x.json";
import payloadProfileB from "@/private/app-payload-4k71m.json";
import payloadProfileC from "@/private/app-payload-9c34v.json";

export type ConfigProfileKey = "default" | "mohamed" | "friend";

const STATIC_PAYLOADS: Record<ConfigProfileKey, Record<string, unknown>> = {
  default: payloadPrimary,
  mohamed: payloadProfileB,
  friend: payloadProfileC,
};

/**
 * Protected Profile Switcher:
 * - Set `ACTIVE_PROFILE_OVERRIDE` below ("default" | "mohamed" | "friend"), OR
 * - Set `NEXT_PUBLIC_WEDDING_PROFILE=mohamed` in `.env.local` / Vercel Environment Variables.
 * Payloads are imported statically from `src/private/` and bundled server/build-time
 * so raw JSON filenames are never exposed in public client URLs.
 */
export const ACTIVE_PROFILE_OVERRIDE: ConfigProfileKey | null = null;

export function getActiveProfileKey(): ConfigProfileKey {
  if (ACTIVE_PROFILE_OVERRIDE && STATIC_PAYLOADS[ACTIVE_PROFILE_OVERRIDE]) {
    return ACTIVE_PROFILE_OVERRIDE;
  }

  const envProfile = process.env.NEXT_PUBLIC_WEDDING_PROFILE as
    | ConfigProfileKey
    | undefined;
  if (envProfile && STATIC_PAYLOADS[envProfile]) {
    return envProfile;
  }

  return "default";
}

export function loadActiveStaticConfig(): Record<string, unknown> {
  const key = getActiveProfileKey();
  return STATIC_PAYLOADS[key] || payloadPrimary;
}
