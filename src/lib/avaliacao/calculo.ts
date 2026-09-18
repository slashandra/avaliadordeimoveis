import type {
  Cidade,
  DadosAvaliacaoUrbana,
  EstadoConservacao,
  FatorRossHeidecke,
  PadraoConstrutivo,
  ParametroTerreno,
  ResultadoAvaliacaoUrbana,
  TipoConstrucao,
} from "./tipos";

/**
 * Arredonda a % de vida consumida para o próximo par da tabela de Ross-Heidecke
 * (a tabela só tem linhas pares, de 2 a 100), conforme o critério do avaliador:
 * arredonda pra cima até o primeiro número par.
 */
export function arredondarIdadePercentual(pct: number): number {
  const limitado = Math.max(0, Math.min(100, pct));
  const parAcima = Math.ceil(limitado / 2) * 2;
  return Math.max(2, Math.min(100, parAcima));
}

export function calcularIdadePercentual(idadeAnos: number, vidaUtilAnos: number): number {
  if (vidaUtilAnos <= 0) return 100;
  return (idadeAnos / vidaUtilAnos) * 100;
}

export function buscarFatorRossHeidecke(
  fatores: FatorRossHeidecke[],
  idadePctArredondada: number,
  estado: EstadoConservacao
): number {
  const linha = fatores.find(
    (f) => f.idade_pct === idadePctArredondada && f.estado_conservacao === estado
  );
  if (!linha) {
    throw new Error(
      `Fator de Ross-Heidecke não encontrado para ${idadePctArredondada}% / estado ${estado}`
    );
  }
  return linha.fator;
}

export function buscarValorTerreno(
  parametros: ParametroTerreno[],
  categoria: DadosAvaliacaoUrbana["terreno"]["categoria"],
  padrao: DadosAvaliacaoUrbana["terreno"]["padrao"]
): number {
  const linha = parametros.find((p) => p.categoria === categoria && p.padrao === padrao);
  if (!linha) {
    throw new Error(`Valor de terreno não encontrado para ${categoria}/${padrao}`);
  }
  return linha.valor_m2;
}

interface CalcularAvaliacaoUrbanaParams {
  dados: DadosAvaliacaoUrbana;
  cidade: Cidade;
  parametrosTerreno: ParametroTerreno[];
  padroesConstrutivos: PadraoConstrutivo[];
  tiposConstrucao: TipoConstrucao[];
  fatoresRossHeidecke: FatorRossHeidecke[];
}

/**
 * Método Evolutivo: valor do terreno (área × valor-base × índice da cidade)
 * somado ao valor da construção (área × CUB do padrão) depreciado pela
 * tabela de Ross-Heidecke conforme idade (% da vida útil) e estado de conservação.
 */
export function calcularAvaliacaoUrbana({
  dados,
  cidade,
  parametrosTerreno,
  padroesConstrutivos,
  tiposConstrucao,
  fatoresRossHeidecke,
}: CalcularAvaliacaoUrbanaParams): ResultadoAvaliacaoUrbana {
  const valorM2TerrenoBase = buscarValorTerreno(
    parametrosTerreno,
    dados.terreno.categoria,
    dados.terreno.padrao
  );
  const valorTerreno = dados.terreno.area_m2 * valorM2TerrenoBase * cidade.indice;

  if (!dados.construcao) {
    return {
      valor_terreno: arred2(valorTerreno),
      valor_m2_terreno_base: valorM2TerrenoBase,
      indice_cidade: cidade.indice,
      valor_construcao_bruto: 0,
      idade_pct_calculada: 0,
      idade_pct_arredondada: 0,
      fator_depreciacao: 0,
      valor_construcao_depreciado: 0,
      valor_total: arred2(valorTerreno),
    };
  }

  const padraoConstrutivo = padroesConstrutivos.find(
    (p) => p.id === dados.construcao!.padrao_construtivo_id
  );
  if (!padraoConstrutivo) throw new Error("Padrão construtivo não encontrado");

  const tipoConstrucao = tiposConstrucao.find(
    (t) => t.id === dados.construcao!.tipo_construcao_id
  );
  if (!tipoConstrucao) throw new Error("Tipo de construção não encontrado");

  const valorConstrucaoBruto = dados.construcao.area_m2 * padraoConstrutivo.valor_m2;

  const idadePctCalculada = calcularIdadePercentual(
    dados.construcao.idade_anos,
    tipoConstrucao.vida_util_anos
  );
  const idadePctArredondada = arredondarIdadePercentual(idadePctCalculada);

  const fatorDepreciacao = buscarFatorRossHeidecke(
    fatoresRossHeidecke,
    idadePctArredondada,
    dados.construcao.estado_conservacao
  );

  const valorConstrucaoDepreciado = valorConstrucaoBruto * fatorDepreciacao;
  const valorTotal = valorTerreno + valorConstrucaoDepreciado;

  return {
    valor_terreno: arred2(valorTerreno),
    valor_m2_terreno_base: valorM2TerrenoBase,
    indice_cidade: cidade.indice,
    valor_construcao_bruto: arred2(valorConstrucaoBruto),
    idade_pct_calculada: arred2(idadePctCalculada),
    idade_pct_arredondada: idadePctArredondada,
    fator_depreciacao: fatorDepreciacao,
    valor_construcao_depreciado: arred2(valorConstrucaoDepreciado),
    valor_total: arred2(valorTotal),
  };
}

function arred2(n: number): number {
  return Math.round(n * 100) / 100;
}
