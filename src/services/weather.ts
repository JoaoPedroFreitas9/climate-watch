
export async function getWeather(city: string) {
  
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  
  
 
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=pt_br&appid=${apiKey}`;

  try {
    
   
    const response = await fetch(url, {
      next: { revalidate: 3600 } 
    });

   
    if (!response.ok) {
      console.log("STATUS DA API:", response.status);
      throw new Error('Cidade não encontrada.');
    }

   
    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Erro ao buscar o clima:", error);
    
    throw error; 
  }
}