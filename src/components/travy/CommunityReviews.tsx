import r1 from "@/assets/review-1.jpg";
import r2 from "@/assets/review-2.jpg";
import r3 from "@/assets/review-3.jpg";
import r4 from "@/assets/review-4.jpg";
import { Badge } from "@/components/ui/badge";
import { BadgeCheck, Play, Star, Coins } from "lucide-react";

const reviews = [
  { img: r1, user: "Sofia M.", spot: "Lisbon Old Town", points: 500, rating: 5 },
  { img: r2, user: "Marco & Léa", spot: "Cliff Jump – Madeira", points: 750, rating: 5 },
  { img: r3, user: "Aïsha K.", spot: "Sunset Tapas – Peru", points: 500, rating: 5 },
  { img: r4, user: "Theo R.", spot: "Mt. Roraima Sunrise", points: 1000, rating: 5 },
];

export const CommunityReviews = () => {
  return (
    <section className="relative py-20">
      <div className="container">
        <div className="mb-8 max-w-2xl">
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {reviews.map((r) => (
            <article
              key={r.user}
              className="group relative aspect-[9/16] rounded-3xl overflow-hidden glass-strong hover:scale-[1.03] transition-transform duration-500 cursor-pointer"
            >
              <img
                src={r.img}
                alt={`${r.user} at ${r.spot}`}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40" />

              {/* Top badges */}
              <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                <Badge className="bg-emerald-500/90 text-white border-0 backdrop-blur-md gap-1 font-semibold">
                  <BadgeCheck className="h-3 w-3" /> Verified
                </Badge>
                <div className="glass rounded-full p-2">
                  <Play className="h-3 w-3 text-white fill-white" />
                </div>
              </div>

              {/* Bottom content */}
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
