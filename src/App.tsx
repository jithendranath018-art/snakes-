/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  return (
    <div className="w-full h-screen bg-black overflow-hidden flex flex-col font-mono text-[#0ff] relative select-none static-noise screen-tear">
      <div className="crt-overlay"></div>

      {/* Header */}
      <header className="h-16 shrink-0 border-b-2 border-b-[#f0f] flex items-center justify-between px-4 sm:px-8 bg-black z-10 w-full mb-4 glitch-box">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black border-2 border-[#0ff] flex items-center justify-center">
            <span className="text-xl font-bold text-[#f0f] animate-pulse">&gt;_</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold tracking-widest text-[#0ff] drop-shadow-[2px_0_0_#f0f]" data-text="SYSTEM.MODULE.SNAKE_AUDIO">
            <span className="glitch-text" data-text="SYSTEM.MODULE.SNAKE_AUDIO">SYSTEM.MODULE.SNAKE_AUDIO</span>
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-sm tracking-widest uppercase text-[#f0f] font-bold hidden sm:block">STATUS: CORRUPTED</div>
          <div className="w-10 h-10 border-2 border-[#0ff] flex items-center justify-center bg-black">
            <div className="w-4 h-4 bg-[#f0f] animate-pulse"></div>
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="flex-1 p-2 sm:p-6 z-10 w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)_250px] grid-rows-[auto_minmax(0,1fr)_auto_auto] lg:grid-rows-[minmax(0,1fr)_120px] gap-4 sm:gap-6 pb-20 lg:pb-16 min-h-0 overflow-y-auto lg:overflow-hidden overflow-x-hidden">
        <MusicPlayer />
        <SnakeGame />
      </main>
    </div>
  );
}

