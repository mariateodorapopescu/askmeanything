import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  const [email, setEmail]     = useState('');
  const [submitted, setSubmitted] = useState(false);

  const quickLinks = [
    { label: 'Acasă',       to: '/'       },
    { label: 'Storytime',to: '/blog'    },
    { label: 'Postări',  to: '/posts'    },
    { label: 'FAQ',         to: '/qa'     },
    { label: 'Contact',     to: '/callme' },
  ];

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    // todo conectare cu serviciu de newsletter (Mailchimp?)
    console.log('Subscribed:', email);
    setSubmitted(true);
    setEmail('');
  }

  return (
    <footer
      style={{
        backgroundColor: '#b5a898',
        color: '#fff',
        fontFamily: 'Montserrat, sans-serif',
      }}
    >
      {/* ── MAIN GRID ─────────────────────────────────────── */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '60px 32px 48px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '48px',
          alignItems: 'start',
        }}
      >

        {/* ── COL 1: Quick links + Subscribe ──────────────── */}
        <div>
          {/* Titlu "Quick links" */}
          <h3
            style={{
              fontFamily: '"Lovers Quarrel", cursive',
              fontSize: '2rem',
              fontWeight: 400,
              marginBottom: '24px',
              color: '#fff',
              letterSpacing: '0.02em',
            }}
          >
            Lik-uri utile
          </h3>

          {/* Lista de linkuri */}
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 48px 0' }}>
            {quickLinks.map(({ label, to }) => (
              <li key={to} style={{ marginBottom: '14px' }}>
                <Link
                  to={to}
                  style={{
                    color: 'rgba(255,255,255,0.88)',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    letterSpacing: '0.03em',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.88)')}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* "Subscribe to email" */}
          <h3
            style={{
              fontFamily: '"Lovers Quarrel", cursive',
              fontSize: '1.85rem',
              fontWeight: 400,
              marginBottom: '20px',
              color: '#fff',
              letterSpacing: '0.02em',
            }}
          >
            Fii la curent cu noile mele postări
          </h3>

          {submitted ? (
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)' }}>
              Mulțumesc!
            </p>
          ) : (
            <form
              onSubmit={handleSubscribe}
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid rgba(255,255,255,0.7)',
                maxWidth: '360px',
              }}
            >
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e-mail"
                required
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  padding: '14px 16px',
                  color: '#fff',
                  fontSize: '0.875rem',
                  fontFamily: 'Montserrat, sans-serif',
                  letterSpacing: '0.04em',
                }}
              />
              {/* Placeholder color via CSS – trick: pseudo-element nu merge inline,
                  adaugă în globals.css:
                  footer input::placeholder { color: rgba(255,255,255,0.65); } */}
              <button
                type="submit"
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderLeft: '1px solid rgba(255,255,255,0.7)',
                  padding: '14px 18px',
                  cursor: 'pointer',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                aria-label="Subscribe"
              >
                <ArrowRight size={18} />
              </button>
            </form>
          )}
        </div>

        {/* ── COL 2: About Us ─────────────────────────────── */}
        <div>
          <h3
            style={{
              fontFamily: '"Lovers Quarrel", cursive',
              fontSize: '2rem',
              fontWeight: 400,
              marginBottom: '24px',
              color: '#fff',
              letterSpacing: '0.02em',
            }}
          >
            Cine sunt eu?
          </h3>
          <p
            style={{
              fontSize: '0.9rem',
              lineHeight: '1.75',
              color: 'rgba(255,255,255,0.85)',
              maxWidth: '380px',
            }}
          >
           Sunt o tânără creativă și ambițioasă, studentă la master la Poli,
           cu abilități interpersonale puternice. În timpul liber, îmi place să învăț despre
           psihologie, relațiile interumane, dar și despre baze de date, 
          inteligență artificială și machine learning,
          dezvoltare software și web. 
           </p>
        </div>

        {/* ── COL 3: Logo badge + Social icons ────────────── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '200px',   // împinge social icons jos
          }}
        >

          {/* Social icons */}
          <div style={{ display: 'flex', gap: '20px' }}>
            <SocialIcon href="https://heyitsmemariap.netlify.app/" label="Facebook">
              <Facebook size={20} />
            </SocialIcon>
            <SocialIcon href="https://resumepmt.netlify.app/" label="Instagram">
              <Instagram size={20} />
            </SocialIcon>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ──────────────────────────────────────── */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.2)',
          padding: '20px 32px',
          maxWidth: '1280px',
          margin: '0 auto',
          fontSize: '0.78rem',
          color: 'rgba(255,255,255,0.7)',
          letterSpacing: '0.03em',
        }}
      >
       © 2026,  React, Vite · {' '}
        <a
          href="https://github.com/mariateodorapopescu"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'underline' }}
        >
        PMT
        </a>{' '}
         · powered by netlify
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────
// Sub-component: Social Icon – cerc alb cu icon interior
// ─────────────────────────────────────────────────────────────
function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
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
        transition: 'background-color 0.2s, transform 0.2s',
        textDecoration: 'none',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(255,255,255,0.45)';
        (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.1)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(255,255,255,0.25)';
        (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)';
      }}
    >
      {children}
    </a>
  );
}
