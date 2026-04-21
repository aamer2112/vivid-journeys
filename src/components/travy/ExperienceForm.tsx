import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Coins, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSubmitted?: () => void;
}

export const ExperienceForm = ({ open, onOpenChange, onSubmitted }: Props) => {
  const { user, profile, refreshProfile } = useAuth();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState(5);
  const [imageUrl, setImageUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) { toast.error("Log in first"); return; }
    setBusy(true);
    try {
      const { error } = await supabase.from("experiences").insert({
        user_id: user.id,
        title, location, rating,
        image_url: imageUrl || null,
        notes: notes || null,
        points_awarded: 500,
      });
      if (error) throw error;
      // Award points
      await supabase
        .from("profiles")
        .update({ points: profile.points + 500 })
        .eq("id", user.id);
      await refreshProfile();
      toast.success("🎉 +500 points earned!", { description: "Your review is now live." });
      setTitle(""); setLocation(""); setImageUrl(""); setNotes(""); setRating(5);
      onOpenChange(false);
      onSubmitted?.();
    } catch (err: any) {
      toast.error(err.message ?? "Couldn't submit");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg glass-strong border-white/15 text-white rounded-3xl">
        <div className="absolute inset-0 bg-gradient-aurora opacity-20 pointer-events-none rounded-3xl" />
        <div className="relative">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <Coins className="h-5 w-5 text-sunset-gold" /> Share an experience
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Earn <strong className="text-sunset-gold">+500 points</strong> per verified review.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submit} className="space-y-3 mt-4">
            <div>
              <Label className="text-white/80 text-xs">What did you experience?</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required
                placeholder="e.g. Sunrise hike at Pico do Arieiro"
                className="glass-input text-white border-white/20 rounded-xl" />
            </div>
            <div>
              <Label className="text-white/80 text-xs">Location</Label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} required
                placeholder="City, country"
                className="glass-input text-white border-white/20 rounded-xl" />
            </div>
            <div>
              <Label className="text-white/80 text-xs">Rating</Label>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n} type="button" onClick={() => setRating(n)}
                    className="transition hover:scale-110">
                    <Star className={`h-7 w-7 ${n <= rating ? "fill-sunset-gold text-sunset-gold" : "text-white/30"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-white/80 text-xs flex items-center gap-1">
                <ImageIcon className="h-3 w-3" /> Photo URL (optional)
              </Label>
              <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://…"
                className="glass-input text-white border-white/20 rounded-xl" />
            </div>
            <div>
              <Label className="text-white/80 text-xs">Notes (optional)</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                placeholder="A few words about it…"
                className="glass-input text-white border-white/20 rounded-xl resize-none min-h-[70px]" />
            </div>
            <Button type="submit" disabled={busy}
              className="w-full bg-gradient-sunset border-0 rounded-xl h-11 font-semibold shadow-glow">
              {busy ? "Submitting…" : "Submit & earn 500 points"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
