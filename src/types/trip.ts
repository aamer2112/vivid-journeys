export interface Activity {
  id: string;
  time: string;
  title: string;
  location: string;
  category: "hike" | "food" | "beach" | "culture" | "nightlife" | "transport" | "experience" | "stay";
  tag: string;
  price_min: number;
  price_max: number;
  ai_note?: string;
}

export interface ItineraryDay {
  day: number;
  label: string;
  activities: Activity[];
}

export interface TripPlan {
  title: string;
  destination: string;
  travelers: number;
  summary: string;
  days: ItineraryDay[];
}

export interface TripRow {
  id: string;
  user_id: string;
  title: string;
  destination: string;
  start_date: string | null;
  end_date: string | null;
  travelers: number;
  model_used: string | null;
  plan: TripPlan;
  created_at: string;
  updated_at: string;
}
