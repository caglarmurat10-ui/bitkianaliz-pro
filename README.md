# BitkiAnaliz Pro

AI bitki teşhisi, gübre/ilaç programı, sera sensörleri ve online hastalık–zararlı kataloğu.

**Canlı:** https://bitkianaliz-pro.vercel.app  
**Kod:** https://github.com/caglarmurat10-ui/bitkianaliz-pro

## Özellikler

- **AI Teşhis** — Gemini, güven skoru, alternatif teşhis, ilaçlama zamanı
- **Online Katalog** — Wikipedia + Openverse görselleri, hastalık/zararlı, kültürel/biyolojik/kimyasal mücadele
- **Gübreleme / İlaçlama** — program kaydı, tank karışabilirlik
- **Sera / Sensör** — ESP32, Ecowitt WS90, Sonoff, Zigbee ingest
- **Mobil PWA** — alt menü, kameradan teşhis
- **Demo** — giriş yok; otomatik misafir oturum

## Hızlı başlangıç

```bash
npm install
cp .env.example .env.local
# GEMINI_API_KEY=...
# NEXT_PUBLIC_DEMO_MODE=true
npm run dev
```

## Ortam değişkenleri

| Değişken | Açıklama |
|---|---|
| `GEMINI_API_KEY` | Google AI (server-only) |
| `WEATHER_API_KEY` | OpenWeatherMap (opsiyonel) |
| `NEXT_PUBLIC_DEMO_MODE` | `true` = localStorage demo |
| `NEXT_PUBLIC_SUPABASE_URL` / `ANON_KEY` | Gerçek auth/DB için |
| `SENSOR_INGEST_TOKEN` | IoT ingest koruması (opsiyonel) |

## Supabase’e geçiş

1. `NEXT_PUBLIC_DEMO_MODE=false`
2. Supabase URL + anon key
3. `supabase/migrations/001_initial.sql` çalıştır
4. Storage: `analyses` bucket

## Scriptler

- `npm run dev` — geliştirme
- `npm run build` / `npm start` — üretim
