export const HTML_MANUAL = `
<div class="shell">
  <aside class="toc">
    <div class="toc-brand"><span class="dot"></span><span>Avaliador de Imóveis</span></div>
    <h1>Manual&nbsp;do&nbsp;Avaliador</h1>
    <nav id="tocNav">
      <div class="toc-group">Começando</div>
      <a class="toc-link" href="#visao-geral">Visão geral</a>
      <a class="toc-link" href="#conta">Criar conta e entrar</a>
      <div class="toc-group">Telas do app</div>
      <a class="toc-link" href="#avaliacoes">Lista de avaliações</a>
      <a class="toc-link" href="#nova">Nova avaliação</a>
      <a class="toc-link" href="#detalhe">Detalhe e laudo</a>
      <a class="toc-link" href="#parametros">Parâmetros</a>
      <div class="toc-group">Metodologia</div>
      <a class="toc-link" href="#metodo">Método Evolutivo</a>
      <a class="toc-link" href="#terreno-calc">Cálculo do terreno</a>
      <a class="toc-link" href="#construcao-calc">Cálculo da construção</a>
      <a class="toc-link" href="#fontes">Fontes dos índices</a>
      <div class="toc-group">Ajuda</div>
      <a class="toc-link" href="#faq">Perguntas frequentes</a>
    </nav>
  </aside>

  <main>
    <div class="mobile-toc">
      <select id="mobileNav">
        <option value="#visao-geral">Visão geral</option>
        <option value="#conta">Criar conta e entrar</option>
        <option value="#avaliacoes">Lista de avaliações</option>
        <option value="#nova">Nova avaliação</option>
        <option value="#detalhe">Detalhe e laudo</option>
        <option value="#parametros">Parâmetros</option>
        <option value="#metodo">Método Evolutivo</option>
        <option value="#terreno-calc">Cálculo do terreno</option>
        <option value="#construcao-calc">Cálculo da construção</option>
        <option value="#fontes">Fontes dos índices</option>
        <option value="#faq">Perguntas frequentes</option>
      </select>
    </div>

    <section class="hero" id="visao-geral">
      <span class="eyebrow"><span class="dot"></span>Manual do usuário</span>
      <h1>Como usar o Avaliador de Imóveis</h1>
      <p class="lede">
        Guia passo a passo do sistema de avaliação imobiliária pelo <strong>Método Evolutivo</strong>:
        cada tela explicada, cada campo do formulário, e a matemática por trás do valor final —
        de onde vêm os índices e como eles se combinam no laudo.
      </p>
      <div class="hero-meta">
        <span class="chip">Imóveis urbanos</span>
        <span class="chip">Protocolo ITCD</span>
        <span class="chip">Laudo em PDF</span>
        <span class="chip">Passos/MG e região</span>
      </div>
    </section>

    <section class="block" id="visao-geral-2">
      <div class="block-head">
        <span class="num">00</span>
        <h2>O que o app faz</h2>
        <p>Três passos resumem o fluxo de trabalho, do cadastro ao laudo pronto.</p>
      </div>
      <div class="steps">
        <div class="step">
          <span class="num"></span>
          <div>
            <h4>Você registra os dados do imóvel</h4>
            <p>Protocolo do ITCD, proprietário, endereço, área do terreno, área construída, padrão da construção, idade e estado de conservação — tudo escolhido por você, o avaliador.</p>
          </div>
        </div>
        <div class="step">
          <span class="num"></span>
          <div>
            <h4>O sistema aplica o Método Evolutivo</h4>
            <p>Terreno e construção são calculados separadamente com tabelas de referência fixas (padronizadas para todos os avaliadores) e somados no valor final.</p>
          </div>
        </div>
        <div class="step">
          <span class="num"></span>
          <div>
            <h4>Você baixa o laudo em PDF</h4>
            <p>Documento de uma página, pronto para anexar ao processo, com a memória de cálculo completa e a foto do imóvel (quando enviada).</p>
          </div>
        </div>
      </div>
    </section>

    <section class="block" id="conta">
      <div class="block-head">
        <span class="num">01</span>
        <h2>Criar conta e entrar</h2>
        <p>O acesso é individual — cada avaliador tem seu próprio login e responde pelas avaliações que assina.</p>
      </div>
      <div class="two-col">
        <div class="device">
          <div class="device-bar"><span class="traffic"></span><span class="traffic"></span><span class="traffic"></span><span class="url">avaliadordeimoveis.vercel.app/login</span></div>
          <div class="device-screen">
            <div class="mk-eyebrow">Avaliador de Imóveis</div>
            <div class="mk-h1">Entrar</div>
            <div class="mk-sub">Acesse sua conta de avaliador</div>
            <div class="mk-field"><div class="mk-label">E-mail</div><div class="mk-input muted">avaliador@fazenda.mg.gov.br</div></div>
            <div class="mk-field"><div class="mk-label">Senha</div><div class="mk-input muted">••••••••••</div></div>
            <span class="mk-btn">Entrar</span>
          </div>
        </div>
        <div class="notes">
          <div class="note">
            <div class="label">Primeiro acesso</div>
            <p>Clique em "Criar conta" na tela de login. É pedido seu nome completo, o registro profissional (MASP, opcional) e um e-mail/senha — esse nome e MASP aparecem depois no rodapé de todo laudo que você assinar.</p>
          </div>
          <div class="note">
            <div class="label">Sessão</div>
            <p>Depois de logado, você continua conectado até clicar em "Sair" no menu do topo. Cada avaliador só enxerga as próprias avaliações.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="block" id="avaliacoes">
      <div class="block-head">
        <span class="num">02</span>
        <h2>Lista de avaliações</h2>
        <p>É a tela inicial depois do login — mostra todas as suas avaliações, concluídas e em rascunho.</p>
      </div>
      <div class="two-col reverse">
        <div class="notes">
          <div class="note">
            <div class="label">Rascunho × concluída</div>
            <p>Uma avaliação urbana com terreno preenchido já é calculada automaticamente e marcada <em>concluída</em>. Avaliações rurais (sem cálculo ainda) ficam como <em>rascunho</em>.</p>
          </div>
          <div class="note">
            <div class="label">Toque para abrir</div>
            <p>Clicar em qualquer linha da lista leva direto ao detalhe daquela avaliação, com o botão de baixar o laudo em PDF.</p>
          </div>
        </div>
        <div class="device">
          <div class="device-bar"><span class="traffic"></span><span class="traffic"></span><span class="traffic"></span><span class="url">avaliadordeimoveis.vercel.app/avaliacoes</span></div>
          <div class="device-screen tight">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
              <div><div class="mk-h1" style="font-size:16px;">Avaliações</div><div class="mk-sub" style="margin-bottom:0;">Laudos em andamento e concluídos</div></div>
              <span class="mk-btn">+ Nova</span>
            </div>
            <div class="mk-card">
              <div class="mk-listrow">
                <div>
                  <span class="mk-name">Maria de Fátima Souza</span> <span class="mk-badge done">Concluída</span>
                  <div class="mk-sub2">Urbano · Passos · Protocolo 2026.0031412-7</div>
                </div>
                <div style="text-align:right"><div class="mk-value">R$ 797.211,43</div><div class="mk-sub2">18/09/2026</div></div>
              </div>
              <div class="mk-listrow">
                <div>
                  <span class="mk-name">José Ribeiro Neto</span> <span class="mk-badge draft">Rascunho</span>
                  <div class="mk-sub2">Rural · Capitólio</div>
                </div>
                <div style="text-align:right"><div class="mk-sub2" style="color:var(--ink-faint)">—</div><div class="mk-sub2">15/09/2026</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="block" id="nova">
      <div class="block-head">
        <span class="num">03</span>
        <h2>Nova avaliação</h2>
        <p>Formulário único, com prévia do valor calculada em tempo real enquanto você preenche.</p>
      </div>
      <div class="two-col">
        <div class="device">
          <div class="device-bar"><span class="traffic"></span><span class="traffic"></span><span class="traffic"></span><span class="url">avaliadordeimoveis.vercel.app/avaliacoes/nova</span></div>
          <div class="device-screen tight">
            <div class="mk-nav">
              <span class="mk-navlink active">Imóvel urbano</span>
              <span class="mk-navlink">Imóvel rural</span>
            </div>
            <div class="mk-row2" style="margin-bottom:10px;">
              <div class="mk-field" style="margin-bottom:0;"><div class="mk-label">Protocolo ITCD</div><div class="mk-input muted">2026.0031412-7</div></div>
              <div class="mk-field" style="margin-bottom:0;"><div class="mk-label">Proprietário</div><div class="mk-input muted">Maria de Fátima Souza</div></div>
            </div>
            <div class="mk-row2" style="margin-bottom:12px;">
              <div class="mk-field" style="margin-bottom:0;"><div class="mk-label">Município</div><div class="mk-input muted">Passos</div></div>
              <div class="mk-field" style="margin-bottom:0;"><div class="mk-label">Endereço</div><div class="mk-input muted">Rua das Acácias, 240</div></div>
            </div>
            <div class="mk-row2" style="margin-bottom:14px;">
              <div class="mk-field" style="margin-bottom:0;"><div class="mk-label">Área do terreno (m²)</div><div class="mk-input muted">150</div></div>
              <div class="mk-field" style="margin-bottom:0;"><div class="mk-label">Categoria / padrão</div><div class="mk-input muted">Central · Máxima</div></div>
            </div>
            <div class="mk-result">
              <div class="mk-label" style="color:var(--field)">Prévia do cálculo</div>
              <div class="big">R$ 797.211,43</div>
            </div>
          </div>
        </div>
        <div>
          <table class="field-table">
            <tr><th>Campo</th><th>Explicação</th></tr>
            <tr><td class="fname">Protocolo ITCD</td><td class="fdesc">Número do protocolo do processo de ITCD ao qual essa avaliação se refere. <span class="tag-opt">opcional</span></td></tr>
            <tr><td class="fname">Proprietário</td><td class="fdesc">Nome de quem solicita ou figura no processo. Campo livre.</td></tr>
            <tr><td class="fname">Foto do imóvel</td><td class="fdesc">Imagem enviada pelo avaliador; aparece no detalhe da avaliação e no laudo em PDF. <span class="tag-opt">opcional</span></td></tr>
            <tr><td class="fname">Categoria do terreno</td><td class="fdesc">Central, perimetral ou periférica — define a faixa de valor do m² do terreno.</td></tr>
            <tr><td class="fname">Padrão do terreno</td><td class="fdesc">Máxima, média ou mínima dentro da categoria escolhida.</td></tr>
            <tr><td class="fname">Padrão construtivo</td><td class="fdesc">Popular, baixo, normal, alto (residencial), normal/alto (comercial) ou galpão industrial — define o CUB/m².</td></tr>
            <tr><td class="fname">Estado de conservação</td><td class="fdesc">Código de A a I — ver a legenda completa na seção Parâmetros.</td></tr>
          </table>
        </div>
      </div>
    </section>

    <section class="block" id="detalhe">
      <div class="block-head">
        <span class="num">04</span>
        <h2>Detalhe da avaliação e laudo</h2>
        <p>Mostra a memória de cálculo completa e o botão para gerar o PDF assinado com seu nome e MASP.</p>
      </div>
      <div class="two-col reverse">
        <div class="notes">
          <div class="note">
            <div class="label">Laudo em PDF</div>
            <p>Uma folha só: dados do imóvel, memória de cálculo do terreno e da construção, valor total e a foto (quando houver), assinada pelo avaliador responsável.</p>
          </div>
          <div class="note">
            <div class="label">Rastreabilidade</div>
            <p>Toda a fórmula fica visível na tela — valor-base × índice da cidade, fator de depreciação — para conferência antes de baixar o PDF.</p>
          </div>
        </div>
        <div class="device">
          <div class="device-bar"><span class="traffic"></span><span class="traffic"></span><span class="traffic"></span><span class="url">avaliadordeimoveis.vercel.app/avaliacoes/&lt;id&gt;</span></div>
          <div class="device-screen tight">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px;">
              <div><div class="mk-h1" style="font-size:16px;">Maria de Fátima Souza</div><div class="mk-sub" style="margin-bottom:0;">Urbano · Passos · Protocolo 2026.0031412-7</div></div>
              <span class="mk-btn">Baixar laudo</span>
            </div>
            <div class="mk-card" style="margin-bottom:8px;">
              <table class="mk-table">
                <tr><th>Terreno</th><th></th></tr>
                <tr><td>Área</td><td>150 m²</td></tr>
                <tr><td>Valor-base × índice</td><td>R$ 1.500,00 × 1,0</td></tr>
                <tr><td>Valor do terreno</td><td style="color:var(--field); font-weight:700;">R$ 225.000,00</td></tr>
              </table>
            </div>
            <div class="mk-result">
              <div class="mk-label" style="color:var(--field)">Valor total estimado</div>
              <div class="big">R$ 797.211,43</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="block" id="parametros">
      <div class="block-head">
        <span class="num">05</span>
        <h2>Parâmetros — visíveis, mas travados</h2>
        <p>As tabelas de referência ficam abertas para consulta, mas não podem ser editadas pelo avaliador: garantem o mesmo padrão de análise para todos.</p>
      </div>
      <div class="two-col">
        <div class="device">
          <div class="device-bar"><span class="traffic"></span><span class="traffic"></span><span class="traffic"></span><span class="url">avaliadordeimoveis.vercel.app/parametros</span></div>
          <div class="device-screen tight">
            <div class="mk-tabs">
              <span class="mk-tab">Cidades</span>
              <span class="mk-tab">Terreno</span>
              <span class="mk-tab">CUB</span>
              <span class="mk-tab active">Ross-Heidecke</span>
            </div>
            <table class="mk-table">
              <tr><th>% vida</th><th>A</th><th>B</th><th>C</th><th>D</th></tr>
              <tr><td>10%</td><td>0,9450</td><td>0,9420</td><td>0,9212</td><td>0,8685</td></tr>
              <tr><td>20%</td><td>0,8800</td><td>0,8772</td><td>0,8578</td><td>0,8088</td></tr>
              <tr><td>30%</td><td>0,8050</td><td>0,8024</td><td>0,7847</td><td>0,7399</td></tr>
            </table>
          </div>
        </div>
        <div>
          <p style="color:var(--ink-soft); font-size: 13.5px; margin-bottom: 6px;">Legenda dos estados de conservação (A a I), usados na coluna da tabela Ross-Heidecke:</p>
          <div class="estado-grid">
            <div class="estado-chip"><div class="code">A</div><div class="desc">Novo</div></div>
            <div class="estado-chip"><div class="code">B</div><div class="desc">Entre novo e regular</div></div>
            <div class="estado-chip"><div class="code">C</div><div class="desc">Regular</div></div>
            <div class="estado-chip"><div class="code">D</div><div class="desc">Entre regular e reparos simples</div></div>
            <div class="estado-chip"><div class="code">E</div><div class="desc">Reparos simples</div></div>
            <div class="estado-chip"><div class="code">F</div><div class="desc">Entre reparos simples e importantes</div></div>
            <div class="estado-chip"><div class="code">G</div><div class="desc">Reparos importantes</div></div>
            <div class="estado-chip"><div class="code">H</div><div class="desc">Entre reparos importantes e sem valor</div></div>
            <div class="estado-chip"><div class="code">I</div><div class="desc">Sem valor (demolição) — sem viabilidade econômica de recuperação</div></div>
          </div>
        </div>
      </div>
    </section>

    <section class="block" id="metodo">
      <div class="block-head">
        <span class="num">06</span>
        <h2>Como o valor é calculado: Método Evolutivo</h2>
        <p>O valor final do imóvel urbano é sempre a soma de duas partes calculadas separadamente.</p>
      </div>
      <div class="formula">
        <div class="title">Valor total do imóvel</div>
        <div class="eq">
          <span class="var">Valor total</span> <span class="op">=</span> <span class="var">Valor do terreno</span> <span class="op">+</span> <span class="var">Valor da construção depreciada</span>
        </div>
      </div>
    </section>

    <section class="block" id="terreno-calc">
      <div class="block-head">
        <span class="num">06.1</span>
        <h2>Cálculo do terreno</h2>
        <p>Área × valor-base do m² (segundo a categoria e o padrão escolhidos) × índice do município.</p>
      </div>
      <div class="formula">
        <div class="title">Valor do terreno</div>
        <div class="eq">
          <span class="var">Área (m²)</span> <span class="op">×</span> <span class="var">Valor-base do m²</span> <span class="op">×</span> <span class="var">Índice da cidade</span>
        </div>
      </div>
      <p style="color:var(--ink-soft); font-size: 13.5px; margin-top:16px;">
        O valor-base do m² vem de uma tabela fixa para <strong>Passos/MG</strong>, cruzando categoria
        (central, perimetral ou periférica) com padrão (máxima, média ou mínima). Para os demais
        municípios da região, esse valor é multiplicado por um <strong>índice</strong> — um número entre
        0 e 1 que representa o quanto o mercado daquela cidade vale em relação a Passos.
      </p>
    </section>

    <section class="block" id="construcao-calc">
      <div class="block-head">
        <span class="num">06.2</span>
        <h2>Cálculo da construção</h2>
        <p>Valor de reprodução (área × CUB) depreciado pela tabela de Ross-Heidecke.</p>
      </div>
      <div class="formula">
        <div class="title">Valor da construção</div>
        <div class="eq">
          (<span class="var">Área construída</span> <span class="op">×</span> <span class="var">CUB/m² do padrão</span>) <span class="op">×</span> <span class="var">Fator de depreciação</span>
        </div>
      </div>
      <p style="color:var(--ink-soft); font-size: 13.5px; margin: 16px 0;">
        O fator de depreciação vem da <strong>tabela de Ross-Heidecke</strong>, que cruza duas variáveis:
      </p>
      <div class="steps">
        <div class="step">
          <span class="num"></span>
          <div>
            <h4>Idade em % da vida útil</h4>
            <p>A idade do imóvel (em anos) dividida pela vida útil esperada do tipo de construção (casa de alvenaria = 65 anos, apartamento = 60 anos, etc.), arredondada para o número inteiro mais próximo (a tabela tem uma linha para cada 1% de 0 a 100).</p>
          </div>
        </div>
        <div class="step">
          <span class="num"></span>
          <div>
            <h4>Estado de conservação (A a I)</h4>
            <p>Avaliação visual do avaliador sobre o estado físico do imóvel — de "novo" (A) a "sem valor, demolição" (I), sem viabilidade econômica de recuperação. Nesse caso o fator de depreciação é sempre 0.</p>
          </div>
        </div>
      </div>
      <p style="color:var(--ink-soft); font-size: 13.5px; margin-top:16px;">
        O cruzamento dessas duas linhas na tabela dá um fator entre 0 e 1, que multiplica o valor bruto
        da construção — quanto mais velho e mais deteriorado, menor o fator, menor o valor depreciado.
      </p>
    </section>

    <section class="block" id="fontes">
      <div class="block-head">
        <span class="num">07</span>
        <h2>De onde vêm os números</h2>
        <p>Cada tabela usada no cálculo tem uma origem documentada — nada é estimado no ato.</p>
      </div>
      <div class="source-list">
        <div class="source">
          <div class="ic">R$</div>
          <div>
            <h4>Valores-base do terreno (Passos/MG)</h4>
            <p>Definidos pelo avaliador responsável para as três categorias (central, perimetral, periférica) e três padrões (máxima, média, mínima) de localização do município-sede.</p>
          </div>
        </div>
        <div class="source">
          <div class="ic">%</div>
          <div>
            <h4>Índices por município da região</h4>
            <p>Coeficiente aplicado sobre os valores de Passos/MG para cada cidade vizinha (Cássia, Piumhi, Alpinópolis, Capitólio e outras), também definido pelo avaliador responsável, conforme o mercado local.</p>
          </div>
        </div>
        <div class="source">
          <div class="ic">CUB</div>
          <div>
            <h4>Custo Unitário Básico (CUB/m²)</h4>
            <p>SINDUSCOM/MG, novembro de 2023 — calculado conforme a <strong>ABNT NBR 12.721:2006</strong>, com base em novos projetos, memoriais descritivos e critérios de orçamentação atualizados. Um valor por padrão construtivo (popular, baixo, normal, alto, comercial, galpão).</p>
          </div>
        </div>
        <div class="source">
          <div class="ic">VU</div>
          <div>
            <h4>Vida útil por tipo de construção</h4>
            <p>Tabela do <strong>Bureau of Internal Revenue</strong> — referência clássica de avaliação de imóveis, usada para calcular quantos anos de vida útil cada tipo de edificação tem (apartamento, casa de alvenaria, galpão, etc.).</p>
          </div>
        </div>
        <div class="source">
          <div class="ic">RH</div>
          <div>
            <h4>Tabela de Ross-Heidecke</h4>
            <p>Método clássico de depreciação de imóveis, cruzando idade (% da vida útil, uma linha para cada 1% de 0 a 100) e estado de conservação (A a I) para obter o fator de depreciação aplicado ao valor da construção. Fonte: <a href="https://oficialavaliador.com.br/wp-content/uploads/2022/09/Tabela-de-fatores-de-depreciacao-Ross-Heidecke.pdf" target="_blank" rel="noreferrer" style="color:var(--field); text-decoration: underline;">Tabela de fatores de depreciação Ross-Heidecke (oficialavaliador.com.br)</a>.</p>
          </div>
        </div>
      </div>
      <div class="note" style="margin-top: 20px;">
        <div class="label">Critério padronizado</div>
        <p>Esses parâmetros ficam travados no sistema (ver seção Parâmetros) justamente para preservar o mesmo critério de análise entre todos os laudos.</p>
      </div>
    </section>

    <section class="block" id="faq">
      <div class="block-head">
        <span class="num">08</span>
        <h2>Perguntas frequentes</h2>
      </div>
      <div class="faq">
        <details class="faq-item">
          <summary>Posso editar os valores de terreno ou CUB se eu discordar?</summary>
          <p>Não pela tela do app — os parâmetros ficam travados de propósito, para manter o mesmo critério de avaliação entre todos os avaliadores. Uma mudança de valores precisa ser feita no banco de dados pelo administrador do sistema.</p>
        </details>
        <details class="faq-item">
          <summary>O que acontece se eu não marcar "imóvel possui benfeitoria"?</summary>
          <p>O sistema calcula só o valor do terreno — a avaliação ainda é salva como concluída, mas sem a parte de construção.</p>
        </details>
        <details class="faq-item">
          <summary>Avaliação rural já calcula automaticamente?</summary>
          <p>Ainda não. O cadastro rural (área em hectares e observações) fica salvo como rascunho, aguardando a definição da metodologia de terra nua + benfeitorias.</p>
        </details>
        <details class="faq-item">
          <summary>A foto do imóvel é obrigatória?</summary>
          <p>Não. É um campo opcional no formulário de nova avaliação — quando enviada, aparece no detalhe da avaliação e no laudo em PDF.</p>
        </details>
        <details class="faq-item">
          <summary>Outro avaliador consegue ver minhas avaliações?</summary>
          <p>Não. Cada conta só enxerga as avaliações que ela mesma criou. As tabelas de parâmetros (Ross-Heidecke, CUB, etc.) são as únicas informações compartilhadas entre todos.</p>
        </details>
      </div>
    </section>

    <footer class="manual-footer">
      Manual do Avaliador de Imóveis — Método Evolutivo · Passos/MG e região
    </footer>
  </main>
</div>
`;
