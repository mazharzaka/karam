"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { CldUploadWidget } from "next-cloudinary";
import {
  Calendar,
  Clock,
  Heart,
  Music,
  UploadCloud,
  Trash2,
  Plus,
  Save,
  CheckCircle2,
  Image as ImageIcon,
  Sparkles,
  Sliders,
  ExternalLink,
  Copy,
  ChevronDown,
  ChevronUp,
  Layers,
  ArrowLeft,
  RefreshCw,
  Eye,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Types & Interfaces                                                         */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* Initial Default Values                                                     */
/* -------------------------------------------------------------------------- */

const DEFAULT_CONFIG: SiteConfiguration = {
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

/* -------------------------------------------------------------------------- */
/* Component: AdminPage                                                       */
/* -------------------------------------------------------------------------- */

export default function AdminPage() {
  // 1. GLOBAL CONFIGURATION (Dates & Audio)
  const [groomName, setGroomName] = useState<string>(DEFAULT_CONFIG.groomName);
  const [brideName, setBrideName] = useState<string>(DEFAULT_CONFIG.brideName);
  const [weddingDate, setWeddingDate] = useState<string>(DEFAULT_CONFIG.weddingDate);
  const [engagementDate, setEngagementDate] = useState<string>(DEFAULT_CONFIG.engagementDate);

  const [audioTrackA, setAudioTrackA] = useState<string>(DEFAULT_CONFIG.audioTrackA);
  const [audioTrackB, setAudioTrackB] = useState<string>(DEFAULT_CONFIG.audioTrackB);
  const [audioTrackC, setAudioTrackC] = useState<string>(DEFAULT_CONFIG.audioTrackC);
  const [audioTrackD, setAudioTrackD] = useState<string>(DEFAULT_CONFIG.audioTrackD);

  // 2. HERO IMAGES UPLOAD
  const [heroGroomUrl, setHeroGroomUrl] = useState<string>(DEFAULT_CONFIG.heroGroomUrl);
  const [heroBrideUrl, setHeroBrideUrl] = useState<string>(DEFAULT_CONFIG.heroBrideUrl);
  const [avatarGroomUrl, setAvatarGroomUrl] = useState<string>(DEFAULT_CONFIG.avatarGroomUrl);
  const [avatarBrideUrl, setAvatarBrideUrl] = useState<string>(DEFAULT_CONFIG.avatarBrideUrl);

  // 3. DYNAMIC GALLERY WITH METADATA (CRITICAL)
  const [gallery, setGallery] = useState<GalleryItem[]>(DEFAULT_CONFIG.gallery);

  // UI & Action states
  const [activeTab, setActiveTab] = useState<"all" | "global" | "heroes" | "gallery" | "json">("all");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [showJsonInspector, setShowJsonInspector] = useState<boolean>(false);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [manualAddUrl, setManualAddUrl] = useState<string>("");

  // Load saved configuration from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: SiteConfiguration = JSON.parse(saved);
        if (parsed.groomName) setGroomName(parsed.groomName);
        if (parsed.brideName) setBrideName(parsed.brideName);
        if (parsed.weddingDate) setWeddingDate(parsed.weddingDate);
        if (parsed.engagementDate) setEngagementDate(parsed.engagementDate);
        if (parsed.audioTrackA) setAudioTrackA(parsed.audioTrackA);
        if (parsed.audioTrackB) setAudioTrackB(parsed.audioTrackB);
        if (parsed.audioTrackC) setAudioTrackC(parsed.audioTrackC);
        if (parsed.audioTrackD) setAudioTrackD(parsed.audioTrackD);
        if (parsed.heroGroomUrl) setHeroGroomUrl(parsed.heroGroomUrl);
        if (parsed.heroBrideUrl) setHeroBrideUrl(parsed.heroBrideUrl);
        if (parsed.avatarGroomUrl) setAvatarGroomUrl(parsed.avatarGroomUrl);
        if (parsed.avatarBrideUrl) setAvatarBrideUrl(parsed.avatarBrideUrl);
        if (Array.isArray(parsed.gallery)) setGallery(parsed.gallery);
      }
    } catch (err) {
      console.warn("Could not load stored admin config:", err);
    }
  }, []);

  /* -------------------------------------------------------------------------- */
  /* Live Counter Calculation Preview                                           */
  /* -------------------------------------------------------------------------- */
  const timeTogetherPreview = useMemo(() => {
    if (!weddingDate) return { days: 0, hours: 0, minutes: 0, isFuture: false };
    const target = new Date(weddingDate).getTime();
    const now = new Date().getTime();
    const diff = target > now ? target - now : now - target;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    return {
      days,
      hours,
      minutes,
      isFuture: target > now,
    };
  }, [weddingDate]);

  /* -------------------------------------------------------------------------- */
  /* Gallery State Handlers                                                     */
  /* -------------------------------------------------------------------------- */

  // Helper to add a new photo to the gallery
  const handleAddPhotoToGallery = useCallback((url: string, caption = "", date = "") => {
    if (!url.trim()) return;
    const newItem: GalleryItem = {
      id: "mem-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
      url: url.trim(),
      caption: caption || "لحظة جديدة جميلة 🌸",
      date: date || new Date().toISOString().split("T")[0],
    };
    setGallery((prev) => [newItem, ...prev]);
  }, []);

  // Update specific fields of a gallery item
  const handleUpdateGalleryItem = useCallback(
    (id: string, field: "caption" | "date" | "url", value: string) => {
      setGallery((prev) =>
        prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
      );
    },
    []
  );

  // Remove a photo from the gallery
  const handleRemoveGalleryItem = useCallback((id: string) => {
    setGallery((prev) => prev.filter((item) => item.id !== id));
  }, []);

  /* -------------------------------------------------------------------------- */
  /* 4. SAVE ACTION: Bundle full state into single JSON payload                 */
  /* -------------------------------------------------------------------------- */
  const fullConfigPayload: SiteConfiguration = useMemo(
    () => ({
      groomName,
      brideName,
      weddingDate,
      engagementDate,
      audioTrackA,
      audioTrackB,
      audioTrackC,
      audioTrackD,
      heroGroomUrl,
      heroBrideUrl,
      avatarGroomUrl,
      avatarBrideUrl,
      gallery,
      lastUpdated: new Date().toISOString(),
    }),
    [
      groomName,
      brideName,
      weddingDate,
      engagementDate,
      audioTrackA,
      audioTrackB,
      audioTrackC,
      audioTrackD,
      heroGroomUrl,
      heroBrideUrl,
      avatarGroomUrl,
      avatarBrideUrl,
      gallery,
    ]
  );

  const handleSaveAndPublish = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    // 1. Bundle entire state into a single JSON object and console.log it
    console.log("==========================================");
    console.log("🚀 PUBLISHING WEDDING SITE CONFIGURATION:");
    console.log(JSON.stringify(fullConfigPayload, null, 2));
    console.log("==========================================");

    // 2. Persist to localStorage for client-side live site consumption
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fullConfigPayload));
    } catch (e) {
      console.warn("Local storage save failed:", e);
    }

    // 3. Post to API /api/config
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullConfigPayload),
      });
      if (res.ok) {
        console.log("✅ Successfully saved to /api/config");
      }
    } catch (err) {
      console.log("ℹ️ /api/config not reachable or pending endpoint; state is safely preserved locally.", err);
    }

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 5000);
    }, 600);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(fullConfigPayload, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#FDF9FA] text-[#33272A] font-sans antialiased">
      {/* -------------------------------------------------------------------- */}
      {/* Top Navigation & Sticky Publish Action Header                        */}
      {/* -------------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#F2D98D]/40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#D4AF37] transition-all"
              title="Return to Romantic Wrapped Experience"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h1 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-[#2B1D24]">
                  Wedding Website Admin
                </h1>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#D4AF37]/15 text-[#B89335]">
                  Control Hub
                </span>
              </div>
              <p className="text-xs text-[#7B6A6E] font-medium hidden sm:block">
                Fully customize dates, dynamic audio, hero characters & memory gallery
              </p>
            </div>
          </div>

          {/* Top Actions: Live Preview Link & Massive Save Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-gray-200 hover:border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-all shadow-xs"
            >
              <Eye className="w-4 h-4 text-[#D4AF37]" />
              <span>Live Site</span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
            </Link>

            {/* Massive SAVE & PUBLISH Button */}
            <button
              type="button"
              onClick={handleSaveAndPublish}
              disabled={isSaving}
              className={`inline-flex items-center gap-2.5 px-5 sm:px-8 py-3 rounded-xl font-bold text-sm sm:text-base text-white shadow-md transition-all duration-200 cursor-pointer ${
                saveSuccess
                  ? "bg-emerald-600 hover:bg-emerald-700 scale-102"
                  : "bg-gradient-to-r from-[#D4AF37] via-[#C9A227] to-[#B89335] hover:opacity-95 hover:shadow-lg active:scale-98"
              } disabled:opacity-50`}
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Publishing Changes...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Published Successfully!</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>SAVE &amp; PUBLISH</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* -------------------------------------------------------------------- */}
      {/* Notification Toast Alert                                             */}
      {/* -------------------------------------------------------------------- */}
      {saveSuccess && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-3 text-emerald-800 text-sm font-semibold flex items-center justify-center gap-2 text-center transition-all animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            Changes saved and published! Complete JSON bundle was logged to the console and saved to local configuration.
          </span>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* Main Content Dashboard Container                                     */}
      {/* -------------------------------------------------------------------- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Tabs Pill Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-gray-200 text-xs sm:text-sm font-semibold scrollbar-none">
          {[
            { id: "all", label: "Overview & All Sections", icon: Sliders },
            { id: "global", label: "1. Global & Audio", icon: Calendar },
            { id: "heroes", label: "2. Hero Characters", icon: ImageIcon },
            { id: "gallery", label: `3. Memory Gallery (${gallery.length})`, icon: Layers },
            { id: "json", label: "4. JSON Config Payload", icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#2B1D24] text-white shadow-xs font-bold"
                    : "text-[#7B6A6E] hover:text-[#2B1D24] hover:bg-gray-100"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#D4AF37]" : "text-gray-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ================================================================== */}
        {/* SECTION 1: GLOBAL CONFIGURATION (Dates & Audio)                     */}
        {/* ================================================================== */}
        {(activeTab === "all" || activeTab === "global") && (
          <section className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-gray-100 bg-gradient-to-r from-amber-50/50 via-rose-50/30 to-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#D4AF37]/15 text-[#B89335]">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-black text-[#2B1D24]">
                    1. Global Configuration
                  </h2>
                  <p className="text-xs sm:text-sm text-[#7B6A6E]">
                    Couple names, milestone dates, live counter engine &amp; soundtrack anthems
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800">
                Core Engine
              </span>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Couple Names Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                    Groom Name (اسم العريس)
                  </label>
                  <input
                    type="text"
                    value={groomName}
                    onChange={(e) => setGroomName(e.target.value)}
                    placeholder="e.g. كرم"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                    Bride Name (اسم العروسة)
                  </label>
                  <input
                    type="text"
                    value={brideName}
                    onChange={(e) => setBrideName(e.target.value)}
                    placeholder="e.g. هدير"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none text-sm transition-all"
                  />
                </div>
              </div>

              {/* Milestone Dates Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                    Engagement Date (تاريخ الخطوبة)
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={engagementDate}
                      onChange={(e) => setEngagementDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none text-sm transition-all bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                    Wedding Date (تاريخ الزفاف)
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={weddingDate}
                      onChange={(e) => setWeddingDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none text-sm transition-all bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* REQUIRED UI HINT: Explanation of "Time Together" Live Counter */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-950 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#B89335] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-amber-900">
                      💡 How the Live &quot;Time Together&quot; Counter Works:
                    </p>
                    <p className="text-amber-800 text-xs mt-0.5">
                      The <strong>Wedding Date</strong> is utilized throughout the Hero Spotlight and Story
                      chapters to automatically compute a real-time counter (Days, Hours, and Minutes). If the
                      wedding has passed, it counts days celebrated together; if ahead, it creates an active
                      countdown to the big day!
                    </p>
                  </div>
                </div>

                {/* Live Preview Pill */}
                <div className="shrink-0 bg-white border border-amber-200 px-3.5 py-2 rounded-lg text-xs font-mono font-bold text-[#B89335] shadow-2xs">
                  <span className="block text-[10px] uppercase font-sans text-gray-400">
                    Live Calculation Preview
                  </span>
                  <span>
                    {timeTogetherPreview.days.toLocaleString()} Days • {timeTogetherPreview.hours}h •{" "}
                    {timeTogetherPreview.minutes}m {timeTogetherPreview.isFuture ? "until Wedding" : "Together"}
                  </span>
                </div>
              </div>

              {/* Audio URLs: 4 Anthems */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <Music className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700">
                    Soundtrack Anthems (4 Audio Tracks)
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Track A */}
                  <div className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 bg-gray-50/50 transition-all">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-gray-800">
                        Track A: Pharaonic Heritage Anthem
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-200 text-gray-700">
                        Scene 02
                      </span>
                    </div>
                    <input
                      type="text"
                      value={audioTrackA}
                      onChange={(e) => setAudioTrackA(e.target.value)}
                      placeholder="/audio/pharaonic-track.mp3"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none font-mono"
                    />
                  </div>

                  {/* Track B */}
                  <div className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 bg-gray-50/50 transition-all">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-gray-800">
                        Track B: Saidi Heritage &amp; Mismar
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        Scene 03
                      </span>
                    </div>
                    <input
                      type="text"
                      value={audioTrackB}
                      onChange={(e) => setAudioTrackB(e.target.value)}
                      placeholder="/audio/saidi.mp3"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none font-mono"
                    />
                  </div>

                  {/* Track C */}
                  <div className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 bg-gray-50/50 transition-all">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-gray-800">
                        Track C: Golden Age Cinema Orchestra
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                        Scene 04
                      </span>
                    </div>
                    <input
                      type="text"
                      value={audioTrackC}
                      onChange={(e) => setAudioTrackC(e.target.value)}
                      placeholder="/audio/track-d-cinema.mp3"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none font-mono"
                    />
                  </div>

                  {/* Track D */}
                  <div className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 bg-gray-50/50 transition-all">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-gray-800">
                        Track D: Zamalek SC Anthem (Curva Sud)
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-red-100 text-red-800">
                        Scene 05
                      </span>
                    </div>
                    <input
                      type="text"
                      value={audioTrackD}
                      onChange={(e) => setAudioTrackD(e.target.value)}
                      placeholder="/audio/zamalek-curva-sud.mp3"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================== */}
        {/* SECTION 2: HERO IMAGES UPLOAD (CldUploadWidget)                    */}
        {/* ================================================================== */}
        {(activeTab === "all" || activeTab === "heroes") && (
          <section className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-gray-100 bg-gradient-to-r from-rose-50/50 via-amber-50/30 to-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-black text-[#2B1D24]">
                    2. Hero Characters Upload
                  </h2>
                  <p className="text-xs sm:text-sm text-[#7B6A6E]">
                    Upload Groom, Bride and 3D Avatar characters via Cloudinary
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-800">
                Cloudinary Widget
              </span>
            </div>

            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Hero 1: Groom */}
                <HeroImageUploaderCard
                  title="Groom Hero Character"
                  subtitle="Section 5 (Zamalek) / Section 3"
                  imageUrl={heroGroomUrl}
                  onUrlChange={setHeroGroomUrl}
                  presetName="wedding_heroes"
                />

                {/* Hero 2: Bride */}
                <HeroImageUploaderCard
                  title="Bride Hero Character"
                  subtitle="Section 5 (Zamalek) / Section 3"
                  imageUrl={heroBrideUrl}
                  onUrlChange={setHeroBrideUrl}
                  presetName="wedding_heroes"
                />

                {/* Hero 3: 3D Groom Avatar */}
                <HeroImageUploaderCard
                  title="Groom 3D Avatar"
                  subtitle="Section 6 (Race Challenge)"
                  imageUrl={avatarGroomUrl}
                  onUrlChange={setAvatarGroomUrl}
                  presetName="wedding_avatars"
                />

                {/* Hero 4: 3D Bride Avatar */}
                <HeroImageUploaderCard
                  title="Bride 3D Avatar"
                  subtitle="Section 6 (Race Challenge)"
                  imageUrl={avatarBrideUrl}
                  onUrlChange={setAvatarBrideUrl}
                  presetName="wedding_avatars"
                />
              </div>
            </div>
          </section>
        )}

        {/* ================================================================== */}
        {/* SECTION 3: DYNAMIC GALLERY WITH METADATA (CRITICAL)                */}
        {/* ================================================================== */}
        {(activeTab === "all" || activeTab === "gallery") && (
          <section className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-gray-100 bg-gradient-to-r from-purple-50/50 via-pink-50/30 to-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-black text-[#2B1D24]">
                    3. Dynamic Memory Gallery
                  </h2>
                  <p className="text-xs sm:text-sm text-[#7B6A6E]">
                    Upload photos with individual captions, stories, and memory dates
                  </p>
                </div>
              </div>

              {/* Upload Controls for Gallery */}
              <div className="flex items-center gap-2.5">
                <CldUploadWidget
                  config={{ cloud: { cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo" } }}
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "wedding_gallery"}
                  onSuccess={(result) => {
                    const info = result?.info as { secure_url?: string } | undefined;
                    if (info?.secure_url) {
                      handleAddPhotoToGallery(info.secure_url);
                    }
                  }}
                  options={{
                    maxFiles: 10,
                    clientAllowedFormats: ["png", "jpeg", "jpg", "webp"],
                  }}
                >
                  {({ open }) => (
                    <button
                      type="button"
                      onClick={() => open?.()}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2B1D24] hover:bg-[#3d2b34] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                    >
                      <UploadCloud className="w-4 h-4 text-[#D4AF37]" />
                      <span>Upload Memory Photos (Cloudinary)</span>
                    </button>
                  )}
                </CldUploadWidget>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Manual URL adder fallback */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <input
                    type="url"
                    value={manualAddUrl}
                    onChange={(e) => setManualAddUrl(e.target.value)}
                    placeholder="Or paste an image URL directly (e.g. Unsplash or Cloudinary URL)..."
                    className="w-full px-4 py-2.5 text-xs rounded-lg border border-gray-200 bg-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (manualAddUrl.trim()) {
                      handleAddPhotoToGallery(manualAddUrl.trim());
                      setManualAddUrl("");
                    }
                  }}
                  disabled={!manualAddUrl.trim()}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#C9A227] disabled:opacity-40 text-white font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Photo</span>
                </button>
              </div>

              {/* Gallery Items List with Side-by-Side Metadata Inputs */}
              {gallery.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-gray-200">
                  <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-bold text-gray-700">No memory photos yet</p>
                  <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                    Click &quot;Upload Memory Photos&quot; above to add your first romantic picture.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-500 px-1">
                    <span>{gallery.length} Photos in Dynamic Gallery</span>
                    <span>Edit captions &amp; dates below:</span>
                  </div>

                  {gallery.map((item, index) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-gray-200 bg-white hover:border-[#D4AF37]/50 hover:shadow-xs transition-all flex flex-col md:flex-row items-center gap-4"
                    >
                      {/* Photo Thumbnail */}
                      <div className="relative w-full md:w-32 h-32 md:h-24 shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-2xs">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.url}
                          alt={item.caption || `Memory Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80";
                          }}
                        />
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-black/70 text-white">
                          #{index + 1 < 10 ? `0${index + 1}` : index + 1}
                        </span>
                      </div>

                      {/* Side-by-Side Metadata Fields: Caption & Date */}
                      <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Caption / Story Input */}
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-gray-600 mb-1">
                            Caption / Story (الوصف أو القصة)
                          </label>
                          <input
                            type="text"
                            value={item.caption}
                            onChange={(e) =>
                              handleUpdateGalleryItem(item.id, "caption", e.target.value)
                            }
                            placeholder="e.g. Our magical sunset in Dahab..."
                            className="w-full px-3.5 py-2 text-xs rounded-lg border border-gray-200 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none"
                          />
                        </div>

                        {/* Date of Memory Input */}
                        <div>
                          <label className="block text-[11px] font-bold text-gray-600 mb-1">
                            Date of Memory (تاريخ الذكرى)
                          </label>
                          <input
                            type="date"
                            value={item.date}
                            onChange={(e) =>
                              handleUpdateGalleryItem(item.id, "date", e.target.value)
                            }
                            className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none bg-white"
                          />
                        </div>
                      </div>

                      {/* Remove Button */}
                      <div className="w-full md:w-auto flex md:flex-col justify-end gap-2 pt-2 md:pt-0">
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryItem(item.id)}
                          className="px-3 py-2 rounded-lg text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 hover:border-rose-600 text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          title="Remove Photo"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="md:hidden">Remove</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ================================================================== */}
        {/* SECTION 4: JSON CONFIG INSPECTOR & EXPORT                           */}
        {/* ================================================================== */}
        <section className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div
            onClick={() => setShowJsonInspector((prev) => !prev)}
            className="p-6 border-b border-gray-100 bg-gray-50/60 flex items-center justify-between cursor-pointer hover:bg-gray-100/50 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gray-200 text-gray-700">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#2B1D24]">
                  Live Dynamic JSON Payload (Ready for API / Export)
                </h3>
                <p className="text-xs text-gray-500">
                  Inspect the compiled bundle sent on Save &amp; Publish
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-gray-500">
                {gallery.length} moments • 4 anthems
              </span>
              {showJsonInspector ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </div>
          </div>

          {(showJsonInspector || activeTab === "json") && (
            <div className="p-6 bg-[#1C1518] text-gray-200">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-xs">
                <span className="font-mono text-romantic-roseGold">
                  payload.json (application/json)
                </span>
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs transition-all cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedJson ? "Copied to Clipboard!" : "Copy JSON"}</span>
                </button>
              </div>

              <pre className="max-h-96 overflow-y-auto text-xs font-mono p-4 rounded-xl bg-black/40 text-emerald-300 scrollbar-thin">
                {JSON.stringify(fullConfigPayload, null, 2)}
              </pre>
            </div>
          )}
        </section>

        {/* ================================================================== */}
        {/* Massive Bottom SAVE & PUBLISH Trigger Banner                       */}
        {/* ================================================================== */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#2B1D24] via-[#3a2630] to-[#2B1D24] text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#D4AF37] mb-2">
              <Heart className="w-3.5 h-3.5 fill-[#D4AF37]" />
              <span>Ready to Broadcast</span>
            </div>
            <h3 className="text-2xl font-serif font-black tracking-tight">
              Publish All Updates to Wedding Experience
            </h3>
            <p className="text-sm text-gray-300 mt-1 max-w-xl">
              Bundles names, dates, Cloudinary images, soundtrack tracks, and dynamic gallery
              metadata into a synchronized payload.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSaveAndPublish}
            disabled={isSaving}
            className={`w-full md:w-auto px-10 py-4 rounded-2xl font-black text-base tracking-wide text-white shadow-2xl transition-all cursor-pointer ${
              saveSuccess
                ? "bg-emerald-600 scale-102"
                : "bg-gradient-to-r from-[#D4AF37] via-[#F2D98D] to-[#B89335] text-[#2B1D24] hover:opacity-95 hover:scale-102 active:scale-98 shadow-[#D4AF37]/30"
            } disabled:opacity-50`}
          >
            {isSaving ? "SAVING &amp; PUBLISHING..." : saveSuccess ? "✓ SAVED &amp; LIVE!" : "SAVE &amp; PUBLISH NOW"}
          </button>
        </div>
      </main>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Subcomponent: HeroImageUploaderCard                                        */
/* -------------------------------------------------------------------------- */

interface HeroImageUploaderCardProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  presetName: string;
  onUrlChange: (url: string) => void;
}

function HeroImageUploaderCard({
  title,
  subtitle,
  imageUrl,
  presetName,
  onUrlChange,
}: HeroImageUploaderCardProps) {
  const [isEditingUrl, setIsEditingUrl] = useState<boolean>(false);
  const [customUrl, setCustomUrl] = useState<string>(imageUrl);

  useEffect(() => {
    setCustomUrl(imageUrl);
  }, [imageUrl]);

  return (
    <div className="flex flex-col justify-between p-4 rounded-xl border border-gray-200 bg-white hover:border-[#D4AF37]/50 hover:shadow-xs transition-all space-y-3">
      {/* Header Info */}
      <div>
        <h4 className="text-xs font-black text-gray-900 line-clamp-1">{title}</h4>
        <p className="text-[11px] text-gray-400">{subtitle}</p>
      </div>

      {/* Visual Image Thumbnail Stage */}
      <div className="relative w-full h-44 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 flex items-center justify-center group">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80";
            }}
          />
        ) : (
          <div className="text-center p-4">
            <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-1" />
            <span className="text-[10px] text-gray-400">No Image Set</span>
          </div>
        )}

        {/* Floating status badge */}
        <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-white/90 backdrop-blur-xs text-gray-700 shadow-2xs">
          {imageUrl.startsWith("http") ? "Cloud/Web" : "Local Asset"}
        </span>
      </div>

      {/* Cloudinary Upload Widget Button */}
      <div className="space-y-2">
        <CldUploadWidget
          config={{ cloud: { cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo" } }}
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || presetName}
          onSuccess={(result) => {
            const info = result?.info as { secure_url?: string } | undefined;
            if (info?.secure_url) {
              onUrlChange(info.secure_url);
            }
          }}
          options={{
            maxFiles: 1,
            clientAllowedFormats: ["png", "jpeg", "jpg", "webp"],
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open?.()}
              className="w-full py-2.5 px-3 rounded-lg bg-[#2B1D24] hover:bg-[#3d2b34] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <UploadCloud className="w-4 h-4 text-[#D4AF37]" />
              <span>Upload via Cloudinary</span>
            </button>
          )}
        </CldUploadWidget>

        {/* Toggle Manual URL override */}
        <button
          type="button"
          onClick={() => setIsEditingUrl((prev) => !prev)}
          className="w-full text-center text-[11px] font-semibold text-[#B89335] hover:underline cursor-pointer"
        >
          {isEditingUrl ? "Hide URL Input" : "Paste / Edit Direct URL"}
        </button>

        {isEditingUrl && (
          <div className="flex gap-1.5 pt-1">
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://... or /statues/..."
              className="flex-1 px-2.5 py-1.5 text-xs rounded border border-gray-200 outline-none focus:border-[#D4AF37]"
            />
            <button
              type="button"
              onClick={() => {
                onUrlChange(customUrl);
                setIsEditingUrl(false);
              }}
              className="px-2.5 py-1.5 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold cursor-pointer"
            >
              Set
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
