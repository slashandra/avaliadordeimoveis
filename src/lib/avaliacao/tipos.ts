export type CategoriaTerreno = "central" | "perimetral" | "periferica";
export type PadraoTerreno = "maxima" | "media" | "minima";
export type EstadoConservacao = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";

export interface ParametroTerreno {
  categoria: CategoriaTerreno;
  padrao: PadraoTerreno;
  valor_m2: number;
}

export interface PadraoConstrutivo {
  id: string;
  nome: string;
  tipo: "residencial" | "comercial" | "industrial";
  valor_m2: number;
}

export interface TipoConstrucao {
  id: string;
  nome: string;
  vida_util_anos: number;
}

export interface Cidade {
  id: string;
  nome: string;
  indice: number;
}

export interface FatorRossHeidecke {
  idade_pct: number;
  estado_conservacao: EstadoConservacao;
  fator: number;
}

export interface DadosTerreno {
  area_m2: number;
  categoria: CategoriaTerreno;
  padrao: PadraoTerreno;
}

export interface DadosConstrucao {
  area_m2: number;
  padrao_construtivo_id: string;
  tipo_construcao_id: string;
  idade_anos: number;
  estado_conservacao: EstadoConservacao;
}

export interface DadosAvaliacaoUrbana {
  terreno: DadosTerreno;
  construcao: DadosConstrucao | null;
}

export interface ResultadoAvaliacaoUrbana {
  valor_terreno: number;
  valor_m2_terreno_base: number;
  indice_cidade: number;
  valor_construcao_bruto: number;
  idade_pct_calculada: number;
  idade_pct_arredondada: number;
  fator_depreciacao: number;
  valor_construcao_depreciado: number;
  valor_total: number;
}
