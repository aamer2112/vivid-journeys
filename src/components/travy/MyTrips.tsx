import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MapPinned, Trash2, Sparkles, Plus, Users, Calendar } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { TripPlan } from "@/types/trip";

interface TripListItem {
  id: string;
  title: string;
  destination: string;
  travelers: number;
  created_at: string;
  plan: TripPlan;
}

interface Props {
  selectedTripId: string | null;
  onSelect: (id: string) => void;
  onPlanNew: () => void;
  refreshKey: number;
}

export const MyTrips = ({ selectedTripId, onSelect, onPlanNew, refreshKey }: Props) => {
  const { user } = useAuth();
  const [trips, setTrips] = useState<TripListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  const load = async () => {
    if (!user) { setTrips([]); return; }
    setLoading(true);
    const { data } = await supabase
      .from("trips")
      .select("id,title,destination,travelers,created_at,plan")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setTrips((data as any) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user, refreshKey]);

  const remove = async (id: string) => {
    const { error } = await supabase.from("trips").delete().eq("id", id);
    if (error) { toast.error("Couldn't delete"); return; }
    toast.success("Trip deleted");
    setConfirmDel(null);
    if (selectedTripId === id) onSelect("");
    load();
  };

  if (!user) return null;

  return (
    <section id="trips" className="relative py-16">
      <div className="container">
        <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
          <div>
            <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-md mb-3">
              <MapPinned className="h-3 w-3 mr-1" /> My Trips
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
              Your <span className="text-gradient-sunset">adventures</span>
            </h2>
          </div>
          <Button onClick={onPlanNew} className="bg-gradient-sunset border-0 rounded-xl shadow-glow">
            <Plus className="h-4 w-4 mr-1" /> Plan a new trip
          </Button>
        </div>

        {loading && <p className="text-white/60">Loading…</p>}

        {!loading && trips.length === 0 && (
          <div className="glass rounded-3xl p-10 text-center">
            <Sparkles className="h-10 w-10 text-sunset-coral mx-auto mb-3" />
            <p className="text-white/80">No trips yet — generate your first one above!</p>
          </div>
        )}

        {trips.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trips.map((trip) => (
              <article
                key={trip.id}
                className={`glass rounded-2xl p-5 group transition hover:bg-white/[0.12] cursor-pointer relative ${
                  selectedTripId === trip.id ? "ring-2 ring-sunset-coral shadow-glow" : ""
                }`}
                onClick={() => onSelect(trip.id)}
              >
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmDel(trip.id); }}
                  aria-label="Delete trip"
                  className="absolute top-3 right-3 h-8 w-8 grid place-items-center rounded-full bg-white/10 hover:bg-destructive/80 text-white/70 hover:text-white transition opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <p className="text-xs text-sunset-coral font-bold tracking-wider uppercase">
                  {trip.destination}
                </p>
                <h3 className="text-white font-bold text-lg mt-1 leading-tight pr-8">{trip.title}</h3>
                <div className="flex items-center gap-3 text-xs text-white/60 mt-3">
                  <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {trip.travelers}</span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {new Date(trip.created_at).toLocaleDateString()}
                  </span>
                  <span>{trip.plan?.days?.length ?? 0} days</span>
                </div>
                {selectedTripId === trip.id && (
                  <Badge className="mt-3 bg-gradient-sunset border-0 text-white">Viewing</Badge>
                )}
              </article>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
        <AlertDialogContent className="glass-strong border-white/15 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this trip?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              This can't be undone. The itinerary and all edits will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 border-white/20 text-white hover:bg-white/15">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmDel && remove(confirmDel)}
              className="bg-destructive hover:bg-destructive/90 border-0">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};
