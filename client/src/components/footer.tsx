import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  const [email,     setEmail]     = useState('');
  const [submitted, setSubmitted] = useState(false);

  const quickLinks = [
    { label: 'Acasă',    to: '/'       },
    { label: 'Storytime',to: '/blog'   },
    { label: 'Postări',  to: '/posts'  },
    { label: 'FAQ',      to: '/qa'     },
    { label: 'Contact',  to: '/callme' },
  ];

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    console.log('Subscribed:', email);
    setSubmitted(true);
    setEmail('');
  }

  return (
    <footer style={{ backgroundColor: '#b5a898', color: '#fff', fontFamily: 'Montserrat, sans-serif' }}>

      {/* ── MAIN GRID ──────────────────────────────────────────────
          Desktop: 3 coloane egale
          Mobil:   1 coloană, totul stivuit vertical
      ─────────────────────────────────────────────────────────── */}
      <div className="footer-grid">

        {/* ── COL 1: Quick links + Subscribe ─────────────────── */}
        <div>
          <FooterHeading>Lik-uri utile</FooterHeading>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0' }}>
            {quickLinks.map(({ label, to }) => (
              <li key={to} style={{ marginBottom: '14px' }}>
                <Link
                  to={to}
                  style={{ color: 'rgba(255,255,255,0.88)', textDecoration: 'none', fontSize: '0.875rem', letterSpacing: '0.03em', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.88)')}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <FooterHeading style={{ fontSize: '1.7rem' }}>
            Fii la curent cu noile mele postări
          </FooterHeading>

          {submitted ? (
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)' }}>Mulțumesc! 🎉</p>
          ) : (
            <form
              onSubmit={handleSubscribe}
              style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(255,255,255,0.7)', maxWidth: '360px' }}
            >
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e-mail"
                required
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', padding: '14px 16px', color: '#fff', fontSize: '0.875rem', fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.04em' }}
              />
              <button
                type="submit"
                style={{ background: 'transparent', border: 'none', borderLeft: '1px solid rgba(255,255,255,0.7)', padding: '14px 18px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                aria-label="Subscribe"
              >
                <ArrowRight size={18} />
              </button>
            </form>
          )}
        </div>

        {/* ── COL 2: About ────────────────────────────────────── */}
        <div>
          <FooterHeading>Cine sunt eu?</FooterHeading>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.75', color: 'rgba(255,255,255,0.85)', maxWidth: '380px' }}>
            Sunt o tânără creativă și ambițioasă, studentă la master la Poli,
            cu abilități interpersonale puternice. În timpul liber, îmi place să învăț despre
            psihologie, relațiile interumane, dar și despre baze de date,
            inteligență artificială și machine learning,
            dezvoltare software și web.
          </p>
        </div>

        {/* ── COL 3: Social icons ─────────────────────────────── */}
        {/*
          Desktop: aliniate dreapta, jos (folosim flex-end + margin-top auto)
          Mobil:   aliniate stânga, după "About" (fără gap 200px)
        */}
        <div className="footer-social-col">
          <div className="footer-social-icons">
            <SocialIcon href="https://heyitsmemariap.netlify.app/" label="Facebook">
              <Facebook size={20} />
            </SocialIcon>
            <SocialIcon href="https://resumepmt.netlify.app/" label="Instagram">
              <Instagram size={20} />
            </SocialIcon>
          </div>
        </div>

      </div>

      {/* ── BOTTOM BAR ──────────────────────────────────────────── */}
      <div className="footer-bottom">
        © 2026, React, Vite ·{' '}
        <a
          href="https://github.com/mariateodorapopescu"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'underline' }}
        >
          PMT
        </a>
        {' '}· powered by netlify
      </div>

      {/* ── CSS RESPONSIVE ─────────────────────────────────────────
          Toată logica de layout e aici, separată de JSX.
          Principiu: mobile-first sau desktop-first – ambele merg,
          eu am ales desktop-first (definesc desktop, modific cu @media).
      ─────────────────────────────────────────────────────────── */}
      <style>{`
        /* DESKTOP ───────────────────────────────── */
        .footer-grid {
          max-width: 1280px;
          margin: 0 auto;
          padding: 60px 32px 48px;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;   /* 3 coloane egale */
          gap: 48px;
          align-items: start;
        }

        /* Col 3: pe desktop – iconițele se duc jos-dreapta */
        .footer-social-col {
          display: flex;
          flex-direction: column;
          align-items: flex-end;      /* aliniat dreapta */
          justify-content: flex-end;  /* aliniat jos */
          height: 100%;               /* ocupă toată înălțimea coloanei */
          min-height: 300px;          /* asigură că e destul spațiu */
        }

        .footer-social-icons {
          display: flex;
          gap: 20px;
        }

        /* Bottom bar */
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.2);
          padding: 20px 32px;
          max-width: 1280px;
          margin: 0 auto;
          font-size: 0.78rem;
          color: rgba(255,255,255,0.7);
          letter-spacing: 0.03em;
        }

        /* TABLET  (max 900px) ────────────────────── */
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;   /* 2 coloane */
            gap: 36px;
          }

          /* Col 3 ocupă ambele coloane, iconițe stânga */
          .footer-social-col {
            grid-column: 1 / -1;       /* span full width */
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            min-height: unset;
            padding-top: 8px;
          }
        }

        /* MOBIL  (max 600px) ─────────────────────── */
        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr;    /* 1 coloană, totul stivuit */
            padding: 40px 20px 32px;
            gap: 32px;
          }

          /* Iconițele social apar ca un rând orizontal */
          .footer-social-col {
            grid-column: 1;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            min-height: unset;
          }

          .footer-social-icons {
            gap: 16px;
          }

          /* Bottom bar mai compact */
          .footer-bottom {
            padding: 16px 20px;
            text-align: center;
          }
        }

        /* Placeholder email input */
        footer input::placeholder {
          color: rgba(255,255,255,0.55);
        }
      `}</style>

    </footer>
  );
}

// ── Helper: heading decorativ ────────────────────────────────
function FooterHeading({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <h3 style={{
      fontFamily: '"Lovers Quarrel", cursive',
      fontSize: '2rem',
      fontWeight: 400,
      marginBottom: '24px',
      marginTop: 0,
      color: '#fff',
      letterSpacing: '0.02em',
      ...style,
    }}>
      {children}
    </h3>
  );
}

// ── Social Icon: cerc cu hover ───────────────────────────────
function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0)',
        color: '#fff',
        textDecoration: 'none',
        transition: 'background-color 0.2s, transform 0.2s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(255,255,255,0.35)';
        (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.1)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(255,255,255,0.15)';
        (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)';
      }}
    >
      {children}
    </a>
  );
}