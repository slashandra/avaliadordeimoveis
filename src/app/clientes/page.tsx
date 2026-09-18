import { createClient } from "@/lib/supabase/server";
import { NavHeader } from "@/components/NavHeader";
import { ClientesClient } from "@/components/ClientesClient";

export default async function ClientesPage() {
  const supabase = createClient();
  const { data: clientes } = await supabase
    .from("clientes")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <NavHeader />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="mb-1 text-3xl">Clientes</h1>
        <p className="mb-8 text-sm text-ink/60">Proprietários e solicitantes das avaliações</p>
        <ClientesClient clientesIniciais={clientes ?? []} />
      </main>
    </>
  );
}
