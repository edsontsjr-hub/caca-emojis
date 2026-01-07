import React, { useState } from 'react';
import { ArrowLeft, Play, Star } from 'lucide-react';
import { LevelData } from '../types';
import { playSound } from '../utils/sound';

interface CreateModeProps {
  onStartCustomGame: (level: LevelData) => void;
  onBack: () => void;
}

const COMMON_EMOJIS = [
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
  '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆',
  '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒',
  '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🎱', '🏓',
  '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐',
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
  '🦄', '🦋', '🐞', '🌸', '🏵️', '🌹', '🌺', '🌻', '🌼', '🌷',
  '👑', '💍', '💎', '💄', '🎀', '👗', '🧚', '🧜', '🧞', '🏰'
];

export const CreateMode: React.FC<CreateModeProps> = ({ onStartCustomGame, onBack }) => {
  const [baseEmoji, setBaseEmoji] = useState<string>('🐶');
  const [targetEmoji, setTargetEmoji] = useState<string>('🐱');
  const [gridSize, setGridSize] = useState<number>(4);

  const handleSubmit = () => {
    playSound.win(); 
    onStartCustomGame({
      id: 999,
      baseEmoji,
      targetEmoji,
      difficulty: 'medium', 
      gridSize
    });
  };

  const setEmoji = (emoji: string) => {
    playSound.pop();
    setTargetEmoji(emoji);
  }

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto p-6 bg-white/90 backdrop-blur-md rounded-[2rem] shadow-2xl border-4 border-white">
      <div className="flex w-full justify-between items-center mb-6">
        <button onClick={() => { playSound.pop(); onBack(); }} className="p-2 bg-pink-100 rounded-full hover:bg-pink-200 text-pink-600 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-magic text-purple-600 drop-shadow-sm">Criar Desafio</h2>
        <div className="w-10" /> 
      </div>

      <div className="w-full space-y-6">
        
        {/* Base Emoji */}
        <div className="bg-pink-50 p-4 rounded-2xl border border-pink-100">
          <label className="block text-sm font-bold text-pink-500 mb-2 uppercase tracking-wide flex items-center gap-2">
            1. O que vai ter bastante? <Star className="w-4 h-4 fill-pink-300 text-pink-300"/>
          </label>
          <div className="flex items-center space-x-4">
             <div className="text-5xl bg-white p-4 rounded-xl shadow-md border-2 border-pink-100 min-w-[90px] text-center transform hover:scale-110 transition-transform cursor-default">
               {baseEmoji}
             </div>
             <input 
               type="text" 
               className="flex-1 p-4 rounded-xl border-2 border-pink-200 focus:border-purple-400 outline-none text-slate-600 font-bold bg-white"
               placeholder="Emoji Comum"
               value={baseEmoji}
               onChange={(e) => setBaseEmoji(e.target.value)}
               maxLength={2}
             />
          </div>
        </div>

        {/* Target Emoji */}
        <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
          <label className="block text-sm font-bold text-purple-500 mb-2 uppercase tracking-wide flex items-center gap-2">
            2. O que o Papai tem que achar? <Star className="w-4 h-4 fill-purple-300 text-purple-300"/>
          </label>
          <div className="flex items-center space-x-4">
             <div className="text-5xl bg-white p-4 rounded-xl shadow-md border-2 border-purple-100 min-w-[90px] text-center transform hover:scale-110 transition-transform cursor-default">
               {targetEmoji}
             </div>
             <input 
               type="text" 
               className="flex-1 p-4 rounded-xl border-2 border-purple-200 focus:border-purple-400 outline-none text-slate-600 font-bold bg-white"
               placeholder="Emoji Secreto"
               value={targetEmoji}
               onChange={(e) => setTargetEmoji(e.target.value)}
               maxLength={2}
             />
          </div>
        </div>

        {/* Grid Size */}
        <div>
           <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wide text-center">
            3. Quão difícil vai ser pro Papai?
          </label>
          <input 
            type="range" 
            min="3" 
            max="7" 
            value={gridSize} 
            onChange={(e) => setGridSize(parseInt(e.target.value))}
            className="w-full h-4 bg-slate-200 rounded-full appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex justify-between text-xs text-purple-400 font-bold mt-2 px-2">
            <span>Fácil</span>
            <span>Médio</span>
            <span>Difícil</span>
          </div>
        </div>

        {/* Quick Select Grid */}
        <div className="pt-2">
          <p className="text-xs font-bold text-slate-400 mb-2 uppercase text-center">Escolha Rápida para a Princesa</p>
          <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto p-3 bg-slate-50 rounded-xl border-inner shadow-inner">
            {COMMON_EMOJIS.map(emoji => (
              <button 
                key={emoji}
                onClick={() => setEmoji(emoji)}
                className="text-2xl p-1 hover:bg-white hover:shadow-md hover:scale-125 rounded transition-all cursor-pointer"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          className="w-full py-4 bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600 text-white font-bold text-xl rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center space-x-2 border-b-4 border-indigo-700 active:border-b-0 active:translate-y-1"
        >
          <Play fill="currentColor" />
          <span className="font-magic">DESAFIAR O PAPAI!</span>
        </button>

      </div>
    </div>
  );
};