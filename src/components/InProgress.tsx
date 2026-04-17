import FadeIn from "./FadeIn";

export default function InProgress() {
  return (
    <section id="in-progress" className="px-6 py-20 md:py-28 border-b border-white/10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-20">
        {/* Label column */}
        <div className="md:col-span-3">
          <FadeIn direction="left">
            <p className="font-mono text-xs tracking-widest uppercase text-white/30 md:sticky md:top-28">
              In Progress
            </p>
          </FadeIn>
        </div>

        {/* Content column */}
        <div className="md:col-span-9">
          <FadeIn delay={150}>
            <div className="border border-white/10 p-8 sm:p-10 hover:border-white/20 transition-colors">
              {/* Status badge */}
              <div className="flex items-center gap-3 mb-8">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="font-mono text-xs tracking-widest uppercase text-accent">
                  Active Build
                </span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-black tracking-tighter text-white mb-4">
                Job Scraper Dashboard
              </h3>
              <p className="font-mono text-xs tracking-widest uppercase text-white/30 mb-8">
                Personal Tooling
              </p>

              <p className="text-white/50 text-base sm:text-lg leading-relaxed max-w-2xl">
                A custom tool that scrapes job listings, scores them against my
                profile using AI, and surfaces the best matches for me to
                review and apply. Built because the job search process is
                broken and I decided to fix it for myself.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
