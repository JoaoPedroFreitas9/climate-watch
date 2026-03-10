import { NASA_BASE_URL } from "./config"

export async function getEvents() {
  const response = await fetch(`${NASA_BASE_URL}/events`, {
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("Erro ao buscar eventos da NASA")
  }

  const data = await response.json()

  return data.events
}