import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import Footer from "@/components/Footer";

export const metadata = {
  title: "ScoreFit — Case Study | Adam Grossman",
  description:
    "How I built and shipped ScoreFit, an AI-powered job-search product, as a solo founder operating as the product and architecture layer directing a team of AI coding agents.",
};

/*
  Real case-study content. Screenshot slots remain as styled placeholders —
  swap <ShotPlaceholder> for <img> once media is provided.
*/

const meta = [
  { k: "Role", v: "Founder · Product & Architecture" },
  { k: "Type", v: "Solo-built B2C SaaS · Active beta" },
  { k: "Live at", v: "scorefit.app" },
];

const glance = [
  { v: "Solo", k: "Founder — product, architecture & integration" },
  { v: "Beta", k: "Live in active beta at scorefit.app" },
  { v: "10k+", k: "Company career sites in the sourcing index" },
  { v: "AI-led", k: "Built by directing parallel AI coding agents" },
];

const disciplines = [
  {
    n: "01",
    title: "Lock the decision before writing the spec",
    body: "Agents are eager to build. Hand off an ambiguous problem and you get a confident, wrong implementation — fast. So every product and design decision had to be settled in plain language before any implementation began. The spec is where the thinking happens; the build is mechanical.",
  },
  {
    n: "02",
    title: "Treat “done” and “verified” as untrustworthy by default",
    body: "An agent reporting “verified” means only “I checked what I thought to check.” Repeatedly, the only reliable signal was live data — the actual database state, the actual API response, the actual network request — not the agent's description of it. I built a habit of confirming outcomes against ground truth before believing anything was fixed.",
  },
  {
    n: "03",
    title: "Watch outcomes, not just errors",
    body: "The most dangerous failures weren't crashes. They were processes that completed successfully while silently doing nothing useful. A job that “ran fine” but returned no results is worse than one that errors, because nothing alerts you. I learned to measure what users actually received, not whether the code executed.",
  },
];

const takeaways = [
  {
    h: "Decisions before deliverables",
    b: "The quality of what gets built is set at the spec, not the review.",
  },
  {
    h: "Verify against ground truth, not reports",
    b: "Confident summaries — from people or tools — are not evidence. Live data is.",
  },
  {
    h: "Distrust improvement that's only relative",
    b: "A number that moved is not a number that's right. I repeatedly caught myself, and my tools, declaring victory on a metric that had improved but was still far from where it needed to be.",
  },
  {
    h: "Cheap reality-checks beat expensive investigations",
    b: "A two-minute manual search redirected a multi-week build.",
  },
  {
    h: "Sequence the work to be measurable",
    b: "Baseline, then change, then compare.",
  },
];

const stack = ["Next.js", "React", "Vercel", "Supabase", "Anthropic API", "Python"];

const screens = ["Match score & resume recommendation", "Application tracking"];

function ShotPlaceholder({ label }: { label: string }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-center">
      <div className="text-center px-6">
        <p className="font-mono text-[10px] tracking-widest uppercase text-white/30 mb-1">
          Screenshot
        </p>
        <p className="font-mono text-xs tracking-wide text-white/50">{label}</p>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <FadeIn direction="left">
      <p className="font-mono text-xs tracking-widest uppercase text-white/50">
        {children}
      </p>
    </FadeIn>
  );
}

export default function ScoreFitCaseStudy() {
  return (
    <main className="bg-[#06060C] text-[#EEF1F4]">
      {/* top bar */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/#projects"
            className="font-mono text-xs tracking-widest uppercase text-white/60 hover:text-accent transition-colors"
          >
            ← Back to portfolio
          </Link>
          <a
            href="https://scorefit.app"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs tracking-widest uppercase text-accent hover:underline"
          >
            Visit ScoreFit ↗
          </a>
        </div>
      </div>

      {/* hero */}
      <section className="px-6 pt-20 pb-14 md:pt-28 md:pb-16 border-b border-white/10">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <p className="font-mono text-xs tracking-widest uppercase text-accent mb-5">
              Case Study · Featured Project
            </p>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-none mb-6">
              ScoreFit
            </h1>
          </FadeIn>
          <FadeIn delay={150}>
            <p className="text-lg md:text-xl text-white/70 max-w-3xl leading-relaxed">
              Scores live job listings against a candidate's background, recommends
              which resume version to use, and tracks applications — so employed
              professionals can run a sharp, low-effort job search instead of
              scrolling endless boards.
            </p>
          </FadeIn>
          <FadeIn delay={250}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/10 mt-10 border border-white/10">
              {meta.map((m) => (
                <div key={m.k} className="bg-[#06060C] p-5">
                  <p className="font-mono text-[10px] tracking-widest uppercase text-white/40 mb-1.5">
                    {m.k}
                  </p>
                  <p className="text-sm text-white/80">{m.v}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* the one-line version — pull quote */}
      <section className="px-6 py-16 md:py-24 border-b border-white/10">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <p className="font-mono text-xs tracking-widest uppercase text-accent mb-6">
              The one-line version
            </p>
          </FadeIn>
          <FadeIn delay={100}>
            <p className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter leading-tight">
              I built and shipped a working AI product end to end as a solo founder
              — not by writing every line myself, but by operating as the product
              and architecture layer directing a team of AI coding agents.
            </p>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="text-base md:text-lg text-white/60 leading-relaxed mt-6 max-w-3xl">
              The interesting part isn't that AI wrote code. It's the operating
              discipline required to make that produce something trustworthy:
              knowing what to delegate, how to verify it, and when an agent's
              confident answer is quietly wrong.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* the problem */}
      <section className="px-6 py-16 md:py-20 border-b border-white/10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-3">
            <SectionLabel>The Problem</SectionLabel>
          </div>
          <div className="md:col-span-9 space-y-5 text-white/70 text-base md:text-lg leading-relaxed">
            <FadeIn delay={100}>
              <p>
                Job seekers who are already employed don't have time to read
                hundreds of listings to find the few worth pursuing. Existing tools
                either spray applications indiscriminately or bury the user in an
                unfiltered feed.
              </p>
            </FadeIn>
            <FadeIn delay={200}>
              <p>
                The opportunity: a product that casts a wide net, scores sharply
                against the individual's real background, and lets the person
                decide. Curation — not automation of the decision itself.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* operating model */}
      <section className="px-6 py-16 md:py-20 border-b border-white/10">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <p className="font-mono text-xs tracking-widest uppercase text-white/50 mb-3">
              How I Worked
            </p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter mb-6">
              The operating model
            </h2>
          </FadeIn>
          <FadeIn delay={100}>
            <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-3xl mb-12">
              I positioned myself as the planning and architecture layer. I made the
              product decisions, defined the architecture, and wrote precise specs —
              then delegated implementation to AI coding agents running in parallel,
              each scoped to a non-overlapping part of the codebase, and reviewed and
              integrated everything myself. That's a force multiplier, but only with
              three disciplines I had to build deliberately.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
            {disciplines.map((d, i) => (
              <FadeIn key={d.n} delay={i * 100}>
                <div className="bg-[#06060C] p-8 h-full">
                  <p className="font-mono text-sm text-accent mb-4">{d.n}</p>
                  <h3 className="text-lg font-bold tracking-tight mb-3 leading-snug">
                    {d.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed text-[15px]">
                    {d.body}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* representative problem */}
      <section className="px-6 py-16 md:py-20 border-b border-white/10">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <p className="font-mono text-xs tracking-widest uppercase text-white/50 mb-3">
              A Representative Problem
            </p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter mb-12">
              The thin-feed investigation
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-7 space-y-5 text-white/70 text-base md:text-lg leading-relaxed">
              <FadeIn delay={100}>
                <p>
                  Several beta testers were getting sparse job feeds, despite the
                  product sourcing from an index covering tens of thousands of
                  company career sites. The obvious assumption was a coverage gap —
                  the data source simply didn't have the roles.
                </p>
              </FadeIn>
              <FadeIn delay={150}>
                <p>
                  Rather than accept that, I ran a structured investigation, split
                  across agents along clean boundaries: one traced how the search
                  query was constructed, one traced what happened to results after
                  they came back, and one made a live call to see what the source
                  actually returned. Keeping the work disjoint meant the agents
                  couldn't collide and each finding was independently verifiable.
                </p>
              </FadeIn>
              <FadeIn delay={200}>
                <p>
                  The result overturned my own initial theory. A simple external
                  reality-check — manually searching a major job board for the same
                  titles — returned over a hundred roles. The source{" "}
                  <em className="text-white/90 not-italic font-semibold">had</em>{" "}
                  the inventory. The bug was ours: the matching logic required job
                  titles to appear in an exact, rigid word order, so real-world
                  titles silently failed to match.
                </p>
              </FadeIn>
              <FadeIn delay={250}>
                <p>
                  A controlled test confirmed it: loosening the matching recovered
                  the missing roles cleanly, with no increase in irrelevant results.
                  The fix was a single change to the query logic — it improved feeds
                  across the entire user base at once, and dissolved a much larger,
                  more expensive plan I'd been considering (integrating a second
                  data source) that would have solved the wrong problem at permanent
                  cost.
                </p>
              </FadeIn>
            </div>
            <div className="md:col-span-5">
              <FadeIn delay={200}>
                <div className="border border-accent/30 bg-accent/[0.04] p-7 md:sticky md:top-8">
                  <p className="font-mono text-[10px] tracking-widest uppercase text-accent mb-4">
                    Why it matters
                  </p>
                  <p className="text-white/80 leading-relaxed">
                    The win wasn't the code change. It was the discipline to distrust
                    a plausible conclusion, design an investigation that could
                    disprove my own assumption, and let cheap evidence redirect an
                    expensive decision before I committed to it.
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* measurement */}
      <section className="px-6 py-16 md:py-20 border-b border-white/10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-3">
            <SectionLabel>Building the Measurement</SectionLabel>
          </div>
          <div className="md:col-span-9 space-y-5 text-white/70 text-base md:text-lg leading-relaxed">
            <FadeIn delay={100}>
              <p>
                Once sourcing worked for most users, a harder question remained: a
                few profiles — very senior roles, niche markets — were still thin,
                and I needed to know whether that was a fixable query problem or a
                genuine limit of the data source before deciding whether to take on a
                major architecture change.
              </p>
            </FadeIn>
            <FadeIn delay={200}>
              <p>
                So rather than guess, I built a set of deliberate test profiles
                modeling the specific edge cases real users had revealed — including
                a known-good control — so any future change could be measured against
                a clean before/after baseline rather than anecdote. Instrument first,
                then change, then measure against the instrument. That sequencing is
                the difference between “the number moved” and “the change worked.”
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* screens */}
      <section className="px-6 py-16 md:py-20 border-b border-white/10">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <p className="font-mono text-xs tracking-widest uppercase text-white/50 mb-3">
              A Look Inside
            </p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter mb-12">
              Screens
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {screens.map((label, i) => (
              <FadeIn key={label} delay={(i % 2) * 100}>
                <ShotPlaceholder label={label} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* takeaways */}
      <section className="px-6 py-16 md:py-20 border-b border-white/10">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <p className="font-mono text-xs tracking-widest uppercase text-white/50 mb-3">
              What I&apos;d Carry Into a Product Role
            </p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter mb-12">
              The operating principles
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">
            {takeaways.map((t, i) => (
              <FadeIn key={t.h} delay={(i % 2) * 100}>
                <div className="bg-[#06060C] p-8 h-full">
                  <h3 className="text-lg font-bold tracking-tight mb-2">{t.h}</h3>
                  <p className="text-white/60 leading-relaxed">{t.b}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* stack */}
      <section className="px-6 py-16 md:py-20 border-b border-white/10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-3">
            <SectionLabel>The Stack</SectionLabel>
          </div>
          <div className="md:col-span-9">
            <FadeIn delay={100}>
              <p className="text-white/70 text-base md:text-lg leading-relaxed mb-7">
                A Next.js / React frontend on Vercel, Supabase for auth and data, a
                multi-pass AI scoring pipeline with deliberate model selection
                validated against ground-truth test cases, a Python resume-parsing
                service, and a third-party job-sourcing API feeding a daily pipeline.
                Architected so the data layer is the single integration point between
                services — no fragile runtime coupling between the AI scoring, the
                sourcing, and the frontend.
              </p>
            </FadeIn>
            <FadeIn delay={200}>
              <div className="flex flex-wrap gap-2">
                {stack.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-xs tracking-widest uppercase border border-white/20 text-white/50 px-3 py-1"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-5xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter mb-8">
              See it in action
            </h2>
            <a
              href="https://scorefit.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-mono text-sm tracking-widest uppercase border border-accent text-accent px-8 py-4 hover:bg-accent hover:text-[#06060C] transition-colors"
            >
              Visit ScoreFit ↗
            </a>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </main>
  );
}
