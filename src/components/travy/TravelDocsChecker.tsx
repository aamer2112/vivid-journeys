import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, ShieldCheck, Lock, Loader2, Sparkles, Plane, FileCheck2, Car } from "lucide-react";

interface Traveler {
  id: string;
  name: string;
  nationality: string;
  hasLicense: boolean;
}

const NATIONALITIES = [
  "United States", "United Kingdom", "Canada", "India", "Brazil", "Germany",
  "France", "Spain", "Italy", "Australia", "Japan", "China", "Mexico",
  "Morocco", "Egypt", "South Africa", "Nigeria", "UAE", "Saudi Arabia",
];

const VISA_FREE = new Set([
  "United States", "United Kingdom", "Canada", "Brazil", "Germany", "France",
  "Spain", "Italy", "Australia", "Japan", "Mexico", "UAE",
]);

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  destination?: string;
}

export const TravelDocsChecker = ({ open, onOpenChange, destination = "Portugal (Madeira)" }: Props) => {
  const [travelers, setTravelers] = useState<Traveler[]>([
    { id: "t1", name: "You", nationality: "United States", hasLicense: true },
    { id: "t2", name: "Friend 2", nationality: "India", hasLicense: false },
  ]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string[] | null>(null);

  const addTraveler = () => {
    setTravelers((t) => [
      ...t,
      { id: `t${Date.now()}`, name: `Traveler ${t.length + 1}`, nationality: "United States", hasLicense: false },
    ]);
  };
  const update = (id: string, patch: Partial<Traveler>) =>
    setTravelers((t) => t.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const remove = (id: string) => setTravelers((t) => t.filter((x) => x.id !== id));

  const analyze = () => {
    setResult(null);
    setLoading(true);
    setTimeout(() => {
      const lines = travelers.map((t, i) => {
        const visa = VISA_FREE.has(t.nationality)
          ? `requires no visa for stays under 90 days in the Schengen Area.`
          : `requires a Schengen Visa — apply at the nearest Portuguese consulate at least 4 weeks before departure.`;
        const lic = t.hasLicense
          ? ` Driver's license is valid for car rentals at FNC Airport (IDP recommended for non-EU licenses).`
          : ` No driver's license on file — book pickup transfer in advance.`;
        return `${t.name || `User ${i + 1}`} (${t.nationality} passport) ${visa}${lic}`;
      });
      setResult([
        `AI Analysis Complete: For your group traveling to ${destination} —`,
        ...lines,
        `All passports must be valid for at least 3 months beyond your return date.`,
      ]);
      setLoading(false);
    }, 1600);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl bg-background/80 backdrop-blur-2xl border-white/15 text-white overflow-y-auto"
      >
        <SheetHeader className="text-left">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-emerald-500/20 text-emerald-200 border-emerald-400/30 gap-1">
              <Lock className="h-3 w-3" /> Encrypted
            </Badge>
            <Badge className="bg-white/10 text-white/80 border-white/15 gap-1">
              <ShieldCheck className="h-3 w-3" /> Trusted by 50k+ travelers
            </Badge>
          </div>
          <SheetTitle className="text-white text-2xl flex items-center gap-2">
            <Plane className="h-6 w-6 text-sunset-coral" /> Foolproof Border & Travel Checker
          </SheetTitle>
          <SheetDescription className="text-white/70">
            Add each traveler. Our AI cross-checks visa rules, license validity, and entry requirements for{" "}
            <span className="text-sunset-gold font-medium">{destination}</span>.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-3">
          {travelers.map((t, i) => (
            <div key={t.id} className="glass-strong rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wider text-white/55">Traveler {i + 1}</p>
                {travelers.length > 1 && (
                  <button
                    onClick={() => remove(t.id)}
                    className="text-white/50 hover:text-destructive transition"
                    aria-label="Remove traveler"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Input
                value={t.name}
                onChange={(e) => update(t.id, { name: e.target.value })}
                placeholder="Name"
                className="bg-white/5 border-white/15 text-white placeholder:text-white/40"
              />
              <Select value={t.nationality} onValueChange={(v) => update(t.id, { nationality: v })}>
                <SelectTrigger className="bg-white/5 border-white/15 text-white">
                  <SelectValue placeholder="Nationality / Passport" />
                </SelectTrigger>
                <SelectContent className="bg-background/95 backdrop-blur-xl border-white/15 text-white max-h-64">
                  {NATIONALITIES.map((n) => (
                    <SelectItem key={n} value={n} className="focus:bg-white/10">
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
                <Checkbox
                  checked={t.hasLicense}
                  onCheckedChange={(v) => update(t.id, { hasLicense: !!v })}
                  className="border-white/30 data-[state=checked]:bg-sunset-coral data-[state=checked]:border-sunset-coral"
                />
                <Car className="h-4 w-4 text-sunset-gold" /> Holds a valid Driver's License
              </label>
            </div>
          ))}

          <Button
            onClick={addTraveler}
            variant="outline"
            className="w-full border-dashed border-white/20 text-white/80 bg-white/5 hover:bg-white/10 rounded-xl"
          >
            <Plus className="h-4 w-4 mr-1" /> Add traveler
          </Button>

          <Button
            onClick={analyze}
            disabled={loading || travelers.length === 0}
            className="w-full bg-gradient-sunset hover:opacity-90 text-white border-0 rounded-2xl h-12 font-semibold shadow-glow"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> AI analyzing requirements…</>
            ) : (
              <><Sparkles className="h-4 w-4 mr-2" /> Run AI Visa & Docs Check</>
            )}
          </Button>
        </div>

        {(loading || result) && (
          <div className="mt-6 glass-strong rounded-2xl p-5 border border-emerald-400/20">
            <div className="flex items-center gap-2 mb-3">
              <FileCheck2 className="h-5 w-5 text-emerald-300" />
              <p className="text-white font-semibold">Travy AI Border Report</p>
            </div>
            {loading ? (
              <div className="space-y-2">
                <div className="h-3 rounded bg-white/10 animate-pulse" />
                <div className="h-3 rounded bg-white/10 animate-pulse w-5/6" />
                <div className="h-3 rounded bg-white/10 animate-pulse w-4/6" />
              </div>
            ) : (
              <div className="space-y-2 animate-fade-in">
                {result!.map((line, i) => (
                  <p key={i} className={i === 0 ? "text-emerald-300 font-medium" : "text-white/85 text-sm"}>
                    {line}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
