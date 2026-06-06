import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { playSynthSound } from '../utils/audio';

interface ContactSectionProps {
  isCliMode?: boolean;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ isCliMode: propIsCliMode }) => {
  const { contact, social, identity, isSoundEnabled } = usePortfolio();
  const location = useLocation();
  const isCliMode = propIsCliMode !== undefined ? propIsCliMode : location.pathname.includes('/cli');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playSynthSound('click', isSoundEnabled);
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    setErrorMsg(null);
    
    try {
      let targetUrl = contact.formspreeUrl;
      if (!targetUrl || targetUrl.trim() === 'https://formspree.io' || targetUrl.trim() === 'https://formspree.io/') {
        targetUrl = 'https://formspree.io/f/xlgvkvyb';
      }
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          message,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        playSynthSound('whoosh', isSoundEnabled);
        setName('');
        setEmail('');
        setMessage('');
        
        setTimeout(() => {
          setIsSubmitted(false);
        }, 8000);
      } else {
        const data = await response.json();
        const err = (data.errors as { message: string }[])?.map((errDetail: { message: string }) => errDetail.message).join(', ') || 'Transmission failed at relay server.';
        setErrorMsg(`ERROR: ${err.toUpperCase()}`);
      }
    } catch (err) {
      const error = err as Error;
      setErrorMsg(`RELAY_OFFLINE: ${error.message?.toUpperCase() || 'NETWORK CONNECTION ERROR'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className={isCliMode ? "content-container" : "section-spacing content-container"}
      style={{
        paddingTop: isCliMode ? '24px' : undefined,
        paddingBottom: isCliMode ? '48px' : undefined,
        borderBottom: isCliMode ? 'none' : '1px solid var(--color-hairline)'
      }}
    >
      <div
        className="hairline-border"
        style={{
          padding: 'var(--spacing-xl)',
          backgroundColor: isCliMode ? 'var(--color-canvas)' : 'var(--color-surface-soft)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-xl)',
        }}
      >
        <div>
          <h2 className="heading-lg" style={{ color: 'var(--color-ink)', margin: 0 }}>
            [+] Get in Touch
          </h2>
          <p className="caption-md" style={{ color: 'var(--color-mute)', marginTop: 'var(--spacing-xs)', marginBottom: 0 }}>
            // Send an encrypted message or connect across the distributed web.
          </p>
        </div>

        <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-lg)' }}>
          
          {/* Left Column: Direct Links & Metadata */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
            
            <div 
              className="hairline-border"
              style={{ 
                padding: 'var(--spacing-xl)', 
                backgroundColor: 'var(--color-canvas)',
                display: 'flex', 
                flexDirection: 'column', 
                gap: 'var(--spacing-md)' 
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--color-stone)', fontWeight: 700 }}>
                DIRECT_CHANNELS //
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                {/* Email link */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-md)' }}>
                  <span style={{ color: 'var(--color-mute)', whiteSpace: 'nowrap', flexShrink: 0 }}>[→]</span>
                  <a 
                    href={`mailto:${contact.email}`} 
                    style={{ color: 'var(--color-ink)', textDecoration: 'underline', fontSize: '0.9rem', fontWeight: 500 }}
                    onClick={() => playSynthSound('click', isSoundEnabled)}
                  >
                    email
                  </a>
                </div>

                {/* GitHub */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-md)' }}>
                  <span style={{ color: 'var(--color-mute)', whiteSpace: 'nowrap', flexShrink: 0 }}>[→]</span>
                  <a 
                    href={social.github.url} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ color: 'var(--color-ink)', textDecoration: 'underline', fontSize: '0.9rem', fontWeight: 500 }}
                    onClick={() => playSynthSound('click', isSoundEnabled)}
                  >
                    github
                  </a>
                </div>

                {/* LinkedIn */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-md)' }}>
                  <span style={{ color: 'var(--color-mute)', whiteSpace: 'nowrap', flexShrink: 0 }}>[→]</span>
                  <a 
                    href={social.linkedin.url} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ color: 'var(--color-ink)', textDecoration: 'underline', fontSize: '0.9rem', fontWeight: 500 }}
                    onClick={() => playSynthSound('click', isSoundEnabled)}
                  >
                    linkedin
                  </a>
                </div>

                {/* Twitter */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-md)' }}>
                  <span style={{ color: 'var(--color-mute)', whiteSpace: 'nowrap', flexShrink: 0 }}>[→]</span>
                  <a 
                    href={social.twitter.url} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ color: 'var(--color-ink)', textDecoration: 'underline', fontSize: '0.9rem', fontWeight: 500 }}
                    onClick={() => playSynthSound('click', isSoundEnabled)}
                  >
                    twitter
                  </a>
                </div>
              </div>
            </div>

            {/* Timezone TUI display panel */}
            <div 
              className="hairline-border"
              style={{ 
                padding: 'var(--spacing-md)', 
                backgroundColor: 'var(--color-canvas)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <div style={{ fontSize: '0.725rem', color: 'var(--color-stone)' }}>TIMEZONE_METRICS //</div>
              <div className="body-strong" style={{ color: 'var(--color-ink)' }}>{contact.timezone}</div>
              <p className="caption-md" style={{ color: 'var(--color-mute)', margin: 0 }}>
                Operating from Bengaluru. Messages usually acknowledged within 24 standard cycles.
              </p>
            </div>
          </div>

          {/* Right Column: Encrypted Contact Form */}
          <div 
            className="hairline-border"
            style={{
              padding: 'var(--spacing-xl)',
              backgroundColor: 'var(--color-canvas)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-md)'
            }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--color-stone)', fontWeight: 700 }}>
              SECURE_MESSAGE_COMPOSE //
            </div>

            {isSubmitted ? (
              <div 
                style={{ 
                  padding: 'var(--spacing-lg)', 
                  backgroundColor: 'rgba(48,209,88,0.12)', 
                  border: '1px solid var(--color-success)', 
                  color: 'var(--color-ink)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-sm)'
                }}
              >
                <div className="body-strong" style={{ color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>[✔]</span>
                  <span>TRANSMISSION SUCCESSFUL</span>
                </div>
                <p className="body-md" style={{ margin: 0, fontSize: '0.875rem' }}>
                  Your message packets have been dispatched. Thank you for connecting, {identity.firstName} will respond shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                {errorMsg && (
                  <div 
                    style={{ 
                      padding: 'var(--spacing-md)', 
                      backgroundColor: 'rgba(255,59,48,0.12)', 
                      border: '1px solid var(--color-danger)', 
                      color: 'var(--color-ink)',
                      fontSize: '0.8125rem',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    [!] {errorMsg}
                  </div>
                )}
                
                {/* Name */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                  <label className="body-strong" style={{ color: 'var(--color-ink)', fontSize: '0.875rem' }}>
                    Sender Name
                  </label>
                  <input
                    type="text"
                    className="text-input"
                    placeholder="e.g. Hal 9000"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Email */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                  <label className="body-strong" style={{ color: 'var(--color-ink)', fontSize: '0.875rem' }}>
                    Sender Email
                  </label>
                  <input
                    type="email"
                    className="text-input"
                    placeholder="e.g. hal@discovery.one"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Message */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                  <label className="body-strong" style={{ color: 'var(--color-ink)', fontSize: '0.875rem' }}>
                    Payload Message
                  </label>
                  <textarea
                    className="textarea"
                    placeholder="Encrypt your query here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="button-primary"
                  disabled={isSubmitting}
                  style={{
                    alignSelf: 'flex-start',
                    marginTop: 'var(--spacing-xs)'
                  }}
                >
                  {isSubmitting ? 'DISPATCHING PACKETS...' : 'DISPATCH MESSAGE [→]'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 851px) {
          .contact-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
