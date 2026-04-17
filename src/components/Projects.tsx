import FadeIn from "./FadeIn";

const ibis = {
  name: "Ibis Men's Golf App",
  tagline: "Golf scheduling, scoring & handicap platform",
  status: "Live",
  statusColor: "text-accent",
  description:
    "A full-stack web app built for a real golf group. Handles scheduling, scoring, leaderboards, and a custom handicap engine built from scratch. We pulled GHIN out entirely and calculate handicaps ourselves, which is the most technically sophisticated piece of the project. Login-protected with Supabase auth, relational database, and real data.",
  stack: ["Next.js", "React", "Tailwind CSS", "Supabase", "PostgreSQL"],
  link: "https://ibis-golf-app.vercel.app/",
  featured: true,
};

const kraveApps = [
  {
    name: "Krave",
    tagline: "Restaurant randomizer",
    status: "Live on iOS",
    statusColor: "text-accent",
    description:
      "Can't decide where to eat? Krave decides for you. A working, live app that cuts through decision fatigue and gets you to the table faster.",
    stack: ["React Native", "Expo", "TypeScript"],
    link: "https://github.com/adgrossm",
    featured: false,
  },
  {
    name: "Krave Out",
    tagline: "Bar & nightlife randomizer",
    status: "In Development",
    statusColor: "text-white/40",
    description:
      "Neon noir aesthetic meets late-night indecision. Krave Out brings the same philosophy to bars and nightlife. Currently in active development.",
    stack: ["React Native", "Expo", "TypeScript"],
    link: "https://github.com/adgrossm",
    featured: false,
  },
  {
    name: "Krave Pour",
    tagline: "Drink randomizer",
    status: "Early Stage",
    statusColor: "text-white/30",
    description:
      "What are you drinking tonight? Krave Pour handles that question. Early stage, but the concept is solid.",
    stack: ["React Native", "Expo", "TypeScript"],
    link: "https://github.com/adgrossm",
    featured: false,
  },
];

export default function Projects() {
  return (
    <section id="projects" className="px-6 py-20 md:py-28 border-b border-white/10">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-12 md:mb-16">
          <div className="md:col-span-3">
            <FadeIn direction="left">
              <p className="font-mono text-xs tracking-widest uppercase text-white/30">
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

        {/* Featured project — Ibis */}
        <FadeIn delay={100}>
          <div className="border border-white/10 hover:border-white/20 transition-colors mb-px">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">
              {/* Placeholder image */}
              <div className="bg-[#0a0a0a] aspect-video flex items-center justify-center">
                <span className="font-mono text-xs text-white/20 tracking-widest uppercase text-center px-4">
                  Ibis Golf App — Screenshot TBD
                </span>
              </div>

              {/* Content */}
              <div className="bg-[#0a0a0a] p-8 sm:p-10 flex flex-col justify-between gap-8">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-2xl sm:text-3xl font-black tracking-tighter text-white">
                      {ibis.name}
                    </h3>
                    <span className={`font-mono text-[10px] tracking-widest uppercase ${ibis.statusColor} mt-1`}>
                      {ibis.status}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-white/30 tracking-wide uppercase mb-5">
                    {ibis.tagline}
                  </p>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {ibis.description}
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2">
                    {ibis.stack.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-[10px] tracking-widest uppercase border border-white/10 text-white/30 px-3 py-1"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <a
                    href={ibis.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs tracking-widest uppercase text-accent hover:underline self-start"
                  >
                    View Site ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Krave family header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-20 mb-10">
          <div className="md:col-span-3" />
          <div className="md:col-span-9 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <FadeIn delay={100}>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tighter text-white leading-none">
                The Krave App Family
              </h3>
            </FadeIn>
            <FadeIn delay={150}>
              <a
                href="https://github.com/adgrossm"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs tracking-widest uppercase text-white/30 hover:text-accent transition-colors self-start sm:self-auto"
              >
                GitHub ↗
              </a>
            </FadeIn>
          </div>
        </div>

        {/* Krave cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
          {kraveApps.map((app, i) => (
            <FadeIn key={app.name} delay={i * 100}>
              <div className="bg-[#0a0a0a] p-6 sm:p-8 flex flex-col gap-6 h-full hover:bg-white/[0.03] transition-colors">
                {/* Placeholder image */}
                <div className="w-full aspect-video bg-white/5 border border-white/10 flex items-center justify-center">
                  <span className="font-mono text-[10px] sm:text-xs text-white/20 tracking-widest uppercase text-center px-2">
                    {app.name} — Image TBD
                  </span>
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-2xl font-black tracking-tighter text-white">
                      {app.name}
                    </h3>
                    <span className={`font-mono text-[10px] tracking-widest uppercase ${app.statusColor} mt-1 text-right`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-white/30 tracking-wide uppercase mb-4">
                    {app.tagline}
                  </p>
                  <p className="text-white/50 text-sm leading-relaxed mb-6 flex-1">
                    {app.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {app.stack.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-[10px] tracking-widest uppercase border border-white/10 text-white/30 px-3 py-1"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="font-mono text-xs text-white/10">0{i + 1}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
