// Generates the profile README header: a browser window with a cat lying on top of it.
// Four files: light/dark theme x desktop/mobile layout. Run: node assets/build.mjs
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const outDir = dirname(fileURLToPath(import.meta.url))

const themes = {
  dark: {
    chrome: '#243443',
    chromeLine: '#2f4252',
    page: '#1b2733',
    text: '#e8eef2',
    muted: '#8fa3b3',
    accent: '#42b883',
    field: '#1b2733',
    cat: '#e8eef2',
    catEye: '#243443',
  },
  light: {
    chrome: '#e9eef1',
    chromeLine: '#d5dde2',
    page: '#ffffff',
    text: '#213547',
    muted: '#5f7383',
    accent: '#2f9e6e',
    field: '#ffffff',
    cat: '#213547',
    catEye: '#e9eef1',
  },
}

const layouts = {
  desktop: { width: 880, height: 404, catX: 610, catScale: 1, pad: 48, h1: 46, body: 17, nav: true },
  mobile: { width: 420, height: 432, catX: 196, catScale: 0.8, pad: 24, h1: 34, body: 15, nav: false },
}

// Lying cat facing left; origin is where its belly touches the window roof.
function cat(t) {
  return `
  <g class="cat">
    <path class="tail" d="M150,-12 C172,-12 180,2 178,20 C177,32 182,40 192,42" fill="none" stroke="${t.cat}" stroke-width="9" stroke-linecap="round"/>
    <ellipse cx="88" cy="-19" rx="60" ry="19" fill="${t.cat}"/>
    <ellipse cx="128" cy="-22" rx="26" ry="22" fill="${t.cat}"/>
    <ellipse cx="140" cy="-4" rx="14" ry="5" fill="${t.cat}"/>
    <ellipse cx="22" cy="-4" rx="12" ry="5" fill="${t.cat}"/>
    <ellipse cx="44" cy="-4" rx="12" ry="5" fill="${t.cat}"/>
    <circle cx="34" cy="-33" r="20" fill="${t.cat}"/>
    <path d="M17,-42 L19,-64 L33,-50 Z M35,-50 L49,-64 L51,-42 Z" fill="${t.cat}" stroke="${t.cat}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M23,-33 q4,4 8,0 M38,-33 q4,4 8,0" fill="none" stroke="${t.catEye}" stroke-width="2" stroke-linecap="round"/>
  </g>`
}

function svg(t, l) {
  const roof = 64
  const winH = l.height - roof - 4
  const navHtml = l.nav
    ? `<nav><span>stack</span><span>github</span><span>contact</span></nav>`
    : ''

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${l.width}" height="${l.height}" viewBox="0 0 ${l.width} ${l.height}" role="img" aria-label="Alexander Vladimirov, full-stack developer">
  <style>
    .tail { transform-origin: 150px -12px; animation: sway 4s ease-in-out infinite; }
    @keyframes sway { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(7deg); } }
    @media (prefers-reduced-motion: reduce) { .tail { animation: none; } }
  </style>
  <foreignObject x="0" y="${roof}" width="${l.width}" height="${winH}">
    <div xmlns="http://www.w3.org/1999/xhtml" class="win">
      <style>
        * { box-sizing: border-box; margin: 0; }
        .win {
          height: ${winH}px; border-radius: 12px; overflow: hidden;
          background: ${t.page}; border: 1px solid ${t.chromeLine};
          font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; color: ${t.text};
          display: flex; flex-direction: column;
        }
        .bar {
          height: 46px; flex: none; display: flex; align-items: center; gap: 16px; padding: 0 16px;
          background: ${t.chrome}; border-bottom: 1px solid ${t.chromeLine}; position: relative;
        }
        .dots { display: flex; gap: 8px; }
        .dots i { width: 12px; height: 12px; border-radius: 50%; display: block; }
        .dots i:nth-child(1) { background: #ff5f57; }
        .dots i:nth-child(2) { background: #febc2e; }
        .dots i:nth-child(3) { background: #28c840; }
        .url {
          flex: 0 1 ${l.nav ? 360 : 220}px; margin-${l.nav ? 'left: 96px' : 'right: auto'}; height: 28px; border-radius: 8px;
          background: ${t.field}; color: ${t.muted}; display: flex; align-items: center; gap: 8px; padding: 0 12px;
          font: 13px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        }
        .url b { color: ${t.text}; font-weight: 500; }
        .load {
          position: absolute; left: 0; bottom: -2px; height: 3px; width: 100%; transform-origin: left;
          background: linear-gradient(to right, #00dc82, #34cdfe 50%, #0047e1);
          animation: load 1.4s cubic-bezier(.3,.6,.2,1) forwards, fade .4s 1.4s forwards;
        }
        @keyframes load { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes fade { to { opacity: 0; } }
        .page {
          flex: 1; padding: ${l.nav ? 28 : 24}px ${l.pad}px ${l.pad}px; display: flex; flex-direction: column;
          opacity: 0; animation: show .6s 1.3s ease-out forwards;
        }
        @keyframes show { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        header { display: flex; justify-content: space-between; align-items: center; }
        .logo {
          width: 34px; height: 34px; border-radius: 9px; border: 2px solid ${t.accent}; color: ${t.accent};
          display: grid; place-items: center; font-weight: 800; font-size: 14px; letter-spacing: -0.02em;
        }
        nav { display: flex; gap: 28px; font-size: 14px; color: ${t.muted}; }
        main { margin-top: auto; padding-top: 24px; max-width: 600px; }
        h1 { font-size: ${l.h1}px; line-height: 1.05; font-weight: 800; letter-spacing: -0.03em; }
        p { font-size: ${l.body}px; line-height: 1.55; margin-top: 14px; max-width: 34em; }
        p + p { margin-top: 8px; color: ${t.muted}; }
        @media (prefers-reduced-motion: reduce) {
          .load { display: none; }
          .page { animation: none; opacity: 1; }
        }
      </style>
      <div class="bar">
        <div class="dots"><i></i><i></i><i></i></div>
        <div class="url">
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="13" viewBox="0 0 11 13"><rect x="0.5" y="5.5" width="10" height="7" rx="1.5" fill="${t.muted}"/><path d="M2.5,5.5 V4 a3,3 0 0 1 6,0 V5.5" fill="none" stroke="${t.muted}" stroke-width="1.4"/></svg>
          <span><b>eienrei.com</b></span>
        </div>
        <div class="load"></div>
      </div>
      <div class="page">
        <header><div class="logo">AV</div>${navHtml}</header>
        <main>
          <h1>Hi, I'm Alexander.</h1>
          <p>Full-stack developer. I build interfaces with Vue and Nuxt, write backends in C#, and make sure it all runs in production.</p>
          <p>Software engineer at CRYPTO-PRO. Off the clock I'm learning Chinese and writing interactive novels.</p>
        </main>
      </div>
    </div>
  </foreignObject>
  <g transform="translate(${l.catX} ${roof + 1}) scale(${l.catScale})">${cat(t)}
  </g>
</svg>
`
}

for (const [themeName, t] of Object.entries(themes)) {
  for (const [layoutName, l] of Object.entries(layouts)) {
    const suffix = layoutName === 'mobile' ? '-mobile' : ''
    writeFileSync(join(outDir, `header-${themeName}${suffix}.svg`), svg(t, l))
  }
}
