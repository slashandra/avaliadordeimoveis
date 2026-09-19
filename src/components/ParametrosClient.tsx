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
        <div className="card overflow-x-auto">
          <p className="px-4 pt-4 text-xs text-ink/50">
            Fator de depreciação por % de vida consumida (linhas) × estado de conservação (colunas).
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
      )}
    </div>
  );
}
