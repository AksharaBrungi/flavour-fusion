import React from "react";
import { motion } from "motion/react";
import { Clock, Flame, BarChart3, Heart, Share2, Printer, Info } from "lucide-react";
import { Recipe } from "../types";
import { toggleFavorite, isFavorite } from "../utils/storage";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface RecipeCardProps {
  recipe: Recipe;
  onRefresh?: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onRefresh }) => {
  const [favorite, setFavorite] = React.useState(isFavorite(recipe.recipeName));

  const handleToggleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(recipe);
    setFavorite(!favorite);
    if (onRefresh) onRefresh();
  };

  const handlePrint = () => {
    window.print();
  };

  const macroData = [
    { name: "Protein", value: recipe.macros.protein, color: "#10b981" },
    { name: "Carbs", value: recipe.macros.carbs, color: "#f97316" },
    { name: "Fat", value: recipe.macros.fat, color: "#ef4444" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bento-card overflow-hidden group mb-12 bg-white dark:bg-white/[0.02] border-stone-200 dark:border-white/10"
      id={`recipe-${recipe.recipeName.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-1 block">
              {recipe.category} • {recipe.difficulty}
            </span>
            <h3 className="font-display text-3xl font-bold leading-tight">{recipe.recipeName}</h3>
          </div>
          <div className="flex gap-2">
             <button
              onClick={handlePrint}
              className="p-3 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-500"
              title="Print Recipe"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={handleToggleFav}
              className={`p-3 rounded-full transition-all ${
                favorite ? "bg-red-50 text-red-500" : "hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500"
              }`}
            >
              <Heart className={`w-6 h-6 ${favorite ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2">
            <div className="flex flex-wrap gap-6 mb-8 text-stone-500 dark:text-stone-400">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{recipe.cookingTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="text-sm font-medium">{recipe.calories} kcal</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium">{recipe.servingSize}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-lg mb-4 flex items-center gap-2 text-stone-800 dark:text-stone-200">
                  <span className="w-2 h-2 bg-primary rounded-full" />
                  Ingredients
                </h4>
                <ul className="space-y-3">
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-start gap-2 text-stone-600 dark:text-stone-300 text-sm">
                      <span className="mt-1.5 w-1.5 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full flex-shrink-0" />
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-4 flex items-center gap-2 text-stone-800 dark:text-stone-200">
                  <span className="w-2 h-2 bg-accent rounded-full" />
                  Instructions
                </h4>
                <ol className="space-y-4">
                  {recipe.instructions.map((step, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="font-display font-bold text-2xl text-stone-200 dark:text-stone-800 leading-none">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          <div className="bg-stone-50 dark:bg-stone-900/50 rounded-3xl p-6 border border-stone-100 dark:border-stone-800">
            <h4 className="font-semibold text-sm mb-6 text-stone-500 uppercase tracking-widest flex items-center gap-2">
              <Info className="w-4 h-4" />
              Nutritional Balance
            </h4>
            
            <div className="h-48 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {macroData.map((macro) => (
                <div key={macro.name} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: macro.color }} />
                    <span className="text-stone-600 dark:text-stone-400">{macro.name}</span>
                  </div>
                  <span className="font-bold">{macro.value}g</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-stone-100 dark:border-stone-800">
          <div className="bg-primary/5 rounded-2xl p-6 mb-8 border border-primary/10 relative">
             <div className="absolute -top-3 left-6 px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-lg">Chef's Secret</div>
             <p className="text-stone-600 dark:text-stone-300 italic text-sm leading-relaxed">
               "{recipe.chefsTip || (recipe as any).chefSecret || (recipe as any).chefsSecret || "To unlock maximum flavour, pair this masterpiece with fresh aromatic herbs and let it rest for 2 minutes before serving!"}"
             </p>
          </div>

          <h4 className="font-semibold text-sm mb-4 text-stone-400 uppercase tracking-widest leading-none">Health Benefits</h4>
          <div className="flex flex-wrap gap-2">
            {recipe.healthBenefits.map((benefit, i) => (
              <span key={i} className="px-4 py-1.5 bg-accent/10 text-accent rounded-full text-xs font-semibold">
                {benefit}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
