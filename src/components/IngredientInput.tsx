import React, { useState } from "react";
import { Search, Loader2, Sparkles, Mic, MicOff } from "lucide-react";

interface IngredientInputProps {
  onGenerate: (ingredients: string) => void;
  isLoading: boolean;
}

export const IngredientInput: React.FC<IngredientInputProps> = ({ onGenerate, isLoading }) => {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) onGenerate(input);
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('speechRecognition' in window)) {
      setVoiceError("Voice recognition is not fully supported in this browser version. Please try modern Chrome!");
      setTimeout(() => setVoiceError(null), 4000);
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).speechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => (prev ? `${prev}, ${transcript}` : transcript));
    };

    recognition.start();
  };

  return (
    <div className="w-full" id="ingredient-generator">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative glass flex items-center p-1 rounded-2xl gap-2 focus-within:ring-2 ring-primary transition-all bg-white dark:bg-white/5 border-stone-200 dark:border-white/10">
          <div className="pl-4">
            <Search className="text-stone-400 w-6 h-6" />
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Chicken, garlic, onion, cream..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-lg py-4 placeholder:text-stone-400 outline-none"
            disabled={isLoading}
          />
          
          <button
            type="button"
            onClick={startVoiceInput}
            className={`p-3 rounded-xl transition-colors ${
              isListening ? "bg-red-100 text-red-500 animate-pulse" : "hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400"
            }`}
            title="Voice Input"
          >
            {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="btn-primary disabled:opacity-50 disabled:scale-100 flex items-center gap-2 whitespace-nowrap"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Cook it!</span>
              </>
            )}
          </button>
        </div>
      </form>
      {voiceError && (
        <div className="mt-3 p-3 bg-orange-500/10 dark:bg-orange-950/20 border border-orange-500/20 rounded-xl text-center text-xs font-semibold text-orange-600 dark:text-orange-400 animate-pulse">
          {voiceError}
        </div>
      )}
      <p className="text-center mt-4 text-stone-500 text-sm">
        Separate ingredients with commas for better results.
      </p>
    </div>
  );
};
