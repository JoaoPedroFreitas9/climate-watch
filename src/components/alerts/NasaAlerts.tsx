import { getEvents } from "@/services/nasa";
import { NasaAlertItem, type NasaEvent } from "@/components/alerts/NasaAlertItem";
import { AlertTriangle } from "lucide-react";

export default async function NasaAlerts() {
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
    const dataA = a.geometries?.[0]?.date
      ? new Date(a.geometries[0].date).getTime()
      : 0;

    const dataB = b.geometries?.[0]?.date
      ? new Date(b.geometries[0].date).getTime()
      : 0;

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
            <span className="text-lg leading-none -mt-0.5">↓</span>
            Role para ver mais
          </span>
        </div>
      )}
    </>
  );
}