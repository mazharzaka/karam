/**
 * Cloudinary Asset URL Optimization & Hotlink-Protection Helpers
 *
 * When Cloudinary "Allowed fetch domains" and "Strict transformations / Allowed referrers"
 * are enabled in the Cloudinary Security Console, optimized `f_auto,q_auto` URLs paired
 * with `Referrer-Policy: strict-origin-when-cross-origin` ensure assets only render on
 * authorized origins and serve AVIF/WebP automatically without casual hotlinking.
 */

const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dsls01rrg";

const CLOUDINARY_FETCH_PROXY_ENABLED =
  process.env.NEXT_PUBLIC_CLOUDINARY_FETCH_PROXY === "true";

const CLOUDINARY_ASSET_PREFIX =
  process.env.NEXT_PUBLIC_CLOUDINARY_ASSET_PREFIX || "";

const DEFAULT_TRANSFORM = "f_auto,q_auto";

export interface CloudinaryUrlOptions {
  maxWidth?: number;
  quality?: "auto" | "auto:best" | "auto:good" | "auto:eco";
}

export function isCloudinaryUrl(url: string): boolean {
  return /^https:\/\/res\.cloudinary\.com\/[^/]+\//i.test(url.trim());
}

function buildTransformString(options?: CloudinaryUrlOptions): string {
  const parts = ["f_auto", `q_${options?.quality || "auto"}`];
  if (options?.maxWidth && options.maxWidth > 0) {
    parts.push(`c_limit,w_${Math.round(options.maxWidth)}`);
  }
  return parts.join(",");
}

/**
 * Optimizes an existing `res.cloudinary.com` delivery URL by ensuring `f_auto,q_auto`
 * transformations are present cleanly once in the upload/fetch path.
 */
export function optimizeCloudinaryUrl(
  url: string,
  options?: CloudinaryUrlOptions
): string {
  const trimmed = url.trim();
  const markerMatch = trimmed.match(
    /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/(?:upload|fetch))\/(.*)$/i
  );
  if (!markerMatch) return trimmed;

  const [, basePrefix, remainder] = markerMatch;
  if (/^(?:[a-z]+_[^/,]+,?)+(\/|$)/i.test(remainder)) {
    // Already contains Cloudinary transformation flags (e.g. f_auto,q_auto or w_800)
    return trimmed.includes("f_auto")
      ? trimmed
      : `${basePrefix}/${DEFAULT_TRANSFORM}/${remainder}`;
  }

  const transforms = buildTransformString(options);
  return `${basePrefix}/${transforms}/${remainder}`;
}

/**
 * Builds an optimized Cloudinary upload URL from a public ID.
 */
export function buildCloudinaryAssetUrl(
  publicId: string,
  options?: CloudinaryUrlOptions
): string {
  const cleanId = publicId.replace(/^cloudinary:\/\//i, "").replace(/^\/+/, "");
  const transforms = buildTransformString(options);
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transforms}/${cleanId}`;
}

/**
 * Resolves any asset source (Cloudinary URL, `cloudinary://` ID, remote HTTPS URL,
 * or local `/...` asset) into an optimized URL ready for Cloudinary hotlink protection.
 */
export function resolveProtectedAssetUrl(
  src: string | undefined | null,
  options?: CloudinaryUrlOptions
): string {
  if (!src || typeof src !== "string") return "";
  const trimmed = src.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("cloudinary://")) {
    return buildCloudinaryAssetUrl(trimmed, options);
  }

  if (isCloudinaryUrl(trimmed)) {
    return optimizeCloudinaryUrl(trimmed, options);
  }

  if (
    CLOUDINARY_ASSET_PREFIX &&
    trimmed.startsWith("/") &&
    !trimmed.startsWith("/audio/")
  ) {
    return buildCloudinaryAssetUrl(
      `${CLOUDINARY_ASSET_PREFIX.replace(/\/+$/, "")}${trimmed}`,
      options
    );
  }

  if (CLOUDINARY_FETCH_PROXY_ENABLED && /^https?:\/\//i.test(trimmed)) {
    const transforms = buildTransformString(options);
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/fetch/${transforms}/${encodeURIComponent(
      trimmed
    )}`;
  }

  return trimmed;
}

