import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 150;

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // Ensure food doesn't spawn on snake
    if (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      return generateFood();
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y,
      };

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const loop = (time: number) => {
      if (time - lastUpdateRef.current > SPEED) {
        moveSnake();
        lastUpdateRef.current = time;
      }
      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [moveSnake]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-[400px] px-4 items-center">
        <div className="border-2 border-neon-blue px-3 py-1 text-neon-blue font-mono text-3xl font-black tracking-tighter glitch-text" data-text={`SCORE: ${score}`}>
          SCORE: <span className="text-white">{score}</span>
        </div>
        <div className="text-neon-pink font-mono text-xl uppercase font-bold tracking-widest animate-pulse">
          {gameOver ? 'Game Over' : isPaused ? 'Paused' : 'Playing'}
        </div>
      </div>

      <div 
        className="relative bg-black/40 border-2 border-neon-blue/30 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(0,255,255,0.1)] crt-effect"
        style={{ width: 400, height: 400 }}
      >
        {/* Screen Tearing Overlay (Randomly visible) */}
        <div className="absolute inset-0 pointer-events-none z-30 opacity-10 mix-blend-screen overflow-hidden">
          <div className="w-full h-[2px] bg-white absolute top-[20%] animate-[glitch-anim_0.1s_infinite]" />
          <div className="w-full h-[1px] bg-neon-pink absolute top-[60%] animate-[glitch-anim2_0.2s_infinite]" />
          <div className="w-full h-[3px] bg-neon-blue absolute top-[85%] animate-[glitch-anim_0.15s_infinite]" />
        </div>
        {/* Grid Background */}
        <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 opacity-10">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-neon-blue/20" />
          ))}
        </div>

        {/* Food */}
        <motion.div
          className="absolute w-[20px] h-[20px] bg-neon-pink rounded-full shadow-[0_0_10px_#ff00ff]"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
          style={{
            left: food.x * 20,
            top: food.y * 20,
          }}
        />

        {/* Snake */}
        {snake.map((segment, i) => (
          <div
            key={`${segment.x}-${segment.y}-${i}`}
            className={`absolute w-[20px] h-[20px] ${
              i === 0 ? 'bg-neon-green z-10' : 'bg-neon-green/60'
            } border border-black/20 rounded-sm shadow-[0_0_5px_#39ff14]`}
            style={{
              left: segment.x * 20,
              top: segment.y * 20,
            }}
          />
        ))}

        {/* Game Over Overlay */}
        <AnimatePresence>
          {gameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20"
            >
              <h2 className="text-5xl font-black text-neon-pink mb-8 tracking-tighter uppercase drop-shadow-[0_0_10px_rgba(255,0,255,0.5)] glitch-text" data-text="GAME OVER">
                Game Over
              </h2>
              <button
                onClick={resetGame}
                className="px-8 py-3 bg-neon-blue text-black font-black rounded-full hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,255,0.6)] uppercase tracking-widest text-sm"
              >
                Retry
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Start/Pause Overlay */}
        <AnimatePresence>
          {isPaused && !gameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center z-20 backdrop-blur-sm"
            >
              <button
                onClick={() => setIsPaused(false)}
                className="w-20 h-20 bg-neon-green rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(57,255,20,0.6)] hover:scale-110 transition-all active:scale-95"
              >
                <div className="w-0 h-0 border-t-[14px] border-t-transparent border-l-[24px] border-l-black border-b-[14px] border-b-transparent ml-2" />
              </button>
              <p className="text-neon-green mt-6 font-mono text-xs uppercase tracking-[0.4em] animate-pulse">
                Press Space to Start
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-white/40 text-xs font-mono uppercase tracking-tighter">
        Use Arrow Keys or WASD to Move • Space to Pause
      </div>
    </div>
  );
};
