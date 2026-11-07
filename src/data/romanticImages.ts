export interface RomanceImage {
  id: number;
  url: string;
  title: string;
  caption: string;
  date: string;
  location: string;
  rotation: number;
  scale: number;
  aspectRatio: "portrait" | "landscape" | "square";
}

// 20 unique high-res romantic and wedding photo base URLs from Unsplash
const UNSPLASH_ROMANCE_COLLECTION = [
  "https://images.unsplash.com/photo-1519741497674-611481863552", // Wedding couple
  "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8", // Ring & proposal
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486", // Cozy couple
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34", // Paris bridge
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2", // Romantic dinner
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a", // Villa wedding
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc", // Aisle walk
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf", // Sunset coast
  "https://images.unsplash.com/photo-1537633552985-df8429e8048b", // Sparkler sendoff
  "https://images.unsplash.com/photo-1529636798458-92182e662485", // Paris cafe
  "https://images.unsplash.com/photo-1469371670807-013ccf25f16a", // First dance
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6", // Wedding hands
  "https://images.unsplash.com/photo-1524863479829-916d8e77f114", // Beach sunset
  "https://images.unsplash.com/photo-1518199266791-5375a83190b7", // Romantic flowers
  "https://images.unsplash.com/photo-1544717305-2782549b5136", // Vintage love
  "https://images.unsplash.com/photo-1513279922550-250c2129b13a", // Couple embracing
  "https://images.unsplash.com/photo-1532712938310-34cb3982ef74", // Golden hour field
  "https://images.unsplash.com/photo-1494774157365-9e04c6720e47", // Couple laughter
  "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70", // Road trip love
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb", // Bride portrait
];

const ROMANTIC_CAPTIONS = [
  "The quiet morning before forever started",
  "Whispering secrets by the Amalfi cliffs",
  "Dancing like nobody was watching",
  "Our hands fitting together perfectly",
  "Midnight walk under Parisian lamplight",
  "First cup of coffee in our new living room",
  "Golden rays catching your veil",
  "The look right before you said 'Yes'",
  "When the rain came and we just laughed",
  "Car ride singalongs with the windows down",
  "Sparklers lighting up the night sky",
  "Our families crying happy tears",
  "Gelato on the steps of the piazza",
  "Sneaking away from the reception for 5 minutes",
  "The toast that made the whole room weep",
  "Unwinding after a 12-hour mountain hike",
  "Sun-kissed skin and ocean salt",
  "Holding you tight on the chilly ferry ride",
  "Writing our vows on crumpled paper napkins",
  "The exact second our eyes locked across the room",
];

const LOCATIONS = [
  "Villa Ephrussi, French Riviera",
  "Positano Cliffside, Italy",
  "Montmartre, Paris",
  "Lake Como, Italy",
  "Big Sur Coast, California",
  "Kyoto Bamboo Forest, Japan",
  "Santorini Balcony, Greece",
  "Central Park Rose Garden, NYC",
  "Cotswolds Countryside, UK",
  "Old San Juan, Puerto Rico",
];

const ROTATIONS = [-8, -6, -4, -2, 2, 4, 6, 8, 10, -10, 12, -12];

// Generate exactly 80 images seamlessly scalable across the 5 chapters
export const ALL_80_IMAGES: RomanceImage[] = Array.from({ length: 80 }).map((_, index) => {
  const baseImg = UNSPLASH_ROMANCE_COLLECTION[index % UNSPLASH_ROMANCE_COLLECTION.length];
  // Add unique query parameters for visual variety while maintaining caching
  const url = `${baseImg}?auto=format&fit=crop&w=${(index % 3 === 0 ? 900 : 700)}&q=80&sig=${index}`;
  const caption = ROMANTIC_CAPTIONS[index % ROMANTIC_CAPTIONS.length];
  const location = LOCATIONS[index % LOCATIONS.length];
  const rotation = ROTATIONS[index % ROTATIONS.length];
  const scale = 0.95 + ((index % 5) * 0.025);
  const aspectRatio = index % 3 === 0 ? "portrait" : index % 3 === 1 ? "landscape" : "square";

  return {
    id: index + 1,
    url,
    title: `Moment #${index + 1}`,
    caption,
    date: `Day ${Math.floor(15 + index * 15.3)}, 2024`,
    location,
    rotation,
    scale,
    aspectRatio,
  };
});

// Segmented sets for the chapters
export const ADVENTURES_20_IMAGES = ALL_80_IMAGES.slice(0, 20);      // Images 1-20
export const SCATTERED_30_IMAGES = ALL_80_IMAGES.slice(20, 50);      // Images 21-50
export const BIG_DAY_20_IMAGES = ALL_80_IMAGES.slice(50, 70);        // Images 51-70
export const FOREVER_WALL_ALL_IMAGES = ALL_80_IMAGES;                // All 80 Images

