import { useRef, useState } from "react";
import { HeroBackground } from "@/components/travy/HeroBackground";
import { Navbar } from "@/components/travy/Navbar";
import { AIPlanner } from "@/components/travy/AIPlanner";
import { FeaturedGems } from "@/components/travy/FeaturedGems";
import { CommunityReviews } from "@/components/travy/CommunityReviews";
import { TripDashboard } from "@/components/travy/TripDashboard";
import { AuthModal } from "@/components/travy/AuthModal";
import { Sparkles } from "lucide-react";

const Index = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const tripRef = useRef<HTMLElement>(null);

  const scrollToTrip = () => {
    setTimeout(() => tripRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
  };

  return (
    <>
      <HeroBackground />
      <Navbar onLogin={() => setAuthOpen(true)} />

      <main className="relative">
        {/* SEO */}
        <h1 className="sr-only">Travy — AI group travel planner with cashless split-pay and hidden local gems</h1>

        {/* Hero */}
        <section className="min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6">
          <div className="text-center mb-10 max-w-3xl animate-fade-in">
            <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-white/90 mb-6 font-medium">
              <Sparkles className="h-3 w-3 text-sunset-gold" />
              The Super App for Group Travel
            </span>
            <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.05]">
              Have a good time.<br />
              <span className="text-gradient-sunset">Leave the planning to us.</span>
            </h2>
            <p className="text-white/80 mt-5 text-base md:text-lg max-w-xl mx-auto">
              AI-crafted itineraries, hidden local gems, and cashless group splitting — all in one place.
            </p>
          </div>
          <AIPlanner onGenerate={scrollToTrip} />
        </section>

        {/* Background panel for sections below the fold */}
        <div className="relative bg-gradient-to-b from-transparent via-background/85 to-background backdrop-blur-2xl">
          <FeaturedGems />
          <CommunityReviews />
          <TripDashboard ref={tripRef} />

          <footer className="container py-12 border-t border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-sunset grid place-items-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="text-white font-bold text-lg">Travy</span>
                <span className="text-white/50 text-sm hidden sm:inline">— Have a good time. Leave the planning to us.</span>
              </div>
              <p className="text-white/50 text-xs">© 2026 Travy. Investor preview.</p>
            </div>
          </footer>
        </div>
      </main>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
};

export default Index;
