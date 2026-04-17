import FadeIn from "./FadeIn";

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-end px-6 pb-20 pt-32 border-b border-white/10">
      <div className="max-w-6xl w-full mx-auto">
        {/* Issue label */}
        <FadeIn delay={0}>
          <p className="font-mono text-xs tracking-widest uppercase text-white/30 mb-12">
            Portfolio — 2026
          </p>
        </FadeIn>

        {/* Main headline */}
        <FadeIn delay={100}>
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tighter text-white max-w-5xl mb-10">
            I spent 15 years in sales learning why customers{" "}
            <span className="text-accent">leave.</span>
            <br className="hidden sm:block" />
            {" "}The last 5, I&apos;ve been making sure they{" "}
            <span className="text-accent">don&apos;t.</span>
          </h1>
        </FadeIn>

        {/* Divider */}
        <FadeIn delay={200}>
          <div className="w-16 h-[2px] bg-accent mb-8" />
        </FadeIn>

        {/* Subheading */}
        <FadeIn delay={300}>
          <p className="text-base sm:text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed">
            Adam Grossman. Implementation leader, project manager, and the
            person who actually shows up.{" "}
            <span className="text-white/90">
              Honest, empathetic, and accountable.
            </span>
          </p>
        </FadeIn>

        {/* CTAs */}
        <FadeIn delay={400}>
          <div className="flex flex-wrap gap-4 mt-12">
            <a
              href="#about"
              className="font-mono text-xs tracking-widest uppercase border border-accent text-accent px-6 py-3 hover:bg-accent hover:text-black transition-all duration-200"
            >
              Read More
            </a>
            <a
              href="#contact"
              className="font-mono text-xs tracking-widest uppercase border border-white/20 text-white/40 px-6 py-3 hover:border-white/60 hover:text-white/80 transition-all duration-200"
            >
              Get in Touch
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
