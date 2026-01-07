import React, { useState, useEffect, useCallback } from 'react';
import { GameState, LevelData, GameStats, FALLBACK_LEVELS } from './types';
import { generateGameLevels } from './services/geminiService';
import { GameScreen } from './components/GameScreen';
import { CreateMode } from './components/CreateMode';
import { GameOver } from './components/GameOver';
import { Play, PenTool, Sparkles, Heart } from 'lucide-react';
import { playSound } from './utils/sound';

// IMPORTANTE: Salve a foto da Maria como 'maria.jpg' na pasta public ou raiz do projeto!
const DOLL_IMG = "./maria.jpg";
const FALLBACK_DOLL_IMG = "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=2075&auto=format&fit=crop";

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [levels, setLevels] = useState<LevelData[]>([]);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [stats, setStats] = useState<GameStats>({ score: 0, level: 1, history: [] });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCustomGame, setIsCustomGame] = useState(false);

  // Load initial levels or fallback
  const loadLevels = useCallback(async (reset = true) => {
    setIsGenerating(true);
    const newLevels = await generateGameLevels(reset ? 0 : levels.length);
    
    if (newLevels.length === 0 && reset) {
       setLevels(FALLBACK_LEVELS);
    } else {
       setLevels(prev => reset ? newLevels : [...prev, ...newLevels]);
    }
    setIsGenerating(false);
  }, [levels.length]);

  const startGame = async () => {
    playSound.win(); // Sound on start
    setStats({ score: 0, level: 1, history: [] });
    setCurrentLevelIndex(0);
    setIsCustomGame(false);
    setGameState(GameState.PLAYING);
    await loadLevels(true);
  };

  const handleLevelComplete = (timeTaken: number) => {
    const timeBonus = Math.max(0, 10 - timeTaken) * 5;
    const levelScore = Math.floor(50 + timeBonus);

    setStats(prev => ({
      score: prev.score + levelScore,
      level: prev.level + 1,
      history: [...prev.history, { level: prev.level, timeTaken }]
    }));

    if (isCustomGame) {
        setTimeout(() => setGameState(GameState.GAME_OVER), 1000);
        return;
    }

    if (currentLevelIndex + 2 >= levels.length && !isCustomGame) {
      if (levels !== FALLBACK_LEVELS) {
         loadLevels(false);
      }
    }

    if (currentLevelIndex < levels.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
    } else {
      setGameState(GameState.GAME_OVER);
    }
  };

  const startCustomGame = (customLevel: LevelData) => {
    setLevels([customLevel]);
    setCurrentLevelIndex(0);
    setStats({ score: 0, level: 1, history: [] });
    setIsCustomGame(true);
    setGameState(GameState.PLAYING);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = FALLBACK_DOLL_IMG;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-300 via-purple-300 to-indigo-400 overflow-hidden font-sans select-none">
      
      {/* Magical Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
         <div className="absolute top-10 left-10 text-6xl animate-bounce-slow opacity-30">🏰</div>
         <div className="absolute bottom-20 right-10 text-6xl animate-bounce-slow opacity-30" style={{animationDelay: '1s'}}>🦄</div>
         <div className="absolute top-1/4 right-1/4 text-4xl animate-sparkle text-yellow-200">✨</div>
         <div className="absolute bottom-1/3 left-1/3 text-3xl animate-sparkle text-white" style={{animationDelay: '0.5s'}}>✨</div>
         <div className="absolute top-1/2 left-10 text-5xl animate-float opacity-30">🧚‍♀️</div>
      </div>

      <div className="relative z-10 w-full h-full min-h-screen flex flex-col">
        
        {/* Main Content Area */}
        <main className="flex-1 flex items-center justify-center p-4">
          
          {gameState === GameState.MENU && (
            <div className="text-center space-y-8 animate-pop max-w-md w-full flex flex-col items-center">
              
              {/* Avatar Image with Royal Frame */}
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-sparkle"></div>
                <div className="w-48 h-48 relative rounded-full border-[6px] border-white shadow-2xl overflow-hidden animate-float bg-white">
                   <img 
                      src={DOLL_IMG} 
                      onError={handleImageError}
                      alt="Princesa Maria" 
                      className="w-full h-full object-cover" 
                   />
                </div>
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-6xl drop-shadow-lg">👑</div>
              </div>

              <div className="space-y-2">
                <h1 className="text-5xl md:text-6xl font-magic text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)] tracking-wide leading-tight">
                  O Reino da<br/>Maria & Papai
                </h1>
                <p className="text-white/90 text-xl font-bold flex items-center justify-center gap-2 bg-purple-900/20 py-2 rounded-full backdrop-blur-sm">
                   Vamos brincar, Princesa? <Heart className="fill-pink-500 text-pink-500 w-6 h-6 animate-pulse" />
                </p>
              </div>

              <div className="bg-white/40 backdrop-blur-lg p-6 rounded-[2rem] shadow-2xl space-y-4 w-full border border-white/50">
                <button 
                  onClick={startGame}
                  className="w-full group relative bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold text-2xl py-6 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 border-b-8 border-purple-800 active:border-b-0 active:translate-y-2 flex items-center justify-center space-x-3"
                >
                  <Play className="w-8 h-8 fill-white" />
                  <span className="font-magic tracking-wider">JOGAR AGORA</span>
                  <Sparkles className="absolute top-2 right-2 text-yellow-300 w-6 h-6 animate-spin-slow" />
                </button>

                <button 
                  onClick={() => { playSound.pop(); setGameState(GameState.CREATE_MODE); }}
                  className="w-full bg-white hover:bg-purple-50 text-purple-600 font-bold text-xl py-4 rounded-2xl shadow-md transition-all hover:scale-105 active:scale-95 border-b-4 border-purple-200 active:border-b-0 active:translate-y-1 flex items-center justify-center space-x-2"
                >
                  <PenTool className="w-6 h-6" />
                  <span>Desafiar o Papai</span>
                </button>
              </div>
            </div>
          )}

          {gameState === GameState.CREATE_MODE && (
            <CreateMode 
              onStartCustomGame={startCustomGame} 
              onBack={() => setGameState(GameState.MENU)} 
            />
          )}

          {gameState === GameState.PLAYING && levels.length > 0 && (
            <GameScreen 
              level={levels[currentLevelIndex]} 
              onLevelComplete={handleLevelComplete}
              currentScore={stats.score}
              currentLevelIndex={stats.level - 1}
              isGenerating={isGenerating && !levels[currentLevelIndex]}
              isCustomGame={isCustomGame}
            />
          )}

          {gameState === GameState.GAME_OVER && (
            <GameOver 
              stats={stats} 
              onRestart={startGame}
              onHome={() => setGameState(GameState.MENU)}
            />
          )}
          
        </main>

        {/* Footer */}
        <footer className="p-4 text-center text-white/80 text-lg font-bold drop-shadow-md">
           Feito com todo amor do mundo pelo Papai para a Maria ❤️
        </footer>
      </div>
    </div>
  );
};

export default App;