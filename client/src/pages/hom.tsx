// import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import type { Post } from '../types/Post';
import '../styles/index.css';

// ─── HELPERS ────────────────────────────────────────────────────────────────

// Formatează un ISO date string în ceva lizibil: "March 18, 2025"
// Intl.DateTimeFormat = API nativ de browser pentru formatare date, no library needed
function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(iso));
}

// ─── BRAND COLORS ───────────────────────────────────────────────────────────
// Culorile proiectului nu sunt în Tailwind default,
// deci le definim ca constante și le folosim cu style={{ }}.

const C = {
  cream:     '#FAF8F5',
  taupe:     '#dcd0c0',
  taupeLight:'#ede6dc',
  taupeMin:  '#b5a898',
  clay:      '#c4a27a',
  clayDark:  '#b08a60',
  clayBg:    '#c8a882',
  brown:     '#3a2c27',
  brownMid:  '#8c7066',
} as const;

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────
// Componentele mici (PostCard, SkeletonCard) stau în același fișier
// dacă sunt folosite DOAR aici. 

// ── PostCard ──
// Primește un Post și afișează cardul cu imagine, titlu, dată, excerpt.
// "{ post }: { post: Post }" = destructurare props cu tipaj TypeScript
function PostCard({ post }: { post: Post }) {
  return (
    // Link din react-router-dom = <a> care navighează fără reload de pagină
    <Link
      to={`/posts/${post._id}`}
      className="group block overflow-hidden border transition-all duration-300 hover:-translate-y-1"
      style={{ borderColor: C.taupe }}
    >
      {/* Imaginea cu zoom la hover */}
      <div className="overflow-hidden h-64">
        <img
          src={post.imageUrl || 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=800&h=500'}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          // "group-hover:scale-105" funcționează pentru că părintele are clasa "group"
          // = când hover pe parent, aplică scale-105 pe acest element
          loading="lazy"
        />
      </div>

      {/* Body card */}
      <div className="p-7">
        {/* Tag categorie */}
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-2"
          style={{ color: C.clayDark }}
        >
          {post.category}
        </p>

        {/* Titlu — group-hover adaugă underline */}
        <h3
          className="font-light mb-2 leading-snug transition-all duration-200"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(1.3rem, 2vw, 1.6rem)',
            fontStyle: 'italic',
            color: C.brown,
            // underline la hover prin boxShadow trick — mai ușor de controlat decât border
            textDecoration: 'none',
          }}
        >
          {post.title}
        </h3>

        {/* Data */}
        <p
          className="text-xs tracking-widest uppercase mb-3"
          style={{ color: C.taupeMin }}
        >
          {formatDate(post.createdAt)}
        </p>

        {/* Excerpt */}
        <p
          className="text-sm leading-relaxed"
          style={{ color: C.brownMid }}
        >
          {post.excerpt}
        </p>
      </div>
    </Link>
  );
}

// ── SkeletonCard ──
// Afișat cât timp datele se încarcă (loading state).
// "Skeleton" = placeholder cu animație pulsantă, standard în UX modern.
// Mult mai bun decât un simplu "Loading..." text.
function SkeletonCard() {
  return (
    <div
      className="border overflow-hidden"
      style={{ borderColor: C.taupe }}
    >
      {/* Animate-pulse = Tailwind utility care face pulsare */}
      <div className="animate-pulse">
        <div className="h-64 w-full" style={{ backgroundColor: C.taupe }} />
        <div className="p-7 space-y-3">
          <div className="h-3 w-20 rounded" style={{ backgroundColor: C.taupeMin }} />
          <div className="h-5 w-3/4 rounded" style={{ backgroundColor: C.taupe }} />
          <div className="h-3 w-24 rounded" style={{ backgroundColor: C.taupeLight }} />
          <div className="h-3 w-full rounded" style={{ backgroundColor: C.taupeLight }} />
          <div className="h-3 w-5/6 rounded" style={{ backgroundColor: C.taupeLight }} />
        </div>
      </div>
    </div>
  );
}


// ─── MAIN PAGE COMPONENT ─────────────────────────────────────────────────────

export default function Home() {
  // Custom hook — aduce posts, loading, error dintr-o singură linie
  const { posts, featuredPost, loading, error } = usePosts();

  // State local pentru newsletter
  // const [email, setEmail]           = useState('');
  // const [subscribed, setSubscribed] = useState(false);
  // const [emailError, setEmailError] = useState(false);

  // // Handler newsletter
  // function handleSubscribe() {
  //   const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  //   if (!valid) {
  //     setEmailError(true);
  //     return;
  //   }
  //   setEmailError(false);
  //   setSubscribed(true);
  //   // TODO: fetch('/posts/newsletter', { method: 'POST', body: JSON.stringify({ email }) })
  //   console.log('Subscribed:', email);
  // }

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    // Fragment <> = container invizibil, nu adaugă un div în plus în DOM
    <>

      {/* ══════════════════════════════════════════════════════════════
          TICKER — bara animată de sus
          overflow-hidden + whitespace-nowrap = textul nu se sparge
          Animația e definită în CSS global (vezi nota de jos)
      ══════════════════════════════════════════════════════════════ */}
     <div
        className="overflow-hidden whitespace-nowrap py-1 text-xs font-semibold tracking-widest uppercase"
        style={{ backgroundColor: "#b6a898", color: "#fefefc" }}
      >
        {/* Containerul care se mișcă */}
        <div className="inline-block animate-ticker">
          {/* Rendăm conținutul de 2 ori (sau mai mult) pentru a umple golul */}
          {[...Array(2)].map((_, index) => (
            <span key={index} className="inline-flex">
              <span className="mx-8">✦ Lorem ipsum</span>
              <span className="mx-4" style={{ color: "#fefefc" }}>✶</span>
              <span className="mx-8">✦ dolor sit amet</span>
              <span className="mx-4" style={{ color: "#fefefc" }}>✶</span>
              <span className="mx-8">✦ consectetur adipiscing elit</span>
              <span className="mx-4" style={{ color: "#fefefc" }}>✶</span>
              <span className="mx-8">✦ sed do eiusmod tempor</span>
              <span className="mx-4" style={{ color: "#fefefc" }}>✶</span>
              <span className="mx-8">✦ incididunt ut labore et dolore magna aliqua</span>
              <span className="mx-8">✦ Lorem  ipsum</span>
              <span className="mx-4" style={{ color: "#fefefc" }}>✶</span>
              <span className="mx-8">✦ dolor sit amet</span>
              <span className="mx-4" style={{ color: "#fefefc" }}>✶</span>
              <span className="mx-8">✦ consectetur adipiscing elit</span>
              <span className="mx-4" style={{ color: "#fefefc" }}>✶</span>
              <span className="mx-8">✦ sed do eiusmod tempor</span>
              <span className="mx-4" style={{ color: "#fefefc" }}>✶</span>
              <span className="mx-8">✦ incididunt ut labore et dolore magna aliqua</span>
            </span>
          ))}
        </div>
      </div>


      {/* ══════════════════════════════════════════════════════════════
          HERO — 3 coloane: img | imagine mare + titlu suprapus | img
          Pe mobile: grid-cols-1, coloanele laterale hidden
      ══════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: "#dbcfbf", minHeight: '85vh' }}
      >
        {/* Text decorativ vertical dreapta */}
        <p
       
          className="font-light italic mb-6 leading-tight hidden lg:block absolute top-[7%] right-6 font-semibold tracking-widest z-10 opacity-40"
          style={{
            // writingMode: 'vertical-rl',
            // transform: 'rotate(180deg)',
            color: C.brown,
            fontFamily: '"Lovers Quarrel", cursive, "Cormorant Garamond", Georgia, serif',
            fontSize: 56,
          }}
        >
          Citeste acum
        </p>

        {/* Grid 3 coloane */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] min-h-[85vh]">

          {/* Coloana stânga */}
          <div className="hidden lg:flex items-center pl-16 pr-4 py-16">
            <img
              src="https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=500&h=750"
              alt="Coding workspace"
              className="w-full object-cover rounded-sm"
              style={{ height: '420px' }}
              loading="eager" // hero e above the fold, încărcăm imediat
            />
          </div>

          {/* Coloana centrală — imagine mare + titlu suprapus */}
          <div className="relative" style={{ minHeight: '85vh' }}>
            <img
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&h=1400"
              alt="Developer workspace aesthetic"
              className="w-full h-full object-cover"
              style={{
                // clip-path = formă neregulată care taie imaginea
                // ellipse(lățime% înălțime% at centruX% centruY%)
                clipPath: 'ellipse(46% 55% at 50% 45%)',
                position: 'absolute',
                top: 0, left: 0,
              }}
              loading="eager"
            />

            {/* Titlul suprapus */}
            <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 text-center w-[90%] z-10">
              <h1
                className="font-light italic text-white leading-tight"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 'clamp(3rem, 6vw, 5.5rem)',
                  textShadow: '0 2px 20px rgba(58,44,39,0.4)',
                }}
              >
                Ask<br />me <br />anything
              </h1>
            </div>
          </div>

          {/* Coloana dreapta */}
          <div className="hidden lg:flex items-center pr-16 pl-4 py-16">
            <img
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=500&h=750"
              alt="Code on screen"
              className="w-full object-cover rounded-sm"
              style={{ height: '420px' }}
              loading="eager"
            />
          </div>
          <p
       
          className="font-light italic mb-6 leading-tight hidden lg:block absolute top-[82%] left-6 font-semibold tracking-widest z-10 opacity-40"
          style={{
            color: C.brown,
            fontFamily: '"Lovers Quarrel", cursive, "Cormorant Garamond", Georgia, serif',
            fontSize: 56,
          }}
        >
          Citeste acum
        </p>
        </div>
      </section>

 <div
        className="overflow-hidden whitespace-nowrap py-5 text-xs font-semibold tracking-widest uppercase"
        style={{ backgroundColor: "#b6a898", color: "#fefefc" }}
      >
        {/* Containerul care se mișcă */}
        <div className="inline-block animate-ticker">
          {/* Rendăm conținutul de 2 ori (sau mai mult) pentru a umple golul */}
          {[...Array(2)].map((_, index) => (
            <span key={index} className="inline-flex">
              {/* <span className="mx-8" style={{ fontSize: 18, color: "#fefefc" }}>✦ thoughts on code  design</span>
              <span className="mx-4" style={{ fontSize: 18, color: "#fefefc" }}>✶</span>
              <span className="mx-8" style={{ fontSize: 18, color: "#fefefc" }}>✦ web development deep dives</span>
              <span className="mx-4" style={{ fontSize: 18, color: "#fefefc" }}>✶</span>
              <span className="mx-8" style={{ fontSize: 18, color: "#fefefc" }}>✦ UI/UX  aesthetics</span>
              <span className="mx-4" style={{ fontSize: 18, color: "#fefefc" }}>✶</span>
              <span className="mx-8" style={{ fontSize: 18, color: "#fefefc" }}>✦ UI/UX  aesthetics</span>
              <span className="mx-4" style={{ fontSize: 18,color: "#fefefc" }}>✶</span>
              <span className="mx-8" style={{ fontSize: 18, color: "#fefefc" }}>✦ thoughts on code  design</span>
              <span className="mx-4" style={{ fontSize: 18, color: "#fefefc" }}>✶</span>
              <span className="mx-8" style={{ fontSize: 18, color: "#fefefc" }}>✦ web development deep dives</span>
              <span className="mx-4" style={{ fontSize: 18, color: "#fefefc" }}>✶</span>
              <span className="mx-8" style={{ fontSize: 18, color: "#fefefc" }}>✦ UI/UX  aesthetics</span>
              <span className="mx-4" style={{ fontSize: 18, color: "#fefefc" }}>✶</span>
              <span className="mx-8" style={{ fontSize: 18, color: "#fefefc" }}>✦ UI/UX  aesthetics</span>
              <span className="mx-4" style={{ fontSize: 18, color: "#fefefc" }}>✶</span> */}
              <span className="mx-8">✦ Lorem ipsum</span>
              <span className="mx-4" style={{ color: "#fefefc" }}>✶</span>
              <span className="mx-8">✦ dolor sit amet</span>
              <span className="mx-4" style={{ color: "#fefefc" }}>✶</span>
              <span className="mx-8">✦ consectetur adipiscing elit</span>
              <span className="mx-4" style={{ color: "#fefefc" }}>✶</span>
              <span className="mx-8">✦ sed do eiusmod tempor</span>
              <span className="mx-4" style={{ color: "#fefefc" }}>✶</span>
              <span className="mx-8">✦ incididunt ut labore et dolore magna aliqua</span>
              <span className="mx-8">✦ Lorem  ipsum</span>
              <span className="mx-4" style={{ color: "#fefefc" }}>✶</span>
              <span className="mx-8">✦ dolor sit amet</span>
              <span className="mx-4" style={{ color: "#fefefc" }}>✶</span>
              <span className="mx-8">✦ consectetur adipiscing elit</span>
              <span className="mx-4" style={{ color: "#fefefc" }}>✶</span>
              <span className="mx-8">✦ sed do eiusmod tempor</span>
              <span className="mx-4" style={{ color: "#fefefc" }}>✶</span>
              <span className="mx-8">✦ incididunt ut labore et dolore magna aliqua</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          FEATURED ARTICLE — bg clay, imagine în cerc stânga, text dreapta
          Afișăm loading skeleton sau eroare dacă e cazul
      ══════════════════════════════════════════════════════════════ */}
      <section
        className="flex flex-col lg:flex-row items-center overflow-hidden"
        style={{ backgroundColor: "#dbcfbf", minHeight: '75vh' }}
        aria-label="Featured article"
      >
        {/* ── Loading state ── */}
        {loading && (
          <div className="w-full flex items-center justify-center py-24">
            <div
              className="w-48 h-48 rounded-full animate-pulse"
              style={{ backgroundColor: C.clay }}
            />
          </div>
        )}

        {/* ── Error state ── */}
        {error && !loading && (
          <div className="w-full text-center py-24 px-8">
            <p className="text-white/70 text-sm tracking-widest uppercase mb-2">
              Of, ceva nu a mers =(
            </p>
            <p className="text-white/50 text-xs">{error}</p>
          </div>
        )}

        {/* ── Success state — avem date ── */}
        {!loading && !error && featuredPost && (
          <>
            {/* Imagine în cerc */}
            <div className="flex-none w-full lg:w-[45%] px-10 lg:pl-20 lg:pr-10 py-16">
              <img
                src={featuredPost.imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&h=800'}
                alt={featuredPost.title}
                className="w-full aspect-square object-cover rounded-full mx-auto"
                // aspect-square = păstrează proporția 1:1
                // rounded-full = border-radius 50% → cerc perfect
                style={{ maxWidth: '420px' }}
                loading="lazy"
              />
            </div>

            {/* Content text */}
            <div className="flex-1 px-10 lg:pr-20 lg:pl-10 pb-16 lg:pb-0">
              <p
                className="text-xs font-semibold tracking-widest uppercase mb-5"
                style={{ color: 'rgba(255,255,255,0.65)' }}
              >
                ✦ Featured article
              </p>

              <h2
                className="font-light italic text-white leading-tight mb-6"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 'clamp(2.2rem, 4vw, 3.6rem)',
                }}
              >
                {featuredPost.title}
              </h2>

              <p
                className="text-sm leading-loose mb-9"
                style={{ color: 'rgba(255,255,255,0.82)', maxWidth: '480px' }}
              >
                {featuredPost.excerpt}
              </p>

              {/* Buton outlined alb */}
              <Link
                to={`/posts/${featuredPost._id}`}
                className="inline-block px-9 py-3.5 border border-white text-white text-xs font-semibold tracking-widest uppercase transition-all duration-250 hover:bg-white"
                style={{
                  // CSS-in-JS pentru hover color nu merge direct cu Tailwind
                  // soluție: folosim group/peer sau adăugăm o clasă custom
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.color = C.brown;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.color = 'white';
                }}
              >
                Read article →
              </Link>
            </div>
          </>
        )}
      </section>



      {/* ══════════════════════════════════════════════════════════════
          RECENT POSTS — grid 2 coloane cu carduri
      ══════════════════════════════════════════════════════════════ */}
        <section
          id="about"
          className="flex flex-col lg:flex-row items-center overflow-hidden"
          style={{ backgroundColor: "#89796a", minHeight: '65vh' }}
          aria-label="About the author"
        >
        {/* Imagine cu formă ovală */}
        <div className="flex-none w-full lg:w-[42%] px-10 lg:pl-20 lg:pr-10 py-16">
          <img
            src="https://www.forbes.com/advisor/wp-content/uploads/2022/06/How_To_Start_A_Blog_-_article_image.jpg"
            alt="Popi — autoarea blogului"
            className="w-full object-cover mx-auto"
            style={{
              maxWidth: '320px',
              aspectRatio: '3/4',
              // border-radius manual: rotunjit sus, drept jos
              borderRadius: '160px 160px 0 0',
            }}
            loading="lazy"
          />
        </div>

        {/* Text */}
        <div className="flex-1 px-10 lg:pr-20 lg:pl-10 pb-16 lg:pb-0">
          {/* <p
            className="text-xs font-semibold tracking-widest uppercase mb-5"
            style={{ color: "#fefefc" }}
          >
            ✦ Despre autoare
          </p> */}

          <h2
            className="font-light italic mb-6 leading-tight"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(2rem, 3.5vw, 3.2rem)',
              color: "#fefefc",
            }}
          >
            The quick fox jumped<br />out of the box
          </h2>

          <p
            className="text-sm leading-loose mb-4"
            style={{ color: "#fefefc", maxWidth: '460px' }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
           
          </p>
          <p
            className="text-sm leading-loose mb-10"
            style={{ color: "#fefefc", maxWidth: '460px' }}
          >
             Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>

          {/* Buton outlined dark */}
          <Link
            to="/about"
            className="inline-block px-9 py-3.5 border text-xs font-semibold tracking-widest uppercase transition-all duration-250"
            style={{ borderColor: C.brown, color: C.brown }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.backgroundColor = 'white';
              el.style.color = '#89796a';
              el.style.scale = '102%';
              el.style.border = 'transparent';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.backgroundColor = 'white';
              el.style.color = '#89796a';
              el.style.scale = '100%';
              el.style.border = 'transparent';
            }}
          >
            MAI MULT
          </Link>
        </div>
      </section>

             <section
        id="recent"
        className="px-6 lg:px-16 py-20"
        style={{ backgroundColor: "#dbcfbf" }}
        aria-label="Recent posts"
      >
        {/* Header secțiunii */}
        <div className="flex items-baseline justify-between mb-12">
          <h2
            className="font-light italic"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              color: C.brown,
            }}
          >
          Ultimele postări
          </h2>
          <Link
            to="/posts"
            className="text-xs font-semibold tracking-widest uppercase border-b transition-all duration-200"
            style={{ color: C.taupeMin, borderColor: C.taupeMin }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.color = C.brown;
              el.style.borderColor = C.brown;
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.color = C.taupeMin;
              el.style.borderColor = C.taupeMin;
            }}
          >
            See all posts
          </Link>
        </div>

        {/* Grid cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {loading
            // Loading: afișăm 4 skeleton cards
            ? Array(4).fill(null).map((_, i) => <SkeletonCard key={i} />)
            // Error sau array gol
            : error
              ? (
                <p
                  className="col-span-2 text-center py-12 text-sm tracking-widest"
                  style={{ color: C.brownMid }}
                >
                  Of, ceva nu a mers =(
                </p>
              )
              : posts.length === 0
                ? (
                  <p
                    className="col-span-2 text-center py-12 text-sm tracking-widest"
                    style={{ color: C.brownMid }}
                  >
                    Nothing to see here
                  </p>
                )
                // Date: randăm fiecare post cu componenta PostCard
                : posts.map(post => (
                    <PostCard key={post._id} post={post} />
                    // key={post._id} = React are nevoie de o cheie unică
                    // pentru a ști ce element să re-randeze când lista se schimbă
                  ))
          }
        </div>
      </section>

      <section
        id="about"
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          // 1. SETĂRI PARALLAX PENTRU FUNDAL
          backgroundImage: `url('https://res.cloudinary.com/worldpackers/image/upload/c_fill,f_auto,q_auto,w_1024/v1/guides/article_cover/vdw3fdnjrjqyxxscep5n?_a=BACAGSGT')`, // O imagine de bijuterii similară
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed', // <-- Aceasta este linia magică pentru parallax CSS
          minHeight: '85vh', // Puțin mai înaltă pentru un efect hero mai bun
        }}
        aria-label="About the author"
      >
        {/* 2. OVERLAY ÎNTUNECAT (pentru contrastul textului, ca în screenshot) */}
        <div className="absolute inset-0 bg-black/40 z-0"></div>

        {/* 3. CONTAINER CONȚINUT CENTRAL (Z-10 pentru a fi deasupra overlay-ului) */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
          {/* Text mic deasupra */}
          <p
            className="text-xs tracking-widest uppercase mb-4 opacity-90"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              color: "#fefefc",
            }}
          >
            Uite ce mai fac în timpul liber!
          </p>

          {/* Titlu Mare Stilizat (ON SALE) */}
          <h1
            className="font-light mb-8 leading-tight tracking-tight"
            style={{
              // Folosim fontul din screenshot (Cormorant) sau un serif elegant similar
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(3rem, 7vw, 6rem)', // Responsiv: mai mic pe mobil, mare pe desktop
              textTransform: 'uppercase',
              color: "#fefefc",
              // Un mic drop shadow pentru a imita efectul din imagine și a crește lizibilitatea
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            }}
          >
            PORTOFOLIO
          </h1>

          {/* Buton Outlined (Shop Now) */}
          <Link
            to="/shop"
            className="inline-block px-10 py-4 border border-white text-sm tracking-widest uppercase transition-all duration-300"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              color: "#fefefc",
              backgroundColor: 'transparent',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              // Efect la hover: fundal alb, text în culoarea brandului (ex: taupe/maro)
              el.style.backgroundColor = 'white';
              el.style.color = '#3a2c27'; // C.brown
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.backgroundColor = 'transparent';
              el.style.color = '#fefefc';
            }}
          >
            DETALII
          </Link>
        </div>
      </section>

    </>
  );
}