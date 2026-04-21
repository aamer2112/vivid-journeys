// Generate a structured travel itinerary via Lovable AI Gateway (gpt-5)
// Returns JSON: { title, destination, travelers, days: [{ day, label, activities: [...] }] }

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const ITINERARY_TOOL = {
  type: "function",
  function: {
    name: "build_itinerary",
    description: "Build a structured group travel itinerary with daily activities and price ranges per person.",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string", description: "Catchy 3-5 word trip title" },
        destination: { type: "string" },
        travelers: { type: "integer", minimum: 1 },
        summary: { type: "string", description: "One-sentence vibe summary." },
        days: {
          type: "array",
          minItems: 1,
          maxItems: 5,
          items: {
            type: "object",
            properties: {
              day: { type: "integer" },
              label: { type: "string", description: "e.g. 'Saturday — Arrival & Cliffs'" },
              activities: {
                type: "array",
                minItems: 3,
                maxItems: 6,
                items: {
                  type: "object",
                  properties: {
                    time: { type: "string", description: "HH:MM 24h" },
                    title: { type: "string" },
                    location: { type: "string" },
                    category: {
                      type: "string",
                      enum: ["hike", "food", "beach", "culture", "nightlife", "transport", "experience", "stay"],
                    },
                    tag: { type: "string", description: "e.g. Hidden gem, Local pick, Sponsored, Verified" },
                    price_min: { type: "number", description: "EUR per person, lower bound (0 if free)" },
                    price_max: { type: "number", description: "EUR per person, upper bound" },
                    ai_note: { type: "string", description: "Optional AI optimization note" },
                  },
                  required: ["time", "title", "location", "category", "tag", "price_min", "price_max"],
                  additionalProperties: false,
                },
              },
            },
            required: ["day", "label", "activities"],
            additionalProperties: false,
          },
        },
      },
      required: ["title", "destination", "travelers", "summary", "days"],
      additionalProperties: false,
    },
  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { prompt, model = "openai/gpt-5", travelers = 4 } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "Missing prompt" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are Travy, an expert Gen-Z travel planner.
Build a multi-day group itinerary focused on local hidden gems, food, nature, and nightlife — NOT generic hotels/flights.
Use realistic EUR price ranges per person. Mix free activities with paid ones. Keep titles short and evocative.
Default to ${travelers} travelers if not specified. Always call build_itinerary.`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        tools: [ITINERARY_TOOL],
        tool_choice: { type: "function", function: { name: "build_itinerary" } },
      }),
    });

    if (aiResp.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limited. Try again in a minute." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (aiResp.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits exhausted. Add funds in Settings → Workspace → Usage." }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!aiResp.ok) {
      const t = await aiResp.text();
      console.error("AI gateway error", aiResp.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiResp.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      console.error("No tool call in response", JSON.stringify(data));
      return new Response(JSON.stringify({ error: "AI did not return a structured plan." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const plan = JSON.parse(toolCall.function.arguments);

    // Add stable activity IDs
    plan.days = (plan.days || []).map((d: any, di: number) => ({
      ...d,
      activities: (d.activities || []).map((a: any, ai: number) => ({
        ...a,
        id: `${di}-${ai}-${crypto.randomUUID().slice(0, 8)}`,
      })),
    }));

    return new Response(JSON.stringify({ plan }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-itinerary error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
