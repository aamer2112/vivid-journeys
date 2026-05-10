import { useEffect, useRef, useState } from "react";
import { HeroBackground } from "@/components/travy/HeroBackground";
import { Navbar } from "@/components/travy/Navbar";
import { AIPlanner } from "@/components/travy/AIPlanner";
import { FeaturedGems } from "@/components/travy/FeaturedGems";
import { CommunityReviews } from "@/components/travy/CommunityReviews";
import { TripDashboard } from "@/components/travy/TripDashboard";
import { MyTrips } from "@/components/travy/MyTrips";
import { AuthModal } from "@/components/travy/AuthModal";
import { ExperienceForm } from "@/components/travy/ExperienceForm";
import { GemForm } from "@/components/travy/GemForm";
import { HelpSupport } from "@/components/travy/HelpSupport";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ensureSeedTrip, SEED_PLAN } from "@/lib/seed-trip";
import travyLogo from "@/assets/travy-logo.png";

const Index = () => {
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [expOpen, setExpOpen] = useState(false);
  const [gemOpen, setGemOpen] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const tripRef = useRef<HTMLDivElement>(null);
  const plannerRef = useRef<HTMLDivElement>(null);

  // Seed Madeira trip on first login
  useEffect(() => {
    if (user) {
      ensureSeedTrip(user.id).then((trip) => {
        if (trip && !selectedTripId) setSelectedTripId(trip.id);
      });
    } else {
      setSelectedTripId(null);
    }
    // eslint-disable-next-line
  }, [user]);

  // If logged in but no trip selected, pick most recent
  useEffect(() => {
    if (user && !selectedTripId) {
      supabase.from("trips").select("id").eq("user_id", user.id)
        .order("created_at", { ascending: false }).limit(1)
        .then(({ data }) => { if (data?.[0]) setSelectedTripId(data[0].id); });
    }
  }, [user, selectedTripId, refreshKey]);

  const handleGenerated = (id: string) => {
    setSelectedTripId(id);
    setRefreshKey((k) => k + 1);
    setTimeout(() => tripRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 250);
  };

  const scrollToPlanner = () =>
    plannerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <>
      <HeroBackground />
      <Navbar onLogin={() => setAuthOpen(true)} />

      <main className="relative">
        <h1 className="sr-only">Travy — AI group travel planner with cashless split-pay and hidden local gems</h1>

        <section ref={plannerRef} className="min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6">
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
          <AIPlanner
            onGenerated={handleGenerated}
            onRequireAuth={() => setAuthOpen(true)}
          />
        </section>

        <div className="relative bg-gradient-to-b from-transparent via-background/85 to-background backdrop-blur-2xl">
          <FeaturedGems onSubmitGem={() => setGemOpen(true)} refreshKey={refreshKey} />
          <CommunityReviews onAddExperience={() => setExpOpen(true)} refreshKey={refreshKey} />

          <MyTrips
            selectedTripId={selectedTripId}
            onSelect={(id) => {
              setSelectedTripId(id || null);
              if (id) setTimeout(() => tripRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
            }}
            onPlanNew={scrollToPlanner}
            refreshKey={refreshKey}
          />

          <div ref={tripRef}>
            {selectedTripId ? (
              <TripDashboard
                key={selectedTripId}
                tripId={selectedTripId}
                onChanged={() => setRefreshKey((k) => k + 1)}
              />
            ) : (
              <TripDashboard demoPlan={SEED_PLAN} />
            )}
          </div>

          <footer className="container py-12 border-t border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <img
                  src={travyLogo}
                  alt="Travy logo"
                  className="h-8 w-8 object-contain"
                />
                <span className="text-white font-bold text-lg">Travy</span>
                <span className="text-white/50 text-sm hidden sm:inline">— Have a good time. Leave the planning to us.</span>
              </div>
              <p className="text-white/50 text-xs">© 2026 Travy. Investor preview.</p>
            </div>
          </footer>
        </div>
      </main>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
      <ExperienceForm open={expOpen} onOpenChange={setExpOpen}
        onSubmitted={() => setRefreshKey((k) => k + 1)} />
      <GemForm open={gemOpen} onOpenChange={setGemOpen}
        onSubmitted={() => setRefreshKey((k) => k + 1)} />
    </>
  );
};

export default Index;
