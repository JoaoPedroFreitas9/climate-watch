import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWeather, getForecast } from "@/services/weather";
import { getEvents } from "@/services/nasa";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Thermometer, Wind, Droplets, Flame, Mountain, Tornado, MapPin, CloudRain, AlertTriangle, Map, Rss, Snowflake, Clock, Search } from "lucide-react";
import { SubmitButton } from "@/components/ui/SubmitButton"; 

interface NasaEvent {
  id: string;
  title: string;
  categories: { title: string }[];
  geometries: { date: string; coordinates: number[] }[];
  sources?: { id: string; url: string }[];
}

async function NasaAlerts() {
  const alertas: NasaEvent[] = await getEvents();
  
  if (!alertas || alertas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-slate-400 h-full">
        <AlertTriangle className="w-10 h-10 mb-2 opacity-50" />
        <p className="text-sm">Nenhum alerta global severo ativo.</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col mt-1">
      {alertas.slice(0, 4).map((evento) => { 
        const tituloCategoria = evento.categories[0]?.title;
        
        let Icone = AlertTriangle; 
        let corIcone = "text-emerald-500";
        let bgIcone = "bg-emerald-50";
        let tituloTraduzido = tituloCategoria || "Evento Menor"; 
        let corBadge = "bg-emerald-100 text-emerald-700";
        let corBolinha = "bg-emerald-500";
        
        if (tituloCategoria === "Severe Storms") { 
          Icone = Tornado; corIcone = "text-red-500"; bgIcone = "bg-red-50"; tituloTraduzido = "Tempestade Severa"; 
          corBadge = "bg-red-100 text-red-700"; corBolinha = "bg-red-500";
        } else if (tituloCategoria === "Wildfires") { 
          Icone = Flame; corIcone = "text-orange-500"; bgIcone = "bg-orange-50"; tituloTraduzido = "Incêndio"; 
          corBadge = "bg-orange-100 text-orange-700"; corBolinha = "bg-orange-500";
        } else if (tituloCategoria === "Volcanoes") { 
          Icone = Mountain; corIcone = "text-red-600"; bgIcone = "bg-red-50"; tituloTraduzido = "Vulcão"; 
          corBadge = "bg-red-100 text-red-700"; corBolinha = "bg-red-600";
        } else if (tituloCategoria === "Sea and Lake Ice") {
          Icone = Snowflake; corIcone = "text-blue-500"; bgIcone = "bg-blue-50"; tituloTraduzido = "Gelo / Iceberg";
          corBadge = "bg-blue-100 text-blue-700"; corBolinha = "bg-blue-500";
        }

        const dataEvento = evento.geometries[0]?.date 
          ? new Date(evento.geometries[0].date).toLocaleDateString('pt-BR')
          : "N/A";

        const coords = evento.geometries[0]?.coordinates;
        const lat = coords && coords.length >= 2 ? coords[1].toFixed(2) : null;
        const lon = coords && coords.length >= 2 ? coords[0].toFixed(2) : null;
        
        const fonteId = evento.sources?.[0]?.id || "NASA";

        return (
          <li key={evento.id} className="flex gap-4 items-start py-3.5 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors px-2 rounded-lg -mx-2">
            <div className={`p-2.5 rounded-full ${bgIcone} ${corIcone} mt-1 cursor-help`} title={`Classificação: ${tituloTraduzido}`}>
              <Icone className="w-5 h-5" />
            </div>
            
            <div className="flex flex-col w-full gap-1">
              <div className="flex items-center">
                <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider font-extrabold ${corBadge} cursor-help`} title="Nível de Severidade">
                  <span className={`w-1.5 h-1.5 rounded-full ${corBolinha} animate-pulse`}></span>
                  {tituloTraduzido}
                </span>
              </div>
              
              <span className="font-bold text-slate-800 text-sm leading-tight line-clamp-2 mt-0.5" title={evento.title}>
                {evento.title}
              </span>
              
              <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] text-slate-500 font-medium mt-1">
                <span title="Data da última atualização" className="cursor-help">• {dataEvento}</span>
                {lat && lon && (
                  <span className="flex items-center gap-1 shrink-0 cursor-help" title="Coordenadas Geográficas (Latitude e Longitude)">
                    <Map className="w-3 h-3" /> {lat}, {lon}
                  </span>
                )}
                <span className="flex items-center gap-1 shrink-0 cursor-help" title="Agência emissora do alerta oficial">
                  <Rss className="w-3 h-3" /> {fonteId}
                </span>
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
  
  const horaAtual = new Date().toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo'
  });
  
  let dadosClima = null;
  let dadosPrevisao = null;
  let erro = null;

  if (cidadeBuscada) {
    try {
      dadosClima = await getWeather(cidadeBuscada);
      dadosPrevisao = await getForecast(cidadeBuscada);
    } catch {
      erro = "Cidade não encontrada. Verifique o nome digitado.";
    }
  }

  return (
    <main className="min-h-screen lg:h-screen lg:overflow-hidden flex flex-col justify-center bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto w-full flex flex-col h-full max-h-212.5 gap-6">
        <div className="flex flex-col items-start text-left gap-1.5 shrink-0">
          <div className="flex flex-wrap items-center justify-between w-full gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 flex items-center gap-2">
                <MapPin className="w-8 h-8 text-blue-600" /> Vigilância Climática
              </h1>
              <p className="text-sm md:text-base text-slate-500 mt-1">
                Acompanhe as condições climáticas e alertas de desastres naturais em tempo real.
              </p>
            </div>
            
            {cidadeBuscada && !erro && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-200/50 px-3 py-1.5 rounded-full animate-in fade-in zoom-in duration-500">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Última atualização: {horaAtual}
              </div>
            )}
          </div>

          <form className="flex w-full max-w-md gap-2 mt-3" action="/">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input 
                name="cidade" 
                defaultValue={dadosClima?.name || cidadeBuscada}
                placeholder="Buscar cidade..." 
                className="bg-white shadow-sm h-12 text-base rounded-xl border-slate-200 pl-11 capitalize" 
                required
              />
            </div>
            <SubmitButton />
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch flex-1 min-h-0">
          <Card className="bg-white border-slate-100 shadow-lg rounded-3xl flex flex-col h-full overflow-hidden">
            <CardHeader className="border-b border-slate-50 pb-4 pt-5 shrink-0">
              <CardTitle className="flex items-center gap-2 text-slate-800 text-base">
                <CloudRain className="w-5 h-5 text-blue-500" />
                Condições Atuais
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 pb-6 flex-1 flex flex-col overflow-y-auto scrollbar-hide">
              {!cidadeBuscada && <p className="text-slate-500 text-center py-8 m-auto">Aguardando sua busca...</p>}
              {erro && <p className="text-red-500 font-medium text-center py-8 m-auto bg-red-50 rounded-xl w-full">{erro}</p>}
              
              {dadosClima && (
                <div className="flex flex-col gap-5 h-full justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-slate-50 p-2 rounded-2xl shrink-0">
                        <Image src={`https://openweathermap.org/img/wn/${dadosClima.weather[0].icon}@2x.png`} alt="Ícone" width={70} height={70} />
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                          {dadosClima.name}
                        </h2>
                        <p className="text-slate-500 capitalize text-base mt-1.5">{dadosClima.weather[0].description}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-5xl font-black text-slate-900 leading-none">{Math.round(dadosClima.main.temp)}°</p>
                      <p className="text-sm font-medium text-slate-500 mt-2">
                        Min {Math.round(dadosClima.main.temp_min)}° / Max {Math.round(dadosClima.main.temp_max)}°
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 p-3 rounded-2xl flex flex-col items-center justify-center text-center cursor-help" title="Sensação térmica atual">
                      <Thermometer className="w-6 h-6 text-orange-500 mb-2" />
                      <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-0.5">Sensação</p>
                      <p className="text-lg font-bold text-slate-800">{Math.round(dadosClima.main.feels_like)}°C</p> 
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl flex flex-col items-center justify-center text-center cursor-help" title="Umidade relativa do ar">
                      <Droplets className="w-6 h-6 text-blue-500 mb-2" />
                      <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-0.5">Umidade</p>
                      <p className="text-lg font-bold text-slate-800">{dadosClima.main.humidity}%</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl flex flex-col items-center justify-center text-center cursor-help" title="Velocidade do vento em km/h">
                      <Wind className="w-6 h-6 text-teal-500 mb-2" />
                      <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-0.5">Vento</p>
                      <p className="text-lg font-bold text-slate-800">{Math.round(dadosClima.wind.speed * 3.6)} km/h</p>
                    </div>
                  </div>

                  {dadosPrevisao && dadosPrevisao.length > 0 && (
                    <div className="mt-1 pt-3 border-t border-slate-50">
                      <h3 className="text-[12px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
                        Próximos 5 dias
                      </h3>
                      <div className="flex justify-between gap-1 overflow-x-auto pb-1 scrollbar-hide">
                        {dadosPrevisao.map((dia: { dt: number; dt_txt: string; main: { temp: number }; weather: { icon: string; description: string }[] }) => {
                          const dataFormatada = new Date(dia.dt_txt).toLocaleDateString('pt-BR', { weekday: 'short' });
                          return (
                            <div key={dia.dt} className="flex flex-col items-center min-w-15 cursor-help" title={`Previsão para ${dataFormatada}`}>
                              <p className="text-xs font-semibold text-slate-500 capitalize">{dataFormatada}</p>
                              <Image src={`https://openweathermap.org/img/wn/${dia.weather[0].icon}.png`} alt="icon" width={36} height={36} />
                              <p className="text-base font-bold text-slate-800">{Math.round(dia.main.temp)}°</p>
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

          <Card className="bg-white border-slate-100 shadow-lg rounded-3xl flex flex-col h-full overflow-hidden">
            <CardHeader className="border-b border-slate-50 pb-4 pt-5 shrink-0">
              <CardTitle className="flex items-center gap-2 text-slate-800 text-base">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Alertas Globais (NASA)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 pb-4 flex-1 overflow-y-auto scrollbar-hide">
              <Suspense fallback={
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full rounded-2xl bg-slate-100" />
                  <Skeleton className="h-16 w-full rounded-2xl bg-slate-100" />
                  <Skeleton className="h-16 w-full rounded-2xl bg-slate-100" />
                  <Skeleton className="h-16 w-full rounded-2xl bg-slate-100" />
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