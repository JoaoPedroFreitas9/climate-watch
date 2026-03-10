
# Vigilância Climática

Dashboard Meteorológico e Sistema de Monitoramento de Desastres Naturais.

---

# Visão Geral

O **Vigilância Climática** é uma aplicação web focada no monitoramento meteorológico em tempo real e no rastreamento global de eventos naturais extremos.

A solução realiza a integração de dados provenientes de APIs governamentais e de pesquisa, consolidando-os em uma interface responsiva e de alta performance. O projeto foi arquitetado com ênfase em **Server-Side Rendering (SSR)**, resiliência de rede, manutenibilidade de código e qualidade de experiência do usuário.

A aplicação foi desenvolvida utilizando **Next.js** com arquitetura moderna baseada no **App Router**.

---

# Stack Tecnológico

## Frontend e Arquitetura

* Framework: Next.js (App Router)
* Biblioteca: React
* Linguagem: TypeScript (tipagem estrita)

## Interface e Estilização

* Tailwind CSS
* next-themes (gerenciamento de tema)
* Shadcn UI (componentes base)
* Lucide React (biblioteca de ícones)

## Integração de Dados

* **OpenWeather API** — dados climáticos atuais e previsão de 5 dias
* **NASA EONET API** — monitoramento global de eventos naturais

---

# Arquitetura de Software e Decisões Técnicas

A estrutura do projeto foi projetada utilizando os paradigmas modernos do **Next.js App Router**, com foco em modularidade, escalabilidade e organização da lógica de dados.

---

## Padrões de Projeto e Qualidade de Código

**Design modular**

A interface foi dividida em componentes com responsabilidade única, incluindo:

* `WeatherDisplay` — exibição das informações meteorológicas
* `NasaAlertItem` — exibição de eventos naturais
* `ThemeToggle` — controle de tema da aplicação

Essa abordagem mantém o roteamento principal responsável apenas pela orquestração dos dados.

---

**Dictionary Pattern**

Estruturas condicionais extensas foram substituídas por um objeto de mapeamento (`CATEGORY_CONFIG`) responsável pela configuração visual e semântica das categorias de eventos.

Essa abordagem:

* reduz complexidade de código
* facilita manutenção
* permite expansão com custo constante O(1)

---

**Imutabilidade de dados**

A ordenação cronológica dos eventos é realizada sem mutação do array original.

Exemplo:

```
[...events].sort()
```

Isso evita efeitos colaterais durante o ciclo de renderização do React.

---

**Tipagem estática rigorosa**

Foram definidas interfaces específicas para representar as respostas das APIs externas, evitando o uso de tipagens genéricas como `any` e garantindo maior segurança no consumo de dados.

---

# Estratégias de Cache e Consumo de Dados

## Dados Meteorológicos

As requisições meteorológicas utilizam **revalidação estática incremental**:

```
revalidate: 3600
```

Isso permite que o servidor atualize os dados automaticamente a cada hora, reduzindo latência e evitando requisições desnecessárias à API externa.

---

## Alertas Globais

Os dados da API EONET são processados com estratégia:

```
cache: "no-store"
```

Essa decisão garante que eventos naturais sejam sempre exibidos com as informações mais recentes disponíveis.

Antes da entrega ao cliente, os eventos são ordenados cronologicamente no servidor.

---

# Interface e Experiência do Usuário

## Sistema de Tema

A aplicação possui suporte a **modo claro e escuro**, implementado com:

* `next-themes`
* integração com preferências do sistema operacional

Essa abordagem evita inconsistências visuais durante a renderização inicial.

---

## Interface limpa e navegável

A lista de eventos utiliza rolagem vertical com barra de rolagem oculta para manter a interface minimalista.

Indicadores visuais de rolagem foram adicionados através de gradientes animados para melhorar a descoberta de conteúdo.

---

## Validação de formulários

Antes do envio da requisição de busca, o sistema realiza validação nativa do formulário:

```
form.checkValidity()
```

Isso previne estados de carregamento indevidos e melhora a experiência do usuário.

---

## Renderização progressiva com Suspense

A aplicação utiliza **React Suspense** combinado com **Skeleton Screens**.

Isso permite:

* renderização imediata da estrutura da página
* carregamento assíncrono de blocos de dados
* melhoria no *First Contentful Paint (FCP)*

---

# Acessibilidade, Localização e Resiliência

## Localização de dados

Eventos fornecidos originalmente em inglês são traduzidos e classificados semanticamente em português, com cores associadas à severidade do evento.

---

## Transparência de dados

Links para relatórios oficiais das agências monitoras são exibidos diretamente nos cards de eventos, permitindo acesso às fontes originais.

---

## Tratamento de falhas

Requisições externas são protegidas por blocos `try/catch` no servidor.

Caso alguma API externa esteja indisponível, a aplicação continua operando normalmente através de estados de fallback visuais.

---

# Instalação e Execução

## Pré-requisitos

* Node.js 18 ou superior
* chave de API válida da OpenWeather

---

## Clone do repositório

```bash
git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
cd SEU_REPOSITORIO
```

---

## Instalação de dependências

```bash
npm install
```

---

## Configuração do ambiente

Crie um arquivo `.env` na raiz do projeto:

```
NEXT_PUBLIC_OPENWEATHER_API_KEY=SUA_CHAVE
```

---

## Execução do projeto

```bash
npm run dev
```

A aplicação estará disponível em:

```
http://localhost:3000
```

---
