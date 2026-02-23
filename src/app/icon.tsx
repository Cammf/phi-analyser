import { ImageResponse } from 'next/og';

// ──────────────────────────────────────────────────────────────────────────────
// /src/app/icon.tsx — PHI Analyser brand favicon (Next.js App Router auto-discovery)
// Generates a 32×32 PNG icon: deep blue (#1E40AF) rounded square + white health cross.
// The existing favicon.ico remains as a legacy fallback for older browsers.
// ──────────────────────────────────────────────────────────────────────────────

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#1E40AF',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '7px',
        }}
      >
        {/* White health cross — two overlapping rectangles */}
        <div
          style={{
            position: 'relative',
            width: '16px',
            height: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Horizontal bar */}
          <div
            style={{
              position: 'absolute',
              background: 'white',
              width: '16px',
              height: '5px',
              borderRadius: '1.5px',
            }}
          />
          {/* Vertical bar */}
          <div
            style={{
              position: 'absolute',
              background: 'white',
              width: '5px',
              height: '16px',
              borderRadius: '1.5px',
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
