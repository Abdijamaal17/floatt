import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] font-sans">

      {/* Nav */}
      <nav className="animate-fade-up fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900" style={{ animationDelay: "0ms" }}>
        <Image
          className="dark:invert opacity-90"
          src="/next.svg"
          alt="Next.js logo"
          width={88}
          height={18}
          priority
        />
        <div className="flex items-center gap-7">
          <a
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-100 transition-colors duration-200"
          >
            Docs
          </a>
          <a
            href="https://nextjs.org/learn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-100 transition-colors duration-200"
          >
            Learn
          </a>
          <a
            href="https://vercel.com/new"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium px-4 py-1.5 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-full hover:opacity-75 transition-opacity duration-200"
          >
            Deploy
          </a>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="flex flex-col items-center gap-8 max-w-2xl mx-auto">

          {/* Badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 text-xs tracking-widest uppercase text-zinc-400 dark:text-zinc-500" style={{ animationDelay: "0ms" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Next.js · App Router
          </div>

          {/* Heading */}
          <h1 className="animate-fade-up text-5xl sm:text-6xl md:text-7xl font-semibold leading-[1.08] tracking-tight text-zinc-900 dark:text-zinc-50" style={{ animationDelay: "80ms" }}>
            Build something
            <br />
            <span className="text-zinc-300 dark:text-zinc-700">remarkable.</span>
          </h1>

          {/* Subtext */}
          <p className="animate-fade-up max-w-sm text-base leading-relaxed text-zinc-400 dark:text-zinc-500" style={{ animationDelay: "160ms" }}>
            Start by editing{" "}
            <code className="font-mono text-sm bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-600 dark:text-zinc-400">
              app/page.tsx
            </code>
            . Save and see changes instantly.
          </p>

          {/* CTA */}
          <div className="animate-fade-up flex flex-col sm:flex-row items-center gap-3 mt-2" style={{ animationDelay: "240ms" }}>
            <a
              href="https://vercel.com/new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-11 px-6 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 text-sm font-medium rounded-full hover:opacity-70 transition-opacity duration-200"
            >
              <Image
                className="invert dark:invert-0"
                src="/vercel.svg"
                alt="Vercel"
                width={14}
                height={14}
              />
              Deploy now
            </a>
            <a
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center h-11 px-6 text-sm font-medium text-zinc-500 dark:text-zinc-400 rounded-full border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 hover:text-zinc-800 dark:hover:border-zinc-700 dark:hover:text-zinc-200 transition-all duration-200"
            >
              Read the docs
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="animate-fade-up fixed bottom-0 left-0 right-0 flex items-center justify-center gap-8 py-5 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-t border-zinc-100 dark:border-zinc-900" style={{ animationDelay: "300ms" }}>
        <a
          href="https://nextjs.org/learn"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-zinc-300 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors duration-200"
        >
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-zinc-300 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors duration-200"
        >
          Templates
        </a>
        <a
          href="https://nextjs.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-zinc-300 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors duration-200"
        >
          nextjs.org →
        </a>
      </footer>
    </div>
  );
}
