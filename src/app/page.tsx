// src/app/page.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWeather } from "@/services/weather"; // Ligando o motor que criamos!


export default async function Home({ searchParams }: { searchParams: Promise<{ cidade?: string }> }) {
  
  
  const params = await searchParams;
  const cidadeBuscada = params.cidade || "";
  
  let dadosClima = null;
  let erro = null;

  
  if (cidadeBuscada) {
    try {
      dadosClima = await getWeather(cidadeBuscada);
    } catch (e) {
      erro = "Cidade não encontrada. Tente verificar o nome.";
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
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
          
          
          <Card>
            <CardHeader>
              <CardTitle>Clima Atual</CardTitle>
            </CardHeader>
            <CardContent>
              
              {!cidadeBuscada && <p className="text-slate-500">Digite uma cidade acima para começar.</p>}
              
              
              {erro && <p className="text-red-500 font-medium">{erro}</p>}

              
              {dadosClima && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    
                    <img 
                      src={`https://openweathermap.org/img/wn/${dadosClima.weather[0].icon}@2x.png`} 
                      alt="Ícone do clima"
                      className="w-16 h-16 bg-slate-200 rounded-full"
                    />
                    <div>
                      <h2 className="text-2xl font-bold">{dadosClima.name}</h2>
                      <p className="text-slate-500 capitalize">{dadosClima.weather[0].description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="bg-slate-100 p-3 rounded-lg">
                      <p className="text-sm text-slate-500">Temperatura</p>
                      
                      <p className="text-xl font-bold">{Math.round(dadosClima.main.temp)}°C</p> 
                    </div>
                    <div className="bg-slate-100 p-3 rounded-lg">
                      <p className="text-sm text-slate-500">Umidade</p>
                      <p className="text-xl font-bold">{dadosClima.main.humidity}%</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          
          <Card>
            <CardHeader>
              <CardTitle>Alertas (NASA)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-500">Aguardando conexão com a NASA...</p>
            </CardContent>
          </Card>

        </div>
      </div>
    </main>
  );
}