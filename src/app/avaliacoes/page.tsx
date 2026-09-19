import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { NavHeader } from "@/components/NavHeader";
import { AvaliacoesListClient } from "@/components/AvaliacoesListClient";

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

        <AvaliacoesListClient avaliacoesIniciais={(avaliacoes as any) ?? []} />
      </main>
    </>
  );
}
