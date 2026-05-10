import { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import {
  HelpCircle,
  MessageSquare,
  CreditCard,
  Bot,
  Mail,
  Send,
  CheckCircle2,
  ArrowRight,
  LifeBuoy,
} from "lucide-react";

const FAQS = [
  {
    question: "How does the AI itinerary planner work?",
    answer:
      "Tell us your destination, dates, and group vibe. Our AI instantly builds a day-by-day itinerary with time-saving routes, hidden local gems, and per-person pricing. You can add or remove activities to fine-tune the plan and budget.",
    icon: Bot,
  },
  {
    question: "Is Split-Pay really cashless?",
    answer:
      "Yes. Once the trip is locked, everyone gets a secure payment link. We hold the funds until the experience is confirmed, then pay the local partner directly. No more chasing friends for cash.",
    icon: CreditCard,
  },
  {
    question: "Why was I charged before the trip is confirmed?",
    answer:
      "We place a temporary authorization to verify your card. You are only charged when the host confirms availability. If confirmation fails, the hold is released automatically.",
    icon: CreditCard,
  },
  {
    question: "How do I earn and redeem points?",
    answer:
      "Earn Travy Points by leaving verified reviews, uploading photo stories, and referring friends. Redeem them for discount vouchers at restaurants, activity hosts, and partner shops listed in the Gems section.",
    icon: CheckCircle2,
  },
  {
    question: "What happens if an AI suggestion is wrong?",
    answer:
      "Tap the activity to see full details. If something looks off — wrong hours, closed location, bad route — hit 'Report an Issue' below and our team will fix it within 24 hours and credit you bonus points.",
    icon: Bot,
  },
  {
    question: "Can I add my own restaurant or hidden gem?",
    answer:
      "Absolutely. Log in as a business owner (demo available) and submit your spot. Once verified, it appears in the Featured Gems carousel and you unlock analytics and voucher tools.",
    icon: MessageSquare,
  },
];

const CONTACTS = [
  {
    label: "Email Support",
    value: "hello@travy.app",
    sub: "We reply within 24h",
    icon: Mail,
  },
  {
    label: "Live Chat",
    value: "Open chat",
    sub: "Mon–Fri 08:00–20:00 CET",
    icon: MessageSquare,
  },
  {
    label: "Emergency Line",
    value: "+351 912 345 678",
    sub: "For active trip issues only",
    icon: LifeBuoy,
  },
];

type IssueCategory = "ai" | "payment" | "general";

export const HelpSupport = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [issueCategory, setIssueCategory] = useState<IssueCategory>("general");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all fields.");
      return;
    }
    // Simulate send
    setSubmitted(true);
    toast.success("Ticket sent! We'll get back to you within 24 hours.");
    setTimeout(() => {
      setSheetOpen(false);
      setSubmitted(false);
      setForm({ name: "", email: "", message: "" });
    }, 1800);
  };

  return (
    <section id="help" className="relative py-20">
      <div className="container max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-white/90 mb-4 font-medium">
            <HelpCircle className="h-3 w-3 text-sunset-gold" />
            Help Center
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Got questions? <span className="text-gradient-sunset">We got answers.</span>
          </h2>
          <p className="text-white/70 mt-3 max-w-lg mx-auto">
            Everything about AI planning, Split-Pay, points, and how to get your business featured.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="glass rounded-3xl p-6 md:p-8 mb-10">
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq, i) => {
              const Icon = faq.icon;
              return (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="border-b border-white/10 last:border-b-0"
                >
                  <AccordionTrigger className="text-left text-white/90 hover:text-white hover:no-underline py-5 text-base font-medium flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 shrink-0">
                      <Icon className="h-4 w-4 text-sunset-gold" />
                    </span>
                    <span className="flex-1">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-white/70 text-sm leading-relaxed pl-11 pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {CONTACTS.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.label}
                className="glass rounded-2xl p-5 flex flex-col items-start hover:bg-white/10 transition cursor-pointer group"
                onClick={() => {
                  if (c.label === "Live Chat") setSheetOpen(true);
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-sunset flex items-center justify-center mb-3 shadow-glow">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <p className="text-white font-semibold text-sm">{c.label}</p>
                <p className="text-white font-bold text-base mt-0.5 group-hover:text-sunset-gold transition">
                  {c.value}
                </p>
                <p className="text-white/50 text-xs mt-1">{c.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Report Issue CTA */}
        <div className="glass rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white font-bold text-lg">Still stuck?</h3>
            <p className="text-white/60 text-sm mt-1">
              Report an issue with AI suggestions or payments and we will fix it within 24h.
            </p>
          </div>
          <Button
            onClick={() => setSheetOpen(true)}
            className="bg-gradient-sunset hover:opacity-90 text-white border-0 shadow-glow rounded-xl font-semibold px-6"
          >
            <Send className="h-4 w-4 mr-2" />
            Report an Issue
          </Button>
        </div>
      </div>

      {/* Contact / Report Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md bg-[hsl(240_20%_6%)] border-l border-white/10 p-0 overflow-y-auto"
        >
          <div className="p-6">
            <SheetHeader className="mb-6">
              <SheetTitle className="text-white text-xl flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-sunset-gold" />
                Contact Travy Support
              </SheetTitle>
              <SheetDescription className="text-white/60">
                Choose a topic and tell us what is going on. We usually reply within a few hours.
              </SheetDescription>
            </SheetHeader>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                </div>
                <h4 className="text-white font-bold text-lg">Ticket received!</h4>
                <p className="text-white/60 text-sm mt-2 max-w-xs">
                  Our team will review your report and get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Category chips */}
                <div>
                  <label className="text-white/70 text-xs font-medium mb-2 block">
                    What is this about?
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {(["general", "ai", "payment"] as IssueCategory[]).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setIssueCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                          issueCategory === cat
                            ? "bg-gradient-sunset text-white border-transparent shadow-glow"
                            : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        {cat === "ai" && "AI / Itinerary"}
                        {cat === "payment" && "Payment / Split-Pay"}
                        {cat === "general" && "General"}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-white/70 text-xs font-medium mb-1.5 block">Name</label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Your name"
                    className="glass-input text-white placeholder:text-white/40 border-white/10 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-white/70 text-xs font-medium mb-1.5 block">Email</label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="you@email.com"
                    className="glass-input text-white placeholder:text-white/40 border-white/10 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-white/70 text-xs font-medium mb-1.5 block">Message</label>
                  <Textarea
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder="Describe the issue or question..."
                    rows={5}
                    className="glass-input text-white placeholder:text-white/40 border-white/10 rounded-xl resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-sunset hover:opacity-90 text-white border-0 shadow-glow rounded-xl font-semibold h-11"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Ticket
                </Button>

                <p className="text-white/40 text-[11px] text-center">
                  By sending this, you agree to our Privacy Policy and allow us to contact you via email.
                </p>
              </form>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};
