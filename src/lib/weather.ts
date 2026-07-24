export interface WeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  isSuitableForSpraying: boolean;
  sprayingWarning: string;
}

const API_KEY = process.env.WEATHER_API_KEY;

export async function getWeatherData(
  lat: number,
  lon: number
): Promise<{ data?: WeatherData; error?: string }> {
  if (!API_KEY) {
    return { error: "WEATHER_API_KEY sunucuda tanımlı değil." };
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=tr&appid=${API_KEY}`
    );

    if (!res.ok) {
      if (res.status === 401) return { error: "Hava API anahtarı geçersiz." };
      if (res.status === 404) return { error: "Konum verisi bulunamadı." };
      return { error: `Hava durumu servisi hatası: ${res.status}` };
    }

    const data = await res.json();
    const windSpeed = data.wind.speed * 3.6;
    const temp = data.main.temp;
    const humidity = data.main.humidity;

    let isSuitable = true;
    let warning = "İlaçlama ve gübreleme için koşullar uygun.";

    if (temp < 2) {
      isSuitable = false;
      warning = "Zirai don riski! Sıcaklık çok düşük.";
    } else if (windSpeed > 60) {
      isSuitable = false;
      warning = "Fırtına uyarısı! Açık alan çalışmalarını durdurun.";
    } else if (windSpeed > 10) {
      isSuitable = false;
      warning = "Rüzgar hızı çok yüksek (>10 km/s). İlaçlama önerilmez.";
    } else if (temp > 30) {
      isSuitable = false;
      warning = "Sıcaklık çok yüksek. Buharlaşma riski var.";
    } else if (data.weather[0].main === "Rain" || data.weather[0].main === "Thunderstorm") {
      isSuitable = false;
      warning = "Yağışlı hava. İlaçlama etkisiz olabilir.";
    }

    return {
      data: {
        temp: Math.round(temp),
        humidity,
        windSpeed: Math.round(windSpeed),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        isSuitableForSpraying: isSuitable,
        sprayingWarning: warning,
      },
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Weather Service Error:", message);
    return { error: `Sunucu hatası: ${message}` };
  }
}
