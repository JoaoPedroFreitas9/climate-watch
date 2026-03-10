import { WEATHER_BASE_URL } from "./config"

const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY

export async function getWeather(city: string) {
  const response = await fetch(
    `${WEATHER_BASE_URL}/weather?q=${city}&units=metric&lang=pt_br&appid=${apiKey}`,
    { next: { revalidate: 3600 } }
  )

  if (!response.ok) {
    throw new Error("Cidade não encontrada.")
  }

  return response.json()
}

export async function getForecast(city: string) {
  const response = await fetch(
    `${WEATHER_BASE_URL}/forecast?q=${city}&units=metric&lang=pt_br&appid=${apiKey}`,
    { next: { revalidate: 3600 } }
  )

  if (!response.ok) {
    throw new Error("Falha ao buscar a previsão.")
  }

  const data = await response.json()

  return data.list.filter((item: { dt_txt: string }) =>
    item.dt_txt.includes("12:00:00")
  )
}