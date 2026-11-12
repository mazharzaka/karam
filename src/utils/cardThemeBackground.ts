export interface CardThemeBackground {
  gradientClass: string;
}

const INDIAN_BG: CardThemeBackground = {
  gradientClass: "bg-gradient-to-t from-black via-orange-950/20 to-black",
};

const MEXICAN_BG: CardThemeBackground = {
  gradientClass: "bg-gradient-to-t from-black via-fuchsia-950/20 to-black",
};

const DEFAULT_BG: CardThemeBackground = {
  gradientClass: "",
};

/**
 * Returns the subtle dark theme gradient class strictly for Indian
 * ("ليالي بوليوود") and Mexican ("فييستا مكسيكية" / "فييستا المكسيكية" / "فيسيتا المكسيكية") cards.
 * All other styles fall back cleanly to a pure solid `bg-black` background.
 */
export function getCardThemeBackground(
  style?: string,
  sectionTitle?: string,
): CardThemeBackground {
  const normalizedStyle = (style || "").trim().toLowerCase();
  const normalizedTitle = (sectionTitle || "").trim();
  const normalizedTitleLower = normalizedTitle.toLowerCase();

  if (
    normalizedStyle === "indian" ||
    normalizedStyle.includes("indian") ||
    normalizedTitle === "ليالي بوليوود" ||
    normalizedTitle.includes("بوليوود") ||
    normalizedTitleLower.includes("indian") ||
    normalizedTitleLower.includes("bollywood")
  ) {
    return INDIAN_BG;
  }

  if (
    normalizedStyle === "mexican" ||
    normalizedStyle.includes("mexican") ||
    normalizedTitle === "فييستا مكسيكية" ||
    normalizedTitle === "فييستا المكسيكية" ||
    normalizedTitle === "فيسيتا المكسيكية" ||
    normalizedTitle.includes("مكسيكية") ||
    normalizedTitleLower.includes("mexican") ||
    normalizedTitleLower.includes("fiesta")
  ) {
    return MEXICAN_BG;
  }

  return DEFAULT_BG;
}
