import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  User, Building2, Sparkles, Coins, AlertTriangle, Check, Crown,
  BarChart3, Gift, ArrowLeft, Zap, LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { loginAsDemo } from "@/lib/demo-accounts";

type Mode = "select" | "auth-traveler" | "auth-business" | "dashboard-traveler" | "dashboard-business";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

export const AuthModal = ({ open, onOpenChange }: Props) => {
  const { user, profile, signOut } = useAuth();
  const [mode, setMode] = useState<Mode>("select");

  // If logged in, jump to relevant dashboard
  const effectiveMode: Mode = (() => {
    if (mode !== "select" && (mode === "auth-traveler" || mode === "auth-business")) return mode;
    if (user && profile) return profile.role === "business" ? "dashboard-business" : "dashboard-traveler";
    return "select";
  })();

  const reset = (o: boolean) => {
    if (!o) setTimeout(() => setMode("select"), 200);
    onOpenChange(o);
  };

  return (
    <Dialog open={open} onOpenChange={reset}>
      <DialogContent className="max-w-2xl glass-strong border-white/15 text-white p-0 overflow-hidden rounded-3xl max-h-[90vh] overflow-y-auto">
        <div className="absolute inset-0 bg-gradient-aurora opacity-30 pointer-events-none" />
        <div className="relative p-6 md:p-8">
          {(effectiveMode === "auth-traveler" || effectiveMode === "auth-business") && (
            <button
              onClick={() => setMode("select")}
              className="mb-3 inline-flex items-center gap-1 text-xs text-white/70 hover:text-white"
            >
              <ArrowLeft className="h-3 w-3" /> Back
            </button>
          )}

          {effectiveMode === "select" && <SelectView setMode={setMode} onClose={() => reset(false)} />}
          {effectiveMode === "auth-traveler" && (
            <AuthForm role="traveler" onDone={() => reset(false)} />
          )}
          {effectiveMode === "auth-business" && (
            <AuthForm role="business" onDone={() => reset(false)} />
          )}
          {effectiveMode === "dashboard-traveler" && profile && (
            <TravelerDashboard profile={profile} onSignOut={async () => { await signOut(); setMode("select"); reset(false); }} />
          )}
          {effectiveMode === "dashboard-business" && profile && (
            <BusinessDashboard profile={profile} onSignOut={async () => { await signOut(); setMode("select"); reset(false); }} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const SelectView = ({ setMode, onClose }: { setMode: (m: Mode) => void; onClose: () => void }) => {
  const [busy, setBusy] = useState<null | "traveler" | "business">(null);

  const oneClick = async (kind: "traveler" | "business") => {
    setBusy(kind);
    try {
      await loginAsDemo(kind);
      toast.success(`Logged in as demo ${kind}`);
      onClose();
    } catch (e: any) {
      toast.error(e.message ?? "Login failed");
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-3xl font-bold text-white">
          Welcome to <span className="text-gradient-sunset">Travy</span>
        </DialogTitle>
        <DialogDescription className="text-white/70">
          Try the prototype with a one-click demo account, or sign up.
        </DialogDescription>
      </DialogHeader>

      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        <div className="glass rounded-2xl p-6 flex flex-col">
          <div className="h-12 w-12 rounded-xl bg-gradient-sunset grid place-items-center mb-4 shadow-glow">
            <User className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-white font-bold text-lg">I'm a Traveler</h3>
          <p className="text-white/65 text-sm mt-1 mb-4 flex-1">
            Plan trips with AI, split costs, earn points by reviewing places you've visited.
          </p>
          <Button
            onClick={() => oneClick("traveler")}
            disabled={busy !== null}
            className="bg-gradient-sunset border-0 rounded-xl mb-2"
          >
            <Zap className="h-4 w-4 mr-1" />
            {busy === "traveler" ? "Loading…" : "Demo as Abdallah"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setMode("auth-traveler")}
            className="border-white/20 text-white bg-white/5 hover:bg-white/15 rounded-xl"
          >
            Sign up / Log in
          </Button>
        </div>

        <div className="glass rounded-2xl p-6 flex flex-col">
          <div className="h-12 w-12 rounded-xl bg-gradient-sunset grid place-items-center mb-4 shadow-glow">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-white font-bold text-lg">I'm a Business Owner</h3>
          <p className="text-white/65 text-sm mt-1 mb-4 flex-1">
            Submit hidden gems, restaurants & experiences to be featured to Gen-Z travelers.
          </p>
          <Button
            onClick={() => oneClick("business")}
            disabled={busy !== null}
            className="bg-gradient-sunset border-0 rounded-xl mb-2"
          >
            <Zap className="h-4 w-4 mr-1" />
            {busy === "business" ? "Loading…" : "Demo as Marco"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setMode("auth-business")}
            className="border-white/20 text-white bg-white/5 hover:bg-white/15 rounded-xl"
          >
            Sign up / Log in
          </Button>
        </div>
      </div>
    </>
  );
};

const AuthForm = ({ role, onDone }: { role: "traveler" | "business"; onDone: () => void }) => {
  const [tab, setTab] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (tab === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              display_name: displayName || email.split("@")[0],
              role,
              business_name: role === "business" ? businessName : null,
            },
          },
        });
        if (error) throw error;
        toast.success("Account created! 🎉");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
      }
      onDone();
    } catch (err: any) {
      toast.error(err.message ?? "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-white">
          {role === "traveler" ? "Traveler" : "Business"} access
        </DialogTitle>
        <DialogDescription className="text-white/70">
          {tab === "signup" ? "Create your account in seconds." : "Sign back in."}
        </DialogDescription>
      </DialogHeader>

      <div className="flex gap-2 mt-4 mb-4 p-1 rounded-xl bg-white/5 w-fit">
        {(["signup", "signin"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              tab === t ? "bg-gradient-sunset text-white shadow-glow" : "text-white/70 hover:text-white"
            }`}
          >
            {t === "signup" ? "Sign up" : "Sign in"}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="space-y-3">
        {tab === "signup" && (
          <>
            <div>
              <Label className="text-white/80 text-xs">Display name</Label>
              <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name" className="glass-input text-white border-white/20 rounded-xl" />
            </div>
            {role === "business" && (
              <div>
                <Label className="text-white/80 text-xs">Business name</Label>
                <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Café do Mar" required
                  className="glass-input text-white border-white/20 rounded-xl" />
              </div>
            )}
          </>
        )}
        <div>
          <Label className="text-white/80 text-xs">Email</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            className="glass-input text-white border-white/20 rounded-xl" />
        </div>
        <div>
          <Label className="text-white/80 text-xs">Password</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            required minLength={6}
            className="glass-input text-white border-white/20 rounded-xl" />
        </div>
        <Button type="submit" disabled={busy}
          className="w-full bg-gradient-sunset border-0 rounded-xl h-11 font-semibold shadow-glow">
          {busy ? "Please wait…" : tab === "signup" ? "Create account" : "Sign in"}
        </Button>
      </form>
    </div>
  );
};

const TravelerDashboard = ({ profile, onSignOut }: { profile: any; onSignOut: () => void }) => {
  const quotaMax = profile.is_premium ? Infinity : 5;
  const quotaPct = profile.is_premium ? 100 : Math.min(100, (profile.prompts_used / quotaMax) * 100);

  return (
    <div className="animate-fade-in">
      <DialogHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <DialogTitle className="text-2xl font-bold text-white">Hey, {profile.display_name} 👋</DialogTitle>
            <DialogDescription className="text-white/70">Your traveler dashboard.</DialogDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onSignOut}
            className="border-white/20 text-white bg-white/5 hover:bg-white/15 rounded-xl">
            <LogOut className="h-3.5 w-3.5 mr-1" /> Sign out
          </Button>
        </div>
      </DialogHeader>

      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        <div className="glass rounded-2xl p-5">
          <p className="text-xs uppercase tracking-wider text-white/55 flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" /> AI Prompts
          </p>
          <p className="text-3xl font-bold text-white mt-1">
            {profile.is_premium ? "∞" : `${profile.prompts_used} / 5`}
          </p>
          <Progress value={quotaPct} className="h-1.5 mt-3 bg-white/10 [&>div]:bg-gradient-sunset" />
          <p className="text-xs text-white/55 mt-2">{profile.is_premium ? "Unlimited tier" : "Free yearly quota"}</p>
        </div>
        <div className="glass rounded-2xl p-5">
          <p className="text-xs uppercase tracking-wider text-white/55 flex items-center gap-1.5">
            <Coins className="h-3 w-3 text-sunset-gold" /> Points balance
          </p>
          <p className="text-3xl font-bold text-gradient-sunset mt-1">{profile.points.toLocaleString()}</p>
          <p className="text-xs text-white/55 mt-3">≈ €{Math.floor(profile.points / 100)} in vouchers</p>
        </div>
      </div>

      <div className="mt-4 glass rounded-2xl p-4 flex gap-3 items-start border border-sunset-gold/30 bg-sunset-gold/5">
        <AlertTriangle className="h-5 w-5 text-sunset-gold shrink-0 mt-0.5" />
        <p className="text-sm text-white/80">
          Submit a verified experience from your trips to earn <strong className="text-white">+500 points</strong> each.
        </p>
      </div>

      {!profile.is_premium && (
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
            <Button onClick={() => toast.success("🎉 Welcome to Travy Unlimited!")}
              className="w-full bg-gradient-sunset border-0 rounded-xl h-11 font-semibold shadow-glow">
              Upgrade to Unlimited
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const BusinessDashboard = ({ profile, onSignOut }: { profile: any; onSignOut: () => void }) => (
  <div className="animate-fade-in">
    <DialogHeader>
      <div className="flex items-start justify-between gap-3">
        <div>
          <DialogTitle className="text-2xl font-bold text-white">Grow {profile.business_name || "your business"} 🚀</DialogTitle>
          <DialogDescription className="text-white/70">Reach 18-36 travelers planning trips right now.</DialogDescription>
        </div>
        <Button variant="outline" size="sm" onClick={onSignOut}
          className="border-white/20 text-white bg-white/5 hover:bg-white/15 rounded-xl">
          <LogOut className="h-3.5 w-3.5 mr-1" /> Sign out
        </Button>
      </div>
    </DialogHeader>

    <p className="text-sm text-white/70 mt-4">
      Use the <strong className="text-white">Submit a Gem</strong> button on the homepage to add your venue —
      it appears instantly in the Featured Hidden Gems carousel.
    </p>

    <div className="grid sm:grid-cols-2 gap-4 mt-6">
      <div className="glass rounded-2xl p-6 flex flex-col">
        <Badge className="self-start bg-white/10 text-white border-white/20">Free</Badge>
        <p className="text-3xl font-bold text-white mt-3">€0</p>
        <p className="text-xs text-white/55">Forever</p>
        <p className="font-semibold text-white mt-4">Claim & Verify</p>
        <ul className="mt-3 space-y-2 text-sm text-white/75 flex-1">
          <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-400 shrink-0" /> Claim listing</li>
          <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-400 shrink-0" /> Verified badge</li>
          <li className="flex gap-2"><Check className="h-4 w-4 text-emerald-400 shrink-0" /> Respond to reviews</li>
        </ul>
        <Badge className="mt-4 self-start bg-emerald-500/20 text-emerald-200 border-emerald-400/30">Active</Badge>
      </div>

      <div className="rounded-2xl p-6 flex flex-col relative overflow-hidden border border-sunset-coral/40 bg-gradient-to-br from-sunset-coral/15 via-sunset-pink/10 to-sunset-purple/15 backdrop-blur-xl">
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-gradient-sunset opacity-30 blur-3xl" />
        <div className="relative">
          <Badge className="self-start bg-gradient-sunset border-0 gap-1"><Crown className="h-3 w-3" /> Premium</Badge>
          <p className="text-3xl font-bold text-white mt-3">€49<span className="text-sm text-white/60">/mo</span></p>
          <p className="text-xs text-white/55">Cancel anytime</p>
          <p className="font-semibold text-white mt-4">Featured Partner</p>
          <ul className="mt-3 space-y-2 text-sm text-white/85">
            <li className="flex gap-2"><Sparkles className="h-4 w-4 text-sunset-gold shrink-0" /> Featured carousel</li>
            <li className="flex gap-2"><BarChart3 className="h-4 w-4 text-sunset-gold shrink-0" /> Customer analytics</li>
            <li className="flex gap-2"><Gift className="h-4 w-4 text-sunset-gold shrink-0" /> Custom vouchers</li>
          </ul>
          <Button onClick={() => toast.success("🚀 Premium plan activated!")}
            className="mt-5 w-full bg-gradient-sunset border-0 rounded-xl font-semibold shadow-glow">
            Go Premium
          </Button>
        </div>
      </div>
    </div>
  </div>
);
