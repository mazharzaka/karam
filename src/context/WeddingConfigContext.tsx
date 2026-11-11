"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { ALL_80_IMAGES, RomanceImage } from "@/data/romanticImages";

export type ThemeId =
  | "pharaonic"
  | "saidi"
  | "cinema"
  | "falahi"
  | "zamalek"
  | "ahly"
  | "indian"
  | "fatimid"
  | "mexican";

export interface ThemeMeta {
  id: ThemeId;
  label: string;
  arabicTitle: string;
  hudTitle: string;
}

export const AVAILABLE_THEMES: ThemeMeta[] = [
  { id: "pharaonic", label: "Pharaonic", arabicTitle: "التراث الفرعوني", hudTitle: "Egyptian Heritage" },
  { id: "saidi", label: "Saidi", arabicTitle: "أصالة وجذور", hudTitle: "Saidi Heritage" },
  { id: "cinema", label: "1950s Cinema", arabicTitle: "زمن الفن الجميل", hudTitle: "Golden Age Cinema" },
  { id: "falahi", label: "Falahi", arabicTitle: "أفراح الريف", hudTitle: "أفراح الريف" },
  { id: "zamalek", label: "Zamalek SC", arabicTitle: "مدرسة الفن والهندسة", hudTitle: "Zamalek SC" },
  { id: "ahly", label: "Al Ahly SC", arabicTitle: "نادي القرن", hudTitle: "نادي القرن" },
  { id: "indian", label: "Indian Bollywood", arabicTitle: "ليالي بوليوود", hudTitle: "ليالي بوليوود" },
  { id: "fatimid", label: "Fatimid Islamic", arabicTitle: "ليالي القاهرة الفاطمية", hudTitle: "Fatimid Heritage" },
  { id: "mexican", label: "Mexican Fiesta", arabicTitle: "فييستا مكسيكية", hudTitle: "فييستا مكسيكية" },
];

export const MAX_ACTIVE_THEMES = 5;

const VALID_THEME_IDS = new Set<ThemeId>(AVAILABLE_THEMES.map((t) => t.id));

export function sanitizeActiveThemes(raw: unknown): ThemeId[] {
  if (!Array.isArray(raw)) {
    return ["ahly", "indian", "fatimid"];
  }
  const result: ThemeId[] = [];
  for (const item of raw) {
    if (typeof item !== "string" || !VALID_THEME_IDS.has(item as ThemeId)) continue;
    const id = item as ThemeId;
    if (result.includes(id)) continue;
    if (id === "ahly" && result.includes("zamalek")) continue;
    if (id === "zamalek" && result.includes("ahly")) continue;
    result.push(id);
    if (result.length >= MAX_ACTIVE_THEMES) break;
  }
  return result;
}

export function isThemeCheckboxDisabled(current: ThemeId[], id: ThemeId): boolean {
  const isSelected = current.includes(id);
  if (isSelected) return false;
  if (current.length >= MAX_ACTIVE_THEMES) return true;
  if (id === "ahly" && current.includes("zamalek")) return true;
  if (id === "zamalek" && current.includes("ahly")) return true;
  return false;
}

export interface GalleryItem {
  id: string;
  url: string;
  caption: string;
  date: string;
}

export interface SiteConfiguration {
  // Active Themes (Max 5, ahly XOR zamalek)
  activeThemes: ThemeId[];

  // CARD 1: Global Info & Section 1
  groomName: string;
  brideName: string;
  engagementDate: string;
  weddingDate: string;
  mainHeroBgUrl: string;
  groomChildhoodUrl: string;
  brideChildhoodUrl: string;

  // CARD 2: Theme Audio URLs
  audioPharaonic: string;
  audioSaidi: string;
  audioCinema: string;
  audioFalahi: string;
  audioZamalek: string;
  audioAhly: string;
  audioIndian: string;
  audioFatimid: string;
  audioMexican: string;

  // CARD 3: All AI Characters & Race Karts
  pharaonicGroomUrl: string;
  pharaonicBrideUrl: string;
  saidiGroomUrl: string;
  saidiBrideUrl: string;
  cinemaGroomUrl: string;
  cinemaBrideUrl: string;
  falahiGroomUrl: string;
  falahiBrideUrl: string;
  zamalekGroomUrl: string;
  zamalekBrideUrl: string;
  ahlyGroomUrl: string;
  ahlyBrideUrl: string;
  indianGroomUrl: string;
  indianBrideUrl: string;
  fatimidGroomUrl: string;
  fatimidBrideUrl: string;
  mexicanGroomUrl: string;
  mexicanBrideUrl: string;
  raceGroomAvatarUrl: string;
  raceBrideAvatarUrl: string;
  raceGroomKartUrl: string;
  raceBrideKartUrl: string;

  // CARD 4: Mass Gallery
  gallery: GalleryItem[];
  lastUpdated?: string;
}

export const DEFAULT_CONFIG: SiteConfiguration = {
  activeThemes: ["ahly", "indian", "fatimid"],

  // Card 1
  groomName: "كرم",
  brideName: "هدير",
  engagementDate: "2023-08-10",
  weddingDate: "2024-11-15",
  mainHeroBgUrl:
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2000&auto=format&fit=crop",
  groomChildhoodUrl:
    "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=400&auto=format&fit=crop",
  brideChildhoodUrl:
    "https://images.unsplash.com/photo-1519340333755-56e9c1d04079?q=80&w=400&auto=format&fit=crop",

  // Card 2: Theme Audio
  audioPharaonic: "/audio/pharaonic-track.mp3",
  audioSaidi: "/audio/track-c-saidi.mp3",
  audioCinema: "/audio/track-d-cinema.mp3",
  audioFalahi: "/audio/hadret-el-omda.mp3",
  audioZamalek: "/audio/zamalek-curva-sud.mp3",
  audioAhly: "/audio/pharaonic-track.mp3",
  audioIndian: "/audio/pharaonic-track.mp3",
  audioFatimid: "/audio/pharaonic-track.mp3",
  audioMexican: "/audio/pharaonic-track.mp3",

  // Card 3: All AI Characters
  pharaonicGroomUrl: "/statues/tutankhamun.png",
  pharaonicBrideUrl: "/statues/nefertiti.png",
  saidiGroomUrl: "/statues/saidi-man.png",
  saidiBrideUrl: "/statues/saidi-woman.png",
  cinemaGroomUrl: "/statues/vintage-groom.png",
  cinemaBrideUrl: "/statues/vintage-bride.png",
  falahiGroomUrl: "/statues/falahi-groom.png",
  falahiBrideUrl: "/statues/falahi-bride.png",
  zamalekGroomUrl: "/statues/zamalek-groom.png",
  zamalekBrideUrl: "/statues/zamalek-bride.png",
  ahlyGroomUrl: "/statues/zamalek-groom.png",
  ahlyBrideUrl: "/statues/zamalek-bride.png",
  indianGroomUrl: "/statues/tutankhamun.png",
  indianBrideUrl: "/statues/nefertiti.png",
  fatimidGroomUrl: "/statues/saidi-man.png",
  fatimidBrideUrl: "/statues/saidi-woman.png",
  mexicanGroomUrl: "/statues/saidi-man.png",
  mexicanBrideUrl: "/statues/saidi-woman.png",
  raceGroomAvatarUrl: "/race/groom-avatar.png",
  raceBrideAvatarUrl: "/race/bride-avatar.png",
  raceGroomKartUrl: "/race/groom-kart.png",
  raceBrideKartUrl: "/race/bride-kart.png",

  // Card 4: Mass Gallery
  gallery: [
    {
      id: "mem-01",
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80",
      caption: "أول خطوة في رحلتنا مع بعض 💍",
      date: "2023-08-10",
    },
    {
      id: "mem-02",
      url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80",
      caption: "غروب النيل في ليلة لا تُنسى ✨",
      date: "2023-11-20",
    },
    {
      id: "mem-03",
      url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80",
      caption: "ضحكة من القلب مع بداية تجهيزات الفرح 🤍",
      date: "2024-05-14",
    },
  ],
};

export const STORAGE_KEY = "WEDDING_ADMIN_CONFIG";

export function normalizeConfig(
  raw: Partial<SiteConfiguration> & Record<string, unknown>
): SiteConfiguration {
  return {
    ...DEFAULT_CONFIG,
    ...raw,
    activeThemes: sanitizeActiveThemes(raw.activeThemes),
    audioPharaonic:
      (raw.audioPharaonic as string) ||
      (raw.audioTrackA as string) ||
      DEFAULT_CONFIG.audioPharaonic,
    audioSaidi:
      (raw.audioSaidi as string) ||
      (raw.audioTrackB as string) ||
      DEFAULT_CONFIG.audioSaidi,
    audioCinema:
      (raw.audioCinema as string) ||
      (raw.audioTrackC as string) ||
      DEFAULT_CONFIG.audioCinema,
    audioZamalek:
      (raw.audioZamalek as string) ||
      (raw.audioTrackD as string) ||
      DEFAULT_CONFIG.audioZamalek,
    zamalekGroomUrl:
      (raw.zamalekGroomUrl as string) ||
      (raw.heroGroomUrl as string) ||
      DEFAULT_CONFIG.zamalekGroomUrl,
    zamalekBrideUrl:
      (raw.zamalekBrideUrl as string) ||
      (raw.heroBrideUrl as string) ||
      DEFAULT_CONFIG.zamalekBrideUrl,
    raceGroomAvatarUrl:
      (raw.raceGroomAvatarUrl as string) ||
      (raw.avatarGroomUrl as string) ||
      DEFAULT_CONFIG.raceGroomAvatarUrl,
    raceBrideAvatarUrl:
      (raw.raceBrideAvatarUrl as string) ||
      (raw.avatarBrideUrl as string) ||
      DEFAULT_CONFIG.raceBrideAvatarUrl,
    gallery: Array.isArray(raw.gallery)
      ? raw.gallery
      : DEFAULT_CONFIG.gallery,
  };
}

const ROTATIONS = [-12, -9, -6, -4, -2, 2, 4, 6, 8, 10, 12, -8, 7, -10, 9];

export function buildDynamicRomanceImages(gallery: GalleryItem[]): RomanceImage[] {
  if (!gallery || gallery.length === 0) {
    return ALL_80_IMAGES;
  }

  return gallery.map((item, index) => {
    const template = ALL_80_IMAGES[index % ALL_80_IMAGES.length];
    const col = index % 5;
    const row = Math.floor(index / 5);
    return {
      ...template,
      id: index + 1,
      url: item.url,
      title: `Memory #${index + 1}`,
      caption: item.caption || template.caption,
      date: item.date || template.date,
      rotation: ROTATIONS[index % ROTATIONS.length],
      tunnelDepth: (index % 20) / 20,
      deskX: ((index * 37) % 650) - 325,
      deskY: ((index * 29) % 360) - 180,
      canvasX: col * 340 - 680 + (index % 3) * 20,
      canvasY: row * 420 - 420 + (index % 2) * 15,
    };
  });
}

export function mergeGalleryIntoCards<
  T extends { photo: string; title: string; time: string }
>(defaults: T[], gallery: GalleryItem[], offset = 0): T[] {
  if (!gallery || gallery.length === 0) return defaults;
  return defaults.map((card, index) => {
    const item = gallery[(index + offset) % gallery.length];
    if (!item) return card;
    return {
      ...card,
      photo: item.url || card.photo,
      title: item.caption?.trim() ? item.caption : card.title,
      time: item.date?.trim() ? item.date : card.time,
    };
  });
}

interface WeddingConfigContextType {
  config: SiteConfiguration;
  updateConfig: (newConfig: Partial<SiteConfiguration>) => void;
  resetToDefaults: () => void;
}

const WeddingConfigContext = createContext<WeddingConfigContextType>({
  config: DEFAULT_CONFIG,
  updateConfig: () => {},
  resetToDefaults: () => {},
});

export const WeddingConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [config, setConfig] = useState<SiteConfiguration>(DEFAULT_CONFIG);

  useEffect(() => {
    let loadedFromLocal = false;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<SiteConfiguration> &
          Record<string, unknown>;
        setConfig(normalizeConfig(parsed));
        loadedFromLocal = true;
      }
    } catch (e) {
      console.warn("Could not load stored config from localStorage:", e);
    }

    fetch("/api/config")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.config) {
          const normalized = normalizeConfig(data.config);
          if (!loadedFromLocal) {
            setConfig(normalized);
          } else {
            setConfig((prev) => {
              const prevTime = prev.lastUpdated ? Date.parse(prev.lastUpdated) : 0;
              const apiTime = normalized.lastUpdated
                ? Date.parse(normalized.lastUpdated)
                : 0;
              return apiTime > prevTime ? normalized : prev;
            });
          }
        }
      })
      .catch(() => {});

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setConfig(normalizeConfig(parsed));
        } catch (err) {
          console.warn("Storage sync error:", err);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const updateConfig = useCallback((newConfig: Partial<SiteConfiguration>) => {
    setConfig((prev) => {
      const merged = normalizeConfig({
        ...prev,
        ...newConfig,
        lastUpdated: new Date().toISOString(),
      });
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } catch (err) {
        console.warn("LocalStorage save error:", err);
      }
      return merged;
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CONFIG));
    } catch (err) {
      console.warn("LocalStorage reset error:", err);
    }
  }, []);

  return (
    <WeddingConfigContext.Provider
      value={{ config, updateConfig, resetToDefaults }}
    >
      {children}
    </WeddingConfigContext.Provider>
  );
};

export const useWeddingConfig = () => useContext(WeddingConfigContext);
