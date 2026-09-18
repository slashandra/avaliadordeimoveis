import { createClient } from "@/lib/supabase/server";
import { NavHeader } from "@/components/NavHeader";
import { NovaAvaliacaoClient } from "@/components/NovaAvaliacaoClient";

export default async function NovaAvaliacaoPage() {
  const supabase = createClient();

  const [{ data: clientes }, { data: cidades }, { data: parametrosTerreno }, { data: padroesConstrutivos }, { data: tiposConstrucao }, { data: fatoresRossHeidecke }] =
    await Promise.all([
      supabase.from("clientes").select("id, nome").order("nome"),
      supabase.from("cidades").select("id, nome, indice").order("nome"),
      supabase.from("parametros_terreno").select("*"),
      supabase.from("padroes_construtivos").select("*").order("nome"),
      supabase.from("tipos_construcao").select("*").order("nome"),
      supabase.from("ross_heidecke_fatores").select("*"),
    ]);

  return (
    <>
      <NavHeader />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="mb-1 text-3xl">Nova avaliação</h1>
        <p className="mb-8 text-sm text-ink/60">Método Evolutivo — terreno + construção depreciada</p>

        <NovaAvaliacaoClient
          clientes={clientes ?? []}
          cidades={cidades ?? []}
          parametrosTerreno={parametrosTerreno ?? []}
          padroesConstrutivos={padroesConstrutivos ?? []}
          tiposConstrucao={tiposConstrucao ?? []}
          fatoresRossHeidecke={fatoresRossHeidecke ?? []}
        />
      </main>
    </>
  );
}
