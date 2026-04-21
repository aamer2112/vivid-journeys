import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Building2,
  Sparkles,
  Coins,
  AlertTriangle,
  Check,
  Crown,
  BarChart3,
  Gift,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

type Mode = "select" | "traveler" | "business";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

export const AuthModal = ({ open, onOpenChange }: Props) => {
  const [mode, setMode] = useState<Mode>("select");

  const reset = (o: boolean) => {
    if (!o) setTimeout(() => setMode("select"), 200);
    onOpenChange(o);
  };

  return (
    <Dialog open={open} onOpenChange={reset}>
      <DialogContent className="max-w-2xl glass-strong border-white/15 text-white p-0 overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-aurora opacity-30 pointer-events-none" />
        <div className="relative p-6 md:p-8">
          {mode !== "select" && (
            <button
              onClick={() => setMode("select")}
              className="mb-3 inline-flex items-center gap-1 text-xs text-white/70 hover:text-white"
            >
              <ArrowLeft className="h-3 w-3" /> Back
            </button>
          )}

          {mode === "select" && (
            <>
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold text-white">
                  Welcome to <span className="text-gradient-sunset">Travy</span>
                </DialogTitle>
                <DialogDescription className="text-white/70">
                  Are you a Traveler or a Business Owner?
                </DialogDescription>
              </DialogHeader>
              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <button
                  onClick={() => setMode("traveler")}
                  className="glass rounded-2xl p-6 text-left hover:bg-white/[0.14] transition group"
                >
                  <div className="h-12 w-12 rounded-xl bg-gradient-sunset grid place-items-center mb-4 shadow-glow group-hover:scale-110 transition">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-lg">I'm a Traveler</h3>
                  <p className="text-white/65 text-sm mt-1">
                    Plan trips with AI, split costs with friends, earn vouchers.
                  </p>
                </button>
                <button
                  onClick={() => setMode("business")}
                  className="glass rounded-2xl p-6 text-left hover:bg-white/[0.14] transition group"
                >
                  <div className="h-12 w-12 rounded-xl bg-gradient-sunset grid place-items-center mb-4 shadow-glow group-hover:scale-110 transition">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-lg">I'm a Business Owner</h3>
                  <p className="text-white/65 text-sm mt-1">
                    Reach Gen-Z travelers in your area, get verified, sell more.
                  </p>
                </button>
              </div>
            </>
          )}

          {mode === "traveler" && <TravelerView onUpgrade={() => toast.success("🎉 Welcome to Travy Unlimited!")} />}
          {mode === "business" && <BusinessView onSelect={(t) => toast.success(`Selected ${t} plan`)} />}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const TravelerView = ({ onUpgrade }: { onUpgrade: () => void }) => (
  <div className="animate-fade-in">
    <DialogHeader>
      <DialogTitle className="text-2xl font-bold text-white">Hey, Sofia 👋</DialogTitle>
      <DialogDescription className="text-white/70">Your traveler dashboard.</DialogDescription>
    </DialogHeader>

    <div className="grid sm:grid-cols-2 gap-4 mt-6">
      <div className="glass rounded-2xl p-5">
        <p className="text-xs uppercase tracking-wider text-white/55 flex items-center gap-1.5">
          <Sparkles className="h-3 w-3" /> AI Prompts
        </p>
        <p className="text-3xl font-bold text-white mt-1">2 / 5</p>
        <Progress value={40} className="h-1.5 mt-3 bg-white/10 [&>div]:bg-gradient-sunset" />
        <p className="text-xs text-white/55 mt-2">Free yearly quota</p>
      </div>
      <div className="glass rounded-2xl p-5">
        <p className="text-xs uppercase tracking-wider text-white/55 flex items-center gap-1.5">
          <Coins className="h-3 w-3 text-sunset-gold" /> Points balance
        </p>
        <p className="text-3xl font-bold text-gradient-sunset mt-1">3,250</p>
        <p className="text-xs text-white/55 mt-3">≈ €32 in vouchers</p>
      </div>
    </div>

    <div className="mt-4 glass rounded-2xl p-4 flex gap-3 items-start border border-sunset-gold/30 bg-sunset-gold/5">
      <AlertTriangle className="h-5 w-5 text-sunset-gold shrink-0 mt-0.5" />
      <p className="text-sm text-white/80">
        You must be <strong className="text-white">logged in</strong> with a <strong className="text-white">verified booking</strong> to leave a review.
      </p>
    </div>

    <div className="mt-5 glass rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-sunset opacity-20" />
      <div className="relative flex items-start gap-4 flex-wrap">
        <div className="h-12 w-12 rounded-xl bg-gradient-sunset grid place-items-center shadow-glow">
          <Crown className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1 min-w-[200px]">
          <p className="font-bold text-white text-lg">Unlimited AI & Vouchers</p>
          <p className="text-white/75 text-sm">Unlimited prompts, 2× points, exclusive partner perks.</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">€14.99<span className="text-sm text-white/60">/mo</span></p>
        </div>
        <Button onClick={onUpgrade} className="w-full bg-gradient-sunset border-0 rounded-xl h-11 font-semibold shadow-glow">
          Upgrade to Unlimited
        </Button>
      </div>
    </div>
  </div>
);

const BusinessView = ({ onSelect }: { onSelect: (t: string) => void }) => (
  <div className="animate-fade-in">
    <DialogHeader>
      <DialogTitle className="text-2xl font-bold text-white">Grow your business with Travy</DialogTitle>
      <DialogDescription className="text-white/70">Reach 18-36 travelers actively planning trips.</DialogDescription>
    </DialogHeader>

    <div className="grid sm:grid-cols-2 gap-4 mt-6">
      <div className="glass rounded-2xl p-6 flex flex-col">
        <Badge className="self-start bg-white/10 text-white border-white/20">Free</Badge>
        <p className="text-3xl font-bold text-white mt-3">€0</p>
        <p className="text-xs text-white/55">Forever</p>
        <p className="font-semibold text-white mt-4">Claim & Verify</p>
        <ul className="mt-3 space-y-2 text-sm text-white/75 flex-1">
          <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-400 shrink-0" /> Claim your business listing</li>
          <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-400 shrink-0" /> Get the verified badge</li>
          <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-400 shrink-0" /> Respond to reviews</li>
        </ul>
        <Button onClick={() => onSelect("Free")} variant="outline" className="mt-5 border-white/20 text-white bg-white/5 hover:bg-white/15 rounded-xl">
          Get started
        </Button>
      </div>

      <div className="rounded-2xl p-6 flex flex-col relative overflow-hidden border border-sunset-coral/40 bg-gradient-to-br from-sunset-coral/15 via-sunset-pink/10 to-sunset-purple/15 backdrop-blur-xl">
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-gradient-sunset opacity-30 blur-3xl" />
        <div className="relative">
          <Badge className="self-start bg-gradient-sunset border-0 gap-1"><Crown className="h-3 w-3" /> Premium</Badge>
          <p className="text-3xl font-bold text-white mt-3">€49<span className="text-sm text-white/60">/mo</span></p>
          <p className="text-xs text-white/55">Cancel anytime</p>
          <p className="font-semibold text-white mt-4">Featured Partner</p>
          <ul className="mt-3 space-y-2 text-sm text-white/85">
            <li className="flex gap-2"><Sparkles className="h-4 w-4 text-sunset-gold shrink-0" /> Featured in Hidden Gems carousel</li>
            <li className="flex gap-2"><BarChart3 className="h-4 w-4 text-sunset-gold shrink-0" /> Customer analytics dashboard</li>
            <li className="flex gap-2"><Gift className="h-4 w-4 text-sunset-gold shrink-0" /> Offer custom vouchers to reviewers</li>
            <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-400 shrink-0" /> Everything in Free</li>
          </ul>
          <Button onClick={() => onSelect("Premium")} className="mt-5 w-full bg-gradient-sunset border-0 rounded-xl font-semibold shadow-glow">
            Go Premium
          </Button>
        </div>
      </div>
    </div>
  </div>
);
