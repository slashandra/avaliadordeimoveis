import { jsPDF } from "jspdf";
import type { ResultadoAvaliacaoUrbana } from "../avaliacao/tipos";

const moeda = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const MARGEM = 16;
const LARGURA_PAGINA = 210;
const LARGURA_UTIL = LARGURA_PAGINA - MARGEM * 2;
const ALTURA_PAGINA = 297;
const RODAPE_Y = ALTURA_PAGINA - 12;

export interface DadosLaudo {
  avaliadorNome: string;
  avaliadorMasp: string | null;
  protocolo: string | null;
  proprietarioNome: string | null;
  cidadeNome: string;
  endereco: string | null;
  dataAvaliacao: string;
  fotoBase64: string | null;
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

class Redator {
  doc: jsPDF;
  y: number = MARGEM;

  constructor(doc: jsPDF) {
    this.doc = doc;
  }

  espaco(altura: number) {
    if (this.y + altura > RODAPE_Y) {
      this.doc.addPage();
      this.y = MARGEM;
    }
    this.y += altura;
  }

  titulo(texto: string, tamanho = 13) {
    this.espaco(tamanho / 2.2);
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(tamanho);
    this.doc.setTextColor(26, 29, 28);
    this.doc.text(texto, MARGEM, this.y);
    this.espaco(tamanho / 3.5);
  }

  subtitulo(texto: string) {
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(90, 90, 90);
    this.doc.text(texto, MARGEM, this.y);
    this.espaco(6.5);
  }

  secao(texto: string) {
    this.espaco(6);
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(10.5);
    this.doc.setTextColor(63, 90, 68);
    this.doc.text(texto, MARGEM, this.y);
    this.espaco(2.5);
    this.doc.setDrawColor(63, 90, 68);
    this.doc.setLineWidth(0.35);
    this.doc.line(MARGEM, this.y, MARGEM + 26, this.y);
    this.espaco(5.5);
    this.doc.setTextColor(26, 29, 28);
  }

  linha(rotulo: string, valor: string) {
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(8);
    this.doc.setTextColor(70, 70, 70);
    this.doc.text(rotulo, MARGEM, this.y);
    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(26, 29, 28);
    const linhasValor = this.doc.splitTextToSize(valor, LARGURA_UTIL - 55);
    this.doc.text(linhasValor, MARGEM + 55, this.y);
    this.espaco(Math.max(4.6, linhasValor.length * 4.2));
  }

  divisor() {
    this.espaco(1.5);
    this.doc.setDrawColor(210, 210, 210);
    this.doc.setLineWidth(0.2);
    this.doc.line(MARGEM, this.y, LARGURA_PAGINA - MARGEM, this.y);
    this.espaco(8);
  }

  paragrafo(texto: string, tamanho = 7) {
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(tamanho);
    this.doc.setTextColor(100, 100, 100);
    const linhas = this.doc.splitTextToSize(texto, LARGURA_UTIL);
    const alturaLinha = tamanho / 2.3;
    this.espaco(linhas.length * alturaLinha + 1.5);
    this.doc.text(linhas, MARGEM, this.y - linhas.length * alturaLinha);
  }
}

export function gerarLaudoPdf(dados: DadosLaudo): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const r = new Redator(doc);

  r.titulo("Laudo de Avaliação Imobiliária");
  r.subtitulo("Método Evolutivo — terreno + construção depreciada");
  r.divisor();

  r.linha("Data da avaliação:", dados.dataAvaliacao);
  if (dados.protocolo) r.linha("Protocolo ITCD:", dados.protocolo);
  r.linha("Proprietário:", dados.proprietarioNome ?? "—");
  r.linha("Município:", dados.cidadeNome);
  r.linha("Endereço:", dados.endereco ?? "—");

  if (dados.fotoBase64) {
    r.espaco(2.5);
    const larguraImg = 60;
    const alturaImg = 40;
    if (r.y + alturaImg > RODAPE_Y) {
      doc.addPage();
      r.y = MARGEM;
    }
    try {
      doc.addImage(dados.fotoBase64, "JPEG", MARGEM, r.y, larguraImg, alturaImg, undefined, "FAST");
    } catch {
      // formato de imagem não suportado — segue sem a foto no PDF
    }
    r.espaco(alturaImg + 4);
  }

  r.secao("1. Avaliação do terreno");
  r.linha("Área do terreno:", `${dados.terreno.area_m2.toLocaleString("pt-BR")} m²`);
  r.linha("Categoria:", capitalizar(dados.terreno.categoria));
  r.linha("Padrão:", capitalizar(dados.terreno.padrao));
  r.linha(
    "Valor-base do m²:",
    `${moeda(dados.resultado.valor_m2_terreno_base)}  ×  índice ${dados.resultado.indice_cidade}`
  );
  r.linha("Valor do terreno:", moeda(dados.resultado.valor_terreno));

  if (dados.construcao) {
    r.secao("2. Avaliação da construção");
    r.linha("Área construída:", `${dados.construcao.area_m2.toLocaleString("pt-BR")} m²`);
    r.linha("Padrão construtivo:", dados.construcao.padraoNome);
    r.linha("Tipo de construção:", dados.construcao.tipoNome);
    r.linha("Idade:", `${dados.construcao.idade_anos} anos`);
    r.linha(
      "Estado de conservação:",
      `${dados.construcao.estado_conservacao} — ${descricaoEstado(dados.construcao.estado_conservacao)}`
    );
    r.linha("Valor de reprodução (bruto):", moeda(dados.resultado.valor_construcao_bruto));
    r.linha(
      "Idade em % da vida útil:",
      `${dados.resultado.idade_pct_calculada}%  (arredondado para ${dados.resultado.idade_pct_arredondada}%)`
    );
    r.linha("Fator de depreciação (Ross-Heidecke):", dados.resultado.fator_depreciacao.toFixed(4));
    r.linha("Valor depreciado da construção:", moeda(dados.resultado.valor_construcao_depreciado));
  }

  r.divisor();

  r.espaco(2);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(63, 90, 68);
  doc.text("Valor total estimado do imóvel", MARGEM, r.y);
  r.espaco(7);
  doc.setFontSize(15);
  doc.text(moeda(dados.resultado.valor_total), MARGEM, r.y);
  r.espaco(8);

  r.paragrafo(
    "Avaliação elaborada pelo Método Evolutivo, com valor do terreno obtido por comparação a " +
      "valores-padrão de mercado da região e valor da construção obtido pelo Custo Unitário Básico " +
      "(CUB/m², SINDUSCOM-MG, conforme NBR 12.721:2006), depreciado pela tabela de Ross-Heidecke em " +
      "função da idade e do estado de conservação."
  );

  r.espaco(9);
  doc.setTextColor(26, 29, 28);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text(dados.avaliadorNome, MARGEM, r.y);
  if (dados.avaliadorMasp) {
    r.espaco(4);
    doc.setFont("helvetica", "normal");
    doc.text(`MASP ${dados.avaliadorMasp}`, MARGEM, r.y);
  }
  r.espaco(4);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(120, 120, 120);
  doc.text("Avaliador responsável", MARGEM, r.y);

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
    I: "Sem valor (demolição)",
  };
  return mapa[codigo] ?? "";
}
