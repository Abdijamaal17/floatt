export default function Home() {
  const features = [
    {
      symbol: "↑",
      title: "Raskt",
      desc: "Ytelsesoptimaliserte løsninger som laster lynraskt og gir brukerne en smidig opplevelse fra første klikk.",
    },
    {
      symbol: "◎",
      title: "Trygt",
      desc: "Sikkerhet er ikke et ettertanke. Vi bygger med beste praksis for autentisering, kryptering og databeskyttelse.",
    },
    {
      symbol: "✦",
      title: "Moderne",
      desc: "Friskt design og oppdatert teknologi. Vi bruker de nyeste verktøyene for å levere løsninger som varer.",
    },
  ];

  const projects = [
    {
      title: "Kvikkbetaling",
      desc: "En sømløs betalingsflyt for nettbutikker med konverteringsoptimalisert UX.",
      tag: "Fintech",
    },
    {
      title: "Helseportalen",
      desc: "En sikker pasientportal med timebestilling, journalinnsyn og meldinger.",
      tag: "Helse",
    },
    {
      title: "Bygg AS",
      desc: "Prosjektstyringssystem for byggefirmaer med sanntidsoppdateringer og rapporter.",
      tag: "Bygg",
    },
  ];

  const faqs = [
    {
      q: "Hva gjør Floatt?",
      a: "Floatt leverer skreddersydde digitale løsninger — fra nettsider og apper til fullstendige produkter. Vi tar deg fra idé til lansering.",
    },
    {
      q: "Hvem er dette for?",
      a: "Startups, etablerte bedrifter og gründere som trenger en pålitelig teknologipartner. Stor eller liten — vi tilpasser oss deg.",
    },
    {
      q: "Hvordan kommer jeg i gang?",
      a: "Ta kontakt via e-post. Vi svarer innen én virkedag og setter opp en uforpliktende samtale.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] font-sans">

      {/* Nav */}
      <nav
        className="animate-fade-up fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900"
        style={{ animationDelay: "0ms" }}
      >
        <span className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Floatt
        </span>
        <div className="flex items-center gap-7">
          <a
            href="#tjenester"
            className="text-sm text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-100 transition-colors duration-200"
          >
            Tjenester
          </a>
          <a
            href="#prosjekter"
            className="text-sm text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-100 transition-colors duration-200"
          >
            Prosjekter
          </a>
          <a
            href="#kontakt"
            className="text-sm font-medium px-4 py-1.5 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-full hover:opacity-75 transition-opacity duration-200"
          >
            Kom i gang
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center pt-20">
        <div className="flex flex-col items-center gap-8 max-w-2xl mx-auto">

          <div
            className="animate-fade-up inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 text-xs tracking-widest uppercase text-zinc-400 dark:text-zinc-500"
            style={{ animationDelay: "0ms" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Tilgjengelig nå
          </div>

          <h1
            className="animate-fade-up text-5xl sm:text-6xl md:text-7xl font-semibold leading-[1.08] tracking-tight text-zinc-900 dark:text-zinc-50"
            style={{ animationDelay: "80ms" }}
          >
            Din digitale
            <br />
            <span className="text-zinc-300 dark:text-zinc-700">partner.</span>
          </h1>

          <p
            className="animate-fade-up max-w-sm text-base leading-relaxed text-zinc-400 dark:text-zinc-500"
            style={{ animationDelay: "160ms" }}
          >
            Floatt hjelper deg å bygge moderne, raske og trygge digitale løsninger — skreddersydd for deg og dine brukere.
          </p>

          <div
            className="animate-fade-up flex flex-col sm:flex-row items-center gap-3 mt-2"
            style={{ animationDelay: "240ms" }}
          >
            <a
              href="#kontakt"
              className="inline-flex items-center h-11 px-6 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 text-sm font-medium rounded-full hover:opacity-70 transition-opacity duration-200"
            >
              Kom i gang
            </a>
            <a
              href="#prosjekter"
              className="inline-flex items-center h-11 px-6 text-sm font-medium text-zinc-500 dark:text-zinc-400 rounded-full border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 hover:text-zinc-800 dark:hover:border-zinc-700 dark:hover:text-zinc-200 transition-all duration-200"
            >
              Se prosjekter
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="tjenester" className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div
            className="animate-fade-up text-center mb-16"
            style={{ animationDelay: "0ms" }}
          >
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Hvorfor Floatt?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-zinc-100 dark:bg-zinc-900 rounded-2xl overflow-hidden">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="animate-fade-up bg-white dark:bg-[#0a0a0a] p-8 flex flex-col gap-4"
                style={{ animationDelay: `${(i + 1) * 80}ms` }}
              >
                <span className="text-xl text-zinc-300 dark:text-zinc-700 font-light">
                  {f.symbol}
                </span>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-400 dark:text-zinc-500">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="prosjekter" className="py-32 px-6 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-4xl mx-auto">
          <div
            className="animate-fade-up text-center mb-16"
            style={{ animationDelay: "0ms" }}
          >
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Prosjekter
            </h2>
            <p className="mt-4 text-sm text-zinc-400 dark:text-zinc-500">
              Et utvalg av hva vi har bygget.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {projects.map((p, i) => (
              <div
                key={p.title}
                className="animate-fade-up flex flex-col gap-4 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors duration-200"
                style={{ animationDelay: `${(i + 1) * 80}ms` }}
              >
                <span className="inline-flex self-start px-2 py-0.5 rounded-full text-xs tracking-wide border border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500">
                  {p.tag}
                </span>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-400 dark:text-zinc-500">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-32 px-6">
        <div className="max-w-2xl mx-auto">
          <div
            className="animate-fade-up text-center mb-16"
            style={{ animationDelay: "0ms" }}
          >
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Vanlige spørsmål
            </h2>
          </div>

          <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-900">
            {faqs.map((item, i) => (
              <details
                key={item.q}
                className="animate-fade-up group py-5"
                style={{ animationDelay: `${(i + 1) * 80}ms` }}
              >
                <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-medium text-zinc-900 dark:text-zinc-50 gap-4">
                  {item.q}
                  <span className="text-zinc-300 dark:text-zinc-700 group-open:rotate-45 transition-transform duration-200 text-lg leading-none select-none">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400 dark:text-zinc-500">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="kontakt"
        className="animate-fade-up border-t border-zinc-100 dark:border-zinc-900 py-12 px-8"
        style={{ animationDelay: "0ms" }}
      >
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Floatt
          </span>
          <p className="text-xs text-zinc-300 dark:text-zinc-700">
            © 2026 Floatt. Alle rettigheter forbeholdt.
          </p>
          <a
            href="mailto:hei@floatt.no"
            className="text-xs text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors duration-200"
          >
            hei@floatt.no
          </a>
        </div>
      </footer>
    </div>
  );
}
