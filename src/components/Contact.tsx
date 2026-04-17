import FadeIn from "./FadeIn";

const links = [
  {
    label: "Email",
    display: "adgrossm@gmail.com",
    href: "mailto:adgrossm@gmail.com",
  },
  {
    label: "Phone",
    display: "732.236.7065",
    href: "tel:7322367065",
  },
  {
    label: "LinkedIn",
    display: "adam-grossman-charlotte",
    href: "https://www.linkedin.com/in/adam-grossman-charlotte/",
  },
  {
    label: "GitHub",
    display: "adgrossm",
    href: "https://github.com/adgrossm",
  },
];

export default function Contact() {
  return (
    <section id="contact" className="px-6 py-20 md:py-28">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-12 md:mb-16">
          <div className="md:col-span-3">
            <FadeIn direction="left">
              <p className="font-mono text-xs tracking-widest uppercase text-white/30">
                Contact
              </p>
            </FadeIn>
          </div>
          <div className="md:col-span-9">
            <FadeIn delay={100}>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white leading-none">
                Let&apos;s talk.
              </h2>
            </FadeIn>
          </div>
        </div>

        {/* Contact links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-3" />
          <div className="md:col-span-9">
            <div className="divide-y divide-white/10">
              {links.map((link, i) => (
                <FadeIn key={link.label} delay={i * 80}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      link.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="flex items-center justify-between py-5 sm:py-6 group"
                  >
                    <span className="font-mono text-xs tracking-widest uppercase text-white/30 group-hover:text-white/60 transition-colors">
                      {link.label}
                    </span>
                    <span className="text-white text-base sm:text-lg font-medium group-hover:text-accent transition-colors">
                      {link.display} ↗
                    </span>
                  </a>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <FadeIn delay={400}>
          <div className="mt-20 md:mt-28 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <span className="font-mono text-xs tracking-widest uppercase text-white/20">
              Adam Grossman — 2026
            </span>
            <span className="font-mono text-xs tracking-widest uppercase text-white/20">
              Built in Next.js
            </span>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
