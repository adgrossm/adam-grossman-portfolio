export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-8 mt-24">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-xs tracking-widest uppercase text-white/30">
        <span>© {new Date().getFullYear()} Adam Grossman</span>
        
         <a href="/privacy"
          className="hover:text-accent transition-colors"
        >
          Privacy Policy
        </a>
      </div>
    </footer>
  );
}