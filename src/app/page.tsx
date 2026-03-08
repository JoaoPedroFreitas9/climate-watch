// src/app/page.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWeather, getForecast } from "@/services/weather";
import { getEvents } from "@/services/nasa";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Tipagem atualizada para o formato da v2.1 da NASA
interface NasaEvent {
  id: string;
  title: string;
  categories: { title: string }[];
  geometries: { date: string }[];
}

// Componente separado da NASA atualizado para v2.1
async function NasaAlerts() {
  const alertas: NasaEvent[] = await getEvents();
  
  if (!alertas || alertas.length === 0) {
    return <p className="text-slate-500">Nenhum alerta global severo nos últimos dias.</p>;
  }

  return (
    <ul className="space-y-4 mt-2">
      {alertas.map((evento) => {
        // Na v2.1, usamos o 'title' da categoria para saber o que é
        const tituloCategoria = evento.categories[0]?.title;
        let icone = "🚨"; 
        
        if (tituloCategoria === "Wildfires") icone = "🔥";
        if (tituloCategoria === "Volcanoes") icone = "🌋";
        if (tituloCategoria === "Severe Storms") icone = "🌀";
        if (tituloCategoria === "Sea and Lake Ice") icone = "🧊";

        // Na v2.1, o campo é 'geometries' (plural)
        const dataEvento = evento.geometries[0]?.date 
          ? new Date(evento.geometries[0].date).toLocaleDateString('pt-BR')
          : "Data indisponível";

        return (
          <li key={evento.id} className="flex gap-3 items-start bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="text-2xl">{icone}</span>
            <div className="flex flex-col">
              <span className="font-semibold text-slate-800 text-sm leading-tight mb-1">
                {evento.title}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Atualizado em: {dataEvento}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// A Página Principal
export default async function Home({ searchParams }: { searchParams: Promise<{ cidade?: string }> }) {
  const params = await searchParams;
  const cidadeBuscada = params.cidade || "";
  
  let dadosClima = null;
  let dadosPrevisao = null;
  let erro = null;

  if (cidadeBuscada) {
    try {
      dadosClima = await getWeather(cidadeBuscada);
      dadosPrevisao = await getForecast(cidadeBuscada);
    } catch (_e) {
      erro = "Cidade não encontrada. Tente verificar o nome.";
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* CABEÇALHO COM A BUSCA */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-slate-900">Monitor da Terra 🌍</h1>
          <p className="text-slate-500">Acompanhe o clima e alertas de desastres naturais.</p>
          
          <form className="flex gap-2 mt-4" action="/">
            <Input 
              name="cidade" 
              defaultValue={cidadeBuscada}
              placeholder="Digite o nome da cidade..." 
              className="max-w-md bg-white" 
              required
            />
            <Button type="submit">Buscar</Button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          
          {/* CARD DO CLIMA E PREVISÃO */}
          <Card>
            <CardHeader><CardTitle>Clima Atual</CardTitle></CardHeader>
            <CardContent>
              {!cidadeBuscada && <p className="text-slate-500">Digite uma cidade acima para começar.</p>}
              {erro && <p className="text-red-500 font-medium">{erro}</p>}
              
              {dadosClima && (
                <div className="flex flex-col gap-4">
                  {/* Info principal (Ícone, Cidade, Condição) */}
                  <div className="flex items-center gap-4">
                    <Image 
                        src={`https://openweathermap.org/img/wn/${dadosClima.weather[0].icon}@2x.png`} 
                        alt="Ícone do clima"
                        width={64}
                        height={64}
                        className="bg-slate-200 rounded-full"
                    />
                    <div>
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        📍 {dadosClima.name}
                      </h2>
                      <p className="text-slate-500 capitalize">☁️ {dadosClima.weather[0].description}</p>
                    </div>
                  </div>
                  
                  {/* Grid com Temp, Sensação, Umidade e Vento */}
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="bg-slate-100 p-3 rounded-lg">
                      <p className="text-sm text-slate-500">🌡️ Temperatura</p>
                      <p className="text-xl font-bold">{Math.round(dadosClima.main.temp)}°C</p> 
                    </div>
                    <div className="bg-slate-100 p-3 rounded-lg">
                      <p className="text-sm text-slate-500">🥵 Sensação</p>
                      <p className="text-xl font-bold">{Math.round(dadosClima.main.feels_like)}°C</p> 
                    </div>
                    <div className="bg-slate-100 p-3 rounded-lg">
                      <p className="text-sm text-slate-500">💧 Umidade</p>
                      <p className="text-xl font-bold">{dadosClima.main.humidity}%</p>
                    </div>
                    <div className="bg-slate-100 p-3 rounded-lg">
                      <p className="text-sm text-slate-500">🌬️ Vento</p>
                      <p className="text-xl font-bold">{Math.round(dadosClima.wind.speed * 3.6)} km/h</p>
                    </div>
                  </div>

                  {/* PREVISÃO DE 5 DIAS */}
                  {dadosPrevisao && dadosPrevisao.length > 0 && (
                    <div className="mt-6 border-t pt-4">
                      <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">
                        Próximos 5 dias
                      </h3>
                      
                      <div className="flex justify-between gap-2 overflow-x-auto pb-2">
                        {dadosPrevisao.map((dia: { dt: number; dt_txt: string; main: { temp: number }; weather: { icon: string; description: string }[] }) => {
                          const dataFormatada = new Date(dia.dt_txt).toLocaleDateString('pt-BR', { weekday: 'short' });
                          
                          return (
                            <div key={dia.dt} className="flex flex-col items-center min-w-[60px]">
                              <p className="text-sm text-slate-500 capitalize">{dataFormatada}</p>
                              <Image 
                                src={`https://openweathermap.org/img/wn/${dia.weather[0].icon}.png`} 
                                alt={dia.weather[0].description}
                                width={40}
                                height={40}
                              />
                              <p className="font-bold text-slate-800">{Math.round(dia.main.temp)}°</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* CARD DA NASA COM SUSPENSE (SKELETON) */}
          <Card>
            <CardHeader><CardTitle>Alertas (NASA)</CardTitle></CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton className="h-32 w-full" />}>
                <NasaAlerts />
              </Suspense>
            </CardContent>
          </Card>

        </div>
      </div>
    </main>
  );
}