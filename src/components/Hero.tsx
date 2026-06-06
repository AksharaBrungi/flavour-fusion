import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Sparkles, Wand2 } from "lucide-react";

interface HeroProps {
  onStart: () => void;
  imageUrl: string;
}

export const Hero: React.FC<HeroProps> = ({ onStart, imageUrl }) => {
  return (
    <div className="relative min-h-[80vh] flex items-center" id="hero">
      <div className="grid lg:grid-cols-12 gap-8 w-full">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7 flex flex-col justify-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-xs mb-6 uppercase tracking-widest border border-primary/20">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Fusion</span>
          </div>
          <h1 className="font-display text-7xl lg:text-9xl font-bold leading-[0.85] tracking-tighter mb-8 bg-gradient-to-br from-stone-900 to-stone-600 dark:from-white dark:to-slate-500 bg-clip-text text-transparent">
            Fuel Your <span className="text-primary italic">Creative</span> Soul.
          </h1>
          <p className="text-lg text-stone-500 dark:text-slate-400 mb-10 max-w-lg leading-relaxed font-medium">
            Stop asking "what's for dinner?" Just enter your ingredients, and let our AI chef fuse them into gourmet masterpieces instantly.
          </p>
          <div className="flex flex-wrap gap-4">
            <button onClick={onStart} className="btn-primary flex items-center gap-3 px-10 py-5 text-lg group">
              Start Cooking <Wand2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="lg:col-span-5 relative"
        >
          <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full mix-blend-overlay" />
          <div className="relative rounded-[48px] overflow-hidden shadow-2xl border border-white/10 aspect-[4/5] group">
            <img 
              src={imageUrl} 
              alt="Delicious Food" 
              className="w-full h-full object-cover transform scale-110 group-hover:scale-125 transition-transform duration-1000" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
            <div className="absolute bottom-10 left-10 right-10">
               <h3 className="text-3xl font-display font-bold text-white tracking-tight">Fusion Food of the Week</h3>
               <p className="text-white/60 text-sm mt-2">Discover how AI is redefining home cooking with our curated ingredients.</p>
            </div>
          </div>
          
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-8 -left-8 glass p-6 rounded-3xl shadow-2xl max-w-[220px] border border-white/20 dark:bg-slate-900/80 backdrop-blur-2xl"
          >
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white font-black shadow-lg shadow-primary/20">FF</div>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Chef Active</span>
            </div>
            <p className="text-sm font-bold leading-snug">Chef Fusion is online and ready to assist.</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
