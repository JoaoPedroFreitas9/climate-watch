import Image from "next/image";
import { Thermometer, Wind, Droplets } from "lucide-react";

export interface WeatherData {
  name: string;
  main: { temp: number; temp_min: number; temp_max: number; feels_like: number; humidity: number };
  weather: { icon: string; description: string }[];
  wind: { speed: number };
}

export interface ForecastData {
  dt: number;
  dt_txt: string;
  main: { temp: number };
  weather: { icon: string; description: string }[];
}

interface WeatherDisplayProps {
  clima: WeatherData;
  previsao: ForecastData[];
}

export function WeatherDisplay({ clima, previsao }: WeatherDisplayProps) {
  return (
    <div className="flex flex-col gap-5 h-full justify-between">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-2xl shrink-0">
            <Image 
              src={`https://openweathermap.org/img/wn/${clima.weather[0].icon}@2x.png`} 
              alt="Ícone" 
              width={70} 
              height={70} 
              className="drop-shadow-sm" 
            />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight leading-none flex items-baseline">
              {clima.name}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 capitalize text-base mt-1.5">
              {clima.weather[0].description}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-5xl font-black text-slate-900 dark:text-white leading-none">
            {Math.round(clima.main.temp)}°
          </p>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">
            Min {Math.round(clima.main.temp_min)}° / Max {Math.round(clima.main.temp_max)}°
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl flex flex-col items-center justify-center text-center cursor-help border border-transparent dark:border-slate-800" title="Sensação térmica atual">
          <Thermometer className="w-6 h-6 text-orange-500 dark:text-orange-400 mb-2" />
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Sensação</p>
          <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{Math.round(clima.main.feels_like)}°C</p> 
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl flex flex-col items-center justify-center text-center cursor-help border border-transparent dark:border-slate-800" title="Humidade relativa do ar">
          <Droplets className="w-6 h-6 text-blue-500 dark:text-blue-400 mb-2" />
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Humidade</p>
          <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{clima.main.humidity}%</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl flex flex-col items-center justify-center text-center cursor-help border border-transparent dark:border-slate-800" title="Velocidade do vento em km/h">
          <Wind className="w-6 h-6 text-teal-500 dark:text-teal-400 mb-2" />
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Vento</p>
          <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{Math.round(clima.wind.speed * 3.6)} km/h</p>
        </div>
      </div>

      {previsao && previsao.length > 0 && (
        <div className="mt-1 pt-3 border-t border-slate-50 dark:border-slate-800/50">
          <h3 className="text-[12px] font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wider">
            Próximos 5 dias
          </h3>
          <div className="flex justify-between gap-1 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {previsao.map((dia) => {
              const dataFormatada = new Date(dia.dt_txt).toLocaleDateString('pt-BR', { weekday: 'short' });
              return (
                <div key={dia.dt} className="flex flex-col items-center min-w-15 cursor-help" title={`Previsão para ${dataFormatada}`}>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 capitalize">{dataFormatada}</p>
                  <Image src={`https://openweathermap.org/img/wn/${dia.weather[0].icon}.png`} alt="icon" width={36} height={36} />
                  <p className="text-base font-bold text-slate-800 dark:text-slate-200">{Math.round(dia.main.temp)}°</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}