import { Badge } from "@/components/ui/badge";
import { Star, BadgeCheck, Play, Sparkles } from "lucide-react";

export const InfluencerProof = () => {
  return (
    <section className="container py-20">
      <div className="text-center mb-10 max-w-2xl mx-auto animate-fade-in">
        <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-white/90 mb-4 font-medium">
          <Sparkles className="h-3 w-3 text-sunset-gold" />
          Social Proof
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
          See Travy <span className="text-gradient-sunset">in Action</span>
        </h2>
        <p className="text-white/70 mt-3">
          Real creators. Real trips. Zero group-chat chaos.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-8 items-center max-w-5xl mx-auto">
        {/* Vertical video */}
        <div className="md:col-span-2 mx-auto w-full max-w-[280px]">
          <div className="relative aspect-[9/16] rounded-[2rem] overflow-hidden shadow-2xl border border-white/15 glass-strong">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80"
            >
              <source
                src="https://cdn.coverr.co/videos/coverr-girl-traveling-with-suitcase-2790/1080p.mp4"
                type="video/mp4"
              />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />
            <div className="absolute top-3 left-3 flex items-center gap-1.5">
              <Badge className="bg-black/50 backdrop-blur text-white border-white/20 text-[10px]">
                ▶ Reels
              </Badge>
              <Badge className="bg-rose-500/80 text-white border-0 text-[10px]">LIVE</Badge>
            </div>
            <div className="absolute bottom-3 left-3 right-3">
              <p className="text-white text-xs font-semibold">@TravelWithSarah</p>
              <p className="text-white/80 text-[11px]">Madeira in 4 days with Travy ✈️🌋</p>
            </div>
            <div className="absolute inset-0 grid place-items-center pointer-events-none">
              <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-md grid place-items-center">
                <Play className="h-6 w-6 text-white fill-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Verified rating */}
        <div className="md:col-span-3 glass-strong rounded-3xl p-7">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
                alt="@TravelWithSarah"
                className="h-14 w-14 rounded-full object-cover border-2 border-sunset-coral"
              />
              <BadgeCheck className="absolute -bottom-1 -right-1 h-5 w-5 text-sky-400 fill-sky-400/30" />
            </div>
            <div>
              <p className="text-white font-semibold flex items-center gap-1.5">
                @TravelWithSarah
                <BadgeCheck className="h-4 w-4 text-sky-400" />
              </p>
              <p className="text-white/55 text-xs">2.4M followers • Verified Booking</p>
            </div>
          </div>

          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-sunset-gold text-sunset-gold" />
            ))}
            <span className="ml-2 text-white/80 text-sm font-medium">5.0 / 5</span>
          </div>

          <p className="text-white/90 text-lg leading-relaxed italic">
            "Travy saved our group chat. Planned our whole Madeira trip, split the Airbnb,
            and found the best local Poncha spot in 5 seconds."
          </p>

          <div className="mt-5 flex items-center gap-3 flex-wrap">
            <Badge className="bg-emerald-500/15 text-emerald-200 border-emerald-400/30 gap-1">
              <BadgeCheck className="h-3 w-3" /> Verified Booking
            </Badge>
            <Badge className="bg-white/10 text-white/80 border-white/15">Madeira, Portugal</Badge>
            <Badge className="bg-white/10 text-white/80 border-white/15">4 friends</Badge>
          </div>
        </div>
      </div>
    </section>
  );
};
