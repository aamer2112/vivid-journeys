import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Building2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSubmitted?: () => void;
}

export const GemForm = ({ open, onOpenChange, onSubmitted }: Props) => {
  const { user, profile } = useAuth();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Restaurant");
  const [priceFrom, setPriceFrom] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) { toast.error("Log in first"); return; }
    if (profile.role !== "business") {
      toast.error("Only business accounts can submit gems");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.from("gem_submissions").insert({
        user_id: user.id,
        title, location, category,
        price_from: priceFrom || null,
        image_url: imageUrl || null,
        description: description || null,
        status: "featured",
      });
      if (error) throw error;
      toast.success("🚀 Featured live!", { description: "Your gem is now in the carousel." });
      setTitle(""); setLocation(""); setPriceFrom(""); setImageUrl(""); setDescription("");
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
              <Building2 className="h-5 w-5 text-sunset-coral" /> Submit a Hidden Gem
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Add your venue, restaurant or experience. Premium accounts get featured instantly.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submit} className="space-y-3 mt-4">
            <div>
              <Label className="text-white/80 text-xs">Name</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required
                placeholder="e.g. Café do Mar"
                className="glass-input text-white border-white/20 rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white/80 text-xs">Location</Label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} required
                  placeholder="City, country"
                  className="glass-input text-white border-white/20 rounded-xl" />
              </div>
              <div>
                <Label className="text-white/80 text-xs">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="glass-input text-white border-white/20 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card/95 backdrop-blur-xl border-white/10 text-white">
                    <SelectItem value="Restaurant">🍽 Restaurant</SelectItem>
                    <SelectItem value="Experience">🎯 Experience</SelectItem>
                    <SelectItem value="Bar">🍹 Bar / Nightlife</SelectItem>
                    <SelectItem value="Outdoor">🥾 Outdoor</SelectItem>
                    <SelectItem value="Stay">🛏 Stay</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-white/80 text-xs">Price from (e.g. €25)</Label>
              <Input value={priceFrom} onChange={(e) => setPriceFrom(e.target.value)}
                placeholder="€25"
                className="glass-input text-white border-white/20 rounded-xl" />
            </div>
            <div>
              <Label className="text-white/80 text-xs">Cover photo URL (optional)</Label>
              <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://…"
                className="glass-input text-white border-white/20 rounded-xl" />
            </div>
            <div>
              <Label className="text-white/80 text-xs">Short pitch</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="What makes it special?"
                className="glass-input text-white border-white/20 rounded-xl resize-none min-h-[70px]" />
            </div>
            <Button type="submit" disabled={busy}
              className="w-full bg-gradient-sunset border-0 rounded-xl h-11 font-semibold shadow-glow">
              <Sparkles className="h-4 w-4 mr-1" />
              {busy ? "Publishing…" : "Publish & feature"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
