# Avaliador de Imóveis — contexto do projeto

App de laudos de avaliação de imóveis urbanos (Método Evolutivo), separado do
`despertar-ppm` — **nunca misturar os dois repositórios ou bancos**.

## Infraestrutura

- **Repo:** github.com/slashandra/avaliadordeimoveis (branch `main`)
- **Deploy:** Vercel, projeto `avaliadordeimoveis` na conta `slashandra-5955`
  (Hobby). Domínio de produção: https://avaliadordeimoveis.vercel.app
  Deploy automático a cada push em `main` (GitHub App do Vercel instalado).
- **Banco:** Supabase, projeto "O Gestor Avaliador"
  - Project ID/ref: `idbrkylgkojkbekamidr` (repare no **L**, não confundir
    com "idbrkyg..." — já rolou engano de digitação nisso)
  - URL: `https://idbrkylgkojkbekamidr.supabase.co`
  - Migrations em `supabase/migrations/` — rodar manualmente no SQL Editor
    do Supabase (colar o conteúdo do arquivo e Run); não há CLI/CI
    automatizando isso ainda.
  - `0001_init.sql`: schema inicial completo + seed das tabelas de
    referência do Método Evolutivo (Passos/MG).
  - `0002_ajustes.sql`: protocolo ITCD, foto do imóvel (+ bucket de storage
    `fotos-imoveis`), e trava as tabelas de parâmetros (RLS só permite
    select pros avaliadores — edição só via SQL editor).

## O que é o app

Avaliadores/corretores/engenheiros fazem login, cadastram uma avaliação de
imóvel urbano com terreno + construção, o app calcula o valor pelo **Método
Evolutivo**: valor do terreno (área × valor-base por categoria/padrão ×
índice da cidade) + valor da construção (CUB/m² × depreciação Ross-Heidecke).
Gera laudo em PDF (uma folha, `src/lib/pdf/laudo.ts`). Tem protocolo de ITCD
e foto opcional do imóvel. Não tem mais tela de "Clientes" (removida por
falta de uso) — proprietário é um campo livre na própria avaliação.

Rural ainda não tem cálculo, só cadastro básico como rascunho — metodologia
a definir com o usuário depois.

Parâmetros de referência (`/parametros`) ficam **visíveis mas travados** —
não editáveis pelo avaliador via app, de propósito, pra manter padrão de
análise igual pra todos.

## Armadilhas já enfrentadas (não repetir)

- Nunca decodificar/transcrever a chave JWT ou o project ref manualmente à
  mão — dá erro de digitação fácil (já aconteceu 2x: "g" vs "l", e chave
  truncada ao copiar do chat). Sempre pegar URL/chaves direto do painel do
  Supabase (Settings → API Keys / General) ou por arquivo de texto puro.
- Variáveis `NEXT_PUBLIC_*` no Vercel precisam ser tipo **Config**, não
  **Secret** (Secret dá erro "cannot use visibility: secret").
- Deploys disparados via API/MCP (`create_git_project` com `deploy:true`)
  já travaram em "Initializing" por muito tempo (fila presa) — quando isso
  acontecer, cancelar os deployments antigos/travados na aba Deployments do
  Vercel e disparar de novo (ou fazer um commit no GitHub, que aciona o
  webhook normal).
- Depois de editar env vars no Vercel, sempre precisa de um **Redeploy**
  manual (ou novo push) — não aplica sozinho nos deployments já prontos.

## Stack

Next.js 14 (App Router) + Supabase (auth/banco/storage) + jsPDF, Tailwind.
Mesma base de código do despertar-ppm, mas projeto/repo/banco totalmente
separados.
