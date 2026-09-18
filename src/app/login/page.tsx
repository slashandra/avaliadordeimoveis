"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });

    setCarregando(false);

    if (error) {
      setErro("E-mail ou senha inválidos.");
      return;
    }

    router.push("/avaliacoes");
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6 py-12">
      <span className="eyebrow mb-2">Avaliador de Imóveis</span>
      <h1 className="mb-1 text-3xl">Entrar</h1>
      <p className="mb-8 text-sm text-ink/60">Acesse sua conta de avaliador</p>

      <form onSubmit={entrar} className="flex flex-col gap-4">
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
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="input"
          />
        </div>

        {erro && <p className="text-sm text-red-700">{erro}</p>}

        <button type="submit" disabled={carregando} className="btn-primary mt-2">
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink/60">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="font-medium text-field underline">
          Criar conta
        </Link>
      </p>
    </main>
  );
}
