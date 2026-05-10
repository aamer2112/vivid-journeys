import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Compass, MapPinned, HelpCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import travyLogo from "@/assets/travy-logo.png";

interface NavbarProps {
  onLogin: () => void;
}

export const Navbar = ({ onLogin }: NavbarProps) => {
  const { user, profile } = useAuth();
  const initials = (profile?.display_name || "?").slice(0, 2).toUpperCase();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="container">
        <div className="mt-4 glass rounded-2xl px-5 py-3 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 group">
            <img
              src={travyLogo}
              alt="Travy logo"
              className="h-10 w-10 object-contain drop-shadow-[0_4px_12px_rgba(255,107,107,0.45)] group-hover:scale-105 transition"
            />
            <span className="text-2xl font-bold tracking-tight text-white">Travy</span>
          </a>

          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <a href="#discover" className="px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition flex items-center gap-2">
              <Compass className="h-4 w-4" /> Discover
            </a>
            <a href="#trips" className="px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition flex items-center gap-2">
              <MapPinned className="h-4 w-4" /> My Trips
            </a>
            <a href="#help" className="px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition flex items-center gap-2">
              <HelpCircle className="h-4 w-4" /> Help
            </a>
          </nav>

          {user && profile ? (
            <button onClick={onLogin}
              className="flex items-center gap-2 glass rounded-xl px-2.5 py-1.5 hover:bg-white/15 transition">
              <Avatar className="h-7 w-7 bg-gradient-sunset">
                <AvatarFallback className="bg-transparent text-white text-xs font-bold">{initials}</AvatarFallback>
              </Avatar>
              <span className="text-white text-sm font-medium hidden sm:inline">{profile.display_name}</span>
            </button>
          ) : (
            <Button onClick={onLogin}
              className="bg-gradient-sunset hover:opacity-90 text-white border-0 shadow-glow rounded-xl font-semibold">
              Login / Sign Up
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
