import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Private Health Insurance Calculator Australia — Is PHI Worth It?';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          backgroundColor: '#1E40AF',
          padding: '64px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Top: logo area */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              backgroundColor: 'white',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
            }}
          >
            🏥
          </div>
          <span
            style={{
              color: '#BFDBFE',
              fontSize: '18px',
              fontWeight: 600,
              letterSpacing: '-0.01em',
            }}
          >
            phianalyser.com.au
          </span>
        </div>

        {/* Middle: main headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h1
            style={{
              color: 'white',
              fontSize: '64px',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              margin: 0,
              maxWidth: '800px',
            }}
          >
            Is Private Health Insurance Worth It?
          </h1>
          <p
            style={{
              color: '#BFDBFE',
              fontSize: '26px',
              fontWeight: 400,
              margin: 0,
              maxWidth: '680px',
              lineHeight: 1.4,
            }}
          >
            Free, independent calculator for Australians. No commissions.
          </p>
        </div>

        {/* Bottom: feature badges */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          {[
            'MLS Calculator',
            'LHC Loading',
            'ATO & APRA Data',
            'FY 2025–26 Rates',
          ].map((badge) => (
            <div
              key={badge}
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: '8px',
                padding: '10px 20px',
                color: 'white',
                fontSize: '18px',
                fontWeight: 600,
              }}
            >
              {badge}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
