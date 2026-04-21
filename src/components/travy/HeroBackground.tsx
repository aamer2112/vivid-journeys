import { useEffect, useState } from "react";
import machu from "@/assets/hero-machu.jpg";
import madeira from "@/assets/hero-madeira.jpg";
import bali from "@/assets/hero-bali.jpg";
import santorini from "@/assets/hero-santorini.jpg";

const slides = [
  { src: machu, label: "Machu Picchu, Peru" },
  { src: madeira, label: "Madeira Cliffs, Portugal" },
  { src: bali, label: "Bali Sunset, Indonesia" },
  { src: santorini, label: "Santorini, Greece" },
];

export const HeroBackground = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
      {slides.map((s, i) => (
        <div
          key={s.src}
          className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
          style={{ opacity: i === active ? 1 : 0 }}
        >
          <img
            src={s.src}
            alt={s.label}
            className="h-full w-full object-cover animate-kenburns"
            loading={i === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}
      {/* Readability overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
      <div className="absolute inset-0 bg-gradient-aurora opacity-30 mix-blend-overlay" />

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((s, i) => (
          <button
            key={s.label}
            onClick={() => setActive(i)}
            aria-label={`Show ${s.label}`}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === active ? "w-10 bg-gradient-sunset" : "w-4 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
      <div className="absolute bottom-6 right-6 hidden md:block text-xs text-white/70 font-medium tracking-wide">
        {slides[active].label}
      </div>
    </div>
  );
};
