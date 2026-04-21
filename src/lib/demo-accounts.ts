// Pre-baked demo accounts for one-click investor demo.
// Email signups in Lovable Cloud have email confirmation OFF by default,
// so signup → instant session.
import { supabase } from "@/integrations/supabase/client";

export const DEMO_ACCOUNTS = {
  traveler: {
    email: "sofia.traveler@travy.demo",
    password: "TravyDemo2026!",
    display_name: "Sofia",
    role: "traveler" as const,
    business_name: null,
  },
  business: {
    email: "marco.business@travy.demo",
    password: "TravyDemo2026!",
    display_name: "Marco",
    role: "business" as const,
    business_name: "Café do Mar",
  },
};

export async function loginAsDemo(kind: "traveler" | "business") {
  const acc = DEMO_ACCOUNTS[kind];
  // Try sign-in first
  const { error: signInErr } = await supabase.auth.signInWithPassword({
    email: acc.email,
    password: acc.password,
  });
  if (!signInErr) return { created: false };

  // Otherwise sign up
  const { error: signUpErr } = await supabase.auth.signUp({
    email: acc.email,
    password: acc.password,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
      data: {
        display_name: acc.display_name,
        role: acc.role,
        business_name: acc.business_name,
      },
    },
  });
  if (signUpErr) throw signUpErr;
  return { created: true };
}
