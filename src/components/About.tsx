import FadeIn from "./FadeIn";

const targetRoles = [
  "Implementation Manager",
  "CSM",
  "Sr. CSM",
  "PM",
  "Sr. PM",
  "Director of CSM",
];

export default function About() {
  return (
    <section id="about" className="px-6 py-20 md:py-28 border-b border-white/10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-20">
        {/* Label column */}
        <div className="md:col-span-3">
          <FadeIn direction="left">
            <p className="font-mono text-xs tracking-widest uppercase text-white/30 md:sticky md:top-28">
              About
            </p>
          </FadeIn>
        </div>

        {/* Content column */}
        <div className="md:col-span-9">
          <FadeIn delay={100}>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug text-white mb-8 md:mb-10">
              I&apos;ve spent 20 years on both sides of the customer
              relationship, earning trust in sales and then putting that
              hard-won perspective to work in SaaS and ERP implementations.
            </p>
          </FadeIn>

          <FadeIn delay={200}>
            <p className="text-white/50 text-base sm:text-lg leading-relaxed mb-10 md:mb-14">
              I build things, I follow through, and I care about outcomes — not
              just deliverables.
            </p>
          </FadeIn>

          {/* Target roles */}
          <FadeIn delay={300}>
            <div>
              <p className="font-mono text-xs tracking-widest uppercase text-white/30 mb-5">
                Target Roles
              </p>
              <div className="flex flex-wrap gap-3">
                {targetRoles.map((role) => (
                  <span
                    key={role}
                    className="font-mono text-xs tracking-wide uppercase border border-white/15 text-white/60 px-3 sm:px-4 py-2"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
