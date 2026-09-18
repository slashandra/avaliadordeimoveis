"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
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

export function ParametrosClient({
  cidadesIniciais,
  parametrosTerrenoIniciais,
  padroesConstrutivosIniciais,
  tiposConstrucaoIniciais,
  fatoresRossHeideckeIniciais,
}: Props) {
  const [aba, setAba] = useState<Aba>("Cidades");
  const [cidades, setCidades] = useState(cidadesIniciais);
  const [parametrosTerreno, setParametrosTerreno] = useState(parametrosTerrenoIniciais);
  const [padroesConstrutivos, setPadroesConstrutivos] = useState(padroesConstrutivosIniciais);
  const [tiposConstrucao, setTiposConstrucao] = useState(tiposConstrucaoIniciais);
  const [fatoresRossHeidecke, setFatoresRossHeidecke] = useState(fatoresRossHeideckeIniciais);
  const [novaCidadeNome, setNovaCidadeNome] = useState("");
  const [novaCidadeIndice, setNovaCidadeIndice] = useState("1.0");
  const [salvo, setSalvo] = useState<string | null>(null);

  const supabase = createClient();

  function mostrarSalvo() {
    setSalvo("Salvo");
    setTimeout(() => setSalvo(null), 1200);
  }

  async function atualizarCidade(id: string, indice: number) {
    setCidades(cidades.map((c) => (c.id === id ? { ...c, indice } : c)));
    await supabase.from("cidades").update({ indice }).eq("id", id);
    mostrarSalvo();
  }

  async function criarCidade() {
    if (!novaCidadeNome.trim()) return;
    const { data } = await supabase
      .from("cidades")
      .insert({ nome: novaCidadeNome, indice: Number(novaCidadeIndice) })
      .select()
      .single();
    if (data) {
      setCidades([...cidades, data].sort((a, b) => a.nome.localeCompare(b.nome)));
      setNovaCidadeNome("");
      setNovaCidadeIndice("1.0");
    }
  }

  async function atualizarTerreno(categoria: string, padrao: string, valor_m2: number) {
    setParametrosTerreno(
      parametrosTerreno.map((p) =>
        p.categoria === categoria && p.padrao === padrao ? { ...p, valor_m2 } : p
      )
    );
    await supabase.from("parametros_terreno").update({ valor_m2 }).match({ categoria, padrao });
    mostrarSalvo();
  }

  async function atualizarPadraoConstrutivo(id: string, valor_m2: number) {
    setPadroesConstrutivos(padroesConstrutivos.map((p) => (p.id === id ? { ...p, valor_m2 } : p)));
    await supabase.from("padroes_construtivos").update({ valor_m2 }).eq("id", id);
    mostrarSalvo();
  }

  async function atualizarVidaUtil(id: string, vida_util_anos: number) {
    setTiposConstrucao(
      tiposConstrucao.map((t) => (t.id === id ? { ...t, vida_util_anos } : t))
    );
    await supabase.from("tipos_construcao").update({ vida_util_anos }).eq("id", id);
    mostrarSalvo();
  }

  async function atualizarFator(idade_pct: number, estado_conservacao: string, fator: number) {
    setFatoresRossHeidecke(
      fatoresRossHeidecke.map((f) =>
        f.idade_pct === idade_pct && f.estado_conservacao === estado_conservacao
          ? { ...f, fator }
          : f
      )
    );
    await supabase
      .from("ross_heidecke_fatores")
      .update({ fator })
      .match({ idade_pct, estado_conservacao });
    mostrarSalvo();
  }

  const idadesUnicas = Array.from(new Set(fatoresRossHeidecke.map((f) => f.idade_pct))).sort(
    (a, b) => a - b
  );

  return (
    <div>
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
        {salvo && <span className="ml-auto pr-2 text-xs text-field">{salvo}</span>}
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
              {cidades.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-2">{c.nome}</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      step="0.01"
                      defaultValue={c.indice}
                      onBlur={(e) => atualizarCidade(c.id, Number(e.target.value))}
                      className="input w-24"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex flex-wrap items-end gap-3 border-t border-ink/8 px-4 py-4">
            <div>
              <label className="label">Novo município</label>
              <input
                value={novaCidadeNome}
                onChange={(e) => setNovaCidadeNome(e.target.value)}
                className="input w-56"
              />
            </div>
            <div>
              <label className="label">Índice</label>
              <input
                type="number"
                step="0.01"
                value={novaCidadeIndice}
                onChange={(e) => setNovaCidadeIndice(e.target.value)}
                className="input w-24"
              />
            </div>
            <button onClick={criarCidade} className="btn-secondary">
              + Adicionar
            </button>
          </div>
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
              {parametrosTerreno.map((p) => (
                <tr key={`${p.categoria}-${p.padrao}`}>
                  <td className="px-4 py-2 capitalize">{p.categoria}</td>
                  <td className="px-4 py-2 capitalize">{p.padrao}</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      step="0.01"
                      defaultValue={p.valor_m2}
                      onBlur={(e) => atualizarTerreno(p.categoria, p.padrao, Number(e.target.value))}
                      className="input w-32"
                    />
                  </td>
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
              {padroesConstrutivos.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-2">{p.nome}</td>
                  <td className="px-4 py-2 capitalize">{p.tipo}</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      step="0.01"
                      defaultValue={p.valor_m2}
                      onBlur={(e) => atualizarPadraoConstrutivo(p.id, Number(e.target.value))}
                      className="input w-32"
                    />
                  </td>
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
              {tiposConstrucao.map((t) => (
                <tr key={t.id}>
                  <td className="px-4 py-2">{t.nome}</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      defaultValue={t.vida_util_anos}
                      onBlur={(e) => atualizarVidaUtil(t.id, Number(e.target.value))}
                      className="input w-24"
                    />
                  </td>
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
                  <td className="px-3 py-1 font-medium">{idade}%</td>
                  {ESTADOS.map((estado) => {
                    const fator = fatoresRossHeidecke.find(
                      (f) => f.idade_pct === idade && f.estado_conservacao === estado
                    );
                    return (
                      <td key={estado} className="px-1 py-1">
                        <input
                          type="number"
                          step="0.0001"
                          defaultValue={fator?.fator ?? 0}
                          onBlur={(e) => atualizarFator(idade, estado, Number(e.target.value))}
                          className="input w-20 px-1.5 py-1 text-center text-xs"
                        />
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
