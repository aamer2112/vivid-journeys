import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock, MapPin, Sparkles, Zap, Bookmark, BookmarkCheck, Navigation,
  Mountain, Coffee, PartyPopper, Sailboat, Landmark, Bus, Bed,
} from "lucide-react";
import type { Activity } from "@/types/trip";

const ICONS: Record<Activity["category"], any> = {
  hike: Mountain, food: Coffee, beach: Sailboat, culture: Landmark,
  nightlife: PartyPopper, transport: Bus, experience: Sparkles, stay: Bed,
};

interface Props {
  activity: Activity | null;
  travelers: number;
  canSave: boolean;
  onClose: () => void;
  onToggleSave: (activity: Activity) => void;
}

export const ActivityDetailDrawer = ({ activity, travelers, canSave, onClose, onToggleSave }: Props) => {
  const open = !!activity;
  const Icon = activity ? (ICONS[activity.category] ?? Sparkles) : Sparkles;

  const groupMin = activity ? activity.price_min * travelers : 0;
  const groupMax = activity ? activity.price_max * travelers : 0;

  const mapsUrl = activity
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        activity.address || `${activity.title} ${activity.location}`,
      )}`
    : "#";

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 border-0 bg-transparent shadow-none overflow-y-auto"
      >
        {activity && (
          <div className="relative h-full min-h-screen p-5 sm:p-7">
            {/* Glassmorphism panel */}
            <div className="glass-strong rounded-3xl p-6 sm:p-7 relative overflow-hidden">
              {/* sunset glow */}
              <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-gradient-sunset opacity-25 blur-3xl pointer-events-none" />

              <div className="relative">
                <SheetHeader className="text-left space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-sunset grid place-items-center shadow-glow shrink-0">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Badge className="bg-white/10 text-white/90 border-white/15 backdrop-blur text-[10px] mb-1.5">
                        {activity.tag}
                      </Badge>
                      <SheetTitle className="text-white text-2xl font-bold leading-tight">
                        {activity.title}
                      </SheetTitle>
                      <SheetDescription className="sr-only">
                        Activity details for {activity.title}
                      </SheetDescription>
                    </div>
                  </div>
                </SheetHeader>

                {/* Time + price row */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="glass rounded-2xl p-4">
                    <p className="text-[10px] uppercase tracking-wider text-white/55 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Time
                    </p>
                    <p className="text-white font-bold text-lg mt-1">{activity.time}</p>
                  </div>
                  <div className="glass rounded-2xl p-4">
                    <p className="text-[10px] uppercase tracking-wider text-white/55">Per person</p>
                    <p className="text-gradient-sunset font-bold text-lg mt-1">
                      {activity.price_min === 0 && activity.price_max === 0
                        ? "Free"
                        : `€${activity.price_min}–€${activity.price_max}`}
                    </p>
                  </div>
                </div>

                {/* Address block */}
                <div className="glass rounded-2xl p-4 mt-3">
                  <p className="text-[10px] uppercase tracking-wider text-white/55 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Address
                  </p>
                  <p className="text-white text-sm font-medium mt-1 leading-snug">
                    {activity.address || activity.location}
                  </p>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs text-sunset-coral hover:text-sunset-pink transition font-semibold"
                  >
                    <Navigation className="h-3 w-3" /> Open in Maps
                  </a>
                </div>

                {/* Why it's a time-saver */}
                {(activity.why_timesaver || activity.ai_note) && (
                  <div className="mt-3 rounded-2xl p-4 border border-emerald-400/30 bg-emerald-500/10 backdrop-blur-xl">
                    <p className="text-[10px] uppercase tracking-wider text-emerald-300 flex items-center gap-1 font-bold">
                      <Zap className="h-3 w-3" /> Why it's a time-saver
                    </p>
                    <p className="text-white text-sm mt-1.5 leading-relaxed">
                      {activity.why_timesaver ||
                        `AI optimization: ${activity.ai_note}.`}
                    </p>
                    {activity.ai_note && activity.why_timesaver && (
                      <p className="text-emerald-200/80 text-xs mt-2 italic">
                        AI: {activity.ai_note}
                      </p>
                    )}
                  </div>
                )}

                {/* Group total */}
                {(activity.price_min > 0 || activity.price_max > 0) && (
                  <div className="mt-3 glass rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-white/55">Group total</p>
                      <p className="text-white font-bold">€{groupMin}–€{groupMax}</p>
                    </div>
                    <p className="text-xs text-white/55">× {travelers} travelers</p>
                  </div>
                )}

                {/* Save action */}
                {canSave && (
                  <Button
                    onClick={() => onToggleSave(activity)}
                    className={
                      activity.saved
                        ? "w-full mt-6 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-2xl h-12 font-semibold"
                        : "w-full mt-6 bg-gradient-sunset hover:opacity-90 text-white border-0 rounded-2xl h-12 font-semibold shadow-glow"
                    }
                  >
                    {activity.saved ? (
                      <><BookmarkCheck className="h-4 w-4 mr-2" /> Saved to trip — tap to unsave</>
                    ) : (
                      <><Bookmark className="h-4 w-4 mr-2" /> Save to trip</>
                    )}
                  </Button>
                )}
                {!canSave && (
                  <p className="mt-6 text-xs text-white/55 text-center">
                    Sign in as the trip owner to save changes.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
