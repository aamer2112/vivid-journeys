// Seeds a Madeira weekend trip for the user on first login
import { supabase } from "@/integrations/supabase/client";
import type { TripPlan } from "@/types/trip";

const SEED_PLAN: TripPlan = {
  title: "Madeira Weekend Escape",
  destination: "Madeira, Portugal",
  travelers: 4,
  summary: "Optimized for time & budget — surf, hidden food, sunset vibes.",
  days: [
    {
      day: 1,
      label: "Saturday — Cliffs & Cove",
      activities: [
        { id: "s-1-0", time: "10:00", title: "Sunrise Hike — Pico do Arieiro", location: "Madeira", category: "hike", tag: "Hidden gem", price_min: 0, price_max: 0 },
        { id: "s-1-1", time: "14:00", title: "Boat Rental — Secret Cove", location: "Câmara de Lobos", category: "beach", tag: "Sponsored", price_min: 30, price_max: 45 },
        { id: "s-1-2", time: "16:00", title: "Hidden Gem Cafe — Café do Mar", location: "Funchal", category: "food", tag: "Local pick", price_min: 8, price_max: 15, ai_note: "saves 15 min walking" },
        { id: "s-1-3", time: "21:30", title: "Sunset Tapas + DJ Set", location: "Rooftop Lisboa", category: "nightlife", tag: "Verified", price_min: 25, price_max: 40 },
      ],
    },
    {
      day: 2,
      label: "Sunday — Levadas & Surf",
      activities: [
        { id: "s-2-0", time: "09:00", title: "Levada Walk — 25 Fontes", location: "Rabaçal", category: "hike", tag: "Hidden gem", price_min: 0, price_max: 0 },
        { id: "s-2-1", time: "13:00", title: "Local Espetada Lunch", location: "Estreito", category: "food", tag: "Local pick", price_min: 12, price_max: 20 },
        { id: "s-2-2", time: "16:00", title: "Surf Lesson — Jardim do Mar", location: "Jardim do Mar", category: "experience", tag: "Sponsored", price_min: 35, price_max: 50 },
        { id: "s-2-3", time: "20:00", title: "Beach Bonfire & Drinks", location: "Porto Moniz", category: "nightlife", tag: "Hidden gem", price_min: 10, price_max: 20 },
      ],
    },
  ],
};

export async function ensureSeedTrip(userId: string) {
  const { data: existing } = await supabase
    .from("trips")
    .select("id")
    .eq("user_id", userId)
    .eq("title", SEED_PLAN.title)
    .maybeSingle();
  if (existing) return existing;

  const { data } = await supabase
    .from("trips")
    .insert({
      user_id: userId,
      title: SEED_PLAN.title,
      destination: SEED_PLAN.destination,
      travelers: SEED_PLAN.travelers,
      model_used: "gpt-4o",
      plan: SEED_PLAN as any,
    })
    .select("id")
    .single();
  return data;
}
