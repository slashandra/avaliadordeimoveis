import { jsPDF } from "jspdf";
import type { ResultadoAvaliacaoUrbana } from "../avaliacao/tipos";

const moeda = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export interface DadosLaudo {
  avaliadorNome: string;
  avaliadorMasp: string | null;
  clienteNome: string | null;
  cidadeNome: string;
  endereco: string | null;
  dataAvaliacao: string;
  terreno: {
    area_m2: number;
    categoria: string;
    padrao: string;
  };
  construcao: {
    area_m2: number;
    padraoNome: string;
    tipoNome: string;
    idade_anos: number;
    estado_conservacao: string;
  } | null;
  resultado: ResultadoAvaliacaoUrbana;
}

export function gerarLaudoPdf(dados: DadosLaudo): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const margem = 20;
  let y = margem;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Laudo de Avaliação Imobiliária", margem, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(90);
  doc.text("Método Evolutivo (terreno + construção depreciada)", margem, y);
  doc.setTextColor(0);
  y += 12;

  doc.setDrawColor(200);
  doc.line(margem, y, 210 - margem, y);
  y += 8;

  const linha = (rotulo: string, valor: string) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(rotulo, margem, y);
    doc.setFont("helvetica", "normal");
    doc.text(valor, margem + 55, y);
    y += 6;
  };

  linha("Data da avaliação:", dados.dataAvaliacao);
  linha("Cliente:", dados.clienteNome ?? "—");
  linha("Município:", dados.cidadeNome);
  linha("Endereço:", dados.endereco ?? "—");
  y += 6;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("1. Avaliação do terreno", margem, y);
  y += 7;

  linha("Área do terreno:", `${dados.terreno.area_m2.toLocaleString("pt-BR")} m²`);
  linha("Categoria:", capitalizar(dados.terreno.categoria));
  linha("Padrão:", capitalizar(dados.terreno.padrao));
  linha(
    "Valor-base do m²:",
    `${moeda(dados.resultado.valor_m2_terreno_base)} × índice ${dados.resultado.indice_cidade}`
  );
  linha("Valor do terreno:", moeda(dados.resultado.valor_terreno));
  y += 6;

  if (dados.construcao) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("2. Avaliação da construção", margem, y);
    y += 7;

    linha("Área construída:", `${dados.construcao.area_m2.toLocaleString("pt-BR")} m²`);
    linha("Padrão construtivo:", dados.construcao.padraoNome);
    linha("Tipo de construção:", dados.construcao.tipoNome);
    linha("Idade:", `${dados.construcao.idade_anos} anos`);
    linha(
      "Estado de conservação:",
      `${dados.construcao.estado_conservacao} — ${descricaoEstado(dados.construcao.estado_conservacao)}`
    );
    linha("Valor de reprodução (bruto):", moeda(dados.resultado.valor_construcao_bruto));
    linha(
      "Idade em % da vida útil:",
      `${dados.resultado.idade_pct_calculada}% (arredondado para ${dados.resultado.idade_pct_arredondada}%)`
    );
    linha("Fator de depreciação (Ross-Heidecke):", dados.resultado.fator_depreciacao.toFixed(4));
    linha("Valor depreciado da construção:", moeda(dados.resultado.valor_construcao_depreciado));
    y += 6;
  }

  doc.setDrawColor(200);
  doc.line(margem, y, 210 - margem, y);
  y += 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Valor total estimado do imóvel:", margem, y);
  y += 8;
  doc.setFontSize(18);
  doc.text(moeda(dados.resultado.valor_total), margem, y);
  y += 16;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(90);
  doc.text(
    doc.splitTextToSize(
      "Avaliação elaborada pelo Método Evolutivo, com valor do terreno obtido por comparação " +
        "a valores-padrão de mercado da região e valor da construção obtido pelo Custo Unitário " +
        "Básico (CUB/m², SINDUSCOM-MG, conforme NBR 12.721:2006), depreciado pela tabela de " +
        "Ross-Heidecke em função da idade e do estado de conservação.",
      210 - margem * 2
    ),
    margem,
    y
  );
  y += 20;

  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(dados.avaliadorNome, margem, y);
  if (dados.avaliadorMasp) {
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.text(`MASP ${dados.avaliadorMasp}`, margem, y);
  }
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.text("Avaliador responsável", margem, y);

  return doc;
}

function capitalizar(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function descricaoEstado(codigo: string): string {
  const mapa: Record<string, string> = {
    A: "Novo",
    B: "Entre novo e regular",
    C: "Regular",
    D: "Entre regular e reparos simples",
    E: "Reparos simples",
    F: "Entre reparos simples e importantes",
    G: "Reparos importantes",
    H: "Entre reparos importantes e sem valor",
  };
  return mapa[codigo] ?? "";
}
