export interface Milestone {
  id: string;
  rank: number;
  title: string;
  date: string;
  subtitle: string;
  category: string;
  imageUrl: string;
  heartCount: string;
  highlightText: string;
}

export interface PolaroidPhoto {
  id: string;
  imageUrl: string;
  caption: string;
  date: string;
  location: string;
  rotation: number; // e.g. -4 to +5 degrees
}

export interface LoveStats {
  daysTogether: number;
  startDate: string;
  partnerNames: {
    partner1: string;
    partner2: string;
  };
  totalMemoriesLogged: number;
  totalLoveLetters: number;
  hoursSpentLaughing: number;
  topAudioTrack: {
    title: string;
    artist: string;
    coverUrl: string;
  };
  loveVibeTitle: string; // e.g. "Golden Hour Soulmates"
  loveVibeDescription: string;
}

export interface WrappedData {
  stats: LoveStats;
  milestones: Milestone[];
  polaroids: PolaroidPhoto[];
}

