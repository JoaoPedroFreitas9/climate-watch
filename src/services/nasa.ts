// src/services/nasa.ts

export async function getEvents() {
  const url = 'https://eonet.gsfc.nasa.gov/api/v2.1/events?limit=4&days=30&status=open';

  try {
    const response = await fetch(url, {
      cache: 'no-store' // Sempre busca os dados mais frescos
    });

    if (!response.ok) {
      throw new Error('Falha ao buscar alertas da NASA v2.1');
    }

    const data = await response.json();
    return data.events || []; 
    
  } catch (error) {
    console.error("Erro na API da NASA:", error);
    // Removemos os dados falsos. Se a NASA cair, a tela simplesmente mostra a mensagem de "Nenhum alerta"
    return []; 
  }
}