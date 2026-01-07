import React, { useEffect } from 'react';
import { GameStats } from '../types';
import { Home, RefreshCcw, Heart, Crown, Star } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { playSound } from '../utils/sound';

interface GameOverProps {
  stats: GameStats;
  onRestart: () => void;
  onHome: () => void;
}

// IMPORTANT: Requires maria.jpg in public folder
const DOLL_IMG = "./maria.jpg";
const FALLBACK_DOLL_IMG = "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=2075&auto=format&fit=crop";

export const GameOver: React.FC<GameOverProps> = ({ stats, onRestart, onHome }) => {
  const data = stats.history.map((h, i) => ({
    name: `Nível ${h.level}`,
    tempo: h.timeTaken,
  }));

  useEffect(() => {
    playSound.win();
  }, []);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = FALLBACK_DOLL_IMG;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-6 bg-white/90 backdrop-blur-md rounded-[2rem] shadow-2xl animate-pop relative overflow-hidden border-4 border-yellow-200">
      
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
         <Heart className="absolute top-10 left-10 w-20 h-20 text-pink-500 animate-float" />
         <Star className="absolute top-40 right-10 w-16 h-16 text-yellow-400 animate-spin-slow" />
         <Heart className="absolute bottom-10 right-10 w-32 h-32 text-purple-500 animate-pulse" />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full">
        
        {/* Crown Icon */}
        <div className="absolute -top-12 animate-bounce-slow">
            <Crown className="w-20 h-20 text-yellow-500 fill-yellow-400 drop-shadow-lg" />
        </div>

        {/* Profile Picture Frame */}
        <div className="w-40 h-40 mt-8 rounded-full border-4 border-yellow-400 shadow-xl overflow-hidden mb-4 animate-float bg-white">
            <img 
                src={DOLL_IMG} 
                onError={handleImageError}
                alt="Princesa Maria" 
                className="w-full h-full object-cover" 
            />
        </div>

        <h2 className="text-4xl md:text-5xl font-magic text-purple-600 text-center leading-tight drop-shadow-sm">
          Parabéns, Princesa!
        </h2>
        
        <div className="mt-4 mb-6 bg-pink-50 p-4 rounded-xl border border-pink-100 shadow-inner w-full text-center">
            <p className="text-slate-600 font-bold text-lg">
              Você completou todos os desafios! <br/>
              <span className="text-pink-500 font-magic text-xl">O Papai te ama muito! ❤️</span>
            </p>
        </div>

        <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-2xl w-full mb-6 flex justify-around items-center border border-white shadow-md">
          <div className="text-center">
            <p className="text-xs text-purple-500 font-bold uppercase tracking-wider">Pontos Reais</p>
            <p className="text-4xl font-black text-purple-600 font-magic">{stats.score}</p>
          </div>
          <div className="w-px h-10 bg-purple-300/50"></div>
          <div className="text-center">
            <p className="text-xs text-pink-500 font-bold uppercase tracking-wider">Desafios</p>
            <p className="text-4xl font-black text-pink-500 font-magic">{stats.level - 1}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="w-full h-32 mb-6">
          <p className="text-xs text-slate-400 font-bold uppercase mb-2 text-center">Sua Velocidade Mágica</p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                cursor={{ fill: 'transparent' }}
              />
              <Bar dataKey="tempo" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#F472B6' : '#A78BFA'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col w-full space-y-3">
          <button 
            onClick={() => { playSound.pop(); onRestart(); }}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-xl rounded-2xl shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center space-x-2 border-b-4 border-purple-700 active:border-b-0 active:translate-y-1"
          >
            <RefreshCcw className="w-6 h-6" />
            <span className="font-magic">Brincar de novo</span>
          </button>
          <button 
            onClick={() => { playSound.pop(); onHome(); }}
            className="w-full py-3 bg-white border-2 border-purple-100 text-purple-400 font-bold text-lg rounded-2xl hover:bg-purple-50 transition-colors flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Menu Real</span>
          </button>
        </div>
      </div>
    </div>
  );
};