import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Brain, Wand2 } from "lucide-react";
import { toast } from "sonner";

export const AIPlanner = ({ onGenerate }: { onGenerate: () => void }) => {
  const [tab, setTab] = useState<"standard" | "detailed">("standard");
  const [model, setModel] = useState("gpt-4o");

  const handleGenerate = () => {
    toast.success("✨ Crafting your perfect itinerary...", {
      description: "Scroll down to see your generated trip.",
    });
    onGenerate();
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-scale-in">
      <div className="glass-strong rounded-3xl p-6 md:p-8 shadow-glow">
        {/* AI brain selector */}
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

        {/* Tabs */}
        <div className="flex gap-2 mb-5 p-1 rounded-xl bg-white/5 w-fit">
          {(["standard", "detailed"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t
                  ? "bg-gradient-sunset text-white shadow-glow"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {t === "standard" ? "Standard Input" : "Detailed Input"}
            </button>
          ))}
        </div>

        {tab === "standard" ? (
          <Textarea
            placeholder="Where to? Who with? When? — e.g. ‘5 friends, Madeira, late June, surf + hidden food spots’"
            className="glass-input text-white placeholder:text-white/55 border-white/20 rounded-2xl min-h-[120px] text-base resize-none"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in">
            <Input placeholder="Destination" className="glass-input text-white border-white/20 rounded-xl" />
            <Input placeholder="Budget per person (€)" className="glass-input text-white border-white/20 rounded-xl" />
            <Select>
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
            <Select>
              <SelectTrigger className="glass-input text-white border-white/20 rounded-xl">
                <SelectValue placeholder="Mobility" />
              </SelectTrigger>
              <SelectContent className="bg-card/95 backdrop-blur-xl border-white/10 text-white">
                <SelectItem value="walk">🚶 Walking only</SelectItem>
                <SelectItem value="public">🚊 Public transport</SelectItem>
                <SelectItem value="rental">🚗 Rental car</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="glass-input text-white border-white/20 rounded-xl sm:col-span-2">
                <SelectValue placeholder="Weather preference" />
              </SelectTrigger>
              <SelectContent className="bg-card/95 backdrop-blur-xl border-white/10 text-white">
                <SelectItem value="hot">☀️ Hot & Sunny</SelectItem>
                <SelectItem value="mild">🌤 Mild</SelectItem>
                <SelectItem value="cool">🌧 Cool & Moody</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <Button
          onClick={handleGenerate}
          size="lg"
          className="w-full mt-5 h-14 text-base font-semibold bg-gradient-sunset hover:opacity-90 text-white border-0 rounded-2xl shadow-glow group"
        >
          <Wand2 className="mr-2 h-5 w-5 group-hover:rotate-12 transition" />
          Generate Itinerary
          <Sparkles className="ml-2 h-5 w-5" />
        </Button>

        <p className="text-center text-xs text-white/70 mt-4">
          5 Free Prompts / Year. Or go{" "}
          <span className="text-gradient-sunset font-semibold">Unlimited for €14.99/mo</span>.
        </p>
      </div>
    </div>
  );
};
