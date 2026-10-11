export interface InteractiveStep {
  id: string;
  type: 'teeth' | 'veggies' | 'toys' | 'crank' | 'bedtime' | 'share';
  title: string;
  instruction: string;
  prompt: string;
  targetCount: number;
  rewardText: string;
  badgeName: string;
}

export interface EpisodeChapter {
  id: string;
  title: string;
  timestamp: string; // e.g., "0:00"
  seconds: number;
  description: string;
  narrativeText: string;
  interactiveStep?: InteractiveStep;
}

export interface Episode {
  id: string;
  title: string;
  views: string;
  viewCountRaw: number;
  uploadDate: string;
  duration: string;
  durationSeconds: number;
  likes: number;
  isFeatured?: boolean;
  category: 'Good Habits' | 'Toy Adventures' | 'Songs & Learning' | 'Bedtime Stories';
  description: string;
  tags: string[];
  thumbnailTheme: {
    bg: string;
    accent: string;
    heroItem: string;
  };
  chapters: EpisodeChapter[];
}

export const EPISODES: Episode[] = [
  {
    id: 'sweet-machine',
    title: 'MP learns good habits with sweet machine - Useful stories for kids',
    views: '18,940,215 views',
    viewCountRaw: 18940215,
    uploadDate: '3 days ago',
    duration: '01:05',
    durationSeconds: 65,
    likes: 32410,
    isFeatured: true,
    category: 'Good Habits',
    description: `MP finds a bright and magical Sweet Machine in the playroom! 🍬✨
But wait! The Sweet Machine doesn't take regular coins—it only gives yummy fruit gummies and glowing surprise toy capsules when MP practices super good habits!

Watch MP learn:
1. Brushing teeth in the morning and before bed to brush away the sugar bugs! 🪥
2. Eating crunchy rainbow veggies (broccoli & carrots!) to power up his muscles! 🥦🥕
3. Putting toy cars and soccer balls neatly back in the toy chest! 🧸🚗
4. Turning the magic candy crank and sharing sweet treats with friends! 🍭❤️

Join MP on this fun adventure full of laughter, songs, and good habits! Don't forget to like and subscribe to MP for more useful stories!`,
    tags: ['#MP', '#MPShow', '#GoodHabits', '#SweetMachine', '#StoriesForKids', '#NurseryRhymes', '#LearnGoodHabits'],
    thumbnailTheme: {
      bg: '#00c4f4',
      accent: '#ffcc00',
      heroItem: 'Sweet Machine & Rocket',
    },
    chapters: [
      {
        id: 'c1',
        title: '0:00 - MP Discovers The Magical Sweet Machine',
        timestamp: '0:00',
        seconds: 0,
        description: 'MP walks into the playroom and finds a giant colorful machine with rainbow candies inside!',
        narrativeText: "Look! A magical Sweet Machine arrived! Complete good habits to unlock the magic treats! Let's help MP!",
      },
      {
        id: 'c2',
        title: '0:08 - Habit 1: Brush Away The Sugar Bugs!',
        timestamp: '0:08',
        seconds: 8,
        description: 'MP takes out his blue toothbrush to clean his sparkling teeth!',
        narrativeText: "Sugar bugs are hiding! Grab the foamy toothbrush and scrub all 4 teeth clean to earn your first Habit Star!",
        interactiveStep: {
          id: 'step-teeth',
          type: 'teeth',
          title: 'Tooth Brushing Challenge',
          instruction: 'Tap each tooth with the bubbly toothbrush to brush away the sugar bugs!',
          prompt: 'Help MP brush all 4 teeth clean!',
          targetCount: 4,
          rewardText: 'Sparkling clean teeth! Sugar bugs are all gone!',
          badgeName: 'Dental Hero Badge ⭐',
        },
      },
      {
        id: 'c3',
        title: '0:20 - Habit 2: Rainbow Veggie Power Plate!',
        timestamp: '0:20',
        seconds: 20,
        description: 'MP chooses delicious crunchy carrots, broccoli, and apples to fill his energy meter!',
        narrativeText: "MP wants super strong muscles! Pick the healthy colorful veggies and feed MP to supercharge his energy meter!",
        interactiveStep: {
          id: 'step-veggies',
          type: 'veggies',
          title: 'Veggie Power Plate',
          instruction: 'Feed MP 4 healthy foods (broccoli, carrots, apples) and skip the sticky donuts!',
          prompt: 'Fill MP’s energy meter with healthy veggies!',
          targetCount: 4,
          rewardText: 'Yummy and strong! Veggie power unlocked!',
          badgeName: 'Veggie Champion Badge 🥦',
        },
      },
      {
        id: 'c4',
        title: '0:34 - Habit 3: Super Fast Toy Cleanup!',
        timestamp: '0:34',
        seconds: 34,
        description: 'Toys are all over the playroom floor! Time for the speedy tidy-up challenge!',
        narrativeText: "Racecars and soccer balls need to go home into the smiling toy box! Tap the toys quickly to tidy up!",
        interactiveStep: {
          id: 'step-toys',
          type: 'toys',
          title: 'Toy Cleanup Frenzy',
          instruction: 'Tap all the scattered toys to put them neatly inside the toy chest!',
          prompt: 'Tidy up all 5 toys into the chest!',
          targetCount: 5,
          rewardText: 'The playroom is sparkling neat and tidy!',
          badgeName: 'Tidy Room Master 🧸',
        },
      },
      {
        id: 'c5',
        title: '0:48 - Habit 4: The Golden Coin & Sweet Machine Dispenser!',
        timestamp: '0:48',
        seconds: 48,
        description: 'All 3 good habits are complete! The Sweet Machine accepts the Golden Habit Coin!',
        narrativeText: "Hooray! Golden Coin unlocked! Insert the coin, spin the big candy crank, and see what surprise pops out!",
        interactiveStep: {
          id: 'step-crank',
          type: 'crank',
          title: 'Turn The Sweet Machine Crank!',
          instruction: 'Click and turn the big candy crank to spin the rainbow gears and dispense the surprise!',
          prompt: 'Turn the crank 3 times to dispense candy surprise!',
          targetCount: 3,
          rewardText: 'POP! Surprise rainbow candy capsule dispensed!',
          badgeName: 'Sweet Machine Master 🍬',
        },
      },
      {
        id: 'c6',
        title: '0:58 - Sharing Sweet Treats & Victory Dance!',
        timestamp: '0:58',
        seconds: 58,
        description: 'MP shares the delicious treats with his best friend Leo and mama, dancing to the Good Habits Song!',
        narrativeText: "Sharing makes everyone smile! MP shares treats with friends. Sing along with the Good Habits Dance!",
      },
    ],
  },
  {
    id: 'firefighter-hero',
    title: 'MP becomes a heroic firefighter - Saving playful puppy with big red truck!',
    views: '14,210,500 views',
    viewCountRaw: 14210500,
    uploadDate: '1 week ago',
    duration: '00:55',
    durationSeconds: 55,
    likes: 27940,
    category: 'Toy Adventures',
    description: 'MP puts on his firefighter helmet and drives the big electric ladder truck to help puppy Barky down from the tree!',
    tags: ['#MPKidsShow', '#Firefighter', '#ToyTrucks', '#RescueHero'],
    thumbnailTheme: {
      bg: '#ff5722',
      accent: '#ffeb3b',
      heroItem: 'Fire Truck & Water Hose',
    },
    chapters: [
      { id: 'f1', title: '0:00 - The Siren Sounds!', timestamp: '0:00', seconds: 0, description: 'MP hears the emergency bell and gears up!', narrativeText: 'Firefighter MP is on duty! Put on the safety boots and helmet!' },
      { id: 'f2', title: '0:15 - Driving The Electric Truck', timestamp: '0:15', seconds: 15, description: 'Steer through the toy city safely!', narrativeText: 'Beep beep! Watch out for teddy bear pedestrians!' },
      { id: 'f3', title: '0:35 - Raising The Giant Ladder', timestamp: '0:35', seconds: 35, description: 'MP reaches puppy Barky safely!', narrativeText: 'Up, up, up goes the rescue ladder! Gentle paws safe!' },
    ],
  },
  {
    id: 'rainbow-train',
    title: 'MP explores colors and shapes with magic alphabet train - Learning fun!',
    views: '22,650,100 views',
    viewCountRaw: 22650100,
    uploadDate: '2 weeks ago',
    duration: '00:45',
    durationSeconds: 45,
    likes: 41200,
    category: 'Songs & Learning',
    description: 'Choo-choo! Join MP as the magic train stops at Red Strawberry Station, Blue Ocean Station, and Yellow Sunflower Hill!',
    tags: ['#MPKidsShow', '#ColorsForKids', '#MagicTrain', '#ToddlerLearning'],
    thumbnailTheme: {
      bg: '#4caf50',
      accent: '#ffeb3b',
      heroItem: 'Magic Rainbow Train',
    },
    chapters: [
      { id: 't1', title: '0:00 - All Aboard The Rainbow Train', timestamp: '0:00', seconds: 0, description: 'MP the conductor punches tickets!', narrativeText: 'Choo Choo! Where will the train take MP today?' },
      { id: 't2', title: '0:18 - Blue Ocean Station', timestamp: '0:18', seconds: 18, description: 'Finding blue dolphins and blue balls!', narrativeText: 'Find 3 blue objects with MP!' },
    ],
  },
  {
    id: 'bedtime-routine',
    title: 'MP gets ready for bedtime with star machine & cozy pajamas',
    views: '16,800,400 views',
    viewCountRaw: 16800400,
    uploadDate: '3 weeks ago',
    duration: '00:45',
    durationSeconds: 45,
    likes: 31050,
    category: 'Bedtime Stories',
    description: 'A soothing evening story showing MP taking a warm bubble bath, putting on cozy bear pajamas, and counting glowing stars.',
    tags: ['#MPKidsShow', '#BedtimeRoutine', '#Lullaby', '#CalmKids'],
    thumbnailTheme: {
      bg: '#3f51b5',
      accent: '#ffd700',
      heroItem: 'Glowing Moon & Star Machine',
    },
    chapters: [
      { id: 'b1', title: '0:00 - Sunset in the Playroom', timestamp: '0:00', seconds: 0, description: 'Putting the toys to sleep', narrativeText: 'The sun is setting. Time for bedtime routine with MP!' },
      {
        id: 'b2',
        title: '0:12 - Warm Bubble Bath & Cozy Pajamas',
        timestamp: '0:12',
        seconds: 12,
        description: 'Splish splash bubble fun',
        narrativeText: 'Wash behind the ears and gently dry off with the soft towel! Tap 3 calming bedtime items!',
        interactiveStep: {
          id: 'step-bedtime',
          type: 'bedtime',
          title: 'Bedtime Calm Challenge',
          instruction: 'Tap warm bubble bath, cozy bear pajamas, and star projector to get MP ready for sleep!',
          prompt: 'Complete bedtime routine with MP!',
          targetCount: 3,
          rewardText: 'Sweet dreams! MP is cozy and ready for peaceful sleep! 🌙',
          badgeName: 'Bedtime Star Badge 🌟',
        },
      },
    ],
  },
  {
    id: 'sharing-toys',
    title: 'MP learns sharing is caring - Building the mega block castle together',
    views: '11,450,800 views',
    viewCountRaw: 11450800,
    uploadDate: '1 month ago',
    duration: '00:30',
    durationSeconds: 30,
    likes: 19800,
    category: 'Good Habits',
    description: 'When MP and friend Mia want the same golden tower block, they learn how taking turns makes playing twice as much fun!',
    tags: ['#MPKidsShow', '#SharingIsCaring', '#SocialSkills', '#Preschool'],
    thumbnailTheme: {
      bg: '#ff9800',
      accent: '#2196f3',
      heroItem: 'Mega Castle Blocks',
    },
    chapters: [
      { id: 's1', title: '0:00 - The Tower Dispute', timestamp: '0:00', seconds: 0, description: 'Who gets the golden block?', narrativeText: 'Uh oh, two friends want the same toy! What should MP do?' },
      {
        id: 's2',
        title: '0:10 - Sharing is Caring Challenge',
        timestamp: '0:10',
        seconds: 10,
        description: 'Take turns and build the highest tower together!',
        narrativeText: 'Sharing makes everyone smile! Tap 3 friendship tokens to share toys with friends!',
        interactiveStep: {
          id: 'step-share',
          type: 'share',
          title: 'Sharing is Caring Challenge',
          instruction: 'Tap each toy to share with your friends and build the castle together!',
          prompt: 'Help MP share toys with friends!',
          targetCount: 3,
          rewardText: 'Awesome sharing! Playing together is twice as fun! 🤝',
          badgeName: 'Super Sharing Champion 🤝',
        },
      },
    ],
  },
  {
    id: 'super-robot',
    title: 'MP builds a robot helper with dad to sort colorful balls and toys',
    views: '26,100,000 views',
    viewCountRaw: 26100000,
    uploadDate: '1 month ago',
    duration: '00:40',
    durationSeconds: 40,
    likes: 48900,
    category: 'Toy Adventures',
    description: 'Robo-MP comes to life! Watch the funny robot beep, bop, and dance while helping MP organize the playroom.',
    tags: ['#MPKidsShow', '#RobotFun', '#DadAndSon', '#PlayroomFun'],
    thumbnailTheme: {
      bg: '#00bcd4',
      accent: '#ff4081',
      heroItem: 'Dancing Playroom Robot',
    },
    chapters: [
      { id: 'r1', title: '0:00 - Assembling Robo-Friend', timestamp: '0:00', seconds: 0, description: 'Gears, lights, and fun buttons!', narrativeText: 'Beep bop boop! Meet Robby the cleaning robot!' },
    ],
  },
];

export interface ChannelComment {
  id: string;
  author: string;
  avatarColor: string;
  avatarEmoji: string;
  timeAgo: string;
  text: string;
  likes: number;
  isPinned?: boolean;
  isCreator?: boolean;
  likedByUser?: boolean;
}

export const INITIAL_COMMENTS: ChannelComment[] = [
  {
    id: 'pinned-mp',
    author: 'MP',
    avatarColor: 'bg-yellow-400 text-sky-900',
    avatarEmoji: '⭐',
    timeAgo: '2 days ago (pinned)',
    text: '❤️ Yay friends! Did you brush your teeth and eat your veggies today? Tell me your favorite candy from the sweet machine in the comments! Don’t forget to SUBSCRIBE to join MP’s adventure club! 🚀🍬',
    likes: 4120,
    isPinned: true,
    isCreator: true,
    likedByUser: true,
  },
  {
    id: 'c-1',
    author: 'Mama Sarah & Leo (3yo)',
    avatarColor: 'bg-pink-500 text-white',
    avatarEmoji: '👩‍👦',
    timeAgo: '1 day ago',
    text: 'My 3-year-old son used to cry every single night during tooth brushing. After watching MP fight the sugar bugs in this episode, he literally runs to the sink shouting "SUGAR BUGS GO AWAY!" Thank you MP!! 🪥✨',
    likes: 892,
  },
  {
    id: 'c-2',
    author: 'Grandma Elena',
    avatarColor: 'bg-emerald-500 text-white',
    avatarEmoji: '👵',
    timeAgo: '2 days ago',
    text: 'Such wholesome, bright, and genuinely educational content for preschoolers. MP has such a bright, sweet smile and his positive energy is contagious! ❤️',
    likes: 421,
  },
  {
    id: 'c-3',
    author: 'ToyCollector_Max',
    avatarColor: 'bg-purple-500 text-white',
    avatarEmoji: '🎮',
    timeAgo: '18 hours ago',
    text: 'Where can I buy that sweet machine for my playroom?? The rainbow candy dispenser is so cool haha! 🍭🍬',
    likes: 184,
  },
  {
    id: 'c-4',
    author: 'Emma’s Family Vlogs',
    avatarColor: 'bg-amber-500 text-white',
    avatarEmoji: '🌻',
    timeAgo: '1 day ago',
    text: 'We love the Good Habits Song at the end! We play it every morning while getting ready for kindergarten. 3.67M subscribers well deserved! 👏🎉',
    likes: 310,
  },
  {
    id: 'c-5',
    author: 'Little Ben (4yo)',
    avatarColor: 'bg-sky-500 text-white',
    avatarEmoji: '🚀',
    timeAgo: '12 hours ago',
    text: 'MP IS MY BEST FRIEND! I have a yellow polo shirt just like MP! 💛💛💛',
    likes: 95,
  },
  {
    id: 'c-6',
    author: 'Dr. Kimberly (Pediatric Dentist)',
    avatarColor: 'bg-teal-500 text-white',
    avatarEmoji: '🦷',
    timeAgo: '2 days ago',
    text: 'As a pediatric dentist, I love how accurately and playfully this demonstrates 2 minutes of circular brushing. Showing sugar bugs makes dental health fun and not scary for little ones!',
    likes: 540,
  },
];

export interface CollectibleSticker {
  id: string;
  name: string;
  category: string;
  icon: string;
  unlocked: boolean;
  habitFact: string;
}

export const INITIAL_STICKERS: CollectibleSticker[] = [
  { id: 'stk-1', name: 'Bubbly Toothbrush', category: 'Hygiene', icon: '🪥', unlocked: true, habitFact: 'Brushing for 2 minutes keeps sugar bugs away!' },
  { id: 'stk-2', name: 'Super Broccoli', category: 'Nutrition', icon: '🥦', unlocked: true, habitFact: 'Broccoli gives your body super Vitamin C power!' },
  { id: 'stk-3', name: 'Toy Chest Champion', category: 'Responsibility', icon: '🧸', unlocked: true, habitFact: 'Clean rooms mean safe fun and no lost toys!' },
  { id: 'stk-4', name: 'Magic Sweet Machine', category: 'Reward', icon: '🍬', unlocked: false, habitFact: 'Sweet treats taste best when shared after healthy meals!' },
  { id: 'stk-5', name: 'Blasting Rocket', category: 'Adventure', icon: '🚀', unlocked: false, habitFact: 'A good breakfast gives you rocket energy all day!' },
  { id: 'stk-6', name: 'Firefighter Helmet', category: 'Hero', icon: '🧑‍🚒', unlocked: false, habitFact: 'Helping others makes everyone a real-life hero!' },
  { id: 'stk-7', name: 'Crisp Red Apple', category: 'Nutrition', icon: '🍎', unlocked: false, habitFact: 'Apples naturally clean your teeth when you crunch!' },
  { id: 'stk-8', name: 'Golden Habit Coin', category: 'Honor', icon: '🪙', unlocked: false, habitFact: 'Good habits stick with you for life!' },
  { id: 'stk-9', name: 'Cozy Pajamas Bear', category: 'Bedtime', icon: '🐻', unlocked: false, habitFact: 'Sleeping 10 hours helps your brain grow big and smart!' },
  { id: 'stk-10', name: 'Rainbow Gummy Star', category: 'Treat', icon: '⭐', unlocked: false, habitFact: 'Balance treats with lots of water and fruit!' },
  { id: 'stk-11', name: 'Hand Wash Soap Bubble', category: 'Hygiene', icon: '🫧', unlocked: false, habitFact: 'Sing Happy Birthday twice while washing hands!' },
  { id: 'stk-12', name: 'Best Friend High-Five', category: 'Kindness', icon: '🤝', unlocked: false, habitFact: 'Sharing toys makes playing 10 times more fun!' },
  { id: 'stk-super-habit', name: 'Super Habit Hero', category: 'Exclusive Milestone', icon: '⚡👑', unlocked: false, habitFact: '7 consecutive days of good habits unlocks your true Super Habit power with MP!' },
];

