"use server";

import { getWeatherData } from "@/lib/weather";

export async function getWeatherAction(lat: number, lon: number) {
  return await getWeatherData(lat, lon);
}
