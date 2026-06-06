export interface Recipe {
  recipeName: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  difficulty: "Easy" | "Medium" | "Hard";
  healthBenefits: string[];
  servingSize: string;
  category: string;
  chefsTip: string;
  isFavorite?: boolean;
}

export interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}
