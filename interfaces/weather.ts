/** Clima actual de una ciudad (respuesta de `/api/weather`). */
export interface IWeatherData {
  /** Temperatura en °C, redondeada */
  temperature: number;
  /** Código WMO de Open-Meteo */
  weatherCode: number;
  /** Si es de día en la ciudad */
  isDay: boolean;
}
