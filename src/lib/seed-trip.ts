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
        {
          id: "s-1-0",
          time: "10:00",
          title: "Sunrise Hike — Pico do Arieiro",
          location: "Madeira",
          address: "Pico do Arieiro, 9050-280 Funchal, Portugal",
          category: "hike",
          tag: "Hidden gem",
          price_min: 0,
          price_max: 0,
          why_timesaver: "We routed you here first while parking is free and the trail is empty — saves ~45 min vs the midday crowd.",
        },
        {
          id: "s-1-1",
          time: "14:00",
          title: "Boat Rental — Secret Cove",
          location: "Câmara de Lobos",
          address: "Marina de Câmara de Lobos, 9300-101, Madeira",
          category: "beach",
          tag: "Sponsored",
          price_min: 30,
          price_max: 45,
          ai_note: "pre-booked slot saves 25 min queue",
          why_timesaver: "Departure timed with your hike finish + tide window so you land in the cove at peak sun.",
        },
        {
          id: "s-1-2",
          time: "16:00",
          title: "Hidden Gem Café — Café do Mar",
          location: "Funchal",
          address: "Rua de Santa Maria 119, 9060-291 Funchal",
          category: "food",
          tag: "Local pick",
          price_min: 8,
          price_max: 15,
          ai_note: "saves 15 min walking",
          why_timesaver: "Picked over the touristy spot 3 blocks away — same vibe, half the wait, zero detour.",
        },
        {
          id: "s-1-3",
          time: "21:30",
          title: "Sunset Tapas + DJ Set",
          location: "Rooftop Lisboa",
          address: "Av. Arriaga 75, 9000-064 Funchal",
          category: "nightlife",
          tag: "Verified",
          price_min: 25,
          price_max: 40,
          why_timesaver: "Reservation pre-held under your group — skip the 40 min Saturday line.",
        },
      ],
    },
    {
      day: 2,
      label: "Sunday — Levadas & Surf",
      activities: [
        {
          id: "s-2-0",
          time: "09:00",
          title: "Levada Walk — 25 Fontes",
          location: "Rabaçal",
          address: "Rabaçal, 9370-352 Calheta, Madeira",
          category: "hike",
          tag: "Hidden gem",
          price_min: 0,
          price_max: 0,
          why_timesaver: "Shuttle pickup arranged — saves the 5 km gravel road drive in your rental.",
        },
        {
          id: "s-2-1",
          time: "13:00",
          title: "Local Espetada Lunch",
          location: "Estreito",
          address: "Estr. da Igreja 6, 9325-034 Estreito de Câmara de Lobos",
          category: "food",
          tag: "Local pick",
          price_min: 12,
          price_max: 20,
          why_timesaver: "On the route from Rabaçal back to surf — zero backtrack.",
        },
        {
          id: "s-2-2",
          time: "16:00",
          title: "Surf Lesson — Jardim do Mar",
          location: "Jardim do Mar",
          address: "Praia do Jardim do Mar, 9370-203 Calheta",
          category: "experience",
          tag: "Sponsored",
          price_min: 35,
          price_max: 50,
          ai_note: "swell forecast checked",
          why_timesaver: "Wetsuits & boards waiting — straight-to-water, saves 30 min rental shuffle.",
        },
        {
          id: "s-2-3",
          time: "20:00",
          title: "Beach Bonfire & Drinks",
          location: "Porto Moniz",
          address: "Praia de Porto Moniz, 9270-095",
          category: "nightlife",
          tag: "Hidden gem",
          price_min: 10,
          price_max: 20,
          why_timesaver: "Group spot pre-reserved — no wandering the coast looking for vibes.",
        },
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
