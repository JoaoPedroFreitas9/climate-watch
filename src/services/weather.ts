
export async function getWeather(city: string) {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=pt_br&appid=${apiKey}`;

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) throw new Error('Cidade não encontrada.');
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar o clima:", error);
    throw error;
  }
}

export async function getForecast(city: string) {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=pt_br&appid=${apiKey}`;

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) throw new Error('Falha ao buscar a previsão.');
    
    const data = await response.json();

  
    const dailyForecast = data.list.filter((item: { dt_txt: string }) => 
      item.dt_txt.includes("12:00:00")
    );

    return dailyForecast;
  } catch (error) {
    console.error("Erro na previsão:", error);
    return []; 
  }
}