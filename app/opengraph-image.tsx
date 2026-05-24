import { ImageResponse } from 'next/og';

/**
 * Dynamic Open Graph image at /opengraph-image — 1200×630 PNG generated at request time.
 * Used by every page that doesn't override it via its own opengraph-image file.
 *
 * Also used by twitter cards (Next.js falls back to opengraph-image when twitter-image is absent).
 */

export const runtime = 'edge';
export const alt = 'BuildYourYear — Plan your day. Build your year.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Day-of-year for the live ring overlay
function dayOfYear(): number {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), 0, 0));
  return Math.max(1, Math.min(365, Math.floor((now.getTime() - start.getTime()) / 86_400_000)));
}

export default async function OpenGraphImage() {
  const day = dayOfYear();
  const pct = Math.round((day / 365) * 100);
  // SVG ring math
  const r = 88;
  const circumference = 2 * Math.PI * r;
  const filled = circumference * (day / 365);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background:
            'linear-gradient(135deg, #ecfdf5 0%, #ccfbf1 35%, #e0f2fe 100%)',
          padding: '64px 80px',
          fontFamily: 'Inter, system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Decorative blobs */}
        <div
          style={{
            position: 'absolute',
            top: -80,
            right: -80,
            width: 360,
            height: 360,
            borderRadius: '100%',
            background: 'rgba(16, 185, 129, 0.18)',
            filter: 'blur(40px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            left: -100,
            width: 320,
            height: 320,
            borderRadius: '100%',
            background: 'rgba(14, 165, 233, 0.18)',
            filter: 'blur(40px)',
          }}
        />

        {/* Top: brand mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background:
                'linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #0ea5e9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 46,
              fontWeight: 800,
              boxShadow: '0 10px 24px -8px rgba(16, 185, 129, 0.5)',
            }}
          >
            ✓
          </div>
          <div style={{ display: 'flex', fontSize: 38, fontWeight: 800, color: '#18181b', letterSpacing: '-0.02em' }}>
            <span>Build</span>
            <span
              style={{
                background:
                  'linear-gradient(90deg, #059669, #14b8a6, #0ea5e9)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Your
            </span>
            <span>Year</span>
          </div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', marginTop: 32 }}>
          {/* Left — hero copy */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, maxWidth: 720 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 14px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: 999,
                fontSize: 16,
                fontWeight: 700,
                color: '#047857',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                alignSelf: 'flex-start',
              }}
            >
              365 days · 12-week heatmap · year-end recap
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                fontSize: 80,
                fontWeight: 800,
                color: '#18181b',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                marginTop: 28,
              }}
            >
              <span>Plan your day.</span>
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                fontSize: 80,
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                marginTop: 4,
              }}
            >
              <span style={{ color: '#18181b' }}>Build your&nbsp;</span>
              <span
                style={{
                  background:
                    'linear-gradient(90deg, #059669, #14b8a6, #0ea5e9)',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                year
              </span>
              <span style={{ color: '#18181b' }}>.</span>
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 26,
                color: '#52525b',
                marginTop: 30,
                lineHeight: 1.35,
                letterSpacing: '-0.01em',
                maxWidth: 660,
              }}
            >
              365 small days. One transformed year. Track habits, ship goals, save for what you want.
            </div>
          </div>

          {/* Right — Day N / 365 ring */}
          <div
            style={{
              width: 240,
              height: 240,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <svg width="240" height="240" viewBox="0 0 240 240">
              <defs>
                <linearGradient id="ogRing" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
              </defs>
              <circle cx="120" cy="120" r={r} fill="none" stroke="#e4e4e7" strokeWidth="14" />
              <circle
                cx="120"
                cy="120"
                r={r}
                fill="none"
                stroke="url(#ogRing)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={`${filled} ${circumference - filled}`}
                strokeDashoffset={0}
                transform="rotate(-90 120 120)"
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 800, color: '#52525b', letterSpacing: '0.22em' }}>
                DAY
              </div>
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 800,
                  color: '#18181b',
                  lineHeight: 1,
                  letterSpacing: '-0.04em',
                  marginTop: 2,
                }}
              >
                {day}
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#a1a1aa', letterSpacing: '0.22em', marginTop: 4 }}>
                OF 365
              </div>
              <div
                style={{
                  display: 'flex',
                  marginTop: 10,
                  padding: '4px 12px',
                  borderRadius: 999,
                  background: 'rgba(16, 185, 129, 0.12)',
                  color: '#047857',
                  fontSize: 16,
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                }}
              >
                {pct}% built
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 36,
            fontSize: 20,
            color: '#52525b',
            fontWeight: 600,
          }}
        >
          <div style={{ display: 'flex', gap: 24 }}>
            <span>✓ No credit card</span>
            <span style={{ color: '#d4d4d8' }}>·</span>
            <span>✓ Syncs across devices</span>
            <span style={{ color: '#d4d4d8' }}>·</span>
            <span>✓ Free forever</span>
          </div>
          <div style={{ display: 'flex', fontWeight: 800, color: '#047857', letterSpacing: '0.18em', textTransform: 'uppercase', fontSize: 18 }}>
            buildyouryear
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
