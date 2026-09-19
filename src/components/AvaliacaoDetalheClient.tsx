"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { gerarLaudoPdf } from "@/lib/pdf/laudo";
import { createClient } from "@/lib/supabase/client";
import type { PadraoConstrutivo, TipoConstrucao } from "@/lib/avaliacao/tipos";

const moeda = (n: number) =>
  Number(n ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface Props {
  avaliacao: any;
  padroesConstrutivos: PadraoConstrutivo[];
  tiposConstrucao: TipoConstrucao[];
}

async function fotoParaBase64(url: string): Promise<string | null> {
  try {
    const resposta = await fetch(url);
    const blob = await resposta.blob();
    return await new Promise((resolve) => {
      const leitor = new FileReader();
      leitor.onloadend = () => resolve(leitor.result as string);
      leitor.onerror = () => resolve(null);
      leitor.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export function AvaliacaoDetalheClient({ avaliacao, padroesConstrutivos, tiposConstrucao }: Props) {
  const router = useRouter();
  const [excluindo, setExcluindo] = useState(false);
  const resultado = avaliacao.resultado ?? {};
  const dados = avaliacao.dados ?? {};

  async function excluirAvaliacao() {
    if (!confirm("Excluir esta avaliação? Essa ação não pode ser desfeita.")) return;
    setExcluindo(true);
    const supabase = createClient();
    const { error } = await supabase.from("avaliacoes").delete().eq("id", avaliacao.id);
    setExcluindo(false);

    if (error) {
      alert("Não foi possível excluir a avaliação.");
      return;
    }

    router.push("/avaliacoes");
    router.refresh();
  }

  async function baixarPdf() {
    const padrao = padroesConstrutivos.find((p) => p.id === dados.construcao?.padrao_construtivo_id);
    const tipo = tiposConstrucao.find((t) => t.id === dados.construcao?.tipo_construcao_id);
    const fotoBase64 = avaliacao.foto_url ? await fotoParaBase64(avaliacao.foto_url) : null;

    const doc = gerarLaudoPdf({
      avaliadorNome: avaliacao.avaliadores?.nome ?? "—",
      avaliadorMasp: avaliacao.avaliadores?.masp ?? null,
      protocolo: avaliacao.protocolo ?? null,
      proprietarioNome: avaliacao.proprietario_nome ?? null,
      cidadeNome: avaliacao.cidades?.nome ?? "—",
      endereco: avaliacao.endereco,
      dataAvaliacao: new Date(avaliacao.created_at).toLocaleDateString("pt-BR"),
      fotoBase64,
      terreno: dados.terreno,
      construcao: dados.construcao
        ? {
            area_m2: dados.construcao.area_m2,
            padraoNome: padrao?.nome ?? "—",
            tipoNome: tipo?.nome ?? "—",
            idade_anos: dados.construcao.idade_anos,
            estado_conservacao: dados.construcao.estado_conservacao,
          }
        : null,
      resultado,
    });

    doc.save(`laudo-avaliacao-${avaliacao.id.slice(0, 8)}.pdf`);
  }

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <h1 className="text-3xl">{avaliacao.proprietario_nome ?? "Sem proprietário informado"}</h1>
            <span
              className={`badge ${avaliacao.status === "concluida" ? "badge-concluida" : "badge-rascunho"}`}
            >
              {avaliacao.status === "concluida" ? "Concluída" : "Rascunho"}
            </span>
          </div>
          <p className="text-sm text-ink/60">
            {avaliacao.tipo === "urbano" ? "Imóvel urbano" : "Imóvel rural"} · {avaliacao.cidades?.nome}
            {avaliacao.protocolo ? ` · Protocolo ${avaliacao.protocolo}` : ""}
            {avaliacao.endereco ? ` · ${avaliacao.endereco}` : ""}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {avaliacao.tipo === "urbano" && resultado.valor_total ? (
            <button onClick={baixarPdf} className="btn-primary">
              Baixar laudo (PDF)
            </button>
          ) : null}
          <button
            onClick={excluirAvaliacao}
            disabled={excluindo}
            className="rounded-lg px-3 py-2 text-sm font-medium text-ink/40 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
          >
            {excluindo ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>

      {avaliacao.foto_url && (
        <div className="card mb-6 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avaliacao.foto_url}
            alt="Foto do imóvel avaliado"
            className="max-h-80 w-full object-cover"
          />
        </div>
      )}

      {avaliacao.tipo === "urbano" && resultado.valor_total ? (
        <div className="flex flex-col gap-6">
          <div className="card p-6">
            <h2 className="mb-4 text-lg">Terreno</h2>
            <dl className="grid grid-cols-2 gap-y-2 text-sm sm:grid-cols-4">
              <dt className="text-ink/50">Área</dt>
              <dd>{dados.terreno?.area_m2} m²</dd>
              <dt className="text-ink/50">Categoria / padrão</dt>
              <dd className="capitalize">
                {dados.terreno?.categoria} / {dados.terreno?.padrao}
              </dd>
              <dt className="text-ink/50">Valor-base × índice</dt>
              <dd>
                {moeda(resultado.valor_m2_terreno_base)} × {resultado.indice_cidade}
              </dd>
              <dt className="text-ink/50">Valor do terreno</dt>
              <dd className="font-medium text-field">{moeda(resultado.valor_terreno)}</dd>
            </dl>
          </div>

          {dados.construcao && (
            <div className="card p-6">
              <h2 className="mb-4 text-lg">Construção</h2>
              <dl className="grid grid-cols-2 gap-y-2 text-sm sm:grid-cols-4">
                <dt className="text-ink/50">Área construída</dt>
                <dd>{dados.construcao.area_m2} m²</dd>
                <dt className="text-ink/50">Idade</dt>
                <dd>{dados.construcao.idade_anos} anos</dd>
                <dt className="text-ink/50">Valor bruto</dt>
                <dd>{moeda(resultado.valor_construcao_bruto)}</dd>
                <dt className="text-ink/50">Estado de conservação</dt>
                <dd>{dados.construcao.estado_conservacao}</dd>
                <dt className="text-ink/50">% vida consumida</dt>
                <dd>
                  {resultado.idade_pct_calculada}% → {resultado.idade_pct_arredondada}%
                </dd>
                <dt className="text-ink/50">Fator Ross-Heidecke</dt>
                <dd>{Number(resultado.fator_depreciacao).toFixed(4)}</dd>
                <dt className="text-ink/50">Valor depreciado</dt>
                <dd className="font-medium text-field">
                  {moeda(resultado.valor_construcao_depreciado)}
                </dd>
              </dl>
            </div>
          )}

          <div className="card border-field/20 bg-field/5 p-6">
            <p className="eyebrow mb-2">Valor total estimado</p>
            <p className="text-3xl font-medium text-field">{moeda(resultado.valor_total)}</p>
          </div>
        </div>
      ) : (
        <div className="card p-6 text-sm text-ink/60">
          <p>
            {avaliacao.tipo === "rural"
              ? "Avaliação rural registrada como rascunho — cálculo automático ainda não disponível."
              : "Avaliação incompleta — faltam dados para o cálculo."}
          </p>
          {avaliacao.dados?.area_m2 && (
            <p className="mt-2">Área informada: {avaliacao.dados.area_m2} ha</p>
          )}
          {avaliacao.dados?.observacoes && (
            <p className="mt-2">Observações: {avaliacao.dados.observacoes}</p>
          )}
        </div>
      )}
    </div>
  );
}
