"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CSS_MANUAL } from "./estilos";
import { HTML_MANUAL } from "./conteudo";

export default function ManualPage() {
  useEffect(() => {
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(".toc-link"));
    const sections = links
      .map((l) => document.querySelector<HTMLElement>(l.getAttribute("href") ?? ""))
      .filter((s): s is HTMLElement => !!s);

    function onScroll() {
      const pos = window.scrollY + 120;
      let current = sections[0];
      sections.forEach((s) => {
        if (s.offsetTop <= pos) current = s;
      });
      links.forEach((l) => {
        l.classList.toggle("active", !!current && l.getAttribute("href") === `#${current.id}`);
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const mobileNav = document.getElementById("mobileNav") as HTMLSelectElement | null;
    function onMobileNavChange() {
      if (!mobileNav) return;
      const el = document.querySelector(mobileNav.value);
      el?.scrollIntoView({ behavior: "smooth" });
    }
    mobileNav?.addEventListener("change", onMobileNavChange);

    return () => {
      window.removeEventListener("scroll", onScroll);
      mobileNav?.removeEventListener("change", onMobileNavChange);
    };
  }, []);

  return (
    <div className="manual-root">
      <style dangerouslySetInnerHTML={{ __html: CSS_MANUAL }} />
      <Link
        href="/avaliacoes"
        className="fixed left-4 top-4 z-20 rounded-lg bg-ink/80 px-3 py-1.5 text-xs font-medium text-paper backdrop-blur hover:bg-ink"
      >
        ← Voltar ao app
      </Link>
      <div dangerouslySetInnerHTML={{ __html: HTML_MANUAL }} />
    </div>
  );
}
