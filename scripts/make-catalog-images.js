const fs = require("fs");
const path = require("path");
const dir = path.join("public", "catalog");
fs.mkdirSync(dir, { recursive: true });

function svg(title, subtitle, shapes, bg1, bg2) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${bg1}"/>
      <stop offset="100%" stop-color="${bg2}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="500" fill="url(#bg)"/>
  ${shapes}
  <rect x="0" y="360" width="800" height="140" fill="#020617" opacity="0.55"/>
  <text x="36" y="410" fill="#ecfdf5" font-family="Segoe UI, Arial" font-size="34" font-weight="700">${title}</text>
  <text x="36" y="450" fill="#a7f3d0" font-family="Segoe UI, Arial" font-size="18">${subtitle}</text>
</svg>`;
}

const items = {
  "tomato-early-blight": svg(
    "Erken Mildiyo",
    "Domates - Alternaria",
    '<ellipse cx="420" cy="210" rx="180" ry="110" fill="#4ade80"/><circle cx="360" cy="180" r="34" fill="#7c2d12"/><circle cx="360" cy="180" r="18" fill="#a16207"/><circle cx="460" cy="220" r="28" fill="#78350f"/><circle cx="500" cy="170" r="16" fill="#92400e"/>',
    "#14532d",
    "#365314"
  ),
  "tomato-late-blight": svg(
    "Gec Mildiyo",
    "Domates - Phytophthora",
    '<ellipse cx="400" cy="210" rx="190" ry="115" fill="#166534"/><ellipse cx="450" cy="190" rx="100" ry="60" fill="#64748b" opacity="0.8"/><ellipse cx="340" cy="230" rx="70" ry="40" fill="#94a3b8" opacity="0.55"/><circle cx="470" cy="175" r="20" fill="#f8fafc" opacity="0.35"/>',
    "#0f172a",
    "#14532d"
  ),
  "grape-powdery-mildew": svg(
    "Kulleme",
    "Asma - Erysiphe",
    '<ellipse cx="410" cy="210" rx="170" ry="100" fill="#15803d"/><circle cx="350" cy="180" r="14" fill="#fff"/><circle cx="390" cy="165" r="12" fill="#f8fafc"/><circle cx="430" cy="185" r="16" fill="#fff"/><circle cx="470" cy="220" r="13" fill="#e2e8f0"/><circle cx="370" cy="230" r="10" fill="#f1f5f9"/>',
    "#1e293b",
    "#334155"
  ),
  "olive-peacock-spot": svg(
    "Halkali Leke",
    "Zeytin",
    '<ellipse cx="410" cy="210" rx="160" ry="85" fill="#84cc16"/><circle cx="360" cy="195" r="30" fill="none" stroke="#422006" stroke-width="8"/><circle cx="360" cy="195" r="10" fill="#78350f"/><circle cx="450" cy="220" r="24" fill="none" stroke="#451a03" stroke-width="6"/><circle cx="450" cy="220" r="8" fill="#713f12"/>',
    "#365314",
    "#1a2e05"
  ),
  "citrus-leafminer": svg(
    "Galeriguvesi",
    "Turuncgil",
    '<ellipse cx="420" cy="210" rx="180" ry="105" fill="#34d399"/><path d="M280 180 C340 150 380 240 440 180 S560 230 600 190" fill="none" stroke="#f8fafc" stroke-width="6" opacity="0.9"/><path d="M300 240 C360 270 400 200 460 250" fill="none" stroke="#e2e8f0" stroke-width="4" opacity="0.7"/>',
    "#134e4a",
    "#0f766e"
  ),
  "wheat-rust": svg(
    "Sari Pas",
    "Bugday",
    '<rect x="360" y="70" width="22" height="250" rx="8" fill="#ca8a04"/><ellipse cx="371" cy="130" rx="34" ry="12" fill="#facc15"/><ellipse cx="371" cy="170" rx="36" ry="12" fill="#eab308"/><ellipse cx="371" cy="210" rx="34" ry="11" fill="#fde047"/><ellipse cx="480" cy="180" rx="16" ry="7" fill="#f59e0b"/><ellipse cx="520" cy="210" rx="18" ry="7" fill="#ea580c"/>',
    "#713f12",
    "#422006"
  ),
  "apple-scab": svg(
    "Karaleke",
    "Elma",
    '<circle cx="420" cy="200" r="110" fill="#ef4444"/><ellipse cx="380" cy="170" rx="28" ry="20" fill="#1c1917"/><ellipse cx="460" cy="230" rx="34" ry="22" fill="#292524"/><ellipse cx="440" cy="155" rx="22" ry="14" fill="#365314"/><path d="M420 90 C450 60 490 75 495 100" fill="none" stroke="#166534" stroke-width="10"/>',
    "#3f6212",
    "#1a2e05"
  ),
  "pepper-blossom-end-rot": svg(
    "Cicek Burnu Curuklugu",
    "Biber - Ca eksikligi",
    '<path d="M360 80 C300 160 290 280 400 360 C510 280 520 160 460 80 C430 65 390 65 360 80Z" fill="#dc2626"/><ellipse cx="400" cy="340" rx="48" ry="32" fill="#44403c"/><ellipse cx="400" cy="335" rx="26" ry="16" fill="#1c1917"/>',
    "#7f1d1d",
    "#450a0a"
  ),
  "generic-aphid": svg(
    "Yaprak Biti",
    "Zararli - Aphididae",
    '<ellipse cx="430" cy="210" rx="170" ry="100" fill="#22c55e"/><ellipse cx="360" cy="185" rx="18" ry="12" fill="#a3e635"/><ellipse cx="400" cy="205" rx="16" ry="11" fill="#bef264"/><ellipse cx="440" cy="175" rx="17" ry="12" fill="#a3e635"/><ellipse cx="480" cy="215" rx="15" ry="10" fill="#d9f99d"/><circle cx="355" cy="183" r="2.5" fill="#14532d"/><circle cx="395" cy="203" r="2.5" fill="#14532d"/>',
    "#064e3b",
    "#022c22"
  ),
  "generic-healthy": svg(
    "Saglikli Bitki",
    "Belirti yok",
    '<ellipse cx="420" cy="200" rx="160" ry="95" fill="#4ade80"/><path d="M420 110 L420 290" stroke="#166534" stroke-width="10"/><path d="M420 160 C360 130 320 180 420 230 C520 180 480 130 420 160Z" fill="#86efac"/>',
    "#065f46",
    "#0e7490"
  ),
  "whitefly": svg(
    "Beyazsine",
    "Zararli - Trialeurodes",
    '<ellipse cx="430" cy="220" rx="170" ry="100" fill="#22c55e"/><ellipse cx="380" cy="180" rx="22" ry="12" fill="#f8fafc"/><ellipse cx="420" cy="165" rx="20" ry="11" fill="#fff"/><ellipse cx="460" cy="185" rx="24" ry="13" fill="#f1f5f9"/><ellipse cx="500" cy="210" rx="18" ry="10" fill="#e2e8f0"/>',
    "#0f766e",
    "#115e59"
  ),
  "red-spider-mite": svg(
    "Kirmizi Orumcek",
    "Zararli - Tetranychus",
    '<ellipse cx="420" cy="210" rx="170" ry="100" fill="#84cc16"/><circle cx="370" cy="190" r="10" fill="#b91c1c"/><circle cx="400" cy="175" r="8" fill="#dc2626"/><circle cx="430" cy="200" r="11" fill="#991b1b"/><circle cx="460" cy="180" r="7" fill="#ef4444"/><path d="M340 160 C400 140 460 170 520 150" fill="none" stroke="#f8fafc" stroke-width="2" opacity="0.5"/>',
    "#7f1d1d",
    "#365314"
  ),
  "thrips": svg(
    "Trips",
    "Zararli - Thrips",
    '<ellipse cx="420" cy="210" rx="170" ry="100" fill="#4ade80"/><rect x="360" y="170" width="8" height="60" rx="3" fill="#fef08a" transform="rotate(-20 364 200)"/><rect x="400" y="160" width="8" height="70" rx="3" fill="#fde047" transform="rotate(10 404 195)"/><rect x="450" y="175" width="8" height="55" rx="3" fill="#facc15" transform="rotate(-5 454 202)"/><ellipse cx="500" cy="200" rx="40" ry="18" fill="#a3e635" opacity="0.5"/>',
    "#422006",
    "#14532d"
  ),
  "tuta-absoluta": svg(
    "Domates Guvesi",
    "Zararli - Tuta absoluta",
    '<ellipse cx="420" cy="210" rx="180" ry="110" fill="#22c55e"/><path d="M300 200 C350 160 390 250 450 180 S560 240 600 200" fill="none" stroke="#f8fafc" stroke-width="5"/><ellipse cx="380" cy="230" rx="35" ry="20" fill="#78350f" opacity="0.7"/><ellipse cx="480" cy="200" rx="28" ry="16" fill="#44403c" opacity="0.75"/>',
    "#14532d",
    "#7f1d1d"
  ),
  "olive-fruit-fly": svg(
    "Zeytin Sinegi",
    "Zararli - Bactrocera oleae",
    '<ellipse cx="420" cy="210" rx="90" ry="120" fill="#a3e635"/><circle cx="400" cy="180" r="14" fill="#422006"/><circle cx="440" cy="220" r="12" fill="#78350f"/><circle cx="415" cy="250" r="10" fill="#1c1917"/><ellipse cx="520" cy="160" rx="40" ry="18" fill="#fef3c7" opacity="0.8"/>',
    "#365314",
    "#1a2e05"
  ),
  "codling-moth": svg(
    "Elma Ickurdu",
    "Zararli - Cydia pomonella",
    '<circle cx="420" cy="200" r="110" fill="#ef4444"/><circle cx="400" cy="180" r="18" fill="#1c1917"/><path d="M400 180 C360 200 370 260 410 280" fill="none" stroke="#fef3c7" stroke-width="4"/><ellipse cx="450" cy="230" rx="20" ry="12" fill="#78716c"/>',
    "#7f1d1d",
    "#3f6212"
  ),
  "medfly": svg(
    "Akdeniz Meyve Sinegi",
    "Zararli - Ceratitis",
    '<ellipse cx="420" cy="210" rx="100" ry="80" fill="#fb923c"/><circle cx="390" cy="190" r="16" fill="#78350f"/><circle cx="450" cy="220" r="14" fill="#422006"/><ellipse cx="520" cy="150" rx="50" ry="22" fill="#fde68a" opacity="0.85"/><circle cx="500" cy="145" r="6" fill="#14532d"/>',
    "#9a3412",
    "#365314"
  ),
  "cutworm": svg(
    "Bozkurt / Kesici Kurt",
    "Zararli - Agrotis",
    '<ellipse cx="420" cy="240" rx="200" ry="40" fill="#57534e"/><ellipse cx="300" cy="235" rx="30" ry="22" fill="#78716c"/><ellipse cx="360" cy="245" rx="28" ry="20" fill="#44403c"/><ellipse cx="420" cy="235" rx="30" ry="22" fill="#57534e"/><ellipse cx="480" cy="245" rx="28" ry="20" fill="#292524"/><ellipse cx="540" cy="235" rx="26" ry="18" fill="#78716c"/>',
    "#1c1917",
    "#365314"
  ),
};

for (const [id, content] of Object.entries(items)) {
  fs.writeFileSync(path.join(dir, id + ".svg"), content, "utf8");
}
console.log("wrote", Object.keys(items).length);
