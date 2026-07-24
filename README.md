# BitkiAnaliz Pro

Profesyonel üretici ve ziraat danışmanları için AI bitki teşhisi, parsel yönetimi, ilaçlama takvimi, stok ve bildirimler.

## Özellikler

- **AI Teşhis**: Gemini 2.5 Flash, güven skoru, alternatif teşhis, şiddet, hastalık kütüphanesi eşlemesi, hava bağlamı
- **Çiftlik yönetimi**: çoklu işletme (danışman), parseller, uygulama takvimi, stok, rotasyon uyarısı
- **Ürünleştirme**: Supabase Auth + RLS (veya demo localStorage), Realtime, PWA, Web Push
- **Güvenlik**: `GEMINI_API_KEY` ve `WEATHER_API_KEY` yalnızca sunucuda

## Hızlı başlangıç (Demo)

```bash
npm install
cp .env.example .env.local
# NEXT_PUBLIC_DEMO_MODE=true bırakın
npm run dev
```

Giriş: herhangi bir e-posta + şifre (demo). Danışman rolü seçerseniz ikinci işletme otomatik oluşur.

## Bulut (Supabase)

1. `.env.local` içinde `NEXT_PUBLIC_DEMO_MODE=false`
2. `NEXT_PUBLIC_SUPABASE_URL` ve `NEXT_PUBLIC_SUPABASE_ANON_KEY` doldurun
3. SQL Editor'de `supabase/migrations/001_initial.sql` çalıştırın
4. Storage'da `analyses` bucket oluşturun
5. `GEMINI_API_KEY` ve `WEATHER_API_KEY` ekleyin

## Ortam değişkenleri

| Değişken | Açıklama |
|---|---|
| `GEMINI_API_KEY` | Google AI (server-only) |
| `WEATHER_API_KEY` | OpenWeatherMap (server-only) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase proje URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `NEXT_PUBLIC_DEMO_MODE` | `true` = localStorage demo |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Opsiyonel Web Push |

## Scriptler

- `npm run dev` — geliştirme
- `npm run build` — üretim derlemesi
- `npm start` — üretim sunucusu
