
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWeather, getForecast } from "@/services/weather";
import { getEvents } from "@/services/nasa";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Thermometer, Wind, Droplets, Flame, Mountain, Tornado, MapPin, CloudRain, AlertTriangle } from "lucide-react";


import { SubmitButton } from "@/components/ui/SubmitButton"; 

interface NasaEvent {
  id: string;
  title: string;
  categories: { title: string }[];
  geometries: { date: string }[];
}


async function NasaAlerts() {
  const alertas: NasaEvent[] = await getEvents();
  
  if (!alertas || alertas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-slate-400">
        <AlertTriangle className="w-10 h-10 mb-2 opacity-50" />
        <p className="text-sm">Nenhum alerta global severo ativo.</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col mt-1">
      
      {alertas.slice(0, 3).map((evento) => { 
        const tituloCategoria = evento.categories[0]?.title;
        let Icone = AlertTriangle; 
        let corIcone = "text-yellow-500";
        let bgIcone = "bg-yellow-50";
        
        if (tituloCategoria === "Wildfires") { Icone = Flame; corIcone = "text-orange-500"; bgIcone = "bg-orange-50"; }
        if (tituloCategoria === "Volcanoes") { Icone = Mountain; corIcone = "text-red-500"; bgIcone = "bg-red-50"; }
        if (tituloCategoria === "Severe Storms") { Icone = Tornado; corIcone = "text-blue-500"; bgIcone = "bg-blue-50"; }

        const dataEvento = evento.geometries[0]?.date 
          ? new Date(evento.geometries[0].date).toLocaleDateString('pt-BR')
          : "Data indisponível";

        return (
         
          <li key={evento.id} className="flex gap-4 items-center py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors px-2 rounded-lg -mx-2">
            <div className={`p-2.5 rounded-full ${bgIcone} ${corIcone}`}>
              <Icone className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-slate-800 text-sm leading-tight">
                {evento.title}
              </span>
              <div className="flex gap-1.5 text-xs text-slate-500 font-medium mt-1">
                <span>{tituloCategoria}</span>
                <span>•</span>
                <span>{dataEvento}</span>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}


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
      erro = "Cidade não encontrada. Verifique o nome digitado.";
    }
  }
  const condicaoClima = dadosClima?.weather[0]?.main;
  let bgClass = "bg-slate-50"; 
  if (condicaoClima === "Clear") bgClass = "bg-sky-50";
  if (condicaoClima === "Rain" || condicaoClima === "Drizzle" || condicaoClima === "Thunderstorm") bgClass = "bg-indigo-50";
  if (condicaoClima === "Clouds") bgClass = "bg-gray-100";
  return (
    <main className={`min-h-screen lg:h-screen lg:overflow-hidden flex flex-col justify-center transition-colors duration-500 ${bgClass} p-4`}>
      <div className="max-w-5xl mx-auto w-full space-y-4">
        <div className="flex flex-col items-center text-center gap-1">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-blue-600" /> Monitor da Terra
          </h1>
          <p className="text-sm text-slate-500">Clima e alertas de desastres naturais em tempo real.</p>
          <form className="flex w-full max-w-md gap-2 mt-2" action="/">
            <Input 
              name="cidade" 
              defaultValue={cidadeBuscada}
              placeholder="Digite sua cidade..." 
              className="bg-white shadow-sm h-10 rounded-lg" 
              required
            />
            <SubmitButton />
          </form>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mt-2">
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm h-fit">
            <CardHeader className="bg-slate-900/5 border-b border-slate-100 pb-3 pt-4">
              <CardTitle className="flex items-center gap-2 text-slate-800 text-base">
                <CloudRain className="w-4 h-4 text-blue-500" />
                Condições Atuais
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 pb-4">
              {!cidadeBuscada && <p className="text-slate-500 text-center py-4">Aguardando sua busca...</p>}
              {erro && <p className="text-red-500 font-medium text-center py-4 bg-red-50 rounded-xl">{erro}</p>}
              {dadosClima && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-1.5 rounded-xl shadow-inner">
                        <Image src={`https://openweathermap.org/img/wn/${dadosClima.weather[0].icon}@2x.png`} alt="Ícone" width={60} height={60} />
                      </div>
                      <div>
                        <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight leading-none">
                          {dadosClima.name}
                        </h2>
                        <p className="text-slate-500 capitalize text-sm mt-1">{dadosClima.weather[0].description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-black text-slate-900 leading-none">{Math.round(dadosClima.main.temp)}°</p>
                      <p className="text-xs font-medium text-slate-500 mt-1">
                        Min {Math.round(dadosClima.main.temp_min)}° / Max {Math.round(dadosClima.main.temp_max)}°
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-slate-50 p-2 md:p-3 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
                      <Thermometer className="w-5 h-5 text-orange-500 mb-1" />
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-0.5">Sensação</p>
                      <p className="text-base font-bold text-slate-800">{Math.round(dadosClima.main.feels_like)}°C</p> 
                    </div>
                    <div className="bg-slate-50 p-2 md:p-3 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
                      <Droplets className="w-5 h-5 text-blue-500 mb-1" />
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-0.5">Umidade</p>
                      <p className="text-base font-bold text-slate-800">{dadosClima.main.humidity}%</p>
                    </div>
                    <div className="bg-slate-50 p-2 md:p-3 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
                      <Wind className="w-5 h-5 text-teal-500 mb-1" />
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-0.5">Vento</p>
                      <p className="text-base font-bold text-slate-800">{Math.round(dadosClima.wind.speed * 3.6)} km/h</p>
                    </div>
                  </div>
                  {dadosPrevisao && dadosPrevisao.length > 0 && (
                    <div className="mt-1 pt-3 border-t border-slate-100">
                      <h3 className="text-xs font-bold text-slate-900 mb-2 uppercase tracking-wider">
                        Previsão (5 dias)
                      </h3>
                      <div className="flex justify-between gap-1 overflow-x-auto pb-1 scrollbar-hide">
                        {dadosPrevisao.map((dia: { dt: number; dt_txt: string; main: { temp: number }; weather: { icon: string; description: string }[] }) => {
                          const dataFormatada = new Date(dia.dt_txt).toLocaleDateString('pt-BR', { weekday: 'short' });
                          return (
                            <div key={dia.dt} className="flex flex-col items-center min-w-[55px] p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                              <p className="text-[11px] font-medium text-slate-500 capitalize">{dataFormatada}</p>
                              <Image src={`https://openweathermap.org/img/wn/${dia.weather[0].icon}.png`} alt="icon" width={32} height={32} />
                              <p className="text-sm font-bold text-slate-800">{Math.round(dia.main.temp)}°</p>
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
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm h-fit">
            <CardHeader className="bg-slate-900/5 border-b border-slate-100 pb-3 pt-4">
              <CardTitle className="flex items-center gap-2 text-slate-800 text-base">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                Alertas Globais (NASA)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 pb-4">
              <Suspense fallback={
                <div className="space-y-3">
                  <Skeleton className="h-14 w-full rounded-xl" />
                  <Skeleton className="h-14 w-full rounded-xl" />
                  <Skeleton className="h-14 w-full rounded-xl" />
                </div>
              }>
                <NasaAlerts />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}