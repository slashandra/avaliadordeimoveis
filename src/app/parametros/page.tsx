import { createClient } from "@/lib/supabase/server";
import { NavHeader } from "@/components/NavHeader";
import { ParametrosClient } from "@/components/ParametrosClient";

export default async function ParametrosPage() {
  const supabase = createClient();

  const [{ data: cidades }, { data: parametrosTerreno }, { data: padroesConstrutivos }, { data: tiposConstrucao }, { data: fatoresRossHeidecke }] =
    await Promise.all([
      supabase.from("cidades").select("*").order("nome"),
      supabase.from("parametros_terreno").select("*"),
      supabase.from("padroes_construtivos").select("*").order("nome"),
      supabase.from("tipos_construcao").select("*").order("nome"),
      supabase.from("ross_heidecke_fatores").select("*").order("idade_pct"),
    ]);

  return (
    <>
      <NavHeader />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="mb-1 text-3xl">Parâmetros</h1>
        <p className="mb-8 text-sm text-ink/60">
          Tabelas de referência do Método Evolutivo — atualize quando os valores do SINDUSCOM ou de
          mercado mudarem.
        </p>
        <ParametrosClient
          cidadesIniciais={cidades ?? []}
          parametrosTerrenoIniciais={parametrosTerreno ?? []}
          padroesConstrutivosIniciais={padroesConstrutivos ?? []}
          tiposConstrucaoIniciais={tiposConstrucao ?? []}
          fatoresRossHeideckeIniciais={fatoresRossHeidecke ?? []}
        />
      </main>
    </>
  );
}
