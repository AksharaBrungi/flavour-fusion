import React from "react";
import { UtensilsCrossed, Heart, Home } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface NavbarProps {
  onNavigate: (page: string) => void;
  activePage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activePage }) => {
  const [showPremiumMessage, setShowPremiumMessage] = React.useState(false);
  
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "generate", label: "Explore", icon: UtensilsCrossed },
    { id: "favorites", label: "Treasures", icon: Heart },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col gap-8 p-8 h-screen sticky top-0 border-r border-stone-200 dark:border-white/5 bg-white/50 dark:bg-bg-dark/50 backdrop-blur-xl">
        <div 
          className="flex items-center gap-3 px-2 cursor-pointer group" 
          onClick={() => onNavigate("home")}
          id="sidebar-logo"
        >
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
            <UtensilsCrossed className="text-white w-7 h-7" />
          </div>
          <h1 className="text-2xl font-display font-bold tracking-tight">Flavour Fusion</h1>
        </div>
        
        <nav className="flex flex-col gap-2 flex-grow">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`nav-link ${activePage === item.id ? "nav-link-active" : "hover:bg-primary/5 dark:hover:bg-white/5"}`}
            >
              <item.icon className={`w-5 h-5 ${activePage === item.id ? "text-primary" : ""}`} />
              <span className="font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 dark:border-white/10 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-1 transition-transform group-hover:scale-125">
             <UtensilsCrossed className="w-12 h-12 text-primary/10" />
          </div>
          <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-2">Exclusive Access</p>
          {showPremiumMessage ? (
            <div className="text-center py-2 animate-pulse">
              <p className="text-xs font-bold text-emerald-500">Curating 1,000+ recipes!</p>
              <p className="text-[10px] text-stone-500 dark:text-slate-400 mt-1 mb-2">Available soon, Chef!</p>
              <button 
                onClick={() => setShowPremiumMessage(false)}
                className="px-3 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 rounded text-[10px] uppercase font-bold"
              >
                Reset
              </button>
            </div>
          ) : (
            <>
              <p className="text-xs text-stone-500 dark:text-slate-400 mb-4 leading-relaxed">Join our inner circle for 1,000+ hand-crafted fusions.</p>
              <button 
                onClick={() => setShowPremiumMessage(true)}
                className="w-full py-3 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:bg-orange-600 transition-colors"
              >
                Go Premium
              </button>
            </>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-white/5">
           <ThemeToggle />
           <div className="text-[10px] text-stone-400 font-medium uppercase tracking-tighter">Your AI Sou-Chef</div>
        </div>
      </aside>

      {/* Mobile Nav Bar */}
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 z-50 glass px-4 py-3 flex items-center justify-between rounded-2xl border border-white/20 dark:border-white/10">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`p-3 rounded-xl transition-all ${
              activePage === item.id 
                ? "bg-primary text-white shadow-lg shadow-primary/30" 
                : "text-stone-500 dark:text-slate-400"
            }`}
          >
            <item.icon className="w-6 h-6" />
          </button>
        ))}
        <ThemeToggle />
      </nav>
    </>
  );
};
