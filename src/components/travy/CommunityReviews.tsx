import r1 from "@/assets/review-1.jpg";
import r2 from "@/assets/review-2.jpg";
import r3 from "@/assets/review-3.jpg";
import r4 from "@/assets/review-4.jpg";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Play, Star, Coins, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const seed = [
  { id: "s1", img: r1, user: "Sofia M.", spot: "Lisbon Old Town", points: 500, rating: 5 },
  { id: "s2", img: r2, user: "Marco & Léa", spot: "Cliff Jump – Madeira", points: 750, rating: 5 },
  { id: "s3", img: r3, user: "Aïsha K.", spot: "Sunset Tapas – Peru", points: 500, rating: 5 },
  { id: "s4", img: r4, user: "Theo R.", spot: "Mt. Roraima Sunrise", points: 1000, rating: 5 },
];

const FALLBACK = "https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=600&q=80";

interface Props {
  onAddExperience: () => void;
  refreshKey: number;
}

export const CommunityReviews = ({ onAddExperience, refreshKey }: Props) => {
  const { profile } = useAuth();
  const [submitted, setSubmitted] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("experiences")
      .select("id,title,location,rating,image_url,points_awarded")
      .order("created_at", { ascending: false })
      .limit(8)
      .then(({ data }) => setSubmitted(data ?? []));
  }, [refreshKey]);

  const all = [
    ...submitted.map((e) => ({
      id: e.id,
      img: e.image_url || FALLBACK,
      user: "You",
      spot: `${e.title} – ${e.location}`,
      points: e.points_awarded,
      rating: e.rating,
    })),
    ...seed,
  ].slice(0, 8);

  return (
    <section className="relative py-20">
      <div className="container">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div className="max-w-2xl">
            <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-md mb-3">
              🎁 Earn points & vouchers
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
              Real trips. <span className="text-gradient-sunset">Real reviews.</span>
            </h2>
            <p className="text-white/70 mt-2">
              Verified travelers earn points for every review — redeemable for vouchers from local partners.
            </p>
          </div>
          {profile?.role === "traveler" && (
            <Button onClick={onAddExperience} className="bg-gradient-sunset border-0 rounded-xl shadow-glow">
              <Plus className="h-4 w-4 mr-1" /> Share an experience
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {all.map((r) => (
            <article
              key={r.id}
              className="group relative aspect-[9/16] rounded-3xl overflow-hidden glass-strong hover:scale-[1.03] transition-transform duration-500 cursor-pointer"
            >
              <img src={r.img} alt={`${r.user} at ${r.spot}`} loading="lazy"
                className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40" />

              <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                <Badge className="bg-emerald-500/90 text-white border-0 backdrop-blur-md gap-1 font-semibold">
                  <BadgeCheck className="h-3 w-3" /> Verified
                </Badge>
                <div className="glass rounded-full p-2">
                  <Play className="h-3 w-3 text-white fill-white" />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-1 mb-1.5">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-sunset-gold text-sunset-gold" />
                  ))}
                </div>
                <p className="text-white font-semibold text-sm leading-tight">{r.spot}</p>
                <p className="text-white/70 text-xs mt-0.5">@{r.user}</p>
                <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-sunset text-white text-[11px] font-bold">
                  <Coins className="h-3 w-3" /> Earned {r.points} pts
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
