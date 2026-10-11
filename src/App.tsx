import React, { useState } from 'react';
import { EPISODES, Episode, INITIAL_STICKERS, CollectibleSticker } from './data/episodes';
import { YouTubeHeader } from './components/YouTubeHeader';
import { VideoPlayer } from './components/VideoPlayer';
import { VideoDetails } from './components/VideoDetails';
import { CommentsSection } from './components/CommentsSection';
import { SidebarRecommendations } from './components/SidebarRecommendations';
import { SweetMachineArcade } from './components/SweetMachineArcade';
import { CreateEpisodeStudio } from './components/CreateEpisodeStudio';
import { CalendarHabitPlanner } from './components/CalendarHabitPlanner';
import { CommunityAndShorts } from './components/CommunityAndShorts';
import { ShareModal } from './components/ShareModal';
import { ColoringModal } from './components/ColoringModal';
import { sound } from './utils/audio';
import { Sparkles, Heart, Bell } from 'lucide-react';

export default function App() {
  const [currentEpisode, setCurrentEpisode] = useState<Episode>(EPISODES[0]);
  const [activeTab, setActiveTab] = useState<'watch' | 'create' | 'arcade' | 'community' | 'stickers' | 'calendar'>('watch');
  const [searchQuery, setSearchQuery] = useState('kid shows on youtube');
  const [subscriberCount, setSubscriberCount] = useState(3674890);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [kidSafeMode, setKidSafeMode] = useState(false);
  const [stickers, setStickers] = useState<CollectibleSticker[]>(INITIAL_STICKERS);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isColoringModalOpen, setIsColoringModalOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Toggle channel subscription with confetti & sound
  const handleToggleSubscribe = () => {
    sound.playSfx('pop');
    if (!isSubscribed) {
      sound.playSfx('fanfare');
      sound.playSfx('bell');
      setSubscriberCount(prev => prev + 1);
      setIsSubscribed(true);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3500);
    } else {
      setSubscriberCount(prev => prev - 1);
      setIsSubscribed(false);
    }
  };

  const handleNextEpisode = () => {
    sound.playSfx('pop');
    const curIdx = EPISODES.findIndex(e => e.id === currentEpisode.id);
    const nextIdx = (curIdx + 1) % EPISODES.length;
    setCurrentEpisode(EPISODES[nextIdx]);
  };

  const handleEarnSticker = (stickerId: string) => {
    setStickers(prev =>
      prev.map(s => (s.id === stickerId ? { ...s, unlocked: true } : s))
    );
  };

  const handleUnlockSticker = (id: string) => {
    handleEarnSticker(id);
  };

  // Play custom episode generated in Story Studio
  const handlePlayGeneratedEpisode = (title: string, description: string, habit: string) => {
    const customEpisode: Episode = {
      id: `custom-${Date.now()}`,
      title,
      views: '1 view • Premiere',
      viewCountRaw: 1,
      uploadDate: 'Just now',
      duration: '08:30',
      durationSeconds: 510,
      likes: 1,
      category: 'Good Habits',
      description,
      tags: ['#MPKidsShow', '#CustomEpisode', '#MyStory'],
      thumbnailTheme: {
        bg: '#00c4f4',
        accent: '#ffcc00',
        heroItem: 'Custom Adventure',
      },
      chapters: [
        {
          id: 'cust-1',
          title: `0:00 - MP's New Mission: ${habit}`,
          timestamp: '0:00',
          seconds: 0,
          description: description,
          narrativeText: `MP is ready for today's special mission: ${habit}! Let's make everyone proud!`,
        },
        {
          id: 'cust-2',
          title: `02:00 - Good Habit Challenge: ${habit}`,
          timestamp: '02:00',
          seconds: 120,
          description: 'Practice the good habit with MP!',
          narrativeText: `Time to practice ${habit}! Remember: good habits make you strong and happy!`,
          interactiveStep: {
            id: 'cust-step',
            type: 'crank',
            title: `${habit} Challenge`,
            instruction: 'Turn the magical sweet machine crank to complete your custom episode!',
            prompt: 'Complete your habit challenge!',
            targetCount: 3,
            rewardText: 'Awesome job! Custom episode completed!',
            badgeName: 'Custom Adventure Star ⭐',
          },
        },
      ],
    };

    setCurrentEpisode(customEpisode);
    setActiveTab('watch');
    sound.playSfx('fanfare');
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-slate-100 font-sans selection:bg-yellow-400 selection:text-sky-950 flex flex-col">
      {/* Celebration Confetti Banner */}
      {showCelebration && (
        <div className="fixed top-16 inset-x-0 z-50 flex justify-center pointer-events-none animate-in slide-in-from-top duration-300">
          <div className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 text-sky-950 px-6 py-2.5 rounded-full font-black text-sm shadow-2xl flex items-center gap-2 border-2 border-white animate-bounce">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span>🎉 Welcome to the 3.67M MP Adventure Club! Bell Notifications ON! ⭐</span>
          </div>
        </div>
      )}

      {/* YouTube Navigation Header */}
      <YouTubeHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        unreadCount={1}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        kidSafeMode={kidSafeMode}
        onToggleKidSafe={() => {
          sound.playSfx('pop');
          setKidSafeMode(!kidSafeMode);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1580px] mx-auto px-3 sm:px-6 py-4">
        {/* Tab 1: WATCH SHOW (The Core YouTube Kids & Video Experience) */}
        {activeTab === 'watch' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Primary Column: Video Player + Details + Comments */}
            <div className={`lg:col-span-8 ${kidSafeMode ? 'lg:col-span-12 max-w-4xl mx-auto' : ''}`}>
              {/* Interactive Video Show Player */}
              <VideoPlayer
                episode={currentEpisode}
                onNextEpisode={handleNextEpisode}
                onEarnSticker={handleEarnSticker}
              />

              {/* Video Details (Title, Subscribers, Likes, Description) */}
              <VideoDetails
                episode={currentEpisode}
                isSubscribed={isSubscribed}
                subscriberCount={subscriberCount}
                onToggleSubscribe={handleToggleSubscribe}
                onOpenShareModal={() => setIsShareModalOpen(true)}
                onOpenColoringModal={() => setIsColoringModalOpen(true)}
              />

              {/* Comments Section (Hidden if KidSafeMode for distraction-free watching) */}
              {!kidSafeMode && <CommentsSection />}
            </div>

            {/* Sidebar Column: Recommendations & Channel Tabs */}
            {!kidSafeMode && (
              <div className="lg:col-span-4 space-y-6">
                {/* Sweet Machine Quick Teaser Widget */}
                <div
                  onClick={() => {
                    sound.playSfx('pop');
                    setActiveTab('arcade');
                  }}
                  className="p-4 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 text-sky-950 rounded-2xl shadow-lg border-2 border-yellow-200 cursor-pointer hover:scale-102 transition-transform select-none"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 text-white px-2 py-0.5 rounded-full">
                        Interactive Feature
                      </span>
                      <h4 className="font-black text-base mt-1 font-['Fredoka']">
                        Play with Sweet Machine! 🍬
                      </h4>
                      <p className="text-xs font-semibold opacity-90">
                        Turn the candy crank & win habit stickers!
                      </p>
                    </div>
                    <span className="text-4xl animate-bounce">🍭</span>
                  </div>
                </div>

                {/* Google Calendar Quick Widget */}
                <div
                  onClick={() => {
                    sound.playSfx('pop');
                    setActiveTab('calendar');
                  }}
                  className="p-4 bg-gradient-to-r from-blue-600 to-sky-600 text-white rounded-2xl shadow-lg border border-sky-400/40 cursor-pointer hover:scale-102 transition-transform select-none"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                        Google Calendar
                      </span>
                      <h4 className="font-bold text-sm mt-1">
                        Daily Good Habits Schedule 📅
                      </h4>
                      <p className="text-[11px] text-sky-100">
                        Sync toothbrushing & episode watch times!
                      </p>
                    </div>
                    <span className="text-3xl">🗓️</span>
                  </div>
                </div>

                {/* Upcoming Recommended Episodes */}
                <SidebarRecommendations
                  currentEpisodeId={currentEpisode.id}
                  onSelectEpisode={(ep) => setCurrentEpisode(ep)}
                />
              </div>
            )}
          </div>
        )}

        {/* Tab 2: SWEET MACHINE ARCADE */}
        {activeTab === 'arcade' && (
          <SweetMachineArcade
            stickers={stickers}
            onUnlockSticker={handleUnlockSticker}
          />
        )}

        {/* Tab 3: CREATE CUSTOM EPISODE */}
        {activeTab === 'create' && (
          <CreateEpisodeStudio
            onPlayGeneratedEpisode={handlePlayGeneratedEpisode}
          />
        )}

        {/* Tab 4: GOOGLE CALENDAR HABIT PLANNER */}
        {activeTab === 'calendar' && (
          <CalendarHabitPlanner />
        )}

        {/* Tab 5: STICKERS ALBUM */}
        {activeTab === 'stickers' && (
          <div className="max-w-4xl mx-auto p-4 sm:p-6 text-white animate-in fade-in">
            <div className="text-center mb-8">
              <span className="bg-purple-400 text-purple-950 font-black text-xs px-3 py-1 rounded-full uppercase">
                Trophy Case
              </span>
              <h2 className="text-3xl font-black text-yellow-300 mt-2 font-['Fredoka']">
                MP’s Good Habits Sticker Book ⭐
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Collect stickers by watching episodes and practicing good habits every day!
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {stickers.map((stk) => (
                <div
                  key={stk.id}
                  className={`p-4 rounded-3xl border text-center transition-all ${
                    stk.unlocked
                      ? 'bg-neutral-800/90 border-yellow-400/60 shadow-lg'
                      : 'bg-neutral-900/40 border-white/5 opacity-40'
                  }`}
                >
                  <div className="text-5xl mb-2">{stk.unlocked ? stk.icon : '🔒'}</div>
                  <div className="font-bold text-sm text-white">{stk.unlocked ? stk.name : 'Secret Sticker'}</div>
                  <div className="text-[10px] text-yellow-300 font-semibold mb-2">{stk.category}</div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    {stk.unlocked ? stk.habitFact : 'Unlocked by completing challenges in episodes!'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: COMMUNITY & SHORTS */}
        {activeTab === 'community' && <CommunityAndShorts />}
      </main>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={currentEpisode.title}
      />

      {/* Coloring & Activity Modal */}
      <ColoringModal
        isOpen={isColoringModalOpen}
        onClose={() => setIsColoringModalOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-12 border-t border-white/10 py-6 text-center text-xs text-slate-500">
        <p>MP Kids Show • 3.67M Subscribers • Imitation Preschool Entertainment & Good Habits Learning Hub</p>
        <p className="mt-1 text-[11px] text-slate-600">
          Features interactive episode player, good habit minigames, Google Calendar routine sync, and the magical sweet machine.
        </p>
      </footer>
    </div>
  );
}
