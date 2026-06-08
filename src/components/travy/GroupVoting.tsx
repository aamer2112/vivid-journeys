import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, X, Vote, Users, Sparkles, RotateCcw } from "lucide-react";

interface VoteCard {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  tag: string;
}

const CARDS: VoteCard[] = [
  {
    id: "levada",
    title: "Levada Walk — 25 Fontes",
    subtitle: "Lush waterfall hike through laurel forest",
    image: "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?auto=format&fit=crop&w=900&q=80",
    tag: "Hike",
  },
  {
    id: "cabogirao",
    title: "Cabo Girão Skywalk",
    subtitle: "Glass platform 580m above the Atlantic",
    image: "https://images.unsplash.com/photo-1505764706515-aa95265c5abc?auto=format&fit=crop&w=900&q=80",
    tag: "View",
  },
  {
    id: "poncha",
    title: "Poncha tasting in Câmara de Lobos",
    subtitle: "Local rum + honey + lemon, fishermen bar",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=900&q=80",
    tag: "Nightlife",
  },
  {
    id: "dolphin",
    title: "Dolphin & Whale Watching",
    subtitle: "Catamaran cruise from Funchal marina",
    image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=900&q=80",
    tag: "Ocean",
  },
];

type Vote = "yes" | "no";

export const GroupVoting = () => {
  const [idx, setIdx] = useState(0);
  const [votes, setVotes] = useState<Record<string, { yes: number; no: number; mine?: Vote }>>(() =>
    Object.fromEntries(CARDS.map((c) => [c.id, { yes: Math.floor(Math.random() * 3), no: 0 }])),
  );
  const [drag, setDrag] = useState(0);
  const [exiting, setExiting] = useState<Vote | null>(null);

  const card = CARDS[idx];
  const friendsTotal = 4;
  const tally = card ? votes[card.id] : { yes: 0, no: 0 };
  const friendsVoted = Math.min(friendsTotal, (tally.yes ?? 0) + (tally.no ?? 0) + (tally.mine ? 1 : 0));

  const overallConsensus = useMemo(() => {
    const totalYes = Object.values(votes).reduce((s, v) => s + v.yes + (v.mine === "yes" ? 1 : 0), 0);
    const totalVotes = Object.values(votes).reduce(
      (s, v) => s + v.yes + v.no + (v.mine ? 1 : 0),
      0,
    );
    return totalVotes ? Math.round((totalYes / totalVotes) * 100) : 0;
  }, [votes]);

  const castVote = (v: Vote) => {
    if (!card) return;
    setExiting(v);
    setTimeout(() => {
      setVotes((prev) => ({ ...prev, [card.id]: { ...prev[card.id], mine: v } }));
      setIdx((i) => i + 1);
      setExiting(null);
      setDrag(0);
    }, 280);
  };

  const reset = () => {
    setIdx(0);
    setVotes(Object.fromEntries(CARDS.map((c) => [c.id, { yes: Math.floor(Math.random() * 3), no: 0 }])));
  };

  // pointer drag
  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const startX = e.clientX;
    const move = (ev: PointerEvent) => setDrag(ev.clientX - startX);
    const up = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      if (dx > 100) castVote("yes");
      else if (dx < -100) castVote("no");
      else setDrag(0);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  return (
    <div className="glass-strong rounded-3xl p-6 md:p-7">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-white font-semibold text-lg flex items-center gap-2">
          <Vote className="h-5 w-5 text-sunset-coral" /> Group Vibe Check
        </h3>
        <Badge className="bg-white/10 text-white/80 border-white/15 backdrop-blur gap-1">
          <Users className="h-3 w-3" /> {friendsTotal} friends
        </Badge>
      </div>
      <p className="text-white/65 text-sm mb-5">
        Swipe right for <span className="text-emerald-300 font-medium">Yes</span>, left for{" "}
        <span className="text-rose-300 font-medium">No</span> — the group decides together.
      </p>

      <div className="relative h-[380px] flex items-center justify-center select-none">
        {card ? (
          <>
            {/* next card peek */}
            {CARDS[idx + 1] && (
              <div className="absolute inset-x-6 top-4 bottom-4 rounded-3xl bg-white/5 border border-white/10 scale-95 opacity-60" />
            )}
            <div
              onPointerDown={onPointerDown}
              style={{
                transform: exiting
                  ? `translateX(${exiting === "yes" ? 600 : -600}px) rotate(${exiting === "yes" ? 25 : -25}deg)`
                  : `translateX(${drag}px) rotate(${drag / 18}deg)`,
                transition: exiting || drag === 0 ? "transform 280ms ease-out" : "none",
              }}
              className="absolute inset-x-0 mx-auto w-full max-w-sm h-full rounded-3xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing"
            >
              <img src={card.image} alt={card.title} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <Badge className="absolute top-4 left-4 bg-white/15 text-white border-white/20 backdrop-blur">
                {card.tag}
              </Badge>
              {/* like / nope stamps */}
              <div
                className="absolute top-6 right-6 px-3 py-1 rounded-lg border-2 border-emerald-300 text-emerald-300 font-extrabold tracking-widest rotate-12 transition-opacity"
                style={{ opacity: Math.min(1, Math.max(0, drag / 80)) }}
              >
                YES
              </div>
              <div
                className="absolute top-6 left-6 px-3 py-1 rounded-lg border-2 border-rose-300 text-rose-300 font-extrabold tracking-widest -rotate-12 transition-opacity"
                style={{ opacity: Math.min(1, Math.max(0, -drag / 80)) }}
              >
                NOPE
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-white font-bold text-xl leading-tight">{card.title}</p>
                <p className="text-white/80 text-sm mt-1">{card.subtitle}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center animate-fade-in">
            <Sparkles className="h-10 w-10 text-sunset-gold mx-auto mb-3" />
            <p className="text-white font-semibold text-lg">All voted!</p>
            <p className="text-white/70 text-sm mt-1">
              Group consensus: <span className="text-gradient-sunset font-bold">{overallConsensus}% Yes</span>
            </p>
            <Button onClick={reset} variant="outline" className="mt-4 border-white/20 bg-white/5 text-white hover:bg-white/10">
              <RotateCcw className="h-4 w-4 mr-1" /> Vote again
            </Button>
          </div>
        )}
      </div>

      {card && (
        <div className="flex items-center justify-center gap-6 mt-5">
          <button
            onClick={() => castVote("no")}
            className="h-14 w-14 rounded-full bg-white/10 hover:bg-rose-500/30 border border-white/15 grid place-items-center text-rose-300 transition hover:scale-110"
            aria-label="Vote no"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            onClick={() => castVote("yes")}
            className="h-16 w-16 rounded-full bg-gradient-sunset shadow-glow grid place-items-center text-white transition hover:scale-110"
            aria-label="Vote yes"
          >
            <Heart className="h-7 w-7" />
          </button>
        </div>
      )}

      <div className="mt-6">
        <div className="flex items-center justify-between text-xs text-white/65 mb-1.5">
          <span>Group Consensus</span>
          <span className="text-white font-semibold">
            {friendsVoted}/{friendsTotal} friends voted
          </span>
        </div>
        <Progress
          value={(friendsVoted / friendsTotal) * 100}
          className="h-2 bg-white/10 [&>div]:bg-gradient-sunset"
        />
      </div>
    </div>
  );
};
