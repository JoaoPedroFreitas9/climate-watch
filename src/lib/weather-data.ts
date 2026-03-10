import { getWeather, getForecast } from "@/services/weather"

export async function getWeatherData(city: string) {
  try {
    const clima = await getWeather(city)
    const previsao = await getForecast(city)

    return {
      clima,
      previsao,
      erro: null,
    }
  } catch {
    return {
      clima: null,
      previsao: null,
      erro: "Cidade não encontrada. Verifique o nome digitado.",
    }
  }
}