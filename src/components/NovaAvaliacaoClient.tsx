"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { calcularAvaliacaoUrbana } from "@/lib/avaliacao/calculo";
import type {
  CategoriaTerreno,
  Cidade,
  EstadoConservacao,
  FatorRossHeidecke,
  PadraoConstrutivo,
  PadraoTerreno,
  ParametroTerreno,
  TipoConstrucao,
} from "@/lib/avaliacao/tipos";

const ESTADOS: { codigo: EstadoConservacao; label: string }[] = [
  { codigo: "A", label: "A — Novo" },
  { codigo: "B", label: "B — Entre novo e regular" },
  { codigo: "C", label: "C — Regular" },
  { codigo: "D", label: "D — Entre regular e reparos simples" },
  { codigo: "E", label: "E — Reparos simples" },
  { codigo: "F", label: "F — Entre reparos simples e importantes" },
  { codigo: "G", label: "G — Reparos importantes" },
  { codigo: "H", label: "H — Entre reparos importantes e sem valor" },
  { codigo: "I", label: "I — Sem valor (demolição)" },
];

const CATEGORIAS: { valor: CategoriaTerreno; label: string }[] = [
  { valor: "central", label: "Área central" },
  { valor: "perimetral", label: "Área perimetral" },
  { valor: "periferica", label: "Área periférica" },
];

const PADROES_TERRENO: { valor: PadraoTerreno; label: string }[] = [
  { valor: "maxima", label: "Máxima" },
  { valor: "media", label: "Média" },
  { valor: "minima", label: "Mínima" },
];

const moeda = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface Props {
  cidades: Cidade[];
  parametrosTerreno: ParametroTerreno[];
  padroesConstrutivos: PadraoConstrutivo[];
  tiposConstrucao: TipoConstrucao[];
  fatoresRossHeidecke: FatorRossHeidecke[];
}

export function NovaAvaliacaoClient({
  cidades,
  parametrosTerreno,
  padroesConstrutivos,
  tiposConstrucao,
  fatoresRossHeidecke,
}: Props) {
  const router = useRouter();
  const [tipo, setTipo] = useState<"urbano" | "rural">("urbano");
  const [protocolo, setProtocolo] = useState("");
  const [proprietarioNome, setProprietarioNome] = useState("");
  const [cidadeId, setCidadeId] = useState(cidades[0]?.id ?? "");
  const [endereco, setEndereco] = useState("");
  const [foto, setFoto] = useState<File | null>(null);

  const [areaTerreno, setAreaTerreno] = useState("");
  const [categoria, setCategoria] = useState<CategoriaTerreno>("central");
  const [padraoTerreno, setPadraoTerreno] = useState<PadraoTerreno>("media");

  const [temConstrucao, setTemConstrucao] = useState(true);
  const [areaConstrucao, setAreaConstrucao] = useState("");
  const [padraoConstrutivoId, setPadraoConstrutivoId] = useState(padroesConstrutivos[0]?.id ?? "");
  const [tipoConstrucaoId, setTipoConstrucaoId] = useState(tiposConstrucao[0]?.id ?? "");
  const [idadeAnos, setIdadeAnos] = useState("0");
  const [estadoConservacao, setEstadoConservacao] = useState<EstadoConservacao>("C");

  const [observacoesRural, setObservacoesRural] = useState("");
  const [areaRural, setAreaRural] = useState("");

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const cidade = cidades.find((c) => c.id === cidadeId);

  const resultado = useMemo(() => {
    if (tipo !== "urbano" || !cidade || !areaTerreno) return null;
    try {
      return calcularAvaliacaoUrbana({
        dados: {
          terreno: { area_m2: Number(areaTerreno), categoria, padrao: padraoTerreno },
          construcao: temConstrucao
            ? {
                area_m2: Number(areaConstrucao || 0),
                padrao_construtivo_id: padraoConstrutivoId,
                tipo_construcao_id: tipoConstrucaoId,
                idade_anos: Number(idadeAnos || 0),
                estado_conservacao: estadoConservacao,
              }
            : null,
        },
        cidade,
        parametrosTerreno,
        padroesConstrutivos,
        tiposConstrucao,
        fatoresRossHeidecke,
      });
    } catch {
      return null;
    }
  }, [
    tipo,
    cidade,
    areaTerreno,
    categoria,
    padraoTerreno,
    temConstrucao,
    areaConstrucao,
    padraoConstrutivoId,
    tipoConstrucaoId,
    idadeAnos,
    estadoConservacao,
    parametrosTerreno,
    padroesConstrutivos,
    tiposConstrucao,
    fatoresRossHeidecke,
  ]);

  async function salvar() {
    setErro(null);
    setSalvando(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setSalvando(false);
      return;
    }

    let fotoUrl: string | null = null;
    if (foto) {
      const extensao = foto.name.split(".").pop();
      const caminho = `${user.id}/${crypto.randomUUID()}.${extensao}`;
      const { error: erroUpload } = await supabase.storage
        .from("fotos-imoveis")
        .upload(caminho, foto);

      if (erroUpload) {
        setSalvando(false);
        setErro("Não foi possível enviar a foto. Tente novamente.");
        return;
      }

      const { data: urlPublica } = supabase.storage.from("fotos-imoveis").getPublicUrl(caminho);
      fotoUrl = urlPublica.publicUrl;
    }

    const dados =
      tipo === "urbano"
        ? {
            terreno: { area_m2: Number(areaTerreno), categoria, padrao: padraoTerreno },
            construcao: temConstrucao
              ? {
                  area_m2: Number(areaConstrucao || 0),
                  padrao_construtivo_id: padraoConstrutivoId,
                  tipo_construcao_id: tipoConstrucaoId,
                  idade_anos: Number(idadeAnos || 0),
                  estado_conservacao: estadoConservacao,
                }
              : null,
          }
        : { area_m2: Number(areaRural || 0), observacoes: observacoesRural };

    const { data, error } = await supabase
      .from("avaliacoes")
      .insert({
        avaliador_id: user.id,
        cidade_id: cidadeId || null,
        tipo,
        protocolo: protocolo || null,
        proprietario_nome: proprietarioNome || null,
        endereco: endereco || null,
        foto_url: fotoUrl,
        status: tipo === "urbano" && resultado ? "concluida" : "rascunho",
        dados,
        resultado: resultado ?? {},
      })
      .select("id")
      .single();

    setSalvando(false);

    if (error || !data) {
      setErro("Não foi possível salvar a avaliação.");
      return;
    }

    router.push(`/avaliacoes/${data.id}`);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="card p-6">
        <div className="mb-5 grid grid-cols-2 gap-2 rounded-lg bg-ink/5 p-1">
          <button
            onClick={() => setTipo("urbano")}
            className={`rounded-md py-2 text-sm font-medium transition-colors ${
              tipo === "urbano" ? "bg-white shadow-sm" : "text-ink/50"
            }`}
          >
            Imóvel urbano
          </button>
          <button
            onClick={() => setTipo("rural")}
            className={`rounded-md py-2 text-sm font-medium transition-colors ${
              tipo === "rural" ? "bg-white shadow-sm" : "text-ink/50"
            }`}
          >
            Imóvel rural
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Protocolo ITCD</label>
            <input
              value={protocolo}
              onChange={(e) => setProtocolo(e.target.value)}
              placeholder="Nº do protocolo"
              className="input"
            />
          </div>
          <div>
            <label className="label">Proprietário / solicitante</label>
            <input
              value={proprietarioNome}
              onChange={(e) => setProprietarioNome(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="label">Município</label>
            <select value={cidadeId} onChange={(e) => setCidadeId(e.target.value)} className="input">
              {cidades.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Endereço</label>
            <input value={endereco} onChange={(e) => setEndereco(e.target.value)} className="input" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Foto do imóvel (opcional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFoto(e.target.files?.[0] ?? null)}
              className="input file:mr-3 file:rounded-md file:border-0 file:bg-ink/5 file:px-3 file:py-1.5 file:text-sm file:font-medium"
            />
          </div>
        </div>
      </div>

      {tipo === "urbano" ? (
        <>
          <div className="card p-6">
            <h2 className="mb-4 text-lg">Terreno</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="label">Área do terreno (m²)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={areaTerreno}
                  onChange={(e) => setAreaTerreno(e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Categoria</label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value as CategoriaTerreno)}
                  className="input"
                >
                  {CATEGORIAS.map((c) => (
                    <option key={c.valor} value={c.valor}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Padrão</label>
                <select
                  value={padraoTerreno}
                  onChange={(e) => setPadraoTerreno(e.target.value as PadraoTerreno)}
                  className="input"
                >
                  {PADROES_TERRENO.map((p) => (
                    <option key={p.valor} value={p.valor}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg">Construção</h2>
              <label className="flex items-center gap-2 text-sm text-ink/60">
                <input
                  type="checkbox"
                  checked={temConstrucao}
                  onChange={(e) => setTemConstrucao(e.target.checked)}
                />
                Imóvel possui benfeitoria
              </label>
            </div>

            {temConstrucao && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Área construída (m²)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={areaConstrucao}
                    onChange={(e) => setAreaConstrucao(e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Padrão construtivo</label>
                  <select
                    value={padraoConstrutivoId}
                    onChange={(e) => setPadraoConstrutivoId(e.target.value)}
                    className="input"
                  >
                    {padroesConstrutivos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nome} ({moeda(p.valor_m2)}/m²)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Tipo de construção (vida útil)</label>
                  <select
                    value={tipoConstrucaoId}
                    onChange={(e) => setTipoConstrucaoId(e.target.value)}
                    className="input"
                  >
                    {tiposConstrucao.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nome} ({t.vida_util_anos} anos)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Idade (anos)</label>
                  <input
                    type="number"
                    min="0"
                    value={idadeAnos}
                    onChange={(e) => setIdadeAnos(e.target.value)}
                    className="input"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Estado de conservação</label>
                  <select
                    value={estadoConservacao}
                    onChange={(e) => setEstadoConservacao(e.target.value as EstadoConservacao)}
                    className="input"
                  >
                    {ESTADOS.map((e) => (
                      <option key={e.codigo} value={e.codigo}>
                        {e.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {resultado && (
            <div className="card border-field/20 bg-field/5 p-6">
              <p className="eyebrow mb-2">Prévia do cálculo</p>
              <div className="grid grid-cols-2 gap-y-1 text-sm text-ink/70 sm:grid-cols-4">
                <p>Terreno</p>
                <p className="font-medium text-ink">{moeda(resultado.valor_terreno)}</p>
                <p>Construção (depreciada)</p>
                <p className="font-medium text-ink">
                  {moeda(resultado.valor_construcao_depreciado)}
                </p>
              </div>
              <p className="mt-4 text-2xl font-medium text-field">{moeda(resultado.valor_total)}</p>
            </div>
          )}
        </>
      ) : (
        <div className="card p-6">
          <p className="mb-4 text-sm text-ink/60">
            Módulo de cálculo para imóveis rurais ainda não implementado. Cadastre os dados básicos
            abaixo — a avaliação fica salva como rascunho.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Área (hectares)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={areaRural}
                onChange={(e) => setAreaRural(e.target.value)}
                className="input"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Observações</label>
              <textarea
                value={observacoesRural}
                onChange={(e) => setObservacoesRural(e.target.value)}
                className="input"
                rows={4}
              />
            </div>
          </div>
        </div>
      )}

      {erro && <p className="text-sm text-red-700">{erro}</p>}

      <div className="flex justify-end">
        <button onClick={salvar} disabled={salvando} className="btn-primary">
          {salvando ? "Salvando..." : "Salvar avaliação"}
        </button>
      </div>
    </div>
  );
}
