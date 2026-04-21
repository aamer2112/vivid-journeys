import kayak from "@/assets/gem-kayak.jpg";
import tapas from "@/assets/gem-tapas.jpg";
import springs from "@/assets/gem-springs.jpg";
import bonfire from "@/assets/gem-bonfire.jpg";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star } from "lucide-react";

const gems = [
  { img: kayak, title: "Secret Kayak Cove", location: "Madeira, Portugal", rating: 4.9, price: "€35", sponsor: "Madeira Adventures" },
  { img: tapas, title: "Sunset Tapas Rooftop", location: "Cusco, Peru", rating: 4.8, price: "€22", sponsor: "Casa del Sol" },
  { img: springs, title: "Hidden Mossy Hot Springs", location: "Reykjadalur, Iceland", rating: 5.0, price: "Free", sponsor: "Local Guide Co." },
  { img: bonfire, title: "Beach Bonfire Night", location: "Algarve, Portugal", rating: 4.7, price: "€18", sponsor: "Coastal Vibes" },
];

export const FeaturedGems = () => {
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
        </div>

        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 snap-x snap-mandatory">
          {gems.map((g) => (
            <article
              key={g.title}
              className="group relative w-[280px] sm:w-[320px] shrink-0 snap-start rounded-3xl overflow-hidden glass-strong hover:scale-[1.02] transition-transform duration-500"
            >
              <div className="relative h-[380px] overflow-hidden">
                <img
                  src={g.img}
                  alt={g.title}
                  loading="lazy"
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <Badge className="absolute top-3 left-3 bg-gradient-sunset text-white border-0 font-semibold">
                  Sponsored
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
