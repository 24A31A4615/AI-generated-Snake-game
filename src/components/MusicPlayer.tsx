import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { motion } from 'motion/react';

interface Track {
  title: string;
  artist: string;
  url: string;
  color: string;
}

const TRACKS: Track[] = [
  {
    title: "Cyberpunk Dreams",
    artist: "AI Gen Synth",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "#00ffff"
  },
  {
    title: "Neon Nights",
    artist: "Digital Pulse",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "#ff00ff"
  },
  {
    title: "Retro Future",
    artist: "Wave Runner",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "#39ff14"
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const handleTrackEnd = () => {
    handleNext();
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full max-w-[400px] bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl crt-effect">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />

      <div className="flex items-center gap-4 mb-6">
        <div 
          className="w-16 h-16 rounded-lg flex items-center justify-center shadow-lg overflow-hidden relative group"
          style={{ backgroundColor: currentTrack.color + '20' }}
        >
          <div 
            className="absolute inset-0 opacity-40 blur-sm"
            style={{ backgroundColor: currentTrack.color }}
          />
          <Volume2 className="relative z-10 text-white" size={24} />
        </div>
        
        <div className="flex-1 overflow-hidden">
          <h3 className="text-white font-bold truncate tracking-tight glitch-text" data-text={currentTrack.title}>
            {currentTrack.title}
          </h3>
          <p className="text-white/50 text-sm truncate">
            {currentTrack.artist}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-1 bg-white/10 rounded-full mb-6 overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 h-full"
          style={{ backgroundColor: currentTrack.color }}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-8">
        <button 
          onClick={handlePrev}
          className="text-white/60 hover:text-white transition-colors"
        >
          <SkipBack size={24} />
        </button>

        <button 
          onClick={togglePlay}
          className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          style={{ backgroundColor: currentTrack.color }}
        >
          {isPlaying ? (
            <Pause size={28} className="text-black fill-black" />
          ) : (
            <Play size={28} className="text-black fill-black ml-1" />
          )}
        </button>

        <button 
          onClick={handleNext}
          className="text-white/60 hover:text-white transition-colors"
        >
          <SkipForward size={24} />
        </button>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {TRACKS.map((_, i) => (
          <div 
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              i === currentTrackIndex ? 'w-4' : 'opacity-20'
            }`}
            style={{ backgroundColor: i === currentTrackIndex ? currentTrack.color : 'white' }}
          />
        ))}
      </div>
    </div>
  );
};
