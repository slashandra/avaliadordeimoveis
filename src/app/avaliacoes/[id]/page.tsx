import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NavHeader } from "@/components/NavHeader";
import { AvaliacaoDetalheClient } from "@/components/AvaliacaoDetalheClient";

export default async function AvaliacaoDetalhePage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: avaliacao } = await supabase
    .from("avaliacoes")
    .select("*, cidades(nome), avaliadores(nome, masp)")
    .eq("id", params.id)
    .single();

  if (!avaliacao) notFound();

  const [{ data: padroesConstrutivos }, { data: tiposConstrucao }] = await Promise.all([
    supabase.from("padroes_construtivos").select("*"),
    supabase.from("tipos_construcao").select("*"),
  ]);

  return (
    <>
      <NavHeader />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <AvaliacaoDetalheClient
          avaliacao={avaliacao}
          padroesConstrutivos={padroesConstrutivos ?? []}
          tiposConstrucao={tiposConstrucao ?? []}
        />
      </main>
    </>
  );
}
