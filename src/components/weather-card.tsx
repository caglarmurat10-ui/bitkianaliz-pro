import { WeatherData } from "@/lib/weather";
import { CloudSun, Wind, Droplets, AlertTriangle, CheckCircle2 } from "lucide-react";

interface WeatherCardProps {
  weather: WeatherData | null;
  loading: boolean;
  error?: string | null;
}

export function WeatherCard({ weather, loading, error }: WeatherCardProps) {
  if (loading) {
    return (
      <div className="flex h-48 animate-pulse items-center justify-center rounded-2xl border border-white/10 bg-slate-900/60">
        <span className="text-slate-400">Hava durumu yükleniyor...</span>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
        <div className="flex items-center gap-3 text-slate-400">
          <CloudSun className="h-8 w-8" />
          <p className="text-sm">Hava durumu alınamadı. {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 to-blue-800 p-6 text-white shadow-xl">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
      <div className="relative z-10 mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-medium opacity-90">Anlık Hava</h2>
          <p className="mt-1 text-2xl font-bold capitalize">{weather.description}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-4xl font-bold">{weather.temp}°C</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt="weather icon"
            className="-my-2 h-16 w-16"
          />
        </div>
      </div>
      <div className="relative z-10 mb-6 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 rounded-xl bg-white/20 p-3 backdrop-blur-md">
          <Wind className="h-5 w-5 text-blue-100" />
          <div>
            <p className="text-xs opacity-70">Rüzgar</p>
            <p className="font-semibold">{weather.windSpeed} km/s</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-white/20 p-3 backdrop-blur-md">
          <Droplets className="h-5 w-5 text-blue-100" />
          <div>
            <p className="text-xs opacity-70">Nem</p>
            <p className="font-semibold">%{weather.humidity}</p>
          </div>
        </div>
      </div>
      <div
        className={`relative z-10 flex items-start gap-3 rounded-xl p-4 backdrop-blur-md ${
          weather.isSuitableForSpraying
            ? "border border-green-400/50 bg-green-500/30"
            : "border border-red-400/50 bg-red-500/30"
        }`}
      >
        {weather.isSuitableForSpraying ? (
          <CheckCircle2 className="h-6 w-6 shrink-0 text-green-200" />
        ) : (
          <AlertTriangle className="h-6 w-6 shrink-0 text-red-200" />
        )}
        <div>
          <h3 className="mb-1 text-sm font-bold">
            {weather.isSuitableForSpraying ? "İlaçlama Uygun" : "İlaçlama Riski"}
          </h3>
          <p className="text-xs leading-relaxed opacity-90">{weather.sprayingWarning}</p>
        </div>
      </div>
    </div>
  );
}
