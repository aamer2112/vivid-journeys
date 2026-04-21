import { Button } from "@/components/ui/button";
import { Compass, MapPinned, Sparkles } from "lucide-react";

interface NavbarProps {
  onLogin: () => void;
}

export const Navbar = ({ onLogin }: NavbarProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="container">
        <div className="mt-4 glass rounded-2xl px-5 py-3 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-sunset grid place-items-center shadow-glow">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              Travy
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <a href="#discover" className="px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition flex items-center gap-2">
              <Compass className="h-4 w-4" /> Discover
            </a>
            <a href="#trips" className="px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition flex items-center gap-2">
              <MapPinned className="h-4 w-4" /> My Trips
            </a>
          </nav>

          <Button
            onClick={onLogin}
            className="bg-gradient-sunset hover:opacity-90 text-white border-0 shadow-glow rounded-xl font-semibold"
          >
            Login / Sign Up
          </Button>
        </div>
      </div>
    </header>
  );
};
