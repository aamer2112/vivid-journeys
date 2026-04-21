import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Sparkles, Brain, Wand2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { TripPlan } from "@/types/trip";

interface Props {
  onGenerated: (tripId: string) => void;
  onRequireAuth: () => void;
}

const MODEL_MAP: Record<string, string> = {
  "gpt-4o": "openai/gpt-5",
  "gemini-1.5-pro": "google/gemini-2.5-pro",
};

export const AIPlanner = ({ onGenerated, onRequireAuth }: Props) => {
  const { user, profile, refreshProfile } = useAuth();
  const [tab, setTab] = useState<"standard" | "detailed">("standard");
  const [model, setModel] = useState("gpt-4o");
  const [loading, setLoading] = useState(false);

  // Standard
  const [prompt, setPrompt] = useState("");

  // Detailed
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [vibe, setVibe] = useState("");
  const [mobility, setMobility] = useState("");
  const [weather, setWeather] = useState("");

  const buildPrompt = () => {
    if (tab === "standard") return prompt.trim();
    const parts = [];
    if (destination) parts.push(`Destination: ${destination}`);
    if (budget) parts.push(`Budget per person: €${budget}`);
    if (vibe) parts.push(`Vibe: ${vibe}`);
    if (mobility) parts.push(`Mobility: ${mobility}`);
    if (weather) parts.push(`Weather preference: ${weather}`);
    return parts.join(". ");
  };

  const handleGenerate = async () => {
    if (!user || !profile) {
      toast.error("Please log in to generate a trip");
      onRequireAuth();
      return;
    }
    if (!profile.is_premium && profile.prompts_used >= 5) {
      toast.error("Free quota reached. Upgrade to Unlimited.");
      return;
    }
    const finalPrompt = buildPrompt();
    if (!finalPrompt || finalPrompt.length < 6) {
      toast.error("Tell us a bit more about your trip");
      return;
    }

    setLoading(true);
    const t = toast.loading("✨ Crafting your itinerary…", {
      description: `Using ${model === "gpt-4o" ? "ChatGPT-4o" : "Gemini 1.5 Pro"}`,
    });

    try {
      const { data, error } = await supabase.functions.invoke("generate-itinerary", {
        body: { prompt: finalPrompt, model: MODEL_MAP[model], travelers: 4 },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const plan = data.plan as TripPlan;

      // Save trip
      const { data: trip, error: insErr } = await supabase
        .from("trips")
        .insert({
          user_id: user.id,
          title: plan.title,
          destination: plan.destination,
          travelers: plan.travelers,
          model_used: model,
          plan: plan as any,
        })
        .select()
        .single();
      if (insErr) throw insErr;

      // Increment prompts_used
      await supabase
        .from("profiles")
        .update({ prompts_used: profile.prompts_used + 1 })
        .eq("id", user.id);
      await refreshProfile();

      toast.success("Trip generated!", { id: t, description: "Scroll down to view it." });
      onGenerated(trip.id);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message ?? "Generation failed", { id: t });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-scale-in">
      <div className="glass-strong rounded-3xl p-6 md:p-8 shadow-glow">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <Label className="text-white/90 text-sm font-medium flex items-center gap-2 shrink-0">
            <Brain className="h-4 w-4 text-sunset-coral" />
            Choose your AI Brain:
          </Label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="glass-input text-white border-white/20 rounded-xl w-full sm:w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card/95 backdrop-blur-xl border-white/10 text-white">
              <SelectItem value="gpt-4o">⚡ ChatGPT-4o</SelectItem>
              <SelectItem value="gemini-1.5-pro">💎 Gemini 1.5 Pro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 mb-5 p-1 rounded-xl bg-white/5 w-fit">
          {(["standard", "detailed"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t ? "bg-gradient-sunset text-white shadow-glow" : "text-white/70 hover:text-white"
              }`}
            >
              {t === "standard" ? "Standard Input" : "Detailed Input"}
            </button>
          ))}
        </div>

        {tab === "standard" ? (
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Where to? Who with? When? — e.g. '5 friends, Madeira, late June, surf + hidden food spots'"
            className="glass-input text-white placeholder:text-white/55 border-white/20 rounded-2xl min-h-[120px] text-base resize-none"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in">
            <Input value={destination} onChange={(e) => setDestination(e.target.value)}
              placeholder="Destination" className="glass-input text-white border-white/20 rounded-xl" />
            <Input value={budget} onChange={(e) => setBudget(e.target.value)}
              placeholder="Budget per person (€)" type="number"
              className="glass-input text-white border-white/20 rounded-xl" />
            <Select value={vibe} onValueChange={setVibe}>
              <SelectTrigger className="glass-input text-white border-white/20 rounded-xl">
                <SelectValue placeholder="Vibe" />
              </SelectTrigger>
              <SelectContent className="bg-card/95 backdrop-blur-xl border-white/10 text-white">
                <SelectItem value="hike">🥾 Hike & Nature</SelectItem>
                <SelectItem value="party">🎉 Party & Nightlife</SelectItem>
                <SelectItem value="culture">🏛 Culture & Food</SelectItem>
                <SelectItem value="chill">🌅 Chill & Beach</SelectItem>
              </SelectContent>
            </Select>
            <Select value={mobility} onValueChange={setMobility}>
              <SelectTrigger className="glass-input text-white border-white/20 rounded-xl">
                <SelectValue placeholder="Mobility" />
              </SelectTrigger>
              <SelectContent className="bg-card/95 backdrop-blur-xl border-white/10 text-white">
                <SelectItem value="walking only">🚶 Walking only</SelectItem>
                <SelectItem value="public transport">🚊 Public transport</SelectItem>
                <SelectItem value="rental car">🚗 Rental car</SelectItem>
              </SelectContent>
            </Select>
            <Select value={weather} onValueChange={setWeather}>
              <SelectTrigger className="glass-input text-white border-white/20 rounded-xl sm:col-span-2">
                <SelectValue placeholder="Weather preference" />
              </SelectTrigger>
              <SelectContent className="bg-card/95 backdrop-blur-xl border-white/10 text-white">
                <SelectItem value="hot and sunny">☀️ Hot & Sunny</SelectItem>
                <SelectItem value="mild">🌤 Mild</SelectItem>
                <SelectItem value="cool and moody">🌧 Cool & Moody</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <Button
          onClick={handleGenerate}
          disabled={loading}
          size="lg"
          className="w-full mt-5 h-14 text-base font-semibold bg-gradient-sunset hover:opacity-90 text-white border-0 rounded-2xl shadow-glow group"
        >
          {loading ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating…</>
          ) : (
            <>
              <Wand2 className="mr-2 h-5 w-5 group-hover:rotate-12 transition" />
              Generate Itinerary
              <Sparkles className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>

        <p className="text-center text-xs text-white/70 mt-4">
          {profile && !profile.is_premium ? (
            <>
              {Math.max(0, 5 - profile.prompts_used)} free prompt{5 - profile.prompts_used !== 1 ? "s" : ""} left this year. Or go{" "}
              <span className="text-gradient-sunset font-semibold">Unlimited for €14.99/mo</span>.
            </>
          ) : profile?.is_premium ? (
            <span className="text-gradient-sunset font-semibold">✨ Unlimited tier active</span>
          ) : (
            <>5 Free Prompts / Year. Or go{" "}
              <span className="text-gradient-sunset font-semibold">Unlimited for €14.99/mo</span>.</>
          )}
        </p>
      </div>
    </div>
  );
};
