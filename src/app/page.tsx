import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

import {
  MapPin,
  CloudRain,
  AlertTriangle,
  Clock,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { WeatherDisplay } from "@/components/weather/WeatherDisplay";
import SearchForm from "@/components/weather/SearchForm";
import NasaAlerts from "@/components/alerts/NasaAlerts";

import { getPageData } from "@/lib/getPageData";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ cidade?: string }>;
}) {

  const {
    cidadeBuscada,
    horaAtual,
    dadosClima,
    dadosPrevisao,
    erro,
  } = await getPageData(searchParams);

  return (
    <main className="h-dvh overflow-hidden flex flex-col justify-start lg:justify-center bg-slate-50 dark:bg-slate-950 p-4 md:p-8 pt-6 lg:pt-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto w-full flex flex-col h-full gap-5 lg:gap-6">

        <div className="flex flex-col items-start text-left gap-1.5 shrink-0">

          <div className="flex flex-wrap items-center justify-between w-full gap-2 lg:gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                <MapPin className="w-6 h-6 md:w-8 md:h-8 text-blue-600 dark:text-blue-500" />
                Vigilância Climática
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

          <SearchForm cidade={dadosClima?.name || cidadeBuscada} />

        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-5 lg:gap-6 items-stretch flex-1 min-h-0 overflow-hidden">

          <Card className="bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-lg rounded-3xl flex flex-col overflow-hidden transition-colors duration-300 min-h-75">

            <CardHeader className="border-b border-slate-50 dark:border-slate-800/50 pb-4 pt-5 shrink-0">
              <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200 text-base">
                <CloudRain className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                Condições Atuais
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-5 md:pt-6 pb-5 md:pb-6 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">

              {!cidadeBuscada && (
                <p className="text-slate-500 dark:text-slate-400 text-center py-8 m-auto">
                  Aguardando sua busca...
                </p>
              )}

              {erro && (
                <p className="text-red-500 dark:text-red-400 font-medium text-center py-8 m-auto bg-red-50 dark:bg-red-950/30 rounded-xl w-full">
                  {erro}
                </p>
              )}

              {dadosClima && (
                <WeatherDisplay clima={dadosClima} previsao={dadosPrevisao} />
              )}

            </CardContent>

          </Card>

          <Card className="bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-lg rounded-3xl flex flex-col min-h-75 flex-1 overflow-hidden transition-colors duration-300">

            <CardHeader className="border-b border-slate-50 dark:border-slate-800/50 pb-4 pt-5 shrink-0 z-10 bg-white dark:bg-slate-900 transition-colors duration-300">
              <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200 text-base">
                <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400" />
                Alertas Globais (NASA)
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-4 pb-0 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden relative">

              <Suspense
                fallback={
                  <div className="space-y-4">
                    <Skeleton className="h-16 w-full rounded-2xl bg-slate-100 dark:bg-slate-800" />
                    <Skeleton className="h-16 w-full rounded-2xl bg-slate-100 dark:bg-slate-800" />
                    <Skeleton className="h-16 w-full rounded-2xl bg-slate-100 dark:bg-slate-800" />
                  </div>
                }
              >
                <NasaAlerts />
              </Suspense>

            </CardContent>

          </Card>

        </div>
      </div>
    </main>
  );
}