import { Recipe } from "../types";

const FAVORITES_KEY = "flavour_fusion_favorites";

export const getFavorites = (): Recipe[] => {
  const saved = localStorage.getItem(FAVORITES_KEY);
  return saved ? JSON.parse(saved) : [];
};

export const toggleFavorite = (recipe: Recipe): Recipe[] => {
  const favorites = getFavorites();
  const index = favorites.findIndex((r) => r.recipeName === recipe.recipeName);
  
  let newFavorites;
  if (index >= 0) {
    newFavorites = favorites.filter((_, i) => i !== index);
  } else {
    newFavorites = [...favorites, { ...recipe, isFavorite: true }];
  }
  
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  return newFavorites;
};

export const isFavorite = (recipeName: string): boolean => {
  const favorites = getFavorites();
  return favorites.some((r) => r.recipeName === recipeName);
};
