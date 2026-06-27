import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import Footer from "@/components/Footer";

export const metadata = {
  title: "ScoreFit — Case Study | Adam Grossman",
  description:
    "How I built ScoreFit, a public AI-powered job-search command center: match scoring, automated career-page scanning, and an auto-populated application pipeline.",
};

/*
  ──────────────────────────────────────────────────────────────────────────
  PLACEHOLDERS TO FILL IN (search for "TODO"):
    • METRICS  — real numbers for the results bar (users, roles scored, etc.)
    • SCREENS  — swap the .shot placeholder boxes for <img> once media is sent
    • STACK    — confirm the tech list is accurate for the public product
  Everything else is real draft copy derived from the product's feature set.
  ──────────────────────────────────────────────────────────────────────────
*/

// TODO METRICS: replace the values with real figures (use "—" if not public).
const results = [
  { v: "80+", k: "Career pages scanned daily" },
  { v: "3", k: "ATS integrations (Greenhouse · Lever · Ashby)" },
  { v: "—", k: "Roles scored to date" },
  { v: "Live", k: "Public at scorefit.app" },
];

const features = [
  {
    title: "AI Match Scoring",
    body: "Paste any job listing and get an instant match score against your tailored resumes, with a breakdown of where you line up and where the gaps are.",
  },
  {
    title: "Automated Career-Page Scanning",
    body: "A daily job scans 80+ company career pages across Greenhouse, Lever, and Ashby, surfacing new roles without any manual searching.",
  },
  {
    title: "Auto-Populated Pipeline",
    body: "New matching roles are scored and pushed straight into a Kanban pipeline — no copy-paste, no manual entry. The board fills itself overnight.",
  },
  {
    title: "AI Cover Letters",
    body: "Generate a tailored cover letter for any role in seconds, grounded in the specific listing and your background.",
  },
  {
    title: "Interview Q&A Engine",
    body: "Prep against likely questions for a given role, with AI-generated answers drawn from your experience.",
  },
  {
    title: "Contact & Rejection Tracking",
    body: "Log contacts, track outreach, and record rejections so the whole search stays in one place instead of a spreadsheet graveyard.",
  },
];

// TODO STACK: confirm this matches the live public product.
const stack = ["Next.js", "Supabase", "Anthropic API", "PostgreSQL"];

// TODO SCREENS: caption each slot; swap <div className="shot"> for <img> on delivery.
const screens = [
  "Match score breakdown",
  "Kanban application pipeline",
  "Daily scan results",
  "AI cover letter generator",
];

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
      <section className="px-6 pt-20 pb-16 md:pt-28 md:pb-20 border-b border-white/10">
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
          <FadeIn delay={200}>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed">
              An AI-powered job-search command center. Score any listing against
              your resumes, let it scan dozens of career pages for you every day,
              and watch matching roles flow into a pipeline that fills itself.
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <div className="flex flex-wrap gap-2 mt-8">
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
      </section>

      {/* results bar */}
      <section className="px-6 py-12 border-b border-white/10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10">
          {results.map((r, i) => (
            <FadeIn key={r.k} delay={i * 80}>
              <div className="bg-[#06060C] p-6 h-full">
                <p className="text-4xl md:text-5xl font-black tracking-tighter text-accent mb-2">
                  {r.v}
                </p>
                <p className="font-mono text-[10px] tracking-widest uppercase text-white/50 leading-relaxed">
                  {r.k}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* the problem */}
      <section className="px-6 py-16 md:py-20 border-b border-white/10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-3">
            <FadeIn direction="left">
              <p className="font-mono text-xs tracking-widest uppercase text-white/50">
                The Problem
              </p>
            </FadeIn>
          </div>
          <div className="md:col-span-9 space-y-5 text-white/70 text-base md:text-lg leading-relaxed">
            <FadeIn delay={100}>
              <p>
                Job searching is a full-time job made of busywork. You scroll the
                same career pages over and over, re-read listings to guess whether
                you&apos;re a fit, rewrite the same cover letter, and try to track it
                all in a spreadsheet that&apos;s out of date by Tuesday.
              </p>
            </FadeIn>
            <FadeIn delay={200}>
              <p>
                I built ScoreFit to run my own search on autopilot — and then opened
                it up so anyone could use the same system. The goal: spend time on
                the roles that actually matter, not on finding and triaging them.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* what it does — features */}
      <section className="px-6 py-16 md:py-20 border-b border-white/10">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <p className="font-mono text-xs tracking-widest uppercase text-white/50 mb-3">
              What It Does
            </p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter mb-12">
              The whole search, in one place
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">
            {features.map((f, i) => (
              <FadeIn key={f.title} delay={(i % 2) * 100}>
                <div className="bg-[#06060C] p-8 h-full">
                  <h3 className="text-xl font-bold tracking-tight mb-3">
                    {f.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed">{f.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* how it's built */}
      <section className="px-6 py-16 md:py-20 border-b border-white/10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-3">
            <FadeIn direction="left">
              <p className="font-mono text-xs tracking-widest uppercase text-white/50">
                How It&apos;s Built
              </p>
            </FadeIn>
          </div>
          <div className="md:col-span-9 space-y-5 text-white/70 text-base md:text-lg leading-relaxed">
            <FadeIn delay={100}>
              <p>
                ScoreFit is a full-stack Next.js app backed by Supabase
                (PostgreSQL) for auth and persistence. Match scoring, cover-letter
                generation, and the interview engine run on the Anthropic API.
              </p>
            </FadeIn>
            <FadeIn delay={200}>
              <p>
                The automation layer is the heart of it: a scheduled job crawls 80+
                company career pages across the Greenhouse, Lever, and Ashby ATS
                platforms, normalizes the listings, scores each new role against
                your resumes, and writes the matches directly into the pipeline —
                all without a human in the loop.
              </p>
            </FadeIn>
            {/* TODO: add an architecture diagram or a deeper technical note here if desired. */}
          </div>
        </div>
      </section>

      {/* screenshots */}
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

      {/* outcome */}
      <section className="px-6 py-16 md:py-20 border-b border-white/10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-3">
            <FadeIn direction="left">
              <p className="font-mono text-xs tracking-widest uppercase text-white/50">
                The Outcome
              </p>
            </FadeIn>
          </div>
          <div className="md:col-span-9 space-y-5 text-white/70 text-base md:text-lg leading-relaxed">
            <FadeIn delay={100}>
              <p>
                What started as a personal tool became a public product. ScoreFit is
                live at{" "}
                <a
                  href="https://scorefit.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  scorefit.app
                </a>{" "}
                and open for anyone running a job search.
              </p>
            </FadeIn>
            {/* TODO: add real outcomes — users, interviews landed, time saved, feedback. */}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-5xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter mb-8">
              Try it yourself
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
