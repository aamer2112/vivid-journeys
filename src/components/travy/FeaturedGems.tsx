import kayak from "@/assets/gem-kayak.jpg";
import tapas from "@/assets/gem-tapas.jpg";
import springs from "@/assets/gem-springs.jpg";
import bonfire from "@/assets/gem-bonfire.jpg";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const seedGems = [
  { id: "seed-1", img: kayak, title: "Secret Kayak Cove", location: "Madeira, Portugal", rating: 4.9, price: "€35", sponsor: "Madeira Adventures" },
  { id: "seed-2", img: tapas, title: "Sunset Tapas Rooftop", location: "Cusco, Peru", rating: 4.8, price: "€22", sponsor: "Casa del Sol" },
  { id: "seed-3", img: springs, title: "Hidden Mossy Hot Springs", location: "Reykjadalur, Iceland", rating: 5.0, price: "Free", sponsor: "Local Guide Co." },
  { id: "seed-4", img: bonfire, title: "Beach Bonfire Night", location: "Algarve, Portugal", rating: 4.7, price: "€18", sponsor: "Coastal Vibes" },
];

const FALLBACK_IMG = "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80";

interface Props {
  onSubmitGem: () => void;
  refreshKey: number;
}

export const FeaturedGems = ({ onSubmitGem, refreshKey }: Props) => {
  const { profile } = useAuth();
  const [submitted, setSubmitted] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("gem_submissions")
      .select("id,title,location,price_from,image_url,description,category")
      .eq("status", "featured")
      .order("created_at", { ascending: false })
      .then(({ data }) => setSubmitted(data ?? []));
  }, [refreshKey]);

  const allGems = [
    ...submitted.map((g) => ({
      id: g.id,
      img: g.image_url || FALLBACK_IMG,
      title: g.title,
      location: g.location,
      rating: 4.9,
      price: g.price_from || "—",
      sponsor: g.category,
      isNew: true,
    })),
    ...seedGems.map((g) => ({ ...g, isNew: false })),
  ];

  return (
    <section id="discover" className="relative py-20">
      <div className="container">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-md mb-3">
              ✨ Sponsored by local businesses
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
              Featured <span className="text-gradient-sunset">Hidden Gems</span>
            </h2>
            <p className="text-white/70 mt-2 max-w-xl">
              Hand-picked, off-the-beaten-path experiences from verified locals.
            </p>
          </div>
          {profile?.role === "business" && (
            <Button onClick={onSubmitGem} className="bg-gradient-sunset border-0 rounded-xl shadow-glow">
              <Plus className="h-4 w-4 mr-1" /> Submit a Gem
            </Button>
          )}
        </div>

        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 snap-x snap-mandatory">
          {allGems.map((g) => (
            <article
              key={g.id}
              className="group relative w-[280px] sm:w-[320px] shrink-0 snap-start rounded-3xl overflow-hidden glass-strong hover:scale-[1.02] transition-transform duration-500"
            >
              <div className="relative h-[380px] overflow-hidden">
                <img
                  src={g.img} alt={g.title} loading="lazy"
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <Badge className={`absolute top-3 left-3 border-0 font-semibold ${g.isNew ? "bg-gradient-sunset text-white" : "bg-gradient-sunset text-white"}`}>
                  {g.isNew ? "Just added" : "Sponsored"}
                </Badge>
                <div className="absolute top-3 right-3 glass rounded-full px-2.5 py-1 flex items-center gap-1 text-xs text-white font-semibold">
                  <Star className="h-3 w-3 fill-sunset-gold text-sunset-gold" />
                  {g.rating}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-white text-xl font-bold leading-tight">{g.title}</h3>
                  <div className="flex items-center gap-1 text-white/80 text-sm mt-1">
                    <MapPin className="h-3.5 w-3.5" /> {g.location}
                  </div>
                  <div className="flex items-end justify-between mt-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-white/50">From</p>
                      <p className="text-gradient-sunset font-bold text-lg">{g.price}</p>
                    </div>
                    <p className="text-[10px] text-white/60">by {g.sponsor}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
