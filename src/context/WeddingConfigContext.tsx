"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface GalleryItem {
  id: string;
  url: string;
  caption: string;
  date: string;
}

export interface SiteConfiguration {
  groomName: string;
  brideName: string;
  weddingDate: string;
  engagementDate: string;
  audioTrackA: string;
  audioTrackB: string;
  audioTrackC: string;
  audioTrackD: string;
  heroGroomUrl: string;
  heroBrideUrl: string;
  avatarGroomUrl: string;
  avatarBrideUrl: string;
  gallery: GalleryItem[];
  lastUpdated?: string;
}

export const DEFAULT_CONFIG: SiteConfiguration = {
  groomName: "كرم",
  brideName: "هدير",
  weddingDate: "2024-11-15",
  engagementDate: "2023-08-10",
  audioTrackA: "/audio/pharaonic-track.mp3",
  audioTrackB: "/audio/saidi.mp3",
  audioTrackC: "/audio/track-d-cinema.mp3",
  audioTrackD: "/audio/zamalek-curva-sud.mp3",
  heroGroomUrl: "/statues/zamalek-groom.png",
  heroBrideUrl: "/statues/zamalek-bride.png",
  avatarGroomUrl: "/race/groom-avatar.png",
  avatarBrideUrl: "/race/bride-avatar.png",
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

const STORAGE_KEY = "WEDDING_ADMIN_CONFIG";

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

export const WeddingConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfiguration>(DEFAULT_CONFIG);

  // Sync from localStorage and API on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setConfig((prev) => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      console.warn("Could not load stored config from localStorage:", e);
    }

    // Also listen to storage events from other tabs / admin page
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setConfig((prev) => ({ ...prev, ...parsed }));
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
      const merged = { ...prev, ...newConfig, lastUpdated: new Date().toISOString() };
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
    <WeddingConfigContext.Provider value={{ config, updateConfig, resetToDefaults }}>
      {children}
    </WeddingConfigContext.Provider>
  );
};

export const useWeddingConfig = () => useContext(WeddingConfigContext);
