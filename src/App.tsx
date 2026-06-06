import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { IngredientInput } from "./components/IngredientInput";
import { RecipeCard } from "./components/RecipeCard";
import { ImageUpload } from "./components/ImageUpload";
import { Recipe } from "./types";
import { getFavorites } from "./utils/storage";
import { getHistory, addToHistory, clearHistory } from "./utils/history";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, AlertCircle, Trash2, ChevronLeft } from "lucide-react";

const HERO_IMAGE = "/src/assets/images/flavour_fusion_hero_1779211340135.png";

export default function App() {
  const [activePage, setActivePage] = useState("home");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Recipe[]>([]);
  const [motivation, setMotivation] = useState("");
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  const healthyRecipes = history.filter(r => 
    r.category.toLowerCase().includes('healthy') || 
    r.healthBenefits.some(b => b.toLowerCase().includes('healthy') || b.toLowerCase().includes('protein') || b.toLowerCase().includes('low'))
  ).length;
  const healthStreak = history.length > 0 ? Math.round((healthyRecipes / history.length) * 100) : 0;

  const motivations = [
    "Every great chef was once a beginner. Keep fusioning!",
    "The secret ingredient is always creativity (and maybe a little AI).",
    "Cooking is an art, but eating is a necessity. Make both beautiful.",
    "Your kitchen is your laboratory. Experiment fearlessly.",
    "Fusion is about finding harmony in the unexpected."
  ];

  useEffect(() => {
    setFavorites(getFavorites());
    setHistory(getHistory());
    setMotivation(motivations[Math.floor(Math.random() * motivations.length)]);
  }, [activePage]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning, Chef!";
    if (hour < 18) return "Good afternoon, Chef!";
    return "Good evening, Chef!";
  };

  const handleGenerateRecipe = async (ingredients: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      addToHistory(data);
      setHistory(getHistory());
      setRecipes([data, ...recipes]);
      setActivePage("results");
    } catch (err: any) {
      setError(err.message || "Failed to generate recipe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeImage = async (image: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      // Auto-trigger recipe generation with detected ingredients
      const ingredientsStr = data.detectedIngredients.join(", ");
      handleGenerateRecipe(ingredientsStr);
    } catch (err: any) {
      setError(err.message || "Failed to analyze image.");
      setIsLoading(false);
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case "home":
        return (
          <Hero 
            onStart={() => setActivePage("generate")} 
            imageUrl={HERO_IMAGE}
          />
        );
      case "generate":
        return (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-12 h-fit">
            {/* Header / Intro - Top Left */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="md:col-span-8 bento-card flex flex-col justify-center relative overflow-hidden"
            >
              <div className="absolute top-4 right-6 text-primary font-bold opacity-10 text-6xl italic select-none">"</div>
              <span className="text-primary font-bold text-sm mb-2 uppercase tracking-widest">{getGreeting()}</span>
              <h2 className="font-display text-4xl lg:text-5xl font-bold mb-4 tracking-tight">Recipe Fusion <span className="text-primary italic">Hub</span></h2>
              <p className="text-stone-500 dark:text-slate-400 max-w-xl leading-relaxed mb-6">
                Connect your ingredients to infinite culinary possibilities. Upload a photo or type what's in your pantry.
              </p>
              <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                 <p className="text-sm italic text-primary/80">"{motivation}"</p>
              </div>
            </motion.div>

            {/* Categories - Top Right */}
            <div className="md:col-span-4 grid grid-cols-2 gap-4">
              <div 
                onClick={() => handleGenerateRecipe("Healthy Breakfast ingredients")}
                className="bg-blue-500/10 border border-blue-500/20 rounded-3xl p-6 flex flex-col items-center justify-center group cursor-pointer hover:bg-blue-500/20 transition-all"
              >
                <span className="text-3xl mb-2 group-hover:scale-125 transition-transform">🍳</span>
                <span className="text-[10px] uppercase font-black tracking-widest text-blue-500">Breakfast</span>
              </div>
              <div 
                onClick={() => handleGenerateRecipe("Low calorie healthy ingredients")}
                className="bg-green-500/10 border border-green-500/20 rounded-3xl p-6 flex flex-col items-center justify-center group cursor-pointer hover:bg-green-500/20 transition-all"
              >
                <span className="text-3xl mb-2 group-hover:scale-125 transition-transform">🥗</span>
                <span className="text-[10px] uppercase font-black tracking-widest text-green-500">Healthy</span>
              </div>
              <div 
                onClick={() => handleGenerateRecipe("Sweet dessert ingredients and fruits")}
                className="bg-purple-500/10 border border-purple-500/20 rounded-3xl p-6 flex flex-col items-center justify-center group cursor-pointer hover:bg-purple-500/20 transition-all"
              >
                <span className="text-3xl mb-2 group-hover:scale-125 transition-transform">🧁</span>
                <span className="text-[10px] uppercase font-black tracking-widest text-purple-500">Dessert</span>
              </div>
              <div 
                onClick={() => handleGenerateRecipe("Delicious dinner ingredients")}
                className="bg-orange-500/10 border border-orange-500/20 rounded-3xl p-6 flex flex-col items-center justify-center group cursor-pointer hover:bg-orange-500/20 transition-all"
              >
                <span className="text-3xl mb-2 group-hover:scale-125 transition-transform">🍱</span>
                <span className="text-[10px] uppercase font-black tracking-widest text-orange-500">Dinner</span>
              </div>
            </div>

            {/* Main Input - Mid Left */}
            <div className="md:col-span-7">
               <IngredientInput onGenerate={handleGenerateRecipe} isLoading={isLoading} />
            </div>

            {/* Analysis Stats - Mid Right */}
            <div className="md:col-span-5 bento-card bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border-emerald-500/20 flex flex-col justify-between overflow-hidden">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-emerald-500 font-bold text-sm tracking-widest uppercase">Wellness Index</h3>
                  <span className="text-2xl font-black text-emerald-500">{healthStreak}%</span>
               </div>
               <p className="text-xs text-stone-500 dark:text-slate-400 mb-6">
                 {history.length > 0 
                   ? `Based on your last ${history.length} fusions, you're leaning towards ${healthStreak > 50 ? 'nutrient-dense' : 'balanced'} choices.`
                   : "Generate your first recipe to start tracking your culinary health profile."}
               </p>
               <div className="flex items-end gap-1 h-12">
                  {history.length > 0 ? history.slice(0, 7).map((r, i) => (
                    <div 
                      key={i} 
                      className={`flex-1 rounded-t-sm ${r.category.toLowerCase().includes('healthy') ? 'bg-emerald-500' : 'bg-emerald-500/30'}`}
                      style={{ height: r.category.toLowerCase().includes('healthy') ? '100%' : '40%' }} 
                    />
                  )) : [40, 40, 40, 40, 40, 40, 40].map((h, i) => (
                    <div key={i} className="flex-1 bg-stone-200 dark:bg-white/5 rounded-t-sm" style={{ height: `${h}%` }} />
                  ))}
               </div>
            </div>

            {/* Recently Fusioned - History Option */}
            {history.length > 0 && (
              <div className="md:col-span-12">
                <div className="flex justify-between items-center mb-4 px-2">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400">Recently Fusioned</h3>
                  {isConfirmingClear ? (
                    <div className="flex items-center gap-2 bg-red-500/10 dark:bg-red-500/5 px-3 py-1.5 rounded-xl border border-red-500/20">
                      <span className="text-[10px] uppercase font-bold text-red-500">Really clear history?</span>
                      <button 
                        onClick={() => {
                          clearHistory();
                          setHistory([]);
                          setIsConfirmingClear(false);
                        }}
                        className="text-[10px] uppercase font-black text-red-600 dark:text-red-400 hover:underline px-1"
                      >
                        Yes
                      </button>
                      <span className="text-[10px] text-stone-400">/</span>
                      <button 
                        onClick={() => setIsConfirmingClear(false)}
                        className="text-[10px] uppercase font-bold text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setIsConfirmingClear(true)}
                      className="text-[10px] uppercase font-bold text-stone-400 hover:text-red-500 transition-colors"
                    >
                      Clear History
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {history.slice(0, 3).map((item, idx) => (
                    <div 
                      key={idx}
                      onClick={() => {
                        setRecipes([item]);
                        setActivePage("results");
                      }}
                      className="bento-card !p-4 flex items-center gap-4 cursor-pointer hover:scale-[1.02] transition-transform bg-white dark:bg-white/5 border-stone-200 dark:border-white/10"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {item.recipeName[0]}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="font-bold text-sm truncate">{item.recipeName}</h4>
                        <p className="text-[10px] text-stone-500 uppercase tracking-tighter">{item.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Photo Upload - Bottom */}
            <div className="md:col-span-12">
               <ImageUpload onAnalyze={handleAnalyzeImage} isLoading={isLoading} />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="md:col-span-12"
              >
                {error.toLowerCase().includes("api key") || error.toLowerCase().includes("gemini_api_key") ? (
                  <div className="bento-card bg-orange-500/5 dark:bg-orange-950/10 border-orange-500/30 p-8 flex flex-col md:flex-row gap-6 items-start text-left">
                    <div className="p-4 bg-orange-500/10 rounded-2xl text-orange-500 text-3xl">🔑</div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="font-display font-bold text-xl text-stone-900 dark:text-slate-100">Setup your Gemini API Key</h3>
                        <p className="text-sm text-stone-500 dark:text-slate-400 mt-1">
                          Flavour Fusion uses the powerful Gemini Flash model to analyze your pantry screenshots and craft gourmet recipes. Follow these simple steps to activate it:
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="p-3 bg-stone-100 dark:bg-white/5 rounded-xl border border-stone-200/50 dark:border-white/5">
                          <span className="font-bold text-primary block mb-1">Step 1: Obtain your key</span>
                          Get a free, fast API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">Google AI Studio</a>.
                        </div>
                        <div className="p-3 bg-stone-100 dark:bg-white/5 rounded-xl border border-stone-200/50 dark:border-white/5">
                          <span className="font-bold text-primary block mb-1">Step 2: Create a .env file</span>
                          Create a file named <code className="px-1.5 py-0.5 bg-black/10 dark:bg-white/10 rounded font-mono">.env</code> in your project root directory.
                        </div>
                        <div className="p-3 bg-stone-100 dark:bg-white/5 rounded-xl border border-stone-200/50 dark:border-white/5">
                          <span className="font-bold text-primary block mb-1">Step 3: Define variable</span>
                          Add the line: <code className="px-1.5 py-0.5 bg-black/10 dark:bg-white/10 rounded font-mono">GEMINI_API_KEY=your_actual_key</code> and save.
                        </div>
                        <div className="p-3 bg-stone-100 dark:bg-white/5 rounded-xl border border-stone-200/50 dark:border-white/5">
                          <span className="font-bold text-primary block mb-1">Step 4: Restart Server</span>
                          Restart your VS Code terminal process and refresh your browser tab!
                        </div>
                      </div>
                      <div className="pt-2 flex flex-wrap gap-3">
                        <a 
                          href="https://aistudio.google.com/app/apikey" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-md hover:bg-orange-600 transition-colors inline-block"
                        >
                          Get Free API Key
                        </a>
                        <button 
                          onClick={() => setError(null)}
                          className="px-5 py-2.5 bg-stone-100 dark:bg-white/5 hover:bg-stone-200 dark:hover:bg-white/10 text-stone-600 dark:text-stone-300 text-xs font-bold rounded-xl transition-all font-sans"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-red-500/10 text-red-500 rounded-3xl flex items-center gap-4 border border-red-500/20 text-left">
                    <AlertCircle className="w-6 h-6 shrink-0" />
                    <div className="flex-1 text-sm font-semibold">{error}</div>
                    <button 
                      onClick={() => setError(null)}
                      className="text-xs uppercase tracking-wider font-bold text-stone-400 hover:text-stone-600 transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        );
      case "results":
        return (
          <div className="flex flex-col gap-8 pb-20">
             <div className="bento-card flex items-center justify-between border-stone-200 dark:border-white/10">
               <div>
                  <h2 className="font-display text-4xl font-bold tracking-tight">Fusion <span className="text-primary italic">Results</span></h2>
                  <p className="text-stone-500 text-sm mt-1">Gourmet creations balanced for your lifestyle.</p>
               </div>
               <button 
                onClick={() => setActivePage("generate")}
                className="flex items-center gap-2 px-6 py-3 bg-stone-100 dark:bg-white/5 hover:bg-stone-200 dark:hover:bg-white/10 transition-all rounded-xl font-bold text-sm"
               >
                 <ChevronLeft className="w-5 h-5" />
                 Explore More
               </button>
             </div>
             
             {isLoading ? (
               <div className="flex flex-col items-center justify-center py-20 gap-4">
                 <Loader2 className="w-12 h-12 text-primary animate-spin" />
                 <p className="font-display text-2xl animate-pulse">Our AI Chef is preparing your masterpiece...</p>
               </div>
             ) : (
               <div className="space-y-12">
                 {recipes.map((recipe, i) => (
                   <RecipeCard key={i} recipe={recipe} onRefresh={() => setFavorites(getFavorites())} />
                 ))}
               </div>
             )}
          </div>
        );
      case "favorites":
        return (
          <div className="flex flex-col gap-8 pb-20">
            <div className="bento-card border-primary/20 bg-primary/5">
               <h2 className="font-display text-5xl font-bold tracking-tight mb-2">My <span className="text-primary italic">Treasures</span></h2>
               <p className="text-stone-500 dark:text-slate-400">Your hand-picked collection of AI-powered gastronomic hits.</p>
            </div>
            {favorites.length === 0 ? (
              <div className="text-center py-20 text-stone-400">
                <Trash2 className="w-16 h-16 mx-auto mb-4 opacity-10" />
                <p className="text-xl">Your cookbook is empty. Start generating recipes!</p>
              </div>
            ) : (
              <div className="space-y-12">
                {favorites.map((recipe, i) => (
                  <RecipeCard key={i} recipe={recipe} onRefresh={() => setFavorites(getFavorites())} />
                ))}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen dark:bg-bg-dark">
      <Navbar onNavigate={setActivePage} activePage={activePage} />
      
      <main className="flex-1 overflow-x-hidden p-6 lg:p-10 mb-20 lg:mb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="max-w-[1400px] mx-auto h-full"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modern thin border on the right for extra flair */}
      <div className="hidden xl:block w-px bg-white/5 h-screen sticky top-0" />
    </div>
  );
}
