import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const MIN_SPEED = 60; // Make it faster as you eat more

type Point = { x: number; y: number };

function randomFoodPosition(snake: Point[]): Point {
  let newFood: Point;
  let isOccupied = true;
  while (isOccupied) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // eslint-disable-next-line no-loop-func
    isOccupied = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
  }
  return newFood!;
}

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [nextDirection, setNextDirection] = useState<Point>({ x: 0, y: -1 });
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const gameBoardRef = useRef<HTMLDivElement>(null);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 0, y: -1 });
    setNextDirection({ x: 0, y: -1 });
    setScore(0);
    setGameOver(false);
    setHasStarted(false);
    setFood(randomFoodPosition([{ x: 10, y: 10 }]));
    gameBoardRef.current?.focus();
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Prevent typical scrolling
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        if (gameOver) {
          resetGame();
        } else if (hasStarted) {
          setIsPaused(prev => !prev);
        } else {
          setHasStarted(true);
        }
        return;
      }

      if (gameOver || isPaused) return;

      if (!hasStarted) {
        setHasStarted(true);
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (direction.y !== 1) setNextDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
          if (direction.y !== -1) setNextDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
          if (direction.x !== 1) setNextDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          if (direction.x !== -1) setNextDirection({ x: 1, y: 0 });
          break;
      }
    },
    [direction, gameOver, isPaused, hasStarted]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (gameOver || isPaused || !hasStarted) return;

    const currentSpeed = Math.max(MIN_SPEED, INITIAL_SPEED - score * 2);

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + nextDirection.x,
          y: head.y + nextDirection.y,
        };

        // Wall collision wrap-around (Optional) or Wall as death
        // Let's make wall collision death
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Eat food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(randomFoodPosition(newSnake));
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        setDirection(nextDirection);
        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, currentSpeed);
    return () => clearInterval(intervalId);
  }, [nextDirection, food, gameOver, isPaused, hasStarted, score]);

  return (
    <div className="contents">
      {/* Board */}
      <div className="lg:col-start-2 lg:col-end-4 lg:row-start-1 bg-black border-2 border-[#0ff] relative overflow-hidden flex items-center justify-center min-h-[350px] lg:min-h-[400px] mx-4 lg:mx-0 glitch-box z-10 group">
        <div className="absolute top-0 right-0 p-2 text-[#f0f] text-xs animate-pulse opacity-50 z-20">ADDR: 0x00FF29</div>
        <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0ff 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
        
        <div 
          ref={gameBoardRef}
          className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] border-2 border-[#f0f] relative z-20 outline-none bg-black overflow-hidden"
          tabIndex={-1}
        >
          {/* Snake rendering */}
          {snake.map((segment, index) => {
            const isHead = index === 0;
            return (
              <div
                key={`${segment.x}-${segment.y}-${index}`}
                className={`absolute transition-all duration-75 ${
                  isHead 
                    ? 'bg-[#0ff] z-10 box-shadow-none' 
                    : 'bg-transparent border-2 border-[#0ff]'
                }`}
                style={{
                  width: '5%',
                  height: '5%',
                  left: `${segment.x * 5}%`,
                  top: `${segment.y * 5}%`,
                }}
              />
            );
          })}

          {/* Food rendering */}
          <div
            className="absolute bg-[#f0f] animate-pulse"
            style={{
              width: '5%',
              height: '5%',
              left: `${food.x * 5}%`,
              top: `${food.y * 5}%`,
            }}
          />

          {/* Overlays */}
          {(!hasStarted || gameOver || isPaused) && (
            <div className={`absolute inset-0 bg-black/80 flex items-center justify-center z-30 ${gameOver ? 'screen-tear' : ''}`}>
              <div className="text-center w-full p-4">
                {gameOver ? (
                  <>
                    <h3 className="text-[#f0f] font-bold text-2xl sm:text-4xl mb-4 uppercase tracking-widest glitch-text" data-text="FATAL ERROR">
                      FATAL ERROR
                    </h3>
                    <div className="text-[#0ff] text-xs mb-6">MEMORY_BUFFER_OVERFLOW at 0x00FF29</div>
                    <button 
                      onClick={resetGame}
                      className="px-6 py-2 bg-[#0ff] text-black font-bold hover:bg-[#f0f] transition-colors uppercase tracking-widest text-sm sm:text-base outline-none border-2 border-[#f0f]"
                    >
                      &gt; EXEC REBOOT.EXE
                    </button>
                  </>
                ) : isPaused ? (
                  <h3 className="text-[#0ff] font-bold text-2xl sm:text-4xl tracking-widest animate-pulse border-y-2 border-[#0ff] py-4 w-full">
                    [ SYSTEM HOLD ]
                  </h3>
                ) : (
                  <div className="flex flex-col items-center">
                    <h3 className="text-[#0ff] font-bold text-2xl sm:text-3xl mb-4 uppercase glitch-text animate-pulse" data-text="INITIALIZE">INITIALIZE</h3>
                    <div className="border border-[#0ff] p-4 text-[#f0f] text-xs sm:text-sm bg-[#0ff]/10">
                      <p className="mb-2">INPUT REQ: WASD || ARROWS</p>
                      <p>EXECUTION: PRESS SPACE</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Score Box */}
      <div className="lg:col-start-3 lg:col-end-4 lg:row-start-2 bg-black border-2 border-[#f0f] p-4 flex flex-col justify-center mb-8 lg:mb-0 mx-4 lg:mx-0 h-24 lg:h-32 text-center lg:text-left relative glitch-box">
        <div className="absolute -top-3 left-4 bg-black px-2 text-[#0ff] text-sm font-bold">STATE_METRICS</div>
        <div className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold animate-pulse">SYS_SCORE</div>
        <div className="text-4xl font-bold text-[#f0f] glitch-text" data-text={score.toString().padStart(4, '0')}>
          {score.toString().padStart(4, '0')}
        </div>
      </div>
    </div>
  );
}
