"use client";
import { useState, useEffect} from "react";
import FadeIn from "./FadeIn";


const quotes = [
  {
    quote: "Adam didn't treat our account as a ticket queue, he treated it as a partnership.",
    name: "Amanda Johns",
    title: "VP, Confianz Client",
  },
  {
    quote: "Whenever there was a problem, Adam was the first person I knew I could trust to help diagnose the issue, align teams, and drive a thoughtful resolution.",
    name: "Ken Schul",
    title: "Director, StackBench",
  },
  {
    quote: "Prospects were never left wondering what was next.",
    name: "Mike Duberstein",
    title: "Fractional Presales Partner",
  },
  {
    quote: "Adam brings a rare combination of strategic thinking, customer empathy, and operational discipline.",
    name: "Anoop Menon",
    title: "CEO, Confianz Global",
  },
  {
    quote: "Adam's strategic thinking and focus on expanded offerings were vital in transforming our legacy graphic design studio into a full-blown creative agency!",
    name: "Harry Karamitopoulos",
    title: "President",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);
const [paused, setPaused] = useState(false);

useEffect(() => {
  if (paused) return;
  const timer = setInterval(() => {
    setIndex((i) => (i + 1) % quotes.length);
  }, 5000);
  return () => clearInterval(timer);
}, [paused]);

  return (
    <section className="px-6 py-20 border-b border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-12">
          <div className="md:col-span-3">
            <FadeIn direction="left">
              <p className="font-mono text-xs tracking-widest uppercase text-white/50">
                What people say
              </p>
            </FadeIn>
          </div>
          <div className="md:col-span-9">
            <FadeIn delay={100}>
              <p className="font-mono text-sm tracking-widest uppercase text-white/60 mb-2">
                A former colleague once called me the Swiss Army Knife of implementations.
              </p>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tighter text-white leading-none">
                I'll take it.
              </h2>
            </FadeIn>
          </div>
        </div>

        <FadeIn delay={150}>
          <div
  className="border border-white/20 p-8 sm:p-12 relative min-h-[200px] flex flex-col justify-between bg-white/[0.03]"
  onMouseEnter={() => setPaused(true)}
  onMouseLeave={() => setPaused(false)}
>
            <div className="w-8 h-[2px] bg-accent mb-8" />
            <p className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter text-white leading-snug max-w-4xl mb-8">
              "{quotes[index].quote}"
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-xs tracking-widest uppercase text-accent">
                  {quotes[index].name}
                </p>
                <p className="font-mono text-xs tracking-widest uppercase text-white/50 mt-1">
                  {quotes[index].title}
                </p>
              </div>
              <div className="flex items-center gap-4">
  <button
    onClick={() => setIndex((i) => (i - 1 + quotes.length) % quotes.length)}
    className="font-mono text-white/50 hover:text-accent transition-colors text-lg"
  >
    &larr;
  </button>
  <div className="flex gap-2">
    {quotes.map((_, i) => (
      <button
        key={i}
        onClick={() => setIndex(i)}
        className={`w-1.5 h-1.5 rounded-full transition-colors ${
          i === index ? "bg-accent" : "bg-white/20"
        }`}
      />
    ))}
  </div>
  <button
    onClick={() => setIndex((i) => (i + 1) % quotes.length)}
    className="font-mono text-white/50 hover:text-accent transition-colors text-lg"
  >
    &rarr;
  </button>
</div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}