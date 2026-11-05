const sharp = require('sharp');
const path = require('path');

// Ionicons "book" icon SVG path (filled version)
const bookIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1024" height="1024">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0A84FF"/>
      <stop offset="100%" style="stop-color:#007AFF"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1024" height="1024" fill="url(#bg)"/>

  <!-- Book icon (scaled and centered) -->
  <g transform="translate(212, 212) scale(1.17)">
    <path fill="white" d="M256 160c16-63.16 76.43-95.41 208-96a15.94 15.94 0 0116 16v288a16 16 0 01-16 16c-128 0-177.45 25.81-208 64-30.37-38-80-64-208-64-9.88 0-16-8.05-16-17.93V80a15.94 15.94 0 0116-16c131.57.59 192 32.84 208 96z"/>
    <path fill="rgba(255,255,255,0.3)" d="M256 160v288"/>
  </g>
</svg>
`;

// Alternative: More detailed book icon
const detailedBookSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0A84FF"/>
      <stop offset="100%" style="stop-color:#005EC4"/>
    </linearGradient>
    <linearGradient id="bookGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#FFFFFF"/>
      <stop offset="100%" style="stop-color:#E8E8E8"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1024" height="1024" fill="url(#bgGrad)"/>

  <!-- Book icon -->
  <g transform="translate(512, 512)">
    <!-- Open book shape -->
    <path fill="white" d="
      M-280 -180
      C-280 -180 -200 -220 0 -220
      C200 -220 280 -180 280 -180
      L280 200
      C280 200 200 160 0 160
      C-200 160 -280 200 -280 200
      Z
    " opacity="0.95"/>

    <!-- Center spine -->
    <path fill="rgba(0,90,196,0.2)" d="
      M-8 -220
      L8 -220
      L8 160
      L-8 160
      Z
    "/>

    <!-- Page lines left -->
    <g stroke="rgba(0,90,196,0.15)" stroke-width="4" fill="none">
      <path d="M-240 -140 L-40 -140"/>
      <path d="M-240 -80 L-40 -80"/>
      <path d="M-240 -20 L-40 -20"/>
      <path d="M-240 40 L-40 40"/>
      <path d="M-240 100 L-40 100"/>
    </g>

    <!-- Page lines right -->
    <g stroke="rgba(0,90,196,0.15)" stroke-width="4" fill="none">
      <path d="M40 -140 L240 -140"/>
      <path d="M40 -80 L240 -80"/>
      <path d="M40 -20 L240 -20"/>
      <path d="M40 40 L240 40"/>
      <path d="M40 100 L240 100"/>
    </g>
  </g>
</svg>
`;

// Splash icon (just the book, no background)
const splashIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <g transform="translate(256, 256)">
    <path fill="#007AFF" d="
      M-140 -90
      C-140 -90 -100 -110 0 -110
      C100 -110 140 -90 140 -90
      L140 100
      C140 100 100 80 0 80
      C-100 80 -140 100 -140 100
      Z
    "/>
    <path fill="rgba(0,90,196,0.3)" d="
      M-4 -110
      L4 -110
      L4 80
      L-4 80
      Z
    "/>
    <g stroke="rgba(255,255,255,0.5)" stroke-width="2" fill="none">
      <path d="M-120 -70 L-20 -70"/>
      <path d="M-120 -40 L-20 -40"/>
      <path d="M-120 -10 L-20 -10"/>
      <path d="M-120 20 L-20 20"/>
      <path d="M-120 50 L-20 50"/>
      <path d="M20 -70 L120 -70"/>
      <path d="M20 -40 L120 -40"/>
      <path d="M20 -10 L120 -10"/>
      <path d="M20 20 L120 20"/>
      <path d="M20 50 L120 50"/>
    </g>
  </g>
</svg>
`;

// Android adaptive icon - foreground (book only, transparent bg)
const androidForegroundSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <g transform="translate(512, 512)">
    <path fill="white" d="
      M-220 -140
      C-220 -140 -160 -175 0 -175
      C160 -175 220 -140 220 -140
      L220 160
      C220 160 160 125 0 125
      C-160 125 -220 160 -220 160
      Z
    " opacity="0.95"/>
    <path fill="rgba(0,90,196,0.2)" d="
      M-6 -175
      L6 -175
      L6 125
      L-6 125
      Z
    "/>
    <g stroke="rgba(0,90,196,0.15)" stroke-width="3" fill="none">
      <path d="M-185 -110 L-30 -110"/>
      <path d="M-185 -60 L-30 -60"/>
      <path d="M-185 -10 L-30 -10"/>
      <path d="M-185 40 L-30 40"/>
      <path d="M-185 90 L-30 90"/>
      <path d="M30 -110 L185 -110"/>
      <path d="M30 -60 L185 -60"/>
      <path d="M30 -10 L185 -10"/>
      <path d="M30 40 L185 40"/>
      <path d="M30 90 L185 90"/>
    </g>
  </g>
</svg>
`;

// Android adaptive icon - background (solid blue)
const androidBackgroundSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="androidBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0A84FF"/>
      <stop offset="100%" style="stop-color:#005EC4"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" fill="url(#androidBg)"/>
</svg>
`;

// Android monochrome icon (for themed icons in Android 13+)
const androidMonochromeSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <g transform="translate(512, 512)">
    <path fill="black" d="
      M-220 -140
      C-220 -140 -160 -175 0 -175
      C160 -175 220 -140 220 -140
      L220 160
      C220 160 160 125 0 125
      C-160 125 -220 160 -220 160
      Z
    "/>
    <path fill="white" d="
      M-6 -175
      L6 -175
      L6 125
      L-6 125
      Z
    "/>
  </g>
</svg>
`;

async function generateIcons() {
  const imagesDir = path.join(__dirname, '..', 'assets', 'images');

  const icons = [
    { name: 'icon.png', svg: detailedBookSvg, size: 1024 },
    { name: 'splash-icon.png', svg: splashIconSvg, size: 512 },
    { name: 'favicon.png', svg: detailedBookSvg, size: 48 },
    { name: 'android-icon-foreground.png', svg: androidForegroundSvg, size: 1024 },
    { name: 'android-icon-background.png', svg: androidBackgroundSvg, size: 1024 },
    { name: 'android-icon-monochrome.png', svg: androidMonochromeSvg, size: 1024 },
  ];

  try {
    for (const icon of icons) {
      await sharp(Buffer.from(icon.svg))
        .resize(icon.size, icon.size)
        .png()
        .toFile(path.join(imagesDir, icon.name));
      console.log(`✅ ${icon.name} gerado (${icon.size}x${icon.size})`);
    }

    console.log('\n📍 Todos os ícones gerados em: assets/images/');
  } catch (error) {
    console.error('❌ Erro ao gerar ícones:', error);
  }
}

generateIcons();
