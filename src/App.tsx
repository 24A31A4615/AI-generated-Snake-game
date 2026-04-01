import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-neon-blue/30 flex flex-col items-center justify-center p-4 overflow-hidden relative crt-effect">
      {/* Glitch Art Layers */}
      <div className="noise-bg" />
      <div className="scanline-overlay" />

      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-blue/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-pink/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 flex flex-col items-center gap-12 w-full max-w-6xl"
      >
        <header className="text-center space-y-1">
          <h1 className="text-7xl font-black tracking-tighter italic uppercase leading-none glitch-text" data-text="NEON SNAKE">
            <span className="text-neon-blue drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">Neon</span>
            <span className="text-white">Snake</span>
          </h1>
          <p className="text-white/30 font-mono text-xs tracking-[0.5em] uppercase">
            Rhythm & Reflexes
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start w-full">
          <section className="flex justify-center">
            <SnakeGame />
          </section>

          <aside className="flex flex-col gap-8 items-center lg:items-start">
            <div className="space-y-4 w-full">
              <h2 className="text-xs font-bold text-white/30 uppercase tracking-[0.3em] px-2">
                Now Playing
              </h2>
              <MusicPlayer />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 w-full space-y-4">
              <h3 className="text-xs font-bold text-white/30 uppercase tracking-[0.3em]">
                How to Play
              </h3>
              <ul className="space-y-3 text-sm text-white/70 font-medium">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-neon-green shadow-[0_0_5px_#39ff14]" />
                  Eat the pink dots to grow
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-neon-pink shadow-[0_0_5px_#ff00ff]" />
                  Avoid walls and yourself
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-neon-blue shadow-[0_0_5px_#00ffff]" />
                  Vibe to the music while you play
                </li>
              </ul>
            </div>
          </aside>
        </main>

        <footer className="mt-8 text-white/20 text-[10px] font-mono uppercase tracking-widest">
          &copy; 2026 Neon Snake Arcade • Built with Google AI Studio
        </footer>
      </motion.div>
    </div>
  );
}
