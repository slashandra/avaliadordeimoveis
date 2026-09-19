import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { NavHeader } from "@/components/NavHeader";

export default async function AvaliacoesPage() {
  const supabase = createClient();
  const { data: avaliacoes } = await supabase
    .from("avaliacoes")
    .select("id, tipo, protocolo, proprietario_nome, endereco, status, resultado, created_at, cidades(nome)")
    .order("created_at", { ascending: false });

  return (
    <>
      <NavHeader />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-1 text-3xl">Avaliações</h1>
            <p className="text-sm text-ink/60">Laudos em andamento e concluídos</p>
          </div>
          <Link href="/avaliacoes/nova" className="btn-primary">
            + Nova avaliação
          </Link>
        </div>

        {!avaliacoes || avaliacoes.length === 0 ? (
          <div className="card px-6 py-12 text-center text-sm text-ink/50">
            Nenhuma avaliação cadastrada ainda.
          </div>
        ) : (
          <div className="card divide-y divide-ink/8">
            {avaliacoes.map((a: any) => (
              <Link
                key={a.id}
                href={`/avaliacoes/${a.id}`}
                className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-ink/[0.02]"
              >
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <p className="font-medium">{a.proprietario_nome ?? "Sem proprietário informado"}</p>
                    <span
                      className={`badge ${a.status === "concluida" ? "badge-concluida" : "badge-rascunho"}`}
                    >
                      {a.status === "concluida" ? "Concluída" : "Rascunho"}
                    </span>
                  </div>
                  <p className="text-sm text-ink/50">
                    {a.tipo === "urbano" ? "Urbano" : "Rural"} · {a.cidades?.nome ?? "—"}
                    {a.protocolo ? ` · Protocolo ${a.protocolo}` : ""}
                    {a.endereco ? ` · ${a.endereco}` : ""}
                  </p>
                </div>
                <div className="text-right">
                  {a.resultado?.valor_total ? (
                    <p className="font-medium text-field">
                      {Number(a.resultado.valor_total).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                  ) : (
                    <p className="text-sm text-ink/30">—</p>
                  )}
                  <p className="text-xs text-ink/40">
                    {new Date(a.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
