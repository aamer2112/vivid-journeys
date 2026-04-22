import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Clock, MapPin, Sparkles, Check, Wallet, Zap, Users, X, BookmarkCheck,
  Mountain, Coffee, PartyPopper, Sailboat, Landmark, Bus, Bed, Plus, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Activity, ItineraryDay, TripPlan, TripRow } from "@/types/trip";
import { ActivityDetailDrawer } from "@/components/travy/ActivityDetailDrawer";

const ICONS: Record<Activity["category"], any> = {
  hike: Mountain, food: Coffee, beach: Sailboat, culture: Landmark,
  nightlife: PartyPopper, transport: Bus, experience: Sparkles, stay: Bed,
};

interface Props {
  tripId?: string;
  demoPlan?: TripPlan;
  onChanged?: () => void;
}

export const TripDashboard = ({ tripId, demoPlan, onChanged }: Props) => {
  const { user } = useAuth();
  const isDemo = !tripId && !!demoPlan;
  const [trip, setTrip] = useState<TripRow | null>(null);
  const [localPlan, setLocalPlan] = useState<TripPlan | null>(demoPlan ?? null);
  const [loading, setLoading] = useState(!isDemo);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [confirmDel, setConfirmDel] = useState<{ dayIdx: number; activityId: string } | null>(null);
  const [openActivity, setOpenActivity] = useState<Activity | null>(null);

  useEffect(() => {
    if (isDemo) {
      setLocalPlan(demoPlan ?? null);
      setLoading(false);
      return;
    }
    if (!tripId) return;
    let active = true;
    setLoading(true);
    supabase.from("trips").select("*").eq("id", tripId).maybeSingle()
      .then(({ data }) => { if (active && data) setTrip(data as any); setLoading(false); });
    return () => { active = false; };
  }, [tripId, isDemo, demoPlan]);

  const plan = isDemo ? localPlan ?? undefined : (trip?.plan as TripPlan | undefined);

  const totals = useMemo(() => {
    if (!plan) return { min: 0, max: 0, perPersonMin: 0, perPersonMax: 0 };
    let min = 0, max = 0;
    plan.days.forEach((d) => d.activities.forEach((a) => {
      min += a.price_min * plan.travelers;
      max += a.price_max * plan.travelers;
    }));
    return {
      min, max,
      perPersonMin: Math.round(min / plan.travelers),
      perPersonMax: Math.round(max / plan.travelers),
    };
  }, [plan]);

  const persistPlan = async (newPlan: TripPlan) => {
    if (isDemo) {
      setLocalPlan(newPlan);
      return;
    }
    if (!trip) return;
    const { error } = await supabase
      .from("trips")
      .update({ plan: newPlan as any })
      .eq("id", trip.id);
    if (error) {
      toast.error("Couldn't save change");
      return;
    }
    setTrip({ ...trip, plan: newPlan });
    onChanged?.();
  };

  const removeActivity = async (dayIdx: number, activityId: string) => {
    if (!plan) return;
    setSavingId(activityId);
    const newPlan: TripPlan = {
      ...plan,
      days: plan.days.map((d, i) => i === dayIdx
        ? { ...d, activities: d.activities.filter((a) => a.id !== activityId) }
        : d),
    };
    await persistPlan(newPlan);
    setSavingId(null);
    setConfirmDel(null);
    toast.success("Activity removed");
  };

  const addActivity = async (dayIdx: number) => {
    if (!plan) return;
    const newAct: Activity = {
      id: `manual-${Date.now()}`,
      time: "12:00",
      title: "New activity",
      location: plan.destination,
      category: "experience",
      tag: "Custom",
      price_min: 10,
      price_max: 25,
    };
    const newPlan: TripPlan = {
      ...plan,
      days: plan.days.map((d, i) => i === dayIdx
        ? { ...d, activities: [...d.activities, newAct] }
        : d),
    };
    await persistPlan(newPlan);
    toast.success("Activity added — tap × to remove later");
  };

  const toggleSaveActivity = async (act: Activity) => {
    if (!plan) return;
    const nextSaved = !act.saved;
    const newPlan: TripPlan = {
      ...plan,
      days: plan.days.map((d) => ({
        ...d,
        activities: d.activities.map((a) =>
          a.id === act.id ? { ...a, saved: nextSaved } : a,
        ),
      })),
    };
    await persistPlan(newPlan);
    setOpenActivity({ ...act, saved: nextSaved });
    toast.success(nextSaved ? "✨ Saved to your trip" : "Removed from saved");
  };

  if (loading) {
    return (
      <div className="container py-20 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-white/60 mx-auto" />
      </div>
    );
  }
  if (!plan || (!isDemo && !trip)) {
    return <div className="container py-20 text-white/60 text-center">Trip not found.</div>;
  }

  const isOwner = isDemo ? true : user?.id === trip!.user_id;
  const modelLabel = isDemo
    ? "ChatGPT-4o"
    : trip?.model_used === "gemini-1.5-pro" ? "Gemini 1.5 Pro" : "ChatGPT-4o";

  const friends = [
    { name: "You", initials: "ME", paid: 100, color: "from-sunset-coral to-sunset-pink" },
    { name: "Léa", initials: "LE", paid: 100, color: "from-sunset-pink to-sunset-purple" },
    { name: "Marco", initials: "MA", paid: 65, color: "from-sunset-purple to-sunset-violet" },
    { name: "Aïsha", initials: "AI", paid: 0, color: "from-sunset-gold to-sunset-coral" },
  ].slice(0, plan.travelers);

  return (
    <section className="relative py-16">
      <div className="container">
        <div className="mb-8 max-w-2xl">
          {isDemo && (
            <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-md mb-2">
              ✨ Live demo — try removing or tapping an activity
            </Badge>
          )}
          <Badge className="bg-gradient-sunset text-white border-0 mb-3 gap-1 ml-0 sm:ml-2">
            <Sparkles className="h-3 w-3" /> Generated by {modelLabel}
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            {plan.title.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="text-gradient-sunset">{plan.title.split(" ").slice(-1)[0]}</span>
          </h2>
          <p className="text-white/70 mt-2 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1"><Users className="h-4 w-4" /> {plan.travelers} travelers</span>
            <span>•</span>
            <span>{plan.destination}</span>
            <span>•</span>
            <span className="text-sunset-gold">{plan.summary}</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Days timeline */}
          <div className="lg:col-span-3 space-y-6">
            {plan.days.map((day, dayIdx) => (
              <DayCard
                key={day.day}
                day={day}
                dayIdx={dayIdx}
                travelers={plan.travelers}
                isOwner={isOwner}
                savingId={savingId}
                onAdd={() => addActivity(dayIdx)}
                onRequestRemove={(actId) => setConfirmDel({ dayIdx, activityId: actId })}
                onOpen={(act) => setOpenActivity(act)}
              />
            ))}
          </div>

          {/* Split-Pay */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-strong rounded-3xl p-6 md:p-7 sticky top-24">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-sunset-coral" /> Split-Pay
                </h3>
                <Badge className="bg-white/10 text-white/80 border-white/15 backdrop-blur">Cashless</Badge>
              </div>
              <p className="text-white/60 text-sm">All booked activities</p>

              <div className="my-6 text-center">
                <p className="text-xs uppercase tracking-wider text-white/50">Estimated total</p>
                <p className="text-4xl font-bold text-gradient-sunset">
                  €{totals.min.toFixed(0)} – €{totals.max.toFixed(0)}
                </p>
                <p className="text-xs text-white/60 mt-1">
                  €{totals.perPersonMin} – €{totals.perPersonMax} per person
                </p>
              </div>

              <Button
                onClick={() => toast.success("Payment requests sent via Apple Pay & Google Pay 💸")}
                className="w-full bg-gradient-sunset hover:opacity-90 text-white border-0 rounded-2xl h-12 font-semibold shadow-glow"
              >
                Split with Group
              </Button>

              <div className="mt-6 space-y-4">
                {friends.map((f) => (
                  <div key={f.name} className="flex items-center gap-3">
                    <Avatar className={`h-10 w-10 bg-gradient-to-br ${f.color}`}>
                      <AvatarFallback className="bg-transparent text-white text-xs font-bold">
                        {f.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-white text-sm font-medium truncate">{f.name}</p>
                        {f.paid === 100 ? (
                          <span className="inline-flex items-center gap-1 text-emerald-300 text-xs font-semibold">
                            <Check className="h-3 w-3" /> Paid
                          </span>
                        ) : (
                          <span className="text-white/60 text-xs">{f.paid}%</span>
                        )}
                      </div>
                      <Progress value={f.paid} className="h-1.5 bg-white/10 [&>div]:bg-gradient-sunset" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-white/55">
                <span>Powered by</span>
                <span className="px-2 py-0.5 rounded bg-white/10 font-semibold text-white/80">Apple Pay</span>
                <span className="px-2 py-0.5 rounded bg-white/10 font-semibold text-white/80">Google Pay</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
        <AlertDialogContent className="glass-strong border-white/15 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove activity?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              The total estimated cost will adjust automatically.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 border-white/20 text-white hover:bg-white/15">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmDel && removeActivity(confirmDel.dayIdx, confirmDel.activityId)}
              className="bg-gradient-sunset border-0">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ActivityDetailDrawer
        activity={openActivity}
        travelers={plan.travelers}
        canSave={isOwner}
        onClose={() => setOpenActivity(null)}
        onToggleSave={toggleSaveActivity}
      />
    </section>
  );
};

const DayCard = ({
  day, dayIdx, travelers, isOwner, savingId, onAdd, onRequestRemove, onOpen,
}: {
  day: ItineraryDay; dayIdx: number; travelers: number;
  isOwner: boolean; savingId: string | null;
  onAdd: () => void; onRequestRemove: (id: string) => void;
  onOpen: (a: Activity) => void;
}) => {
  const dayMin = day.activities.reduce((s, a) => s + a.price_min, 0);
  const dayMax = day.activities.reduce((s, a) => s + a.price_max, 0);

  return (
    <div className="glass-strong rounded-3xl p-6 md:p-7">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
        <h3 className="text-white font-semibold text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-sunset-coral" /> Day {day.day} — {day.label}
        </h3>
        <Badge className="bg-white/10 text-white/80 border-white/15 backdrop-blur">
          €{dayMin}–€{dayMax} pp
        </Badge>
      </div>
      <ol className="relative space-y-4 pl-6 border-l-2 border-white/10">
        {day.activities.map((act, idx) => {
          const Icon = ICONS[act.category] ?? Sparkles;
          const isSaving = savingId === act.id;
          return (
            <li key={act.id} className="relative animate-slide-up" style={{ animationDelay: `${idx * 60}ms` }}>
              <div className="absolute -left-[33px] top-1 h-6 w-6 rounded-full bg-gradient-sunset grid place-items-center shadow-glow">
                <div className="h-2 w-2 rounded-full bg-white" />
              </div>
              <button
                type="button"
                onClick={() => onOpen(act)}
                className="w-full text-left glass rounded-2xl p-4 hover:bg-white/[0.14] hover:scale-[1.01] transition relative group focus:outline-none focus:ring-2 focus:ring-sunset-coral/60"
                aria-label={`Open details for ${act.title}`}
              >
                {act.saved && (
                  <span className="absolute -top-2 -left-2 h-6 w-6 grid place-items-center rounded-full bg-gradient-sunset shadow-glow">
                    <BookmarkCheck className="h-3.5 w-3.5 text-white" />
                  </span>
                )}
                {isOwner && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => { e.stopPropagation(); onRequestRemove(act.id); }}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); onRequestRemove(act.id); } }}
                    aria-label="Remove activity"
                    className="absolute top-3 right-3 h-7 w-7 grid place-items-center rounded-full bg-white/10 hover:bg-destructive/80 text-white/70 hover:text-white transition opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3.5 w-3.5" />}
                  </span>
                )}
                <div className="flex items-start gap-3 pr-8">
                  <div className="h-10 w-10 rounded-xl bg-white/10 grid place-items-center shrink-0">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <p className="text-xs text-sunset-coral font-bold tracking-wider">{act.time}</p>
                        <p className="text-white font-semibold leading-tight">{act.title}</p>
                        <p className="text-white/60 text-xs mt-0.5 flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {act.location}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge className="bg-white/10 text-white/90 border-white/15 backdrop-blur text-[10px] mb-1">
                          {act.tag}
                        </Badge>
                        <p className="text-sm font-bold text-gradient-sunset">
                          {act.price_min === 0 && act.price_max === 0
                            ? "Free"
                            : `€${act.price_min}–€${act.price_max}`}
                        </p>
                        <p className="text-[10px] text-white/55">per person</p>
                      </div>
                    </div>
                    {act.ai_note && (
                      <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-300 font-medium">
                        <Zap className="h-3 w-3" /> AI: {act.ai_note}
                      </div>
                    )}
                    <p className="mt-2 text-[10px] text-white/45 group-hover:text-white/70 transition">
                      Tap for address & details →
                    </p>
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ol>
      {isOwner && (
        <Button
          onClick={onAdd}
          variant="outline"
          className="mt-4 w-full border-dashed border-white/20 text-white/80 bg-white/5 hover:bg-white/10 rounded-xl"
        >
          <Plus className="h-4 w-4 mr-1" /> Add activity to this day
        </Button>
      )}
    </div>
  );
};
