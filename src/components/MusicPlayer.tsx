import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "Cyberpunk City Drive",
    artist: "AI Gen Tracks",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "Neon Grid Runner",
    artist: "AI Gen Tracks",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "Synthwave Nightfall",
    artist: "AI Gen Tracks",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="contents">
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={handleEnded}
      />
      
      {/* Sidebar: Playlist & Visualizer */}
      <aside className="lg:col-start-1 lg:row-start-1 lg:row-end-3 flex flex-col gap-6">
        <div className="bg-black border-2 border-[#0ff] p-4 flex flex-col gap-4 mt-2 lg:mt-0 glitch-box relative">
          <div className="absolute -top-3 left-4 bg-black px-2 text-[#f0f] text-sm font-bold">DATA_BLOB_ARRAY</div>
          <div className="space-y-4 mt-2">
            {TRACKS.map((track, idx) => {
              const isActive = currentTrackIndex === idx;
              return (
                <div 
                  key={track.id} 
                  onClick={() => { setCurrentTrackIndex(idx); setIsPlaying(true); }}
                  className={`p-2 flex items-center gap-3 transition-colors cursor-pointer border-2 ${isActive ? 'bg-[#0ff]/10 border-[#0ff]' : 'border-transparent hover:border-[#f0f]/50'}`}
                >
                  <div className={`w-8 h-8 flex items-center justify-center font-bold ${isActive ? 'bg-[#0ff] text-black' : 'bg-transparent border-2 border-[#f0f] text-[#f0f]'}`}>
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <div className={`text-sm font-bold ${isActive ? 'text-[#0ff]' : 'text-gray-400'}`}>{track.title}</div>
                    <div className="text-[10px] text-[#f0f] uppercase">{track.artist}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-black border-2 border-[#f0f] p-4 flex-1 hidden lg:block relative glitch-box">
          <div className="absolute -top-3 left-4 bg-black px-2 text-[#0ff] text-sm font-bold">AUDIO_FREQ_VIS</div>
          <div className="flex items-end gap-1 h-32 justify-center mt-4 border-b-2 border-[#f0f]">
            <div className={`w-4 bg-[#0ff] transition-all duration-75 ${isPlaying ? 'animate-pulse h-12' : 'h-2'}`}></div>
            <div className={`w-4 bg-[#f0f] transition-all duration-75 ${isPlaying ? 'animate-[pulse_0.5s_ease-in-out_infinite] h-24' : 'h-2'}`}></div>
            <div className={`w-4 bg-[#0ff] transition-all duration-75 ${isPlaying ? 'animate-[pulse_0.2s_ease-in-out_infinite] h-32' : 'h-2'}`}></div>
            <div className={`w-4 bg-[#f0f] transition-all duration-75 ${isPlaying ? 'animate-[pulse_0.4s_ease-in-out_infinite] h-20' : 'h-2'}`}></div>
            <div className={`w-4 bg-[#0ff] transition-all duration-75 ${isPlaying ? 'animate-[pulse_0.3s_ease-in-out_infinite] h-28' : 'h-2'}`}></div>
            <div className={`w-4 bg-[#f0f] transition-all duration-75 ${isPlaying ? 'animate-[pulse_0.6s_ease-in-out_infinite] h-16' : 'h-2'}`}></div>
          </div>
        </div>
      </aside>

      {/* Play Controls */}
      <div className="lg:col-start-2 lg:row-start-2 bg-black border-2 border-[#0ff] p-4 flex items-center justify-around h-24 lg:h-32 mb-4 lg:mb-0 relative z-20 mx-4 lg:mx-0 glitch-box">
        <div className="absolute -top-3 left-4 bg-black px-2 text-[#f0f] text-sm font-bold">EXEC_CONTROL</div>
        
        <button onClick={prevTrack} className="p-2 text-[#f0f] hover:text-black hover:bg-[#f0f] transition-colors outline-none font-bold text-xl border-2 border-transparent hover:border-[#f0f]">
          [ &lt;&lt; ]
        </button>
        <button onClick={togglePlay} className="px-6 py-4 bg-[#0ff] text-black font-bold text-xl hover:bg-[#f0f] transition-colors outline-none border-2 border-transparent">
          {isPlaying ? '[ || SPACE ]' : '[ > PLAY ]'}
        </button>
        <button onClick={nextTrack} className="p-2 text-[#f0f] hover:text-black hover:bg-[#f0f] transition-colors outline-none font-bold text-xl border-2 border-transparent hover:border-[#f0f]">
          [ &gt;&gt; ]
        </button>
      </div>

      {/* Footer / Timeline */}
      <footer className="fixed bottom-0 left-0 right-0 h-10 border-t-2 border-[#f0f] bg-black flex items-center px-4 lg:px-8 z-50">
        <div className="flex items-center gap-4 w-full">
          <span className="text-[12px] text-[#0ff] font-bold hidden sm:block">00:00</span>
          <div className="flex-1 h-2 bg-gray-900 border border-[#0ff] relative">
            <div className="absolute left-0 top-0 h-full w-1/3 bg-[#f0f]"></div>
          </div>
          <span className="text-[12px] text-[#0ff] font-bold hidden sm:block">--:--</span>
          
          {/* Volume */}
          <div className="ml-2 sm:ml-8 flex items-center gap-2 text-[#0ff] font-bold">
            VOL:
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16 sm:w-24 appearance-none h-2 bg-gray-900 border border-[#0ff] accent-[#f0f] cursor-pointer"
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
