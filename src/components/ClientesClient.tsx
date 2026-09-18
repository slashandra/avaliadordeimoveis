"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Cliente {
  id: string;
  nome: string;
  documento: string | null;
  telefone: string | null;
  email: string | null;
}

export function ClientesClient({ clientesIniciais }: { clientesIniciais: Cliente[] }) {
  const [clientes, setClientes] = useState(clientesIniciais);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nome, setNome] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("clientes")
      .insert({
        avaliador_id: user.id,
        nome,
        documento: documento || null,
        telefone: telefone || null,
        email: email || null,
      })
      .select()
      .single();

    setSalvando(false);
    if (!error && data) {
      setClientes([data, ...clientes]);
      setNome("");
      setDocumento("");
      setTelefone("");
      setEmail("");
      setMostrarForm(false);
    }
  }

  async function remover(id: string) {
    if (!confirm("Remover este cliente?")) return;
    const supabase = createClient();
    await supabase.from("clientes").delete().eq("id", id);
    setClientes(clientes.filter((c) => c.id !== id));
  }

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <button onClick={() => setMostrarForm((v) => !v)} className="btn-primary">
          {mostrarForm ? "Cancelar" : "+ Novo cliente"}
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={salvar} className="card mb-8 grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
          <div>
            <label className="label">Nome</label>
            <input required value={nome} onChange={(e) => setNome(e.target.value)} className="input" />
          </div>
          <div>
            <label className="label">CPF / CNPJ</label>
            <input value={documento} onChange={(e) => setDocumento(e.target.value)} className="input" />
          </div>
          <div>
            <label className="label">Telefone</label>
            <input value={telefone} onChange={(e) => setTelefone(e.target.value)} className="input" />
          </div>
          <div>
            <label className="label">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" disabled={salvando} className="btn-primary">
              {salvando ? "Salvando..." : "Salvar cliente"}
            </button>
          </div>
        </form>
      )}

      {clientes.length === 0 ? (
        <p className="text-sm text-ink/50">Nenhum cliente cadastrado ainda.</p>
      ) : (
        <div className="card divide-y divide-ink/8">
          {clientes.map((c) => (
            <div key={c.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="font-medium">{c.nome}</p>
                <p className="text-sm text-ink/50">
                  {[c.documento, c.telefone, c.email].filter(Boolean).join(" · ") || "—"}
                </p>
              </div>
              <button
                onClick={() => remover(c.id)}
                className="text-sm text-ink/40 hover:text-red-600"
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
