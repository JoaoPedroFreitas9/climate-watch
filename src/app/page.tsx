import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWeather, getForecast } from "@/services/weather";
import { getEvents } from "@/services/nasa";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, CloudRain, AlertTriangle, Clock, Search } from "lucide-react";
import { SubmitButton } from "@/components/ui/SubmitButton"; 
import { ThemeToggle } from "@/components/ui/ThemeToggle"; 
import { NasaAlertItem, type NasaEvent } from "@/components/ui/NasaAlertItem";
import { WeatherDisplay } from "@/components/ui/WeatherDisplay";

async function NasaAlerts() {
  const alertas: NasaEvent[] = await getEvents();
  
  if (!alertas || alertas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-slate-400 dark:text-slate-500 h-full">
        <AlertTriangle className="w-10 h-10 mb-2 opacity-50" />
        <p className="text-sm">Nenhum alerta global severo ativo.</p>
      </div>
    );
  }

  const alertasOrdenados = [...alertas].sort((a, b) => {
    const dataA = a.geometries?.[0]?.date ? new Date(a.geometries[0].date).getTime() : 0;
    const dataB = b.geometries?.[0]?.date ? new Date(b.geometries[0].date).getTime() : 0;
    return dataB - dataA; 
  });

  const alertasExibidos = alertasOrdenados.slice(0, 20);

  return (
    <>
      <ul className="flex flex-col mt-1 pb-8">
        {alertasExibidos.map((evento) => (
          <NasaAlertItem key={evento.id} evento={evento} />
        ))}
      </ul>

      {alertasExibidos.length > 4 && (
        <div className="sticky bottom-0 left-0 right-0 h-16 bg-linear-to-t from-white dark:from-slate-900 via-white/95 dark:via-slate-900/95 to-transparent flex justify-center items-end pb-3 pointer-events-none">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest bg-white/60 dark:bg-slate-800/60 px-4 py-1.5 rounded-full backdrop-blur-sm shadow-sm flex items-center gap-1.5 animate-pulse border border-slate-100 dark:border-slate-700">
            <span className="text-lg leading-none -mt-0.5">↓</span> Role para ver mais
          </span>
        </div>
      )}
    </>
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
    <main className="min-h-dvh lg:h-screen lg:overflow-hidden flex flex-col justify-start lg:justify-center bg-slate-50 dark:bg-slate-950 p-4 md:p-8 pt-6 lg:pt-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto w-full flex flex-col h-full max-h-none lg:max-h-212.5 gap-5 lg:gap-6">
        <div className="flex flex-col items-start text-left gap-1.5 shrink-0">
          <div className="flex flex-wrap items-center justify-between w-full gap-2 lg:gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                <MapPin className="w-6 h-6 md:w-8 md:h-8 text-blue-600 dark:text-blue-500" /> Vigilância Climática
              </h1>
              <p className="text-xs md:text-base text-slate-500 dark:text-slate-400 mt-1">
                Acompanhe as condições climáticas e alertas de desastres naturais em tempo real.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {cidadeBuscada && !erro && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-200/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full animate-in fade-in zoom-in duration-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  Atualizado: {horaAtual}
                </div>
              )}
              <ThemeToggle />
            </div>
          </div>

          <form className="flex w-full max-w-md gap-2 mt-2 lg:mt-3" action="/">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
              <Input 
                name="cidade" 
                defaultValue={dadosClima?.name || cidadeBuscada}
                placeholder="Buscar cidade..." 
                className="bg-white dark:bg-slate-900 shadow-sm h-12 text-base rounded-xl border-slate-200 dark:border-slate-800 pl-11 capitalize text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-blue-500" 
                required
              />
            </div>
            <SubmitButton />
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 items-stretch flex-1 min-h-0">
          <Card className="bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-lg rounded-3xl flex flex-col h-full overflow-hidden transition-colors duration-300">
            <CardHeader className="border-b border-slate-50 dark:border-slate-800/50 pb-4 pt-5 shrink-0">
              <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200 text-base">
                <CloudRain className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                Condições Atuais
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 md:pt-6 pb-5 md:pb-6 flex-1 flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {!cidadeBuscada && <p className="text-slate-500 dark:text-slate-400 text-center py-8 m-auto">Aguardando a tua busca...</p>}
              {erro && <p className="text-red-500 dark:text-red-400 font-medium text-center py-8 m-auto bg-red-50 dark:bg-red-950/30 rounded-xl w-full">{erro}</p>}
              
              {dadosClima && <WeatherDisplay clima={dadosClima} previsao={dadosPrevisao} />}

            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-lg rounded-3xl flex flex-col h-full overflow-hidden transition-colors duration-300">
            <CardHeader className="border-b border-slate-50 dark:border-slate-800/50 pb-4 pt-5 shrink-0 z-10 bg-white dark:bg-slate-900 transition-colors duration-300">
              <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200 text-base">
                <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400" />
                Alertas Globais (NASA)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 pb-0 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative">
              <Suspense fallback={
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full rounded-2xl bg-slate-100 dark:bg-slate-800" />
                  <Skeleton className="h-16 w-full rounded-2xl bg-slate-100 dark:bg-slate-800" />
                  <Skeleton className="h-16 w-full rounded-2xl bg-slate-100 dark:bg-slate-800" />
                  <Skeleton className="h-16 w-full rounded-2xl bg-slate-100 dark:bg-slate-800" />
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