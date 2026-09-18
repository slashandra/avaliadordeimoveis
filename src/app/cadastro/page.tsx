"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function CadastroPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [masp, setMasp] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function criarConta(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { data: { nome, masp } },
    });

    setCarregando(false);

    if (error) {
      setErro(error.message);
      return;
    }

    router.push("/avaliacoes");
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6 py-12">
      <span className="eyebrow mb-2">Avaliador de Imóveis</span>
      <h1 className="mb-1 text-3xl">Criar conta</h1>
      <p className="mb-8 text-sm text-ink/60">Cadastro do avaliador responsável</p>

      <form onSubmit={criarConta} className="flex flex-col gap-4">
        <div>
          <label className="label">Nome completo</label>
          <input required value={nome} onChange={(e) => setNome(e.target.value)} className="input" />
        </div>

        <div>
          <label className="label">MASP / registro profissional (opcional)</label>
          <input value={masp} onChange={(e) => setMasp(e.target.value)} className="input" />
        </div>

        <div>
          <label className="label">E-mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
        </div>

        <div>
          <label className="label">Senha</label>
          <input
            type="password"
            required
            minLength={6}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="input"
          />
        </div>

        {erro && <p className="text-sm text-red-700">{erro}</p>}

        <button type="submit" disabled={carregando} className="btn-primary mt-2">
          {carregando ? "Criando..." : "Criar conta"}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink/60">
        Já tem conta?{" "}
        <Link href="/login" className="font-medium text-field underline">
          Entrar
        </Link>
      </p>
    </main>
  );
}
