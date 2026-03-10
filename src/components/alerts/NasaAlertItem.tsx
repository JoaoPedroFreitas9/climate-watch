import { AlertTriangle, Flame, Mountain, Snowflake, Tornado, Map, Rss } from "lucide-react";

export interface NasaEvent {
  id: string;
  title: string;
  categories: { title: string }[];
  geometries: { date: string; coordinates: number[] }[];
  sources?: { id: string; url: string }[];
}

interface CategoryConfig {
  icon: React.ElementType;
  corIcone: string;
  bgIcone: string;
  titulo: string;
  corBadge: string;
  corBolinha: string;
}

const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  "Severe Storms": {
    icon: Tornado,
    corIcone: "text-red-500 dark:text-red-400",
    bgIcone: "bg-red-50 dark:bg-red-950/30",
    titulo: "Tempestade Severa",
    corBadge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    corBolinha: "bg-red-500 dark:bg-red-400",
  },
  "Wildfires": {
    icon: Flame,
    corIcone: "text-orange-500 dark:text-orange-400",
    bgIcone: "bg-orange-50 dark:bg-orange-950/30",
    titulo: "Incêndio",
    corBadge: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    corBolinha: "bg-orange-500 dark:bg-orange-400",
  },
  "Volcanoes": {
    icon: Mountain,
    corIcone: "text-red-600 dark:text-red-500",
    bgIcone: "bg-red-50 dark:bg-red-950/30",
    titulo: "Vulcão",
    corBadge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    corBolinha: "bg-red-600 dark:bg-red-500",
  },
  "Sea and Lake Ice": {
    icon: Snowflake,
    corIcone: "text-blue-500 dark:text-blue-400",
    bgIcone: "bg-blue-50 dark:bg-blue-950/30",
    titulo: "Gelo / Iceberg",
    corBadge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    corBolinha: "bg-blue-500 dark:bg-blue-400",
  },
};

const DEFAULT_CONFIG: CategoryConfig = {
  icon: AlertTriangle,
  corIcone: "text-emerald-500 dark:text-emerald-400",
  bgIcone: "bg-emerald-50 dark:bg-emerald-950/30",
  titulo: "Evento Menor",
  corBadge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  corBolinha: "bg-emerald-500 dark:bg-emerald-400",
};

export function NasaAlertItem({ evento }: { evento: NasaEvent }) {
  const tituloCategoria = evento.categories[0]?.title || "";
  const config = CATEGORY_CONFIG[tituloCategoria] || DEFAULT_CONFIG;
  const Icone = config.icon;

  const dataEvento = evento.geometries[0]?.date
    ? new Date(evento.geometries[0].date).toLocaleDateString("pt-BR")
    : "N/A";

  const coords = evento.geometries[0]?.coordinates;
  const lat = coords && coords.length >= 2 ? coords[1].toFixed(2) : null;
  const lon = coords && coords.length >= 2 ? coords[0].toFixed(2) : null;
  const fonteId = evento.sources?.[0]?.id || "NASA";

  return (
    <li className="flex gap-3 sm:gap-4 items-start py-4 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors px-3 sm:px-2 rounded-lg sm:-mx-2">
      
      <div
        className={`p-3 sm:p-2.5 rounded-full ${config.bgIcone} ${config.corIcone} mt-1 cursor-help`}
        title={`Classificação: ${config.titulo}`}
      >
        <Icone className="w-5 h-5" />
      </div>

      <div className="flex flex-col w-full gap-1">
        
        <div className="flex items-center">
          <span
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs sm:text-[10px] uppercase tracking-wider font-extrabold ${config.corBadge} cursor-help`}
            title="Nível de Severidade"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${config.corBolinha} animate-pulse`}
            />
            {config.titulo}
          </span>
        </div>

        <span
          className="font-bold text-slate-800 dark:text-slate-200 text-base sm:text-sm leading-tight line-clamp-2 mt-0.5"
          title={evento.title}
        >
          {evento.title}
        </span>

        <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
          
          <span
            title="Data da última atualização"
            className="cursor-help"
          >
            • {dataEvento}
          </span>

          {lat && lon && (
            <span
              className="flex items-center gap-1 shrink-0 cursor-help"
              title="Coordenadas Geográficas (Latitude e Longitude)"
            >
              <Map className="w-3 h-3" />
              {lat}, {lon}
            </span>
          )}

          {evento.sources?.[0]?.url ? (
            <a
              href={evento.sources[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 shrink-0 text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors"
              title="Clique para ler o relatório oficial"
            >
              <Rss className="w-3 h-3" />
              {fonteId}
            </a>
          ) : (
            <span
              className="flex items-center gap-1 shrink-0 cursor-help"
              title="Agência emissora do alerta oficial"
            >
              <Rss className="w-3 h-3" />
              {fonteId}
            </span>
          )}

        </div>
      </div>
    </li>
  );
}