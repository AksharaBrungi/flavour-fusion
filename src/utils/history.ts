import { Recipe } from "../types";

const HISTORY_KEY = "flavour_fusion_history";
const MAX_HISTORY = 10;

export const addToHistory = (recipe: Recipe) => {
  const history = getHistory();
  // Avoid duplicates based on recipe name
  const filteredHistory = history.filter(h => h.recipeName !== recipe.recipeName);
  const newHistory = [recipe, ...filteredHistory].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
};

export const getHistory = (): Recipe[] => {
  const history = localStorage.getItem(HISTORY_KEY);
  return history ? JSON.parse(history) : [];
};

export const clearHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
};
