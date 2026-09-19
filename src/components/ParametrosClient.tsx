"use client";

import { useState } from "react";
import type {
  Cidade,
  EstadoConservacao,
  FatorRossHeidecke,
  PadraoConstrutivo,
  ParametroTerreno,
  TipoConstrucao,
} from "@/lib/avaliacao/tipos";

const ABAS = ["Cidades", "Terreno", "CUB (construção)", "Vida útil", "Ross-Heidecke"] as const;
type Aba = (typeof ABAS)[number];

const ESTADOS: EstadoConservacao[] = ["A", "B", "C", "D", "E", "F", "G", "H"];

const DESCRICAO_ESTADOS: Record<EstadoConservacao, string> = {
  A: "Novo",
  B: "Entre novo e regular",
  C: "Regular",
  D: "Entre regular e reparos simples",
  E: "Reparos simples",
  F: "Entre reparos simples e importantes",
  G: "Reparos importantes",
  H: "Entre reparos importantes e sem valor",
};

const FONTES: Record<Aba, string> = {
  Cidades:
    "Índices aplicados sobre os valores-base de Passos/MG conforme critério do avaliador responsável, refletindo o mercado imobiliário de cada município da região.",
  Terreno:
    "Valores-base do m² de terreno para Passos/MG (categoria central/perimetral/periférica × padrão máxima/média/mínima), conforme prompt de avaliação do avaliador responsável.",
  "CUB (construção)":
    "Custo Unitário Básico (CUB/m²) por padrão construtivo, extraído do SINDUSCOM/MG de novembro de 2023, calculado conforme a ABNT NBR 12.721:2006 (novos projetos, memoriais descritivos e critérios de orçamentação).",
  "Vida útil":
    "Vida útil estimada por tipo de construção, conforme Tabela Bureau of Internal Revenue — referência usada para calcular a idade em % da vida útil de cada imóvel.",
  "Ross-Heidecke":
    "Tabela de Ross-Heidecke para depreciação de imóveis: cruza a idade em % da vida útil (arredondada para cima ao próximo número par) com o estado de conservação (A a H) pra obter o fator de depreciação aplicado ao valor da construção.",
};

interface Props {
  cidadesIniciais: Cidade[];
  parametrosTerrenoIniciais: ParametroTerreno[];
  padroesConstrutivosIniciais: PadraoConstrutivo[];
  tiposConstrucaoIniciais: TipoConstrucao[];
  fatoresRossHeideckeIniciais: FatorRossHeidecke[];
}

const moeda = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function ParametrosClient({
  cidadesIniciais,
  parametrosTerrenoIniciais,
  padroesConstrutivosIniciais,
  tiposConstrucaoIniciais,
  fatoresRossHeideckeIniciais,
}: Props) {
  const [aba, setAba] = useState<Aba>("Cidades");

  const idadesUnicas = Array.from(
    new Set(fatoresRossHeideckeIniciais.map((f) => f.idade_pct))
  ).sort((a, b) => a - b);

  return (
    <div>
      <div className="mb-6 flex items-start gap-3 rounded-lg border border-terra/20 bg-terra/5 px-4 py-3">
        <span className="mt-0.5 text-terra">🔒</span>
        <p className="text-sm text-ink/70">
          Estes valores são padronizados e não podem ser alterados pelo avaliador, para manter o mesmo
          critério de análise entre todos os laudos.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-1 rounded-lg bg-ink/5 p-1">
        {ABAS.map((a) => (
          <button
            key={a}
            onClick={() => setAba(a)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              aba === a ? "bg-white shadow-sm" : "text-ink/50"
            }`}
          >
            {a}
          </button>
        ))}
      </div>

      <p className="mb-4 text-xs leading-relaxed text-ink/50">
        <span className="font-medium text-ink/60">Fonte: </span>
        {FONTES[aba]}
      </p>

      {aba === "Cidades" && (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ink/5 text-left text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Município</th>
                <th className="px-4 py-3">Índice sobre Passos/MG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/8">
              {cidadesIniciais.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-2.5">{c.nome}</td>
                  <td className="px-4 py-2.5">{c.indice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {aba === "Terreno" && (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ink/5 text-left text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Padrão</th>
                <th className="px-4 py-3">Valor do m² (Passos/MG)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/8">
              {parametrosTerrenoIniciais.map((p) => (
                <tr key={`${p.categoria}-${p.padrao}`}>
                  <td className="px-4 py-2.5 capitalize">{p.categoria}</td>
                  <td className="px-4 py-2.5 capitalize">{p.padrao}</td>
                  <td className="px-4 py-2.5">{moeda(p.valor_m2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {aba === "CUB (construção)" && (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ink/5 text-left text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Padrão construtivo</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Valor do m² (CUB)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/8">
              {padroesConstrutivosIniciais.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-2.5">{p.nome}</td>
                  <td className="px-4 py-2.5 capitalize">{p.tipo}</td>
                  <td className="px-4 py-2.5">{moeda(p.valor_m2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {aba === "Vida útil" && (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ink/5 text-left text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Tipo de construção</th>
                <th className="px-4 py-3">Vida útil (anos)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/8">
              {tiposConstrucaoIniciais.map((t) => (
                <tr key={t.id}>
                  <td className="px-4 py-2.5">{t.nome}</td>
                  <td className="px-4 py-2.5">{t.vida_util_anos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {aba === "Ross-Heidecke" && (
        <div className="flex flex-col gap-4">
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-ink/5 text-left text-xs uppercase tracking-wide text-ink/50">
                <tr>
                  <th className="px-4 py-2.5">Código</th>
                  <th className="px-4 py-2.5">Estado de conservação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/8">
                {ESTADOS.map((e) => (
                  <tr key={e}>
                    <td className="px-4 py-2 font-medium">{e}</td>
                    <td className="px-4 py-2">{DESCRICAO_ESTADOS[e]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card overflow-x-auto">
          <p className="px-4 pt-4 text-xs text-ink/50">
            Fator de depreciação por % de vida consumida (linhas) × estado de conservação (colunas, ver
            legenda acima).
          </p>
          <table className="w-full text-sm">
            <thead className="bg-ink/5 text-left text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-3 py-3">% vida</th>
                {ESTADOS.map((e) => (
                  <th key={e} className="px-2 py-3 text-center">
                    {e}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/8">
              {idadesUnicas.map((idade) => (
                <tr key={idade}>
                  <td className="px-3 py-1.5 font-medium">{idade}%</td>
                  {ESTADOS.map((estado) => {
                    const fator = fatoresRossHeideckeIniciais.find(
                      (f) => f.idade_pct === idade && f.estado_conservacao === estado
                    );
                    return (
                      <td key={estado} className="px-2 py-1.5 text-center text-xs">
                        {fator ? fator.fator.toFixed(4) : "—"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
