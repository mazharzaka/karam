"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import { intervalToDuration } from "date-fns";
import {
  Bot,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Eye,
  Image as ImageIcon,
  Layers,
  LogOut,
  Music,
  Palette,
  Plus,
  RefreshCw,
  Save,
  Sparkles,
  Trash2,
  UploadCloud,
  Users,
  ArrowLeft,
  Wand2,
  AlertCircle,
} from "lucide-react";
import {
  useWeddingConfig,
  SiteConfiguration,
  GalleryItem,
  ThemeId,
  AVAILABLE_THEMES,
  MAX_ACTIVE_THEMES,
  isThemeCheckboxDisabled,
} from "@/context/WeddingConfigContext";

// Replace "wedding_uploads" if you named your Cloudinary unsigned upload preset differently
const CLOUDINARY_UPLOAD_PRESET = "wedding_uploads";

const HYPER_REALISTIC_PROMPTS: { id: string; title: string; prompt: string }[] = [
  {
    id: "ahly-groom",
    title: "1. العريس (الأهلي):",
    prompt:
      "Hyper-realistic, cinematic full-body portrait of a handsome real Egyptian man with [وصف شعرك] wearing a red Al Ahly SC football jersey. He is smiling enthusiastically. 10% empty padding margin. Feet firmly at the bottom. 3/4 camera angle slightly from above. Pure white background for easy cutout. 8k resolution --ar 2:3",
  },
  {
    id: "ahly-bride",
    title: "2. العروسة (الأهلي):",
    prompt:
      "Hyper-realistic, cinematic full-body portrait of a beautiful real Egyptian woman with [وصف شعرها/طرحتها] wearing a sporty red Al Ahly SC jersey. She is cheering happily. 10% empty padding margin. Feet firmly at the bottom. 3/4 camera angle slightly from above. Pure white background. 8k resolution --ar 2:3",
  },
  {
    id: "indian-groom",
    title: "3. العريس (الهندي):",
    prompt:
      "Hyper-realistic, cinematic full-body portrait of a real Egyptian man with [وصف شعرك] dressed in a traditional vibrant royal Indian Sherwani. 10% padding. Pure white background. 8k resolution --ar 2:3",
  },
  {
    id: "indian-bride",
    title: "4. العروسة (الهندي):",
    prompt:
      "Hyper-realistic, cinematic full-body portrait of a real Egyptian woman with [وصف شعرها] dressed in a stunning, colorful Indian Lehenga. 10% padding. Pure white background. 8k resolution --ar 2:3",
  },
  {
    id: "mexican-groom",
    title: "5. العريس (المكسيكي):",
    prompt:
      "Hyper-realistic, cinematic full-body portrait of a real Egyptian man dressed in a festive Mexican Charro suit with a Sombrero. 10% padding. Pure white background. 8k resolution --ar 2:3",
  },
  {
    id: "mexican-bride",
    title: "6. العروسة (المكسيكية):",
    prompt:
      "Hyper-realistic, cinematic full-body portrait of a real Egyptian woman dressed in a colorful embroidered Mexican fiesta dress. 10% padding. Pure white background. 8k resolution --ar 2:3",
  },
];

const FULL_CHEAT_SHEET_TEXT = `دليل توليد الصور (شخصيات حقيقية 100%):
استخدم هذه الأوامر للحصول على صور واقعية سينمائية. استبدل ما بين الأقواس بملامحك.

${HYPER_REALISTIC_PROMPTS.map((p) => `${p.title}\n${p.prompt}`).join("\n\n")}

(ملاحظة: صور سيارات السباق فقط هي التي تظل 3D Pixar style لتناسب اللعبة)`;

interface MagicGenerationTask {
  key: CharacterFieldKey;
  role: "groom" | "bride";
  label: string;
  prompt: string;
}

const GROOM_GENERATION_TASKS: MagicGenerationTask[] = [
  {
    key: "pharaonicGroomUrl",
    role: "groom",
    label: "Pharaonic Groom",
    prompt:
      "Hyper-realistic, cinematic full-body studio portrait of a handsome real Egyptian man dressed as an ancient Egyptian king Pharaoh in ornate golden Nemes headdress, royal gold collar, and linen tunic, confident noble smile, 10% empty padding margin, feet firmly at bottom, 3/4 camera angle, pure solid white background for easy cutout, 8k photorealistic photography",
  },
  {
    key: "saidiGroomUrl",
    role: "groom",
    label: "Saidi Groom",
    prompt:
      "Hyper-realistic, cinematic full-body studio portrait of a handsome real Upper Egyptian Saidi man wearing an authentic crisp traditional wool Galabeya, wrapped white Saidi turban, and draped shawl, warm proud smile, 10% empty padding margin, feet firmly at bottom, 3/4 camera angle, pure solid white background for easy cutout, 8k photorealistic photography",
  },
  {
    key: "falahiGroomUrl",
    role: "groom",
    label: "Falahi Groom",
    prompt:
      "Hyper-realistic, cinematic full-body studio portrait of a charming real Egyptian Delta groom wearing traditional rural Egyptian festive linen Galabeya and vest holding fresh tangerines, joyful warm smile, 10% empty padding margin, feet firmly at bottom, 3/4 camera angle, pure solid white background for easy cutout, 8k photorealistic photography",
  },
  {
    key: "cinemaGroomUrl",
    role: "groom",
    label: "Cinema Groom",
    prompt:
      "Hyper-realistic, cinematic full-body studio portrait of a handsome real Egyptian man in classic 1950s Cairo Golden Age Cinema black tailored tuxedo with bow tie and vintage slicked hairstyle, nostalgic monochrome sepia film lighting, charming smile, 10% empty padding margin, pure solid white background for easy cutout, 8k photorealistic photography",
  },
  {
    key: "zamalekGroomUrl",
    role: "groom",
    label: "Zamalek Groom",
    prompt:
      "Hyper-realistic, cinematic full-body studio portrait of a handsome real Egyptian man wearing the classic white Zamalek SC football jersey with two horizontal red stripes, enthusiastic celebratory smile, 10% empty padding margin, feet firmly at bottom, 3/4 camera angle, pure solid white background for easy cutout, 8k photorealistic photography",
  },
  {
    key: "ahlyGroomUrl",
    role: "groom",
    label: "Al Ahly Groom",
    prompt:
      "Hyper-realistic, cinematic full-body studio portrait of a handsome real Egyptian man wearing a vibrant red Al Ahly SC football jersey, smiling enthusiastically in celebration, 10% empty padding margin, feet firmly at bottom, 3/4 camera angle, pure solid white background for easy cutout, 8k photorealistic photography",
  },
  {
    key: "indianGroomUrl",
    role: "groom",
    label: "Indian Groom",
    prompt:
      "Hyper-realistic, cinematic full-body studio portrait of a handsome real Egyptian man dressed in an opulent embroidered royal Indian Sherwani in deep crimson and gold with traditional stole, warm festive smile, 10% empty padding margin, feet firmly at bottom, pure solid white background for easy cutout, 8k photorealistic photography",
  },
  {
    key: "mexicanGroomUrl",
    role: "groom",
    label: "Mexican Groom",
    prompt:
      "Hyper-realistic, cinematic full-body studio portrait of a handsome real Egyptian man dressed in a traditional embroidered Mexican Charro mariachi suit with an ornate festive Sombrero, joyful smile, 10% empty padding margin, feet firmly at bottom, pure solid white background for easy cutout, 8k photorealistic photography",
  },
];

const BRIDE_GENERATION_TASKS: MagicGenerationTask[] = [
  {
    key: "pharaonicBrideUrl",
    role: "bride",
    label: "Pharaonic Bride",
    prompt:
      "Hyper-realistic, cinematic full-body studio portrait of a beautiful real Egyptian woman dressed as Queen Nefertiti in an ornate golden Pharaonic crown, jeweled broad collar, and flowing pleated white royal gown, radiant smile, 10% empty padding margin, feet firmly at bottom, 3/4 camera angle, pure solid white background for easy cutout, 8k photorealistic photography",
  },
  {
    key: "saidiBrideUrl",
    role: "bride",
    label: "Saidi Bride",
    prompt:
      "Hyper-realistic, cinematic full-body studio portrait of a beautiful real Upper Egyptian Saidi woman wearing a richly embroidered traditional black and gold Talli dress, delicate head veil, and traditional Egyptian gold jewelry, radiant smile, 10% empty padding margin, feet firmly at bottom, pure solid white background for easy cutout, 8k photorealistic photography",
  },
  {
    key: "falahiBrideUrl",
    role: "bride",
    label: "Falahi Bride",
    prompt:
      "Hyper-realistic, cinematic full-body studio portrait of a beautiful real Egyptian Delta bride wearing an authentic colorful floral embroidered Falahi traditional dress and delicate headscarf holding tangerines, joyful smile, 10% empty padding margin, feet firmly at bottom, pure solid white background for easy cutout, 8k photorealistic photography",
  },
  {
    key: "cinemaBrideUrl",
    role: "bride",
    label: "Cinema Bride",
    prompt:
      "Hyper-realistic, cinematic full-body studio portrait of a glamorous real Egyptian woman styled like a 1950s Cairo Golden Age film star in an elegant vintage polka-dot evening dress holding a rose, classic retro hair waves, nostalgic sepia film lighting, pure solid white background for easy cutout, 8k photorealistic photography",
  },
  {
    key: "zamalekBrideUrl",
    role: "bride",
    label: "Zamalek Bride",
    prompt:
      "Hyper-realistic, cinematic full-body studio portrait of a beautiful real Egyptian woman wearing a sporty white Zamalek SC football jersey with two horizontal red stripes, cheering happily with a bright smile, 10% empty padding margin, feet firmly at bottom, pure solid white background for easy cutout, 8k photorealistic photography",
  },
  {
    key: "ahlyBrideUrl",
    role: "bride",
    label: "Al Ahly Bride",
    prompt:
      "Hyper-realistic, cinematic full-body studio portrait of a beautiful real Egyptian woman wearing a sporty red Al Ahly SC football jersey, cheering happily with a joyful smile, 10% empty padding margin, feet firmly at bottom, 3/4 camera angle, pure solid white background for easy cutout, 8k photorealistic photography",
  },
  {
    key: "indianBrideUrl",
    role: "bride",
    label: "Indian Bride",
    prompt:
      "Hyper-realistic, cinematic full-body studio portrait of a beautiful real Egyptian woman dressed in a stunning richly embroidered crimson, magenta, and gold Indian bridal Lehenga with sheer dupatta and traditional jewelry, radiant smile, 10% empty padding margin, pure solid white background for easy cutout, 8k photorealistic photography",
  },
  {
    key: "mexicanBrideUrl",
    role: "bride",
    label: "Mexican Bride",
    prompt:
      "Hyper-realistic, cinematic full-body studio portrait of a beautiful real Egyptian woman dressed in a vibrant colorful floral embroidered Mexican fiesta dress with festive ribbons, joyful radiant smile, 10% empty padding margin, feet firmly at bottom, pure solid white background for easy cutout, 8k photorealistic photography",
  },
];

const ALL_16_GENERATION_TASKS: MagicGenerationTask[] = GROOM_GENERATION_TASKS.flatMap(
  (groomTask, idx) => [groomTask, BRIDE_GENERATION_TASKS[idx]]
);

type CharacterFieldKey =
  | "pharaonicGroomUrl"
  | "pharaonicBrideUrl"
  | "saidiGroomUrl"
  | "saidiBrideUrl"
  | "cinemaGroomUrl"
  | "cinemaBrideUrl"
  | "falahiGroomUrl"
  | "falahiBrideUrl"
  | "zamalekGroomUrl"
  | "zamalekBrideUrl"
  | "ahlyGroomUrl"
  | "ahlyBrideUrl"
  | "indianGroomUrl"
  | "indianBrideUrl"
  | "mexicanGroomUrl"
  | "mexicanBrideUrl"
  | "raceGroomAvatarUrl"
  | "raceBrideAvatarUrl"
  | "raceGroomKartUrl"
  | "raceBrideKartUrl";

const CHARACTER_FIELDS: {
  key: CharacterFieldKey;
  title: string;
  subtitle: string;
  themeId?: ThemeId;
}[] = [
    { key: "pharaonicGroomUrl", title: "Pharaonic Groom", subtitle: "Theme: pharaonic", themeId: "pharaonic" },
    { key: "pharaonicBrideUrl", title: "Pharaonic Bride", subtitle: "Theme: pharaonic", themeId: "pharaonic" },
    { key: "saidiGroomUrl", title: "Saidi Groom (الصعيدي)", subtitle: "Theme: saidi", themeId: "saidi" },
    { key: "saidiBrideUrl", title: "Saidi Bride (الصعيدية)", subtitle: "Theme: saidi", themeId: "saidi" },
    { key: "cinemaGroomUrl", title: "1950s Cinema Groom", subtitle: "Theme: cinema", themeId: "cinema" },
    { key: "cinemaBrideUrl", title: "1950s Cinema Bride", subtitle: "Theme: cinema", themeId: "cinema" },
    { key: "falahiGroomUrl", title: "Falahi Groom (أفراح الريف)", subtitle: "Theme: falahi", themeId: "falahi" },
    { key: "falahiBrideUrl", title: "Falahi Bride (أفراح الريف)", subtitle: "Theme: falahi", themeId: "falahi" },
    { key: "zamalekGroomUrl", title: "Zamalek Groom (الملكي)", subtitle: "Theme: zamalek", themeId: "zamalek" },
    { key: "zamalekBrideUrl", title: "Zamalek Bride (الملكية)", subtitle: "Theme: zamalek", themeId: "zamalek" },
    { key: "ahlyGroomUrl", title: "Al Ahly Groom (نادي القرن)", subtitle: "Theme: ahly", themeId: "ahly" },
    { key: "ahlyBrideUrl", title: "Al Ahly Bride (نادي القرن)", subtitle: "Theme: ahly", themeId: "ahly" },
    { key: "indianGroomUrl", title: "Indian Groom (ليالي بوليوود)", subtitle: "Theme: indian", themeId: "indian" },
    { key: "indianBrideUrl", title: "Indian Bride (ليالي بوليوود)", subtitle: "Theme: indian", themeId: "indian" },
    { key: "mexicanGroomUrl", title: "Mexican Groom (فييستا مكسيكية)", subtitle: "Theme: mexican", themeId: "mexican" },
    { key: "mexicanBrideUrl", title: "Mexican Bride (فييستا مكسيكية)", subtitle: "Theme: mexican", themeId: "mexican" },
    { key: "raceGroomAvatarUrl", title: "Race Groom Avatar", subtitle: "Couples Race Challenge" },
    { key: "raceBrideAvatarUrl", title: "Race Bride Avatar", subtitle: "Couples Race Challenge" },
    { key: "raceGroomKartUrl", title: "Groom Racing Kart (3D)", subtitle: "Race Lane 1" },
    { key: "raceBrideKartUrl", title: "Bride Racing Kart (3D)", subtitle: "Race Lane 2" },
  ];

const AUDIO_FIELDS: {
  key: keyof Pick<
    SiteConfiguration,
    | "audioPharaonic"
    | "audioSaidi"
    | "audioCinema"
    | "audioFalahi"
    | "audioZamalek"
    | "audioAhly"
    | "audioIndian"
    | "audioMexican"
  >;
  label: string;
  badge: string;
  placeholder: string;
}[] = [
    {
      key: "audioPharaonic",
      label: "1. Pharaonic Theme Audio URL",
      badge: "pharaonic",
      placeholder: "/audio/pharaonic-track.mp3",
    },
    {
      key: "audioSaidi",
      label: "2. Saidi Theme Audio URL",
      badge: "saidi",
      placeholder: "/audio/track-c-saidi.mp3",
    },
    {
      key: "audioCinema",
      label: "3. Cinema (1950s) Theme Audio URL",
      badge: "cinema",
      placeholder: "/audio/track-d-cinema.mp3",
    },
    {
      key: "audioFalahi",
      label: "4. Falahi Theme Audio URL",
      badge: "falahi",
      placeholder: "/audio/hadret-el-omda.mp3",
    },
    {
      key: "audioZamalek",
      label: "5. Zamalek SC Theme Audio URL",
      badge: "zamalek",
      placeholder: "/audio/zamalek-curva-sud.mp3",
    },
    {
      key: "audioAhly",
      label: "6. Al Ahly SC Theme Audio URL",
      badge: "ahly",
      placeholder: "/audio/ahly-theme.mp3",
    },
    {
      key: "audioIndian",
      label: "7. Indian Bollywood Theme Audio URL",
      badge: "indian",
      placeholder: "/audio/indian-theme.mp3",
    },
    {
      key: "audioMexican",
      label: "8. Mexican Fiesta Theme Audio URL",
      badge: "mexican",
      placeholder: "/audio/mexican-theme.mp3",
    },
  ];

function computeDurationLabel(dateStr: string): string {
  if (!dateStr) return "Select a date";
  const target = new Date(dateStr);
  if (Number.isNaN(target.getTime())) return "Invalid date";
  const now = new Date();
  const isFuture = target.getTime() > now.getTime();
  const duration = intervalToDuration({
    start: isFuture ? now : target,
    end: isFuture ? target : now,
  });
  return `${duration.years ?? 0}y • ${duration.months ?? 0}m • ${duration.days ?? 0}d • ${duration.hours ?? 0}h ${isFuture ? "(countdown)" : "together"
    }`;
}

export default function AdminPage() {
  const router = useRouter();
  const { config, updateConfig } = useWeddingConfig();

  const [draft, setDraft] = useState<SiteConfiguration>(config);
  const [isDirty, setIsDirty] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [manualAddUrl, setManualAddUrl] = useState("");
  const [lastUploadedGalleryUrl, setLastUploadedGalleryUrl] = useState("");
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  // Magic AI Generator state
  const [groomSourceUrl, setGroomSourceUrl] = useState("");
  const [brideSourceUrl, setBrideSourceUrl] = useState("");
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<{
    current: number;
    total: number;
    currentLabel: string;
  }>({ current: 0, total: ALL_16_GENERATION_TASKS.length, currentLabel: "" });
  const [generationStatuses, setGenerationStatuses] = useState<
    Record<string, "idle" | "generating" | "done" | "error">
  >({});
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Keep draft synced with context hydration from localStorage / /api/config until user edits
  useEffect(() => {
    if (!isDirty) {
      setDraft(config);
    }
  }, [config, isDirty]);

  const setField = useCallback(
    <K extends keyof SiteConfiguration>(key: K, value: SiteConfiguration[K]) => {
      setIsDirty(true);
      setDraft((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleToggleTheme = useCallback((id: ThemeId) => {
    setIsDirty(true);
    setDraft((prev) => {
      const current = prev.activeThemes || [];
      if (current.includes(id)) {
        return {
          ...prev,
          activeThemes: current.filter((t) => t !== id),
        };
      }
      if (isThemeCheckboxDisabled(current, id)) {
        return prev;
      }
      return {
        ...prev,
        activeThemes: [...current, id],
      };
    });
  }, []);

  const engagementPreview = useMemo(
    () => computeDurationLabel(draft.engagementDate),
    [draft.engagementDate]
  );
  const weddingPreview = useMemo(
    () => computeDurationLabel(draft.weddingDate),
    [draft.weddingDate]
  );

  const handleAddGalleryPhoto = useCallback((url: string) => {
    if (!url.trim()) return;
    const newItem: GalleryItem = {
      id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      url: url.trim(),
      caption: "",
      date: new Date().toISOString().split("T")[0],
    };
    setIsDirty(true);
    setDraft((prev) => ({
      ...prev,
      gallery: [newItem, ...prev.gallery],
    }));
  }, []);

  const handleUpdateGalleryItem = useCallback(
    (id: string, field: "caption" | "date", value: string) => {
      setIsDirty(true);
      setDraft((prev) => ({
        ...prev,
        gallery: prev.gallery.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      }));
    },
    []
  );

  const handleRemoveGalleryItem = useCallback((id: string) => {
    setIsDirty(true);
    setDraft((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((item) => item.id !== id),
    }));
  }, []);

  const handleCopyPrompt = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => {
      setCopiedPromptId((prev) => (prev === id ? null : prev));
    }, 2500);
  };

  const handleGenerateAll16 = async () => {
    if (!groomSourceUrl || !brideSourceUrl || isGeneratingAll) return;

    setIsGeneratingAll(true);
    setGenerationError(null);
    setGenerationProgress({
      current: 0,
      total: ALL_16_GENERATION_TASKS.length,
      currentLabel: "Starting Magic AI Pipeline...",
    });
    setGenerationStatuses({});

    for (let i = 0; i < ALL_16_GENERATION_TASKS.length; i++) {
      const task = ALL_16_GENERATION_TASKS[i];
      const sourceImageUrl =
        task.role === "groom" ? groomSourceUrl : brideSourceUrl;

      setGenerationProgress({
        current: i + 1,
        total: ALL_16_GENERATION_TASKS.length,
        currentLabel: `Generating ${task.label}... ${i + 1}/${ALL_16_GENERATION_TASKS.length}`,
      });
      setGenerationStatuses((prev) => ({ ...prev, [task.key]: "generating" }));

      try {
        const res = await fetch("/api/generate-character", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sourceImageUrl,
            prompt: task.prompt,
          }),
        });

        const data = (await res.json()) as {
          success?: boolean;
          imageUrl?: string;
          url?: string;
          error?: string;
        };

        const generatedUrl = data.imageUrl || data.url;
        if (!res.ok || !generatedUrl) {
          throw new Error(
            data.error || `Failed generating ${task.label} (HTTP ${res.status})`
          );
        }

        // Immediately persist each generated URL into local draft & global WeddingConfigContext
        setDraft((prev) => ({ ...prev, [task.key]: generatedUrl }));
        updateConfig({ [task.key]: generatedUrl });
        setGenerationStatuses((prev) => ({ ...prev, [task.key]: "done" }));
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : `Error generating ${task.label}`;
        setGenerationStatuses((prev) => ({ ...prev, [task.key]: "error" }));
        setGenerationError(msg);
        // Stop early if REPLICATE_API_TOKEN is not configured so we don't fail 16 times in a row
        if (msg.includes("REPLICATE_API_TOKEN")) {
          break;
        }
      }
    }

    setIsGeneratingAll(false);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth", { method: "DELETE" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  const handleSaveAndPublish = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    const payload: SiteConfiguration = {
      ...draft,
      lastUpdated: new Date().toISOString(),
    };

    // Persist immediately into global context + localStorage
    updateConfig(payload);
    setIsDirty(false);

    // Persist to /api/config server endpoint
    try {
      await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn("Could not save to /api/config:", err);
    }

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 5000);
    }, 350);
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-gray-50 p-4 pb-32 text-[#33272A] font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Bar */}
        <header className="bg-white rounded-2xl border border-gray-200 shadow-xs px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#D4AF37] transition-all"
              title="Back to Wedding Site"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h1 className="text-xl sm:text-2xl font-serif font-black text-[#2B1D24]">
                  Wedding Control Dashboard
                </h1>
              </div>
              <p className="text-xs text-gray-500">
                100% Dynamic Configuration — Changes appear live across all sections
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 transition-all"
            >
              <Eye className="w-4 h-4 text-[#D4AF37]" />
              <span>Preview Live Site</span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-bold transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* ================================================================== */}
        {/* TOP CARD: ✨ MAGIC AI CHARACTER GENERATOR (REPLICATE INSTANTID)    */}
        {/* ================================================================== */}
        <section className="bg-white rounded-2xl border-2 border-[#D4AF37]/50 shadow-md overflow-hidden">
          <div className="p-6 border-b border-[#D4AF37]/20 bg-gradient-to-r from-[#2B1D24] via-[#3d2631] to-[#2B1D24] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B89335] text-[#2B1D24] shadow-md">
                <Wand2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-black tracking-tight">
                  ✨ Magic AI Generator
                </h2>
                <p className="text-xs sm:text-sm text-amber-100/85">
                  Upload 1 clear photo of the Groom &amp; 1 of the Bride — InstantID generates all 16 hyper-realistic theme characters progressively.
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-[#D4AF37]/40 text-xs font-bold text-[#F2D98D] self-start sm:self-auto">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Replicate InstantID • 16 Characters</span>
            </span>
          </div>

          <div className="p-6 space-y-6">
            {/* 2 Source Photo Uploaders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CloudinaryImageCard
                title="1. Groom Source Photo (صورة العريس الأصلية)"
                subtitle="Clear front-facing portrait for InstantID face preservation"
                imageUrl={groomSourceUrl}
                onUrlChange={setGroomSourceUrl}
              />
              <CloudinaryImageCard
                title="2. Bride Source Photo (صورة العروسة الأصلية)"
                subtitle="Clear front-facing portrait for InstantID face preservation"
                imageUrl={brideSourceUrl}
                onUrlChange={setBrideSourceUrl}
              />
            </div>

            {/* Error Alert */}
            {generationError && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Generation Notice:</p>
                  <p>{generationError}</p>
                </div>
              </div>
            )}

            {/* Progress Bar & Live Status Text */}
            {(isGeneratingAll || generationProgress.current > 0) && (
              <div className="p-4 rounded-xl bg-amber-50/70 border border-[#D4AF37]/40 space-y-3">
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-[#2B1D24]">
                  <span className="flex items-center gap-2">
                    {isGeneratingAll && (
                      <RefreshCw className="w-4 h-4 text-[#B89335] animate-spin" />
                    )}
                    <span>
                      {isGeneratingAll
                        ? generationProgress.currentLabel
                        : `Completed ${Object.values(generationStatuses).filter(
                          (s) => s === "done"
                        ).length
                        } / ${ALL_16_GENERATION_TASKS.length} Characters`}
                    </span>
                  </span>
                  <span className="font-mono text-[#B89335]">
                    {Math.round(
                      (generationProgress.current / generationProgress.total) *
                      100
                    )}
                    %
                  </span>
                </div>

                <div className="w-full h-3 rounded-full bg-white border border-[#D4AF37]/30 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#D4AF37] via-[#F2D98D] to-[#B89335] transition-all duration-300"
                    style={{
                      width: `${(generationProgress.current /
                          generationProgress.total) *
                        100
                        }%`,
                    }}
                  />
                </div>

                {/* 16-Item Live Status Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-1">
                  {ALL_16_GENERATION_TASKS.map((task) => {
                    const status = generationStatuses[task.key] || "idle";
                    return (
                      <div
                        key={task.key}
                        className={`px-2 py-1.5 rounded-lg border text-[10px] font-bold flex items-center justify-between gap-1 ${status === "generating"
                            ? "border-[#D4AF37] bg-amber-100 text-[#2B1D24] animate-pulse"
                            : status === "done"
                              ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                              : status === "error"
                                ? "border-rose-300 bg-rose-50 text-rose-800"
                                : "border-gray-200 bg-white text-gray-500"
                          }`}
                      >
                        <span className="truncate">{task.label}</span>
                        <span>
                          {status === "generating"
                            ? "⏳"
                            : status === "done"
                              ? "✓"
                              : status === "error"
                                ? "✕"
                                : "•"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Massive Generate All 16 Characters Button */}
            <div className="flex flex-col items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleGenerateAll16}
                disabled={
                  isGeneratingAll || !groomSourceUrl || !brideSourceUrl
                }
                className="w-full py-4 px-8 rounded-2xl font-black text-base sm:text-lg tracking-wide text-[#2B1D24] bg-gradient-to-r from-[#D4AF37] via-[#F2D98D] to-[#B89335] hover:opacity-95 shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
              >
                {isGeneratingAll ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>{generationProgress.currentLabel}</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    <span>Generate All 16 Characters</span>
                  </>
                )}
              </button>
              {(!groomSourceUrl || !brideSourceUrl) && (
                <p className="text-xs text-gray-500">
                  Upload both the Groom and Bride source photos above to unlock Magic AI Generation.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/* THEME SELECTOR CARD (MAX 5 THEMES + AHLY / ZAMALEK XOR)            */}
        {/* ================================================================== */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50/50 via-amber-50/40 to-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
                <Palette className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-serif font-black text-[#2B1D24]">
                  Theme Selector (Choose up to {MAX_ACTIVE_THEMES} Themes)
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Select which cultural themes appear on your live timeline. Maximum 5 themes; Al Ahly &amp; Zamalek are mutually exclusive.
                </p>
              </div>
            </div>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full self-start sm:self-auto ${draft.activeThemes.length >= MAX_ACTIVE_THEMES
                  ? "bg-amber-100 text-amber-800"
                  : "bg-emerald-100 text-emerald-800"
                }`}
            >
              {draft.activeThemes.length} / {MAX_ACTIVE_THEMES} Selected
            </span>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {AVAILABLE_THEMES.map((theme) => {
              const checked = draft.activeThemes.includes(theme.id);
              const disabled = isThemeCheckboxDisabled(draft.activeThemes, theme.id);
              const isXorBlocked =
                !checked &&
                ((theme.id === "ahly" && draft.activeThemes.includes("zamalek")) ||
                  (theme.id === "zamalek" && draft.activeThemes.includes("ahly")));

              return (
                <label
                  key={theme.id}
                  className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${checked
                      ? "border-[#D4AF37] bg-amber-50/60 shadow-2xs cursor-pointer"
                      : disabled
                        ? "border-gray-200 bg-gray-100 opacity-55 cursor-not-allowed"
                        : "border-gray-200 bg-white hover:border-gray-300 cursor-pointer"
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onChange={() => handleToggleTheme(theme.id)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-[#B89335] disabled:cursor-not-allowed"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-[#2B1D24]">
                        {theme.label}
                      </span>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white border border-gray-200 text-gray-500">
                        {theme.id}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5">{theme.arabicTitle}</p>
                    {isXorBlocked && (
                      <p className="text-[10px] font-bold text-rose-600 mt-1">
                        Disabled ({theme.id === "ahly" ? "Zamalek" : "Al Ahly"} selected)
                      </p>
                    )}
                    {!isXorBlocked && disabled && (
                      <p className="text-[10px] font-bold text-amber-700 mt-1">
                        Max 5 themes reached
                      </p>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </section>

        {/* ================================================================== */}
        {/* CARD 1: GLOBAL INFO & SECTION 1                                    */}
        {/* ================================================================== */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-amber-50/60 via-rose-50/40 to-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#D4AF37]/15 text-[#B89335]">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-serif font-black text-[#2B1D24]">
                  Card 1: Global Info &amp; Section 1 (Hero Intro)
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Couple names, milestone dates, hero background, and childhood portraits
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800">
              Section 01
            </span>
          </div>

          <div className="p-6 space-y-6">
            {/* Couple Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Groom Name (اسم العريس)
                </label>
                <input
                  type="text"
                  value={draft.groomName}
                  onChange={(e) => setField("groomName", e.target.value)}
                  placeholder="e.g. كرم"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Bride Name (اسم العروسة)
                </label>
                <input
                  type="text"
                  value={draft.brideName}
                  onChange={(e) => setField("brideName", e.target.value)}
                  placeholder="e.g. هدير"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none text-sm"
                />
              </div>
            </div>

            {/* Engagement & Wedding Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Engagement Date (تاريخ الخطوبة)
                </label>
                <input
                  type="date"
                  value={draft.engagementDate}
                  onChange={(e) => setField("engagementDate", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none text-sm bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Wedding Date (تاريخ الزفاف)
                </label>
                <input
                  type="date"
                  value={draft.weddingDate}
                  onChange={(e) => setField("weddingDate", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none text-sm bg-white"
                />
              </div>
            </div>

            {/* Live Counter Preview Banner */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#B89335] shrink-0" />
                <div>
                  <span className="font-bold text-amber-950 block">
                    Since Engagement:
                  </span>
                  <span className="font-mono text-[#B89335] font-bold">
                    {engagementPreview}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#B89335] shrink-0" />
                <div>
                  <span className="font-bold text-amber-950 block">
                    Since Wedding:
                  </span>
                  <span className="font-mono text-[#B89335] font-bold">
                    {weddingPreview}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 1 Cloudinary Uploaders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              <CloudinaryImageCard
                title="Main Background Hero Image"
                subtitle="Section 1 Spotlight Backdrop"
                imageUrl={draft.mainHeroBgUrl}
                onUrlChange={(url) => setField("mainHeroBgUrl", url)}
              />
              <CloudinaryImageCard
                title="Groom Childhood Image"
                subtitle={`Young ${draft.groomName || "Groom"} Portrait`}
                imageUrl={draft.groomChildhoodUrl}
                onUrlChange={(url) => setField("groomChildhoodUrl", url)}
              />
              <CloudinaryImageCard
                title="Bride Childhood Image"
                subtitle={`Young ${draft.brideName || "Bride"} Portrait`}
                imageUrl={draft.brideChildhoodUrl}
                onUrlChange={(url) => setField("brideChildhoodUrl", url)}
              />
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/* CARD 2: AUDIO TRACKS (5 THEMES)                                    */}
        {/* ================================================================== */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50/50 via-purple-50/30 to-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-700">
                <Music className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-serif font-black text-[#2B1D24]">
                  Card 2: Audio Tracks (8 Cultural Themes)
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Soundtrack URLs for Pharaonic, Saidi, Cinema, Falahi, Zamalek, Al Ahly, Indian &amp; Mexican chapters
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-100 text-indigo-800">
              8 Themes
            </span>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {AUDIO_FIELDS.map((field) => (
              <div
                key={field.key}
                className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800">
                    {field.label}
                  </label>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-600">
                    {field.badge}
                  </span>
                </div>
                <input
                  type="text"
                  value={draft[field.key]}
                  onChange={(e) => setField(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none font-mono"
                />
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================== */}
        {/* CARD 3: AI CHARACTERS & EMBEDDED AI PROMPT CHEAT SHEET             */}
        {/* ================================================================== */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-rose-50/50 via-amber-50/30 to-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-serif font-black text-[#2B1D24]">
                  Card 3: AI Characters &amp; Cheat Sheet
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Upload hyper-realistic Groom &amp; Bride cutouts for all themes + 3D Wedding Race Karts
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-800">
              {CHARACTER_FIELDS.length} Character Slots
            </span>
          </div>

          <div className="p-6 space-y-8">
            {/* Grid of Character Uploaders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {CHARACTER_FIELDS.map((item) => (
                <CloudinaryImageCard
                  key={item.key}
                  title={item.title}
                  subtitle={
                    item.themeId && draft.activeThemes.includes(item.themeId)
                      ? `${item.subtitle} • Active`
                      : item.subtitle
                  }
                  imageUrl={draft[item.key]}
                  isGenerating={generationStatuses[item.key] === "generating"}
                  onUrlChange={(url) => setField(item.key, url)}
                />
              ))}
            </div>

            {/* Embedded Hyper-Realistic AI Prompt Cheat Sheet at bottom of Card 3 */}
            <div
              dir="rtl"
              className="rounded-2xl border-2 border-[#D4AF37]/40 bg-gradient-to-br from-amber-50/70 via-rose-50/40 to-white p-6 space-y-5 text-right"
            >
              <div className="flex items-center justify-between flex-wrap gap-3 border-b border-[#D4AF37]/20 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B89335] text-white">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-black text-[#2B1D24]">
                      دليل توليد الصور (شخصيات حقيقية 100%):
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-700 font-medium">
                      استخدم هذه الأوامر للحصول على صور واقعية سينمائية. استبدل ما بين الأقواس بملامحك.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyPrompt(FULL_CHEAT_SHEET_TEXT, "all")}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/40 text-xs font-bold text-[#8A6A1F] cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>
                    {copiedPromptId === "all" ? "تم نسخ الدليل بالكامل ✓" : "نسخ الدليل بالكامل"}
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {HYPER_REALISTIC_PROMPTS.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-white border border-gray-200 space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-xs sm:text-sm text-[#2B1D24]">
                        {item.title}
                      </h4>
                      <button
                        type="button"
                        onClick={() => handleCopyPrompt(item.prompt, item.id)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[#8A6A1F] text-xs font-bold cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedPromptId === item.id ? "تم النسخ ✓" : "نسخ"}</span>
                      </button>
                    </div>
                    <div
                      dir="ltr"
                      className="p-3 rounded-lg bg-gray-900 text-gray-100 font-mono text-[11px] leading-relaxed text-left select-all"
                    >
                      {item.prompt}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-xl bg-amber-100/70 border border-amber-300 text-amber-950 text-xs sm:text-sm font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#B89335] shrink-0" />
                <span>(ملاحظة: صور سيارات السباق فقط هي التي تظل 3D Pixar style لتناسب اللعبة)</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/* CARD 4: MASS GALLERY (80+ PHOTOS WITH MULTIPLE UPLOAD)             */}
        {/* ================================================================== */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50/50 via-pink-50/30 to-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-serif font-black text-[#2B1D24]">
                  Card 4: Mass Memory Gallery ({draft.gallery.length} Photos)
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Batch upload 80+ photos via Cloudinary, then customize each Caption &amp; Memory Date
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start sm:items-end">
              <CldUploadWidget
                config={{
                  cloud: {
                    cloudName:
                      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo",
                  },
                }}
                uploadPreset={CLOUDINARY_UPLOAD_PRESET}
                onSuccess={(result) => {
                  if (
                    typeof result?.info === "object" &&
                    result.info?.secure_url
                  ) {
                    setLastUploadedGalleryUrl(result.info.secure_url);
                    handleAddGalleryPhoto(result.info.secure_url);
                  }
                }}
                options={{
                  multiple: true,
                  maxFiles: 120,
                  clientAllowedFormats: ["png", "jpeg", "jpg", "webp"],
                }}
              >
                {({ open }) => (
                  <button
                    type="button"
                    onClick={() => open?.()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2B1D24] hover:bg-[#3d2b34] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                  >
                    <UploadCloud className="w-4 h-4 text-[#D4AF37]" />
                    <span>Mass Upload Photos (80+ Supported)</span>
                  </button>
                )}
              </CldUploadWidget>

              {lastUploadedGalleryUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={lastUploadedGalleryUrl}
                  alt="Latest Uploaded Preview"
                  className="h-32 w-auto mt-2 border-2 border-green-500 rounded-lg object-contain bg-white"
                />
              )}
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Quick Manual URL Fallback */}
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-center gap-3">
              <input
                type="url"
                value={manualAddUrl}
                onChange={(e) => setManualAddUrl(e.target.value)}
                placeholder="Or paste a direct image URL (https://...)..."
                className="flex-1 w-full px-3.5 py-2 text-xs rounded-lg border border-gray-200 bg-white focus:border-[#D4AF37] outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (manualAddUrl.trim()) {
                    handleAddGalleryPhoto(manualAddUrl.trim());
                    setManualAddUrl("");
                  }
                }}
                disabled={!manualAddUrl.trim()}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#D4AF37] hover:bg-[#C9A227] disabled:opacity-40 text-white font-bold text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add URL</span>
              </button>
            </div>

            {/* Responsive Photo Grid */}
            {draft.gallery.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-gray-200">
                <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-gray-700">
                  No gallery photos yet
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Use Mass Upload Photos above to batch-upload up to 80+ photos at once.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {draft.gallery.map((item, idx) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-gray-200 bg-white p-3 flex flex-col gap-3 hover:border-[#D4AF37]/60 transition-all shadow-2xs"
                  >
                    <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.url}
                        alt={item.caption || `Gallery Photo ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/75 text-white">
                        #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryItem(item.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 hover:bg-rose-600 text-rose-600 hover:text-white shadow-xs transition-all cursor-pointer"
                        title="Remove Photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-500 mb-0.5">
                          Caption
                        </label>
                        <input
                          type="text"
                          value={item.caption}
                          onChange={(e) =>
                            handleUpdateGalleryItem(item.id, "caption", e.target.value)
                          }
                          placeholder="Write a memory caption..."
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 focus:border-[#D4AF37] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-500 mb-0.5">
                          Memory Date
                        </label>
                        <input
                          type="date"
                          value={item.date}
                          onChange={(e) =>
                            handleUpdateGalleryItem(item.id, "date", e.target.value)
                          }
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 focus:border-[#D4AF37] outline-none bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ==================================================================== */}
      {/* STICKY MASSIVE SAVE & PUBLISH BAR AT THE BOTTOM                      */}
      {/* ==================================================================== */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] px-4 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-gray-600 flex items-center gap-2">
            {saveSuccess ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Saved! All frontend sections are now synced with your updates.
              </span>
            ) : (
              <span>
                Couple: <strong>{draft.groomName || "—"} &amp; {draft.brideName || "—"}</strong> •{" "}
                <strong>{draft.gallery.length}</strong> gallery photos ready
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleSaveAndPublish}
            disabled={isSaving}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-10 py-3.5 rounded-xl font-black text-sm sm:text-base tracking-wide shadow-lg transition-all cursor-pointer ${saveSuccess
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-gradient-to-r from-[#D4AF37] via-[#C9A227] to-[#B89335] hover:opacity-95 text-white"
              } disabled:opacity-50`}
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>SAVING &amp; PUBLISHING...</span>
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>SAVED &amp; PUBLISHED ✓</span>
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
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Reusable Cloudinary Image Uploader Card with Instant Preview               */
/* -------------------------------------------------------------------------- */

interface CloudinaryImageCardProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  isGenerating?: boolean;
  onUrlChange: (url: string) => void;
}

function CloudinaryImageCard({
  title,
  subtitle,
  imageUrl,
  isGenerating = false,
  onUrlChange,
}: CloudinaryImageCardProps) {
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [customUrl, setCustomUrl] = useState(imageUrl);
  const [justUploaded, setJustUploaded] = useState(false);

  useEffect(() => {
    setCustomUrl(imageUrl);
  }, [imageUrl]);

  return (
    <div className="flex flex-col justify-between p-4 rounded-xl border border-gray-200 bg-gray-50/40 hover:border-[#D4AF37]/60 transition-all space-y-2.5">
      <div>
        <h4 className="text-xs font-black text-gray-900 line-clamp-1">{title}</h4>
        <p className="text-[11px] text-gray-500">{subtitle}</p>
      </div>

      <div className="space-y-2">
        <CldUploadWidget
          config={{
            cloud: {
              cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo",
            },
          }}
          uploadPreset={CLOUDINARY_UPLOAD_PRESET}
          onSuccess={(result) => {
            if (typeof result?.info === "object" && result.info?.secure_url) {
              onUrlChange(result.info.secure_url);
              setJustUploaded(true);
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
              className="w-full py-2 px-3 rounded-lg bg-[#2B1D24] hover:bg-[#3d2b34] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <UploadCloud className="w-4 h-4 text-[#D4AF37]" />
              <span>Upload Image</span>
            </button>
          )}
        </CldUploadWidget>

        {/* Instant Preview immediately below the upload button */}
          {
            isGenerating?(
          <div className = "w-full rounded-lg bg-amber-50 p-4 border-2 border-[#D4AF37] flex flex-col items-center justify-center gap-2 h-40" >
            <RefreshCw className="w-6 h-6 text-[#B89335] animate-spin" />
            <span className="text-[11px] font-bold text-[#8A6A1F]">
              Generating with InstantID...
            </span>
          </div>
      ) : imageUrl ? (
      <div className="w-full rounded-lg bg-white p-2 border border-gray-200 flex flex-col items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={`${title} Preview`}
          className={`h-32 w-auto mt-1 rounded-md object-contain ${justUploaded || imageUrl.startsWith("http")
              ? "border-2 border-green-500"
              : "border border-gray-200"
            }`}
        />
        <span className="mt-1 text-[10px] font-semibold text-gray-500">
          {justUploaded
            ? "✓ Uploaded via Cloudinary"
            : imageUrl.startsWith("http")
              ? "Cloud URL"
              : "Local Default"}
        </span>
      </div>
      ) : (
      <div className="text-center p-4 rounded-lg bg-white border border-dashed border-gray-200">
        <ImageIcon className="w-6 h-6 text-gray-300 mx-auto mb-1" />
        <span className="text-[10px] text-gray-400">No Image Set</span>
      </div>
        )}

      <button
        type="button"
        onClick={() => setIsEditingUrl((prev) => !prev)}
        className="w-full text-center text-[11px] font-semibold text-[#B89335] hover:underline cursor-pointer"
      >
        {isEditingUrl ? "Hide Direct URL" : "Paste / Edit URL"}
      </button>

      {isEditingUrl && (
        <div className="flex gap-1.5">
          <input
            type="text"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="https://... or /statues/..."
            className="flex-1 px-2.5 py-1.5 text-xs rounded border border-gray-200 bg-white outline-none focus:border-[#D4AF37]"
          />
          <button
            type="button"
            onClick={() => {
              onUrlChange(customUrl);
              setJustUploaded(false);
              setIsEditingUrl(false);
            }}
            className="px-2.5 py-1.5 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold cursor-pointer"
          >
            Set
          </button>
        </div>
      )}
    </div>
    </div >
  );
}
