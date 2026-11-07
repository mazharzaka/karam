export interface CinematicImage {
  id: number;
  url: string;
  titleEn: string;
  titleAr: string;
  captionEn: string;
  captionAr: string;
  date: string;
  location: string;
  rotation: number;
  dropX: number; // percentage offset for desk drop
  dropY: number; // percentage offset for desk drop
}

const BASE_URLS = [
  "https://images.unsplash.com/photo-1519741497674-611481863552", // Wedding couple
  "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8", // The Proposal
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486", // First Apartment
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34", // Midnight in Paris
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2", // First Date Cafe
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a", // Villa French Riviera
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc", // Aisle Walk
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf", // Amalfi Coast Sunset
  "https://images.unsplash.com/photo-1537633552985-df8429e8048b", // Sparkler Sendoff
  "https://images.unsplash.com/photo-1529636798458-92182e662485", // Paris Croissants
  "https://images.unsplash.com/photo-1469371670807-013ccf25f16a", // First Dance
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6", // Heirloom Rings
  "https://images.unsplash.com/photo-1524863479829-916d8e77f114", // Beach Sunset
  "https://images.unsplash.com/photo-1518199266791-5375a83190b7", // Bridal Bouquet
  "https://images.unsplash.com/photo-1544717305-2782549b5136", // Vintage Car
];

const TITLES = [
  { en: "The First Glance", ar: "النظرة الأولى" },
  { en: "The Paris Rainy Night", ar: "ليلة باريس الممطرة" },
  { en: "The Cliffside 'Yes!'", ar: "نعم على حافة الجرف" },
  { en: "Unpacking Moving Boxes", ar: "بيتنا الأول" },
  { en: "Morning Coffee Whispers", ar: "قهوة الصباح الهادئة" },
  { en: "Walking Down The Aisle", ar: "خطواتنا نحو المذبح" },
  { en: "The Golden Hour Waltz", ar: "رقصتنا في ساعة الغروب" },
  { en: "Champagne & Laughter", ar: "ضحكات لا تنتهي" },
  { en: "Sparklers Under The Stars", ar: "نجوم وألعاب نارية" },
  { en: "Handwritten Vows", ar: "عهودنا الأبدية" },
];

const LOCATIONS = [
  "Villa Ephrussi, French Riviera",
  "Pont Alexandre III, Paris",
  "Positano Cliffside, Italy",
  "Le Marais, France",
  "Kyoto Bamboo Grove, Japan",
  "Lake Como, Bellagio",
  "Cotswolds Countryside, UK",
  "Central Park Rose Conservatory, NYC",
];

const ROTATIONS = [-9, 7, -5, 11, -8, 6, -11, 4, -7, 9, -4, 8];

// Pre-calculated organic drop offsets on a 2D canvas
const DROP_COORDS = [
  { x: -28, y: -16 },
  { x: 12, y: -22 },
  { x: -14, y: 14 },
  { x: 26, y: 8 },
  { x: -32, y: 18 },
  { x: 4, y: -8 },
  { x: -8, y: -24 },
  { x: 34, y: -18 },
  { x: -18, y: -6 },
  { x: 20, y: 22 },
  { x: -4, y: 26 },
  { x: 38, y: -4 },
];

// 30 rich placeholders
export const CINEMATIC_IMAGES: CinematicImage[] = Array.from({ length: 30 }).map((_, i) => {
  const base = BASE_URLS[i % BASE_URLS.length];
  const title = TITLES[i % TITLES.length];
  const location = LOCATIONS[i % LOCATIONS.length];
  const rotation = ROTATIONS[i % ROTATIONS.length];
  const coord = DROP_COORDS[i % DROP_COORDS.length];

  return {
    id: i + 1,
    url: `${base}?auto=format&fit=crop&w=800&q=80&sig=${i}`,
    titleEn: title.en,
    titleAr: title.ar,
    captionEn: `Moment #${i + 1} — ${title.en} in ${location.split(",")[0]}`,
    captionAr: `${title.ar} • في ${location.split(",")[0]}`,
    date: `October ${10 + (i % 20)}, 2024`,
    location,
    rotation,
    dropX: coord.x + ((i % 3) * 4),
    dropY: coord.y + ((i % 4) * 3),
  };
});

// Scene 2: 6 key timeline chapters revealed side-by-side sequentially
export const TIMELINE_IMAGES = CINEMATIC_IMAGES.slice(0, 6);

// Scene 3: 12 polaroids dropped one-by-one with spring physics on the desk
export const DESK_POLAROIDS = CINEMATIC_IMAGES.slice(6, 18);

