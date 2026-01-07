import React, { useState, useEffect, useMemo, useRef } from 'react';
import { LevelData } from '../types';
import { Confetti } from './Confetti';
import { Trophy, Keyboard, Heart, Lightbulb, Crown, Sparkles } from 'lucide-react';
import { playSound } from '../utils/sound';

interface GameScreenProps {
  level: LevelData;
  onLevelComplete: (timeTaken: number) => void;
  currentScore: number;
  currentLevelIndex: number;
  isGenerating: boolean;
  isCustomGame?: boolean;
}

const PRINCESS_ENCOURAGEMENTS = [
  "Maravilhosa, minha Princesa!",
  "Sua coroa está brilhando!",
  "Papai ama ver você acertar!",
  "Magia pura, filhota!",
  "Genial como uma Rainha!",
  "Nossa, que inteligência real!",
];

export const GameScreen: React.FC<GameScreenProps> = ({ 
  level, 
  onLevelComplete, 
  currentScore, 
  currentLevelIndex,
  isGenerating,
  isCustomGame = false
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [inputValue, setInputValue] = useState('');
  const [isError, setIsError] = useState(false);
  const [encouragement, setEncouragement] = useState('');
  const [hiddenIndices, setHiddenIndices] = useState<number[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset state when level changes
  useEffect(() => {
    setShowConfetti(false);
    setStartTime(Date.now());
    setInputValue('');
    setIsError(false);
    setEncouragement('');
    setHiddenIndices([]);
    setHintsUsed(0);
    playSound.sparkle(); // Magical start
  }, [level]);

  const gridItems = useMemo(() => {
    const totalCells = level.gridSize * level.gridSize;
    const targetIndex = Math.floor(Math.random() * totalCells);
    
    return Array.from({ length: totalCells }).map((_, index) => ({
      id: index,
      isTarget: index === targetIndex,
      emoji: index === targetIndex ? level.targetEmoji : level.baseEmoji
    }));
  }, [level]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (showConfetti) return;

    const val = e.target.value;
    setInputValue(val);
    setIsError(false);

    if (val.includes(level.targetEmoji)) {
      // WIN
      playSound.correct();
      setTimeout(() => playSound.win(), 500);
      
      setShowConfetti(true);
      setEncouragement(
        isCustomGame 
          ? "O Papai achou! Obrigado, filhota!" 
          : PRINCESS_ENCOURAGEMENTS[Math.floor(Math.random() * PRINCESS_ENCOURAGEMENTS.length)]
      );
      
      const endTime = Date.now();
      const timeTaken = (endTime - startTime) / 1000;
      
      inputRef.current?.blur();
      
      setTimeout(() => {
        onLevelComplete(timeTaken);
      }, 3500);
    } 
    else if (val.includes(level.baseEmoji)) {
      playSound.wrong();
      setIsError(true);
      setTimeout(() => setIsError(false), 500);
    }
  };

  const useHint = () => {
    if (hintsUsed > 0 || showConfetti) return;
    
    playSound.hint();
    setHintsUsed(prev => prev + 1);

    const nonTargetIndices = gridItems.filter(i => !i.isTarget).map(i => i.id);
    const shuffled = nonTargetIndices.sort(() => 0.5 - Math.random());
    const toHide = shuffled.slice(0, Math.floor(nonTargetIndices.length / 2));
    
    setHiddenIndices(toHide);
    inputRef.current?.focus();
  };

  const getGridCols = (size: number) => {
    if (size <= 3) return 'grid-cols-3';
    if (size === 4) return 'grid-cols-4';
    if (size === 5) return 'grid-cols-5';
    if (size === 6) return 'grid-cols-6';
    if (size === 7) return 'grid-cols-7';
    if (size === 8) return 'grid-cols-8';
    return 'grid-cols-9'; 
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-400"></div>
        <p className="text-2xl text-pink-600 font-magic animate-pulse">
          {isCustomGame ? "Preparando o desafio da Princesa..." : "Papai está criando mágica..."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start h-full w-full max-w-2xl mx-auto p-4 relative overflow-y-auto">
      {showConfetti && <Confetti />}

      {/* Royal Header */}
      <div className="w-full flex justify-between items-center bg-white/70 backdrop-blur-md p-3 rounded-full shadow-lg mb-4 shrink-0 border-2 border-yellow-300">
        <div className="flex items-center space-x-2 pl-2">
          <div className="bg-gradient-to-tr from-yellow-300 to-yellow-500 p-2 rounded-full shadow-inner">
            <Crown className="text-white w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-purple-700 font-magic">{currentScore}</span>
        </div>
        
        <div className={`px-4 py-2 rounded-full border-2 flex items-center gap-2 ${isCustomGame ? 'bg-blue-100 border-blue-200' : 'bg-pink-100 border-pink-200'}`}>
          <Heart className={`w-4 h-4 ${isCustomGame ? 'text-blue-500 fill-blue-500' : 'text-pink-500 fill-pink-500'} animate-pulse`} />
          <span className={`${isCustomGame ? 'text-blue-600' : 'text-pink-600'} font-bold font-magic tracking-wide`}>
            {isCustomGame ? "Vez do Papai!" : `Nível Real ${currentLevelIndex + 1}`}
          </span>
        </div>
      </div>

      {/* Instruction */}
      <div className="mb-4 text-center animate-pop shrink-0 relative z-10">
        {showConfetti ? (
           <div className="bg-white/90 p-4 rounded-3xl shadow-xl border-4 border-yellow-300 transform -rotate-1">
             <h2 className="text-2xl md:text-3xl font-magic text-pink-600 leading-tight animate-bounce">
               {encouragement} <Heart className="inline w-6 h-6 fill-pink-500 text-pink-500"/>
             </h2>
           </div>
        ) : (
          <>
            <h2 className="text-2xl md:text-3xl font-magic text-white drop-shadow-md leading-tight">
              {isCustomGame ? "O que a Maria escondeu?" : "Atenção, Princesa!"}
            </h2>
            <p className="text-white/90 text-md font-bold mt-1 bg-purple-900/20 py-1 px-4 rounded-full inline-block backdrop-blur-sm">
              Encontre o intruso no quadro mágico:
            </p>
          </>
        )}
      </div>

      {/* Magic Mirror Grid */}
      <div className="relative p-3 bg-gradient-to-br from-yellow-200 via-yellow-100 to-yellow-300 rounded-[2rem] shadow-2xl shrink-0 mb-6">
          <div className="absolute inset-0 rounded-[2rem] border-4 border-yellow-400 opacity-50"></div>
          
          <div className={`grid ${getGridCols(level.gridSize)} gap-1 md:gap-2 w-full aspect-square max-w-[380px] transition-all duration-500 bg-white/40 rounded-[1.5rem] p-2`}>
            {gridItems.map((item) => {
              const isHidden = hiddenIndices.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    playSound.pop();
                    inputRef.current?.focus();
                  }}
                  className={`
                    relative flex items-center justify-center
                    rounded-xl shadow-sm transition-all select-none
                    ${isHidden ? 'bg-transparent shadow-none opacity-0 pointer-events-none' : 'bg-white/80 backdrop-blur cursor-pointer hover:bg-white hover:scale-110 hover:shadow-md'}
                    ${showConfetti && item.isTarget ? 'scale-125 ring-4 ring-yellow-400 z-20 bg-yellow-50 shadow-xl rotate-6' : ''}
                  `}
                  style={{
                    fontSize: `${Math.max(1, 4 - level.gridSize * 0.35)}rem`
                  }}
                >
                  {!isHidden && item.emoji}
                </div>
              );
            })}
          </div>
      </div>

      {/* Magical Controls */}
      <div className="w-full max-w-[400px] flex flex-col items-center gap-4 shrink-0 pb-8 animate-pop">
        
        {/* Scroll Input */}
        <div className={`
            w-full relative flex items-center bg-white rounded-full shadow-xl border-4 transition-all duration-300
            ${isError ? 'border-red-300 translate-x-[-5px]' : 'border-purple-200 focus-within:border-pink-300 focus-within:ring-4 focus-within:ring-pink-100'}
            ${isError ? 'animate-[shake_0.5s_ease-in-out]' : ''}
        `}>
            <div className="pl-4 text-pink-300">
                <Keyboard className="w-6 h-6" />
            </div>
            <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                className="w-full p-3 bg-transparent outline-none text-2xl text-center font-bold text-purple-700 placeholder:text-purple-300/70 placeholder:font-magic placeholder:text-xl"
                placeholder="Digite aqui..."
                autoComplete="off"
            />
            <div className="pr-4 text-pink-300">
                <Sparkles className="w-5 h-5 animate-spin-slow" />
            </div>
        </div>

        {/* Hints Button */}
        {!showConfetti && !isCustomGame && hintsUsed === 0 && (
          <button 
            onClick={useHint}
            className="flex items-center space-x-2 bg-gradient-to-r from-yellow-200 to-yellow-100 hover:from-yellow-300 hover:to-yellow-200 text-yellow-800 px-6 py-2 rounded-full font-bold text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-1 border-2 border-yellow-300"
          >
            <Lightbulb className="w-4 h-4" />
            <span>Ajuda Mágica do Papai!</span>
          </button>
        )}
        
        {/* Messages */}
        {isError && (
            <div className="bg-red-100 px-4 py-1 rounded-full text-center text-red-500 font-bold text-sm animate-pulse border border-red-200 shadow-sm">
                Não é esse, minha linda. Tente de novo!
            </div>
        )}
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};