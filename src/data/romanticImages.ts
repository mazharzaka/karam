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
  deskX: number;
  deskY: number;
  tunnelDepth: number; // 0 to 1
  canvasX: number; // For infinite canvas layout
  canvasY: number;
}

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
  "Lake Como, Bellagio",
  "Big Sur Coast, California",
  "Kyoto Bamboo Forest, Japan",
  "Santorini Balcony, Greece",
  "Central Park Rose Garden, NYC",
  "Cotswolds Countryside, UK",
  "Old San Juan, Puerto Rico",
];

const ROTATIONS = [-12, -9, -6, -4, -2, 2, 4, 6, 8, 10, 12, -8, 7, -10, 9];

// Generate exactly 80 images
export const ALL_80_IMAGES: RomanceImage[] = Array.from({ length: 80 }).map((_, index) => {
  const baseImg = UNSPLASH_ROMANCE_COLLECTION[index % UNSPLASH_ROMANCE_COLLECTION.length];
  const url = `${baseImg}?auto=format&fit=crop&w=${(index % 3 === 0 ? 900 : 700)}&q=80&sig=${index}`;
  const caption = ROMANTIC_CAPTIONS[index % ROMANTIC_CAPTIONS.length];
  const location = LOCATIONS[index % LOCATIONS.length];
  const rotation = ROTATIONS[index % ROTATIONS.length];
  const scale = 0.95 + ((index % 5) * 0.025);
  const aspectRatio = index % 3 === 0 ? "portrait" : index % 3 === 1 ? "landscape" : "square";

  // Pseudo-random yet deterministic scatter coordinates
  const deskX = ((index * 37) % 650) - 325;
  const deskY = ((index * 29) % 360) - 180;

  // Tunnel depth index
  const tunnelDepth = (index % 20) / 20;

  // Infinite canvas grid positioning (e.g. 5 columns by 4 rows)
  const col = index % 5;
  const row = Math.floor(index / 5);
  const canvasX = col * 340 - 680 + ((index % 3) * 20);
  const canvasY = row * 420 - 420 + ((index % 2) * 15);

  return {
    id: index + 1,
    url,
    title: `Memory #${index + 1}`,
    caption,
    date: `Day ${Math.floor(15 + index * 15.3)}, 2024`,
    location,
    rotation,
    scale,
    aspectRatio,
    deskX,
    deskY,
    tunnelDepth,
    canvasX,
    canvasY,
  };
});

// The 5 Physics Scenes segmentation:
export const SCENE1_SPOTLIGHT_IMAGES = ALL_80_IMAGES.slice(0, 2);     // Images 1-2
export const SCENE2_FILMSTRIP_IMAGES = ALL_80_IMAGES.slice(2, 20);    // Images 3-20 (18 images)
export const SCENE3_DESK_IMAGES      = ALL_80_IMAGES.slice(20, 50);   // Images 21-50 (30 images)
export const SCENE4_TUNNEL_IMAGES    = ALL_80_IMAGES.slice(50, 70);   // Images 51-70 (20 images)
export const SCENE5_CANVAS_IMAGES    = ALL_80_IMAGES.slice(70, 80);   // Images 71-80+ (10 images)

// Legacy alias exports for modular desktop components
export const ADVENTURES_20_IMAGES    = ALL_80_IMAGES.slice(0, 20);
export const SCATTERED_30_IMAGES     = ALL_80_IMAGES.slice(20, 50);
export const BIG_DAY_20_IMAGES       = ALL_80_IMAGES.slice(50, 70);
export const FOREVER_WALL_ALL_IMAGES = ALL_80_IMAGES;
