# Avaliador de Imóveis

App para avaliadores/corretores/engenheiros gerarem laudos de avaliação de imóveis urbanos (e, futuramente, rurais) pelo **Método Evolutivo**: valor do terreno (comparação a valores-padrão de mercado por região) somado ao valor da construção pelo Custo Unitário Básico (CUB/m², SINDUSCOM-MG, NBR 12.721:2006), depreciado pela **tabela de Ross-Heidecke** conforme idade e estado de conservação.

**Stack:** Next.js 14 (App Router) + Supabase (banco/auth) + jsPDF (geração do laudo).

## Rodando localmente

```
npm install
cp .env.local.example .env.local   # preencher as chaves do Supabase
npm run dev
```

## Configuração necessária

1. **Supabase** — `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` em Project Settings → API.
   Rodar a migration em `supabase/migrations/0001_init.sql` (`supabase db push` ou colar no SQL editor).
   Ela já cria o schema e popula as tabelas de referência com os valores do prompt de avaliação
   (terreno padrão de Passos/MG, índices por cidade, CUB por padrão construtivo, vida útil por tipo
   de construção e a tabela completa de Ross-Heidecke).

## Estrutura

- `src/app/login`, `src/app/cadastro` — autenticação do avaliador
- `src/app/clientes` — cadastro de clientes/proprietários
- `src/app/avaliacoes` — lista, nova avaliação (formulário urbano/rural) e detalhe com geração de laudo em PDF
- `src/app/parametros` — tabelas de referência editáveis (cidades, valores de terreno, CUB, vida útil, Ross-Heidecke)
- `src/lib/avaliacao/calculo.ts` — lógica pura do Método Evolutivo (terreno + construção depreciada)
- `src/lib/pdf/laudo.ts` — geração do laudo em PDF (jsPDF)
- `supabase/migrations/0001_init.sql` — schema, RLS e seed das tabelas de referência

## Metodologia (imóvel urbano)

1. **Terreno**: área × valor-base do m² (categoria central/perimetral/periférica × padrão máxima/média/mínima, referência Passos/MG) × índice da cidade.
2. **Construção**: área × CUB do padrão construtivo escolhido, depreciado pelo fator de Ross-Heidecke — obtido cruzando a **idade em % da vida útil** (arredondada para cima ao próximo número par) com o **estado de conservação** (A a H).
3. **Valor total** = valor do terreno + valor da construção depreciada.

Todas as tabelas de referência acima são editáveis em `/parametros`, sem precisar alterar código, para acompanhar atualizações do SINDUSCOM ou de mercado.

**Imóvel rural**: cadastro básico disponível (área em hectares + observações), como rascunho — metodologia de cálculo (terra nua + benfeitorias) a definir.

**Avaliador de referência do prompt original:** Gustavo de Pádua Andrade Pereira / MASP 669.819-5.
