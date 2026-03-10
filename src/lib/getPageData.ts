import { getWeatherData } from "./getWeatherData";
import { getCurrentTime } from "./getCurrentTime";

interface SearchParams {
  cidade?: string;
}

export async function getPageData(
  searchParams: Promise<SearchParams>
) {
  const { cidade = "" } = await searchParams;

  const horaAtual = getCurrentTime();

  const weather = cidade
    ? await getWeatherData(cidade)
    : { dadosClima: null, dadosPrevisao: null, erro: null };

  return {
    cidadeBuscada: cidade,
    horaAtual,
    ...weather,
  };
}   