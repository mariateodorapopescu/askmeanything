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

const mockPosts: Post[] = [
  {
    _id: 'mock-1',
    title: "You're Amazing",
    category: 'Lifestyle',
    author: 'Popi',
    featured: false,
    createdAt: '2026-01-15T10:00:00.000Z',
    excerpt: 'O privire asupra detaliilor mici care fac diferența în fiecare zi.',
    imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&h=600',
  },
  {
    _id: 'mock-2',
    title: "You're Gorgeous",
    category: 'Inspirație',
    author: 'Popi',
    featured: false,
    createdAt: '2026-01-10T10:00:00.000Z',
    excerpt: 'Câteva gânduri despre stil, încredere și autenticitate.',
    imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&h=600',
  },
  {
    _id: 'mock-3',
    title: "You're So Amazing",
    category: 'Personal',
    author: 'Popi',
    featured: false,
    createdAt: '2026-01-05T10:00:00.000Z',
    excerpt: 'Povestea din spatele acestui proiect și de ce a contat pentru mine.',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&h=600',
  },
  {
    _id: 'mock-4',
    title: "You're So Gorgeous",
    category: 'Design',
    author: 'Popi',
    featured: false,
    createdAt: '2026-01-01T10:00:00.000Z',
    excerpt: 'De ce micile detalii vizuale schimbă complet experiența.',
    imageUrl: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=800&h=600',
  },
];

const mockTopPosts: Post[] = mockPosts.slice(0, 3); // refolosim primele 3 mock-uri

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────
// Componentele mici (PostCard, SkeletonCard) stau în același fișier
// dacă sunt folosite DOAR aici. 

// ── PostCard ──
// Primește un Post și afișează cardul cu imagine, titlu, dată, excerpt.
// "{ post }: { post: Post }" = destructurare props cu tipaj TypeScript
// function PostCard({ post }: { post: Post }) {
//   return (
//     // Link din react-router-dom = <a> care navighează fără reload de pagină
//     <Link
//       to={`/posts/${post._id}`}
//       className="group block overflow-hidden border transition-all duration-300 hover:-translate-y-1"
//       style={{ borderColor: C.taupe }}
//     >
//       {/* Imaginea cu zoom la hover */}
//       <div className="overflow-hidden h-64">
//         <img
//           src={post.imageUrl || 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=800&h=500'}
//           alt={post.title}
//           className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//           // "group-hover:scale-105" funcționează pentru că părintele are clasa "group"
//           // = când hover pe parent, aplică scale-105 pe acest element
//           loading="lazy"
//         />
//       </div>

//       {/* Body card */}
//       <div className="p-7">
//         {/* Tag categorie */}
//         <p
//           className="text-xs font-semibold tracking-widest uppercase mb-2"
//           style={{ color: C.clayDark }}
//         >
//           {post.category}
//         </p>

//         {/* Titlu — group-hover adaugă underline */}
//         <h3
//           className="font-light mb-2 leading-snug transition-all duration-200"
//           style={{
//             fontFamily: "'Cormorant Garamond', Georgia, serif",
//             fontSize: 'clamp(1.3rem, 2vw, 1.6rem)',
//             fontStyle: 'italic',
//             color: C.brown,
//             // underline la hover prin boxShadow trick — mai ușor de controlat decât border
//             textDecoration: 'none',
//           }}
//         >
//           {post.title}
//         </h3>

//         {/* Data */}
//         <p
//           className="text-xs tracking-widest uppercase mb-3"
//           style={{ color: C.taupeMin }}
//         >
//           {formatDate(post.createdAt)}
//         </p>

//         {/* Excerpt */}
//         <p
//           className="text-sm leading-relaxed"
//           style={{ color: C.brownMid }}
//         >
//           {post.excerpt}
//         </p>
//       </div>
//     </Link>
//   );
// }

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

async function trackView(post: Post) {
  if (!post.type) return; // mock-urile nu au type, le ignorăm
  const base = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
  try {
    await fetch(`${base}/api/posts/${post._id}/view`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: post.type }),
    });
  } catch {
    // view tracking nu e critic, eșecul e silențios
  }
}

// ── CindyPostCard — stilul shop Cindy: imagine portrait, text centrat, buton outlined ──
function CindyPostCard({ post }: { post: Post }) {
  return (
    <Link
      to={`/posts/${post._id}`}
      className="group block"
      style={{ textDecoration: 'none' }}
      onClick={() => trackView(post)}
    >
      {/* Imagine portrait 3:4 — exact ca în screenshot */}
      <div className="overflow-hidden w-full" style={{ aspectRatio: '3/4' }}>
        <img
          src={post.imageUrl || 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=800&h=1067'}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Text centrat sub imagine */}
      <div className="pt-5 pb-2 text-center px-3">

        {/* Titlu în Lovers Quarrel — fontul script din screenshot */}
        <h3
          className="mb-2 leading-snug group-hover:underline"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(1.5rem, 2vw, 2rem)',
            color: C.brown,
            fontWeight: 400,
          }}
        >
          {post.title}
        </h3>

        {/* Data — în locul prețului */}
        <p
          className="font-semibold mb-5"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '0.8rem',
            letterSpacing: '0.05em',
            color: C.brown,
          }}
        >
          {formatDate(post.createdAt)}
        </p>

        {/* Buton outlined full-width — "Choose options" din screenshot devine "Citește acum" */}
        <div
          className="w-full py-3 text-xs tracking-widest uppercase transition-all duration-300"
          style={{
            border: `1px solid ${"#000000"}`,
            color: C.brownMid,
            fontFamily: "'Montserrat', sans-serif",
          }}
          // box-shadow inset simulează un border mai gros fără layout shift
          onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 0 2px ${"#000000"}`)}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
        >
          Citește acum
        </div>
      </div>
    </Link>
  );
}

// ── TopPostCard — stilul Cindy cu 3 coloane: imagine mare, titlu uppercase, link text ──
function TopPostCard({ post }: { post: Post }) {
  return (
    <Link
      to={`/posts/${post._id}`}
      className="group block text-center"
      style={{ textDecoration: 'none' }}
      onClick={() => trackView(post)}
    >
      {/* Imagine portrait — ocupă ~65% din card, fără border */}
      <div className="overflow-hidden w-full mb-6" style={{ aspectRatio: '3/4' }}>
        <img
          src={post.imageUrl || 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=800&h=1067'}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Titlu uppercase tracked — "BESTSELLERS" style */}
      <h3
        className="mb-4 tracking-widest uppercase"
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
          color: C.brown,
          fontWeight: 400,
          letterSpacing: '0.2em',
        }}
      >
        {post.title}
      </h3>

      {/* Excerpt centrat — descrierea scurtă */}
      <p
        className="mb-5 mx-auto leading-relaxed"
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: '1rem',
          color: C.brownMid,
          maxWidth: '280px',
        }}
      >
        {post.excerpt}
      </p>

      {/* Link text cu săgeată — nu buton bordered */}
      
      <span
        className="inline-flex items-center gap-2 text-xs tracking-widest uppercase"
        style={{ fontFamily: "'Montserrat', sans-serif", color: C.brown }}
      >
        Citește acum
        {/* inline-block e necesar ca translate să funcționeze pe un element inline */}
        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </span>
    </Link>
  );
}

// ─── MAIN PAGE COMPONENT ─────────────────────────────────────────────────────

export default function Home() {
  // Custom hook — aduce posts, loading, error dintr-o singură linie
  // const { posts, featuredPost, loading, error } = usePosts();
  // const { posts, topPosts, featuredPost, loading, error } = usePosts();
  const { posts, topPosts, loading, error } = usePosts();

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
        <div className="inline-block animate-ticker2">
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

      {/* ══ TOP 3 POSTS ══ */}
      <section
        className="px-6 lg:px-16 py-16"
        style={{ backgroundColor: "#dbcfbf" }}
      >
        <div className="flex items-baseline justify-between mb-10">
          <h2
            className="font-light italic"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
              color: C.brown,
            }}
          >
            Cele mai citite
          </h2>
          <Link
            to="/posts"
            className="text-xs font-semibold tracking-widest uppercase border-b"
            style={{ color: C.taupeMin, borderColor: C.taupeMin }}
          >
            Toate postările
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
  {loading
    ? Array(3).fill(null).map((_, i) => <SkeletonCard key={i} />)
    : (topPosts.length > 0 ? topPosts : mockTopPosts).map((post: Post) => (
        <CindyPostCard key={post._id} post={post} />
      ))
  }
</div>
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
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> */}
          <div className="grid grid-cols-1 sd:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading
            // Loading: afișăm 4 skeleton cards
            ? Array(4).fill(null).map((_, i) => <SkeletonCard key={i} />)
            // Error sau array gol
            : error
              // ? (
              //   <p
              //     className="col-span-2 text-center py-12 text-sm tracking-widest"
              //     style={{ color: C.brownMid }}
              //   >
              //     Of, ceva nu a mers =(
              //   </p>
              // )
              ? mockPosts.map(post => <TopPostCard key={post._id} post={post} />)
              : posts.length === 0
                // ? (
                //   <p
                //     className="col-span-2 text-center py-12 text-sm tracking-widest"
                //     style={{ color: C.brownMid }}
                //   >
                //     Nothing to see here
                //   </p>
                // )

                 ? mockPosts.map(post => <TopPostCard key={post._id} post={post} />)

                // Date: randăm fiecare post cu componenta PostCard
                : posts.map(post => (
                    <TopPostCard key={post._id} post={post} />
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