"use client";
import { useState } from "react";
import FadeIn from "./FadeIn";

const ibis = {
  name: "Ibis Men's Golf App",
  tagline: "Golf scheduling, scoring & handicap platform",
  status: "Live",
  description:
    "A full-stack web app built for a real golf group. Handles scheduling, scoring, leaderboards, and a custom handicap engine built from scratch. We pulled GHIN out entirely and calculate handicaps ourselves — the most technically sophisticated piece of the project. Login-protected with Supabase auth, relational database, and real data.",
  stack: ["Next.js", "React", "Tailwind CSS", "Supabase", "PostgreSQL"],
  link: "https://ibis-golf-app.vercel.app/",
  screenshots: [
    "/ibis/ibis1.png",
    "/ibis/ibis2.png",
    "/ibis/ibis3.png",
    "/ibis/ibis4.png",
    "/ibis/ibis5.png",
    "/ibis/ibis6.png",
    "/ibis/ibis7.png",
  ],
};

const kraveApps = [
  {
    name: "Krave",
    tagline: "Restaurant randomizer",
    status: "Live on iOS",
    accent: "#FF1F8F",
    description:
      "Can't decide where to eat? Krave decides for you. Pick a cuisine, set a radius, and let the spin mechanic find your next meal. Built with Google Places API, live location, and Supabase session logging.",
    stack: ["React Native", "Expo", "TypeScript", "Google Places API", "Supabase"],
    github: "https://github.com/adgrossm/Krave",
    screenshots: [
  "/krave/krave-home.PNG",
  "/krave/krave-result1.PNG",
  "/krave/krave-result2.PNG",
],
  },
  {
    name: "Krave Out",
    tagline: "Bar & nightlife randomizer",
    status: "Live",
    accent: "#00E5FF",
    description:
      "Same philosophy as Krave, pointed at nightlife. Pick a vibe — dive bar, rooftop, cocktail bar, club — and let it decide. Includes a Get Me Out of Here escape button for when you need to go somewhere, anywhere, right now.",
    stack: ["React Native", "Expo", "TypeScript", "Google Places API", "Supabase"],
    github: "https://github.com/adgrossm/KraveOut",
    screenshots: [
  "/kraveout/kraveout-home.PNG",
  "/kraveout/kraveout-home2.PNG",
  "/kraveout/kraveout-result1.PNG",
  "/kraveout/kraveout-result2.PNG",
],
  },
  {
    name: "Krave Pour",
    tagline: "Drink randomizer",
    status: "Live",
    accent: "#C6FF1A",
    description:
      "What are you drinking tonight? Pick a vibe and a spirit, and Krave Pour spins up a drink recommendation pulled from a full cocktail database. Complete with ingredients and instructions.",
    stack: ["React Native", "Expo", "TypeScript", "TheCocktailDB API", "Supabase"],
    github: "https://github.com/adgrossm/KravePour",
    screenshots: [
  "/kravepour/kravepour-home1.PNG",
  "/kravepour/kravepour-home2.PNG",
  "/kravepour/kravepour-home3.PNG",
  "/kravepour/kravepour-result1.PNG",
  "/kravepour/kravepour-result2.PNG",
  "/kravepour/kravepour-result3.PNG",
],
  },
];

function IbisCarousel({ screenshots }: { screenshots: string[] }) {
  const [index, setIndex] = useState(0);
  return (
    <div className="relative w-full h-full flex items-center justify-center group">
      <img
        src={screenshots[index]}
        alt={`Ibis screenshot ${index + 1}`}
        className="w-full h-full object-cover"
      />
      <button
        onClick={() => setIndex((i) => (i - 1 + screenshots.length) % screenshots.length)}
        className="absolute left-2 p-2 text-2xl text-white/60 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
      >
        ‹
      </button>
      <button
        onClick={() => setIndex((i) => (i + 1) % screenshots.length)}
        className="absolute right-2 p-2 text-2xl text-white/60 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
      >
        ›
      </button>
      <div className="absolute bottom-2 flex gap-1">
        {screenshots.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${i === index ? "bg-accent" : "bg-white/30"}`}
          />
        ))}
      </div>
    </div>
  );
}

function ScreenshotCarousel({ screenshots, accent }: { screenshots: string[], accent: string }) {
  const [index, setIndex] = useState(0);
  return (
    <div className="w-full flex flex-col items-center gap-2">
      <div className="relative w-full flex items-center justify-center">
        <button
          onClick={() => setIndex((i) => (i - 1 + screenshots.length) % screenshots.length)}
          className="absolute left-0 z-10 p-1 text-white/40 hover:text-white transition-colors"
        >
          ‹
        </button>
        <div className="relative mx-8" style={{ width: "160px" }}>
          <div className="rounded-[28px] border-2 overflow-hidden bg-black shadow-xl" style={{ borderColor: accent + '40' }}>
            <img
              src={screenshots[index]}
              alt={`Screenshot ${index + 1}`}
              className="w-full block"
              style={{ aspectRatio: "9/19.5", objectFit: "cover" }}
            />
          </div>
        </div>
        <button
          onClick={() => setIndex((i) => (i + 1) % screenshots.length)}
          className="absolute right-0 z-10 p-1 text-white/40 hover:text-white transition-colors"
        >
          ›
        </button>
      </div>
      <div className="flex gap-1">
        {screenshots.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className="w-1.5 h-1.5 rounded-full transition-colors"
            style={{ backgroundColor: i === index ? accent : 'rgba(255,255,255,0.2)' }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="px-6 py-20 md:py-28 border-b border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-12 md:mb-16">
          <div className="md:col-span-3">
            <FadeIn direction="left">
              <p className="font-mono text-xs tracking-widest uppercase text-white/50">
                Projects
              </p>
            </FadeIn>
          </div>
          <div className="md:col-span-9">
            <FadeIn delay={100}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white leading-none">
                What I&apos;ve Built
              </h2>
            </FadeIn>
          </div>
        </div>

        {/* Ibis */}
        <FadeIn delay={100}>
          <div className="border border-white/10 hover:border-white/20 transition-colors mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">
              <div className="bg-[#06060C] aspect-video overflow-hidden">
                <IbisCarousel screenshots={ibis.screenshots} />
              </div>
              <div className="bg-[#06060C] p-8 sm:p-10 flex flex-col justify-between gap-8">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-2xl sm:text-3xl font-black tracking-tighter text-white">
                      {ibis.name}
                    </h3>
                    <span className="font-mono text-[10px] tracking-widest uppercase text-accent mt-1">
                      {ibis.status}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-white/50 tracking-wide uppercase mb-5">
                    {ibis.tagline}
                  </p>
                  <p className="text-white/70 text-base leading-relaxed">
                    {ibis.description}
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2">
                    {ibis.stack.map((tech) => (
                      <span key={tech} className="font-mono text-xs tracking-widest uppercase border border-white/20 text-white/50 px-3 py-1">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <a href={ibis.link} target="_blank" rel="noopener noreferrer" className="font-mono text-xs tracking-widest uppercase text-accent hover:underline self-start">
                    View Site ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Krave Suite header */}
        <div className="mb-4">
          <FadeIn delay={100}>
            <p className="font-mono text-xs tracking-widest uppercase text-white/50 mb-2">The Krave Suite</p>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tighter text-white leading-none mb-2">
              One mark.{" "}
              <span style={{ color: "#FF1F8F" }}>Three</span>{" "}
              <span style={{ color: "#00E5FF" }}>moods.</span>{" "}
              <span style={{ color: "#C6FF1A" }}>One database.</span>
            </h3>
            <p className="text-white/60 text-sm max-w-2xl mt-3 mb-8">
              A suite of randomizer apps sharing a common Supabase backend. Every spin is logged and every Krave is tracked!
            </p>
          </FadeIn>
        </div>

        {/* Krave cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 mb-2">
          {kraveApps.map((app, i) => (
            <FadeIn key={app.name} delay={i * 100}>
              <div className="bg-[#06060C] p-6 sm:p-8 flex flex-col gap-6 h-full hover:bg-white/[0.02] transition-colors" style={{ borderTop: `2px solid ${app.accent}20` }}>
                {app.screenshots ? (
                  <ScreenshotCarousel screenshots={app.screenshots} accent={app.accent} />
                ) : (
                  <div className="w-full aspect-video border flex items-center justify-center" style={{ borderColor: app.accent + '20', backgroundColor: app.accent + '05' }}>
                    <span className="font-mono text-[10px] text-white/20 tracking-widest uppercase text-center px-2">
                      Screenshots coming soon
                    </span>
                  </div>
                )}

                <div className="flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-2xl font-black tracking-tighter text-white">
                      {app.name}
                    </h3>
                    <span className="font-mono text-[10px] tracking-widest uppercase mt-1" style={{ color: app.accent }}>
                      {app.status}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-white/50 tracking-wide uppercase mb-4">
                    {app.tagline}
                  </p>
                  <p className="text-white/70 text-base leading-relaxed mb-6 flex-1">
                    {app.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {app.stack.map((tech) => (
                      <span key={tech} className="font-mono text-xs tracking-widest uppercase border border-white/20 text-white/50 px-3 py-1">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <a href={app.github} target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] tracking-widest uppercase hover:underline self-start" style={{ color: app.accent }}>
                    GitHub ↗
                  </a>
                </div>

                <p className="font-mono text-xs text-white/10">0{i + 1}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={100}>
          <div className="border border-white/5 p-6 mt-2 flex items-center justify-between">
            <p className="font-mono text-xs text-white/50 tracking-widest uppercase text-center px-2">Shared backend · Supabase · krave_sessions · Year in Krave Review coming</p>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FF1F8F]" />
              <div className="w-2 h-2 rounded-full bg-[#00E5FF]" />
              <div className="w-2 h-2 rounded-full bg-[#C6FF1A]" />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}