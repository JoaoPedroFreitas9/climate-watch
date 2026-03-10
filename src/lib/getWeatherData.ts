import { getWeather, getForecast } from "@/services/weather";

export async function getWeatherData(city: string) {
  try {
    const clima = await getWeather(city);
    const previsao = await getForecast(city);

    return {
      dadosClima: clima,
      dadosPrevisao: previsao,
      erro: null,
    };
  } catch {
    return {
      dadosClima: null,
      dadosPrevisao: null,
      erro: "Cidade não encontrada. Verifique o nome digitado.",
    };
  }
}