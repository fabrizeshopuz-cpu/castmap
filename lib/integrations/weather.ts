export async function fetchWeather(config: Record<string, unknown>) {
  return {
    city: String(config.city || "Toshkent"),
    language: String(config.language || "uz"),
    unit: String(config.unit || "celsius"),
    temp: 27,
    condition: "Quyoshli",
    humidity: 34,
    wind: "3 m/s",
    source: "mock",
    syncedAt: new Date().toISOString(),
  };
}

export function createWeatherWidget(data: Awaited<ReturnType<typeof fetchWeather>>, displayStyle = "card") {
  return { type: "weather", displayStyle, data };
}
