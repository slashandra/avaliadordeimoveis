"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const LINKS = [
  { href: "/avaliacoes", label: "Avaliações" },
  { href: "/parametros", label: "Parâmetros" },
  { href: "/manual", label: "Manual do usuário" },
];

export function NavHeader() {
  const pathname = usePathname();
  const router = useRouter();

  async function sair() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-10 border-b border-ink/8 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/avaliacoes" className="eyebrow">
          Avaliador de Imóveis
        </Link>
        <nav className="flex items-center gap-1">
          {LINKS.map((link) => {
            const ativo = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                target={link.href === "/manual" ? "_blank" : undefined}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  ativo ? "bg-field text-white" : "text-ink/70 hover:bg-ink/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <button
            onClick={sair}
            className="ml-1 rounded-lg px-3 py-1.5 text-sm font-medium text-ink/50 hover:bg-ink/5"
          >
            Sair
          </button>
        </nav>
      </div>
    </header>
  );
}
