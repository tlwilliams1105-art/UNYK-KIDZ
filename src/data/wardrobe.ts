export interface WardrobeItem {
  id: string;
  name: string;
  category: 'outfit' | 'hat' | 'accessory';
  streakRequired: number; // Habit streak days required to unlock
  description: string;
  icon: string;
  previewColor: string;
  unlockedHint: string;
  // Specific visual styles for SVG rendering
  theme: {
    shirtGradient: [string, string, string];
    collarGradient: [string, string];
    placketColor: string;
    collarStroke: string;
    buttonColor: string;
    hatSvgType?: 'none' | 'superhero-cape' | 'golden-crown' | 'firefighter-helmet' | 'star-cap' | 'detective-hat' | 'dino-hood';
    accessorySvgType?: 'none' | 'gold-medal' | 'star-glasses' | 'super-badge' | 'sparkle-aura';
  };
}

export const WARDROBE_ITEMS: WardrobeItem[] = [
  // --- OUTFITS ---
  {
    id: 'outfit-classic-yellow',
    name: 'Classic Sunshine Polo',
    category: 'outfit',
    streakRequired: 0,
    description: "MP's signature bright yellow polo shirt from the YouTube show!",
    icon: '👕',
    previewColor: '#fbc02d',
    unlockedHint: 'Unlocked by default',
    theme: {
      shirtGradient: ['#ffea3b', '#fbc02d', '#f57f17'],
      collarGradient: ['#fff176', '#f9a825'],
      placketColor: '#fff59d',
      collarStroke: '#e65100',
      buttonColor: '#e65100',
    },
  },
  {
    id: 'outfit-sky-blue',
    name: 'Playroom Cerulean Polo',
    category: 'outfit',
    streakRequired: 1,
    description: 'A crisp ocean blue polo earned after your first habit streak!',
    icon: '🌊',
    previewColor: '#0288d1',
    unlockedHint: 'Complete a 1-day habit streak',
    theme: {
      shirtGradient: ['#4fc3f7', '#0288d1', '#01579b'],
      collarGradient: ['#81d4fa', '#039be5'],
      placketColor: '#b3e5fc',
      collarStroke: '#01579b',
      buttonColor: '#01579b',
    },
  },
  {
    id: 'outfit-emerald-veggie',
    name: 'Veggie Power Green',
    category: 'outfit',
    streakRequired: 2,
    description: 'Crisp broccoli & apple emerald polo celebrating healthy nutrition!',
    icon: '🥦',
    previewColor: '#43a047',
    unlockedHint: 'Complete a 2-day habit streak',
    theme: {
      shirtGradient: ['#81c784', '#43a047', '#2e7d32'],
      collarGradient: ['#a5d6a7', '#388e3c'],
      placketColor: '#c8e6c9',
      collarStroke: '#1b5e20',
      buttonColor: '#1b5e20',
    },
  },
  {
    id: 'outfit-royal-purple',
    name: 'Sweet Machine Royal Purple',
    category: 'outfit',
    streakRequired: 3,
    description: 'Magical rainbow grape candy polo unlocked after 3 days of habits!',
    icon: '🍇',
    previewColor: '#8e24aa',
    unlockedHint: 'Complete a 3-day habit streak',
    theme: {
      shirtGradient: ['#ba68c8', '#8e24aa', '#4a148c'],
      collarGradient: ['#ce93d8', '#7b1fa2'],
      placketColor: '#e1bee7',
      collarStroke: '#4a148c',
      buttonColor: '#4a148c',
    },
  },
  {
    id: 'outfit-fire-hero',
    name: 'Firefighter Crimson Coat',
    category: 'outfit',
    streakRequired: 5,
    description: 'Heroic firefighter red uniform with golden reflective stripes!',
    icon: '🧑‍🚒',
    previewColor: '#e53935',
    unlockedHint: 'Complete a 5-day habit streak',
    theme: {
      shirtGradient: ['#ef5350', '#e53935', '#b71c1c'],
      collarGradient: ['#ffeb3b', '#fbc02d'],
      placketColor: '#ffcdd2',
      collarStroke: '#b71c1c',
      buttonColor: '#ffd600',
    },
  },
  {
    id: 'outfit-golden-champion',
    name: 'Super Streak Golden Tux',
    category: 'outfit',
    streakRequired: 7,
    description: 'The ultimate 7-day habit streak champion suit shimmering with gold!',
    icon: '⚡',
    previewColor: '#ffd700',
    unlockedHint: 'Complete a 7-day habit streak',
    theme: {
      shirtGradient: ['#fff59d', '#ffd700', '#ff8f00'],
      collarGradient: ['#ffffff', '#ffb300'],
      placketColor: '#fff9c4',
      collarStroke: '#ff6f00',
      buttonColor: '#d50000',
    },
  },

  // --- HATS & HEADWEAR ---
  {
    id: 'hat-none',
    name: 'Natural Hair (No Hat)',
    category: 'hat',
    streakRequired: 0,
    description: "MP's natural cute coils and curls without headwear.",
    icon: '✨',
    previewColor: '#3d261a',
    unlockedHint: 'Unlocked by default',
    theme: {
      shirtGradient: ['#ffea3b', '#fbc02d', '#f57f17'],
      collarGradient: ['#fff176', '#f9a825'],
      placketColor: '#fff59d',
      collarStroke: '#e65100',
      buttonColor: '#e65100',
      hatSvgType: 'none',
    },
  },
  {
    id: 'hat-star-cap',
    name: 'Blue Star Cap',
    category: 'hat',
    streakRequired: 2,
    description: 'Sporty backwards baseball cap with a glowing yellow star!',
    icon: '🧢',
    previewColor: '#0288d1',
    unlockedHint: 'Complete a 2-day habit streak',
    theme: {
      shirtGradient: ['#ffea3b', '#fbc02d', '#f57f17'],
      collarGradient: ['#fff176', '#f9a825'],
      placketColor: '#fff59d',
      collarStroke: '#e65100',
      buttonColor: '#e65100',
      hatSvgType: 'star-cap',
    },
  },
  {
    id: 'hat-firefighter',
    name: 'Chief Rescue Helmet',
    category: 'hat',
    streakRequired: 4,
    description: 'Official firefighter chief safety helmet with a shiny gold badge!',
    icon: '🚒',
    previewColor: '#d32f2f',
    unlockedHint: 'Complete a 4-day habit streak',
    theme: {
      shirtGradient: ['#ffea3b', '#fbc02d', '#f57f17'],
      collarGradient: ['#fff176', '#f9a825'],
      placketColor: '#fff59d',
      collarStroke: '#e65100',
      buttonColor: '#e65100',
      hatSvgType: 'firefighter-helmet',
    },
  },
  {
    id: 'hat-golden-crown',
    name: 'Habit King Crown',
    category: 'hat',
    streakRequired: 7,
    description: 'Sparkling jeweled golden crown for the 7-day habit royalty!',
    icon: '👑',
    previewColor: '#ffc107',
    unlockedHint: 'Complete a 7-day habit streak',
    theme: {
      shirtGradient: ['#ffea3b', '#fbc02d', '#f57f17'],
      collarGradient: ['#fff176', '#f9a825'],
      placketColor: '#fff59d',
      collarStroke: '#e65100',
      buttonColor: '#e65100',
      hatSvgType: 'golden-crown',
    },
  },

  // --- ACCESSORIES ---
  {
    id: 'acc-none',
    name: 'No Accessory',
    category: 'accessory',
    streakRequired: 0,
    description: 'Clean classic look without accessories.',
    icon: '🚫',
    previewColor: '#78909c',
    unlockedHint: 'Unlocked by default',
    theme: {
      shirtGradient: ['#ffea3b', '#fbc02d', '#f57f17'],
      collarGradient: ['#fff176', '#f9a825'],
      placketColor: '#fff59d',
      collarStroke: '#e65100',
      buttonColor: '#e65100',
      accessorySvgType: 'none',
    },
  },
  {
    id: 'acc-star-glasses',
    name: 'Rainbow Star Sunglasses',
    category: 'accessory',
    streakRequired: 3,
    description: 'Funky star-shaped cartoon sunglasses that make MP look super cool!',
    icon: '🕶️',
    previewColor: '#e91e63',
    unlockedHint: 'Complete a 3-day habit streak',
    theme: {
      shirtGradient: ['#ffea3b', '#fbc02d', '#f57f17'],
      collarGradient: ['#fff176', '#f9a825'],
      placketColor: '#fff59d',
      collarStroke: '#e65100',
      buttonColor: '#e65100',
      accessorySvgType: 'star-glasses',
    },
  },
  {
    id: 'acc-gold-medal',
    name: 'Habit Champion Gold Medal',
    category: 'accessory',
    streakRequired: 5,
    description: 'Shining 1st place gold medal on a red-white-blue ribbon!',
    icon: '🥇',
    previewColor: '#fbc02d',
    unlockedHint: 'Complete a 5-day habit streak',
    theme: {
      shirtGradient: ['#ffea3b', '#fbc02d', '#f57f17'],
      collarGradient: ['#fff176', '#f9a825'],
      placketColor: '#fff59d',
      collarStroke: '#e65100',
      buttonColor: '#e65100',
      accessorySvgType: 'gold-medal',
    },
  },
  {
    id: 'acc-superhero-cape',
    name: 'Super Habit Hero Cape & Sparkles',
    category: 'accessory',
    streakRequired: 6,
    description: 'Flapping superhero red cape with floating victory sparkles!',
    icon: '🦸',
    previewColor: '#d50000',
    unlockedHint: 'Complete a 6-day habit streak',
    theme: {
      shirtGradient: ['#ffea3b', '#fbc02d', '#f57f17'],
      collarGradient: ['#fff176', '#f9a825'],
      placketColor: '#fff59d',
      collarStroke: '#e65100',
      buttonColor: '#e65100',
      accessorySvgType: 'superhero-cape',
    },
  },
];

export interface UserWardrobeState {
  selectedOutfitId: string;
  selectedHatId: string;
  selectedAccessoryId: string;
}

export const DEFAULT_WARDROBE_STATE: UserWardrobeState = {
  selectedOutfitId: 'outfit-classic-yellow',
  selectedHatId: 'hat-none',
  selectedAccessoryId: 'acc-none',
};
