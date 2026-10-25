/**
 * Helpers puros de clima (códigos WMO de Open-Meteo). Sin fetch ni server-only:
 * se pueden usar en el cliente.
 * https://open-meteo.com/en/docs
 */
export const weatherCodes: Record<number, { description: string; icon: string }> = {
  0: { description: "Despejado", icon: "☀️" },
  1: { description: "Mayormente despejado", icon: "🌤️" },
  2: { description: "Parcialmente nublado", icon: "⛅" },
  3: { description: "Nublado", icon: "☁️" },
  45: { description: "Neblina", icon: "🌫️" },
  48: { description: "Neblina con escarcha", icon: "🌫️" },
  51: { description: "Llovizna ligera", icon: "🌦️" },
  53: { description: "Llovizna moderada", icon: "🌦️" },
  55: { description: "Llovizna intensa", icon: "🌧️" },
  61: { description: "Lluvia ligera", icon: "🌧️" },
  63: { description: "Lluvia moderada", icon: "🌧️" },
  65: { description: "Lluvia intensa", icon: "🌧️" },
  71: { description: "Nieve ligera", icon: "🌨️" },
  73: { description: "Nieve moderada", icon: "🌨️" },
  75: { description: "Nieve intensa", icon: "❄️" },
  80: { description: "Chubascos ligeros", icon: "🌦️" },
  81: { description: "Chubascos moderados", icon: "🌧️" },
  82: { description: "Chubascos intensos", icon: "⛈️" },
  95: { description: "Tormenta", icon: "⛈️" },
  96: { description: "Tormenta con granizo", icon: "⛈️" },
  99: { description: "Tormenta con granizo intenso", icon: "⛈️" },
};

/** Ícono del clima según el código y si es de día (de noche, luna en vez de sol). */
export function getWeatherIcon(code: number, isDay: boolean): string {
  const weather = weatherCodes[code] || weatherCodes[0];

  if (!isDay && code <= 2) {
    return "🌙";
  }

  return weather.icon;
}

/** Descripción del clima en español. */
export function getWeatherDescription(code: number): string {
  return weatherCodes[code]?.description || "Desconocido";
}
