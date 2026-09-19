"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Avaliacao {
  id: string;
  tipo: string;
  protocolo: string | null;
  proprietario_nome: string | null;
  endereco: string | null;
  status: string;
  resultado: { valor_total?: number } | null;
  created_at: string;
  cidades: { nome: string } | null;
}

const moeda = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function AvaliacoesListClient({ avaliacoesIniciais }: { avaliacoesIniciais: Avaliacao[] }) {
  const [avaliacoes, setAvaliacoes] = useState(avaliacoesIniciais);
  const [excluindoId, setExcluindoId] = useState<string | null>(null);

  async function excluir(e: React.MouseEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Excluir esta avaliação? Essa ação não pode ser desfeita.")) return;

    setExcluindoId(id);
    const supabase = createClient();
    const { error } = await supabase.from("avaliacoes").delete().eq("id", id);
    setExcluindoId(null);

    if (!error) {
      setAvaliacoes((atual) => atual.filter((a) => a.id !== id));
    } else {
      alert("Não foi possível excluir a avaliação.");
    }
  }

  if (avaliacoes.length === 0) {
    return (
      <div className="card px-6 py-12 text-center text-sm text-ink/50">
        Nenhuma avaliação cadastrada ainda.
      </div>
    );
  }

  return (
    <div className="card divide-y divide-ink/8">
      {avaliacoes.map((a) => (
        <Link
          key={a.id}
          href={`/avaliacoes/${a.id}`}
          className="group flex items-center justify-between px-6 py-4 transition-colors hover:bg-ink/[0.02]"
        >
          <div>
            <div className="mb-1 flex items-center gap-2">
              <p className="font-medium">{a.proprietario_nome ?? "Sem proprietário informado"}</p>
              <span className={`badge ${a.status === "concluida" ? "badge-concluida" : "badge-rascunho"}`}>
                {a.status === "concluida" ? "Concluída" : "Rascunho"}
              </span>
            </div>
            <p className="text-sm text-ink/50">
              {a.tipo === "urbano" ? "Urbano" : "Rural"} · {a.cidades?.nome ?? "—"}
              {a.protocolo ? ` · Protocolo ${a.protocolo}` : ""}
              {a.endereco ? ` · ${a.endereco}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              {a.resultado?.valor_total ? (
                <p className="font-medium text-field">{moeda(Number(a.resultado.valor_total))}</p>
              ) : (
                <p className="text-sm text-ink/30">—</p>
              )}
              <p className="text-xs text-ink/40">{new Date(a.created_at).toLocaleDateString("pt-BR")}</p>
            </div>
            <button
              onClick={(e) => excluir(e, a.id)}
              disabled={excluindoId === a.id}
              title="Excluir avaliação"
              className="rounded-lg px-2 py-1.5 text-ink/30 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 disabled:opacity-50"
            >
              {excluindoId === a.id ? "..." : "✕"}
            </button>
          </div>
        </Link>
      ))}
    </div>
  );
}
