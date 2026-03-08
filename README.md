# 🌍 Observador do Clima (Dashboard Meteorológico & NASA)

![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript)

O **Observador do Clima** é uma aplicação web de alta performance focada em monitoramento climático em tempo real e rastreamento de desastres naturais globais. 

O painel integra dados meteorológicos precisos com alertas oficiais de agências governamentais, entregando uma interface limpa, responsiva e com excelente experiência de usuário (UX).

---

## 🚀 Tecnologias e Ferramentas

* **Framework:** Next.js (App Router)
* **Linguagem:** TypeScript
* **Estilização:** Tailwind CSS + Shadcn UI
* **Ícones:** Lucide React
* **APIs Consumidas:** * [OpenWeather API](https://openweathermap.org/api) (Clima atual e Previsão de 5 dias)
  * [NASA EONET v2.1](https://eonet.gsfc.nasa.gov/) (Earth Observatory Natural Event Tracker)

---

## 🌟 Destaques da Arquitetura

### 1. Performance e Cache Estratégico
Estratégias avançadas utilizando os recursos nativos do Next.js (Server Components `fetch`):
* **Dados Climáticos:** Utilização de revalidação baseada em tempo (`revalidate: 3600`) para cachear a previsão por 1 hora, otimizando o consumo da API da OpenWeather.
* **Dados de Desastres (NASA):** Requisições em tempo real (`cache: 'no-store'`) para garantir que alertas críticos de desastres naturais sejam sempre os mais recentes.

### 2. UX e Tratamento de Erros
* **Loading Híbrido:** Utilização de `Suspense` do React 18 com componentes `Skeleton` para carregamento assíncrono dos alertas da NASA, garantindo que o painel principal não seja bloqueado durante a requisição.
* **Feedback Visual:** Implementação do hook `useFormStatus` para gerenciar o estado do botão de busca em Client Components, prevenindo múltiplos envios simultâneos.
* **Graceful Degradation:** Blocos `try/catch` robustos garantem que falhas em APIs externas (como indisponibilidade nos servidores da NASA ou cidades não encontradas) sejam tratadas com mensagens amigáveis na UI, sem quebrar a aplicação.

### 3. Acessibilidade e Interface
* **Localização (i18n):** Tradução automática e dinâmica dos termos técnicos da NASA para o Português do Brasil.
* **Acessibilidade:** Implementação de tooltips nativos (`title`) em ícones e dados complexos para orientar o usuário e melhorar a legibilidade.
* **Design Responsivo:** Abordagem *Mobile-First* utilizando o grid system do Tailwind, com um layout "No-Scroll" no desktop para simular um painel de controle nativo.

---

## ⚙️ Como executar o projeto localmente

1. Clone o repositório:
```bash
git clone [https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git](https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git)
Entre na pasta do projeto:

Bash
cd SEU_REPOSITORIO
Instale as dependências:

Bash
npm install
Crie um arquivo .env.local na raiz do projeto e adicione sua chave da OpenWeather:

Snippet de código
NEXT_PUBLIC_OPENWEATHER_API_KEY=sua_chave_aqui
(Nota: A API da NASA EONET é aberta e não exige chave de autenticação).

Rode o servidor de desenvolvimento:

Bash
npm run dev
Acesse http://localhost:3000 no seu navegador.


---