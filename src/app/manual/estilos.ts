export const CSS_MANUAL = `
  .manual-root {
    --paper: #FAFAF8;
    --paper-raised: #FFFFFF;
    --ink: #1A1D1C;
    --ink-soft: #5B5F5D;
    --ink-faint: #8A8D8B;
    --line: rgba(26,29,28,0.10);
    --line-strong: rgba(26,29,28,0.16);
    --field: #3F5A44;
    --field-soft: #E7ECE7;
    --terra: #8A6D4B;
    --terra-soft: #F3ECE3;
    --badge-bg: #EEF2EE;
    --shadow: 0 1px 2px rgba(26,29,28,0.06), 0 8px 24px rgba(26,29,28,0.05);
  }

  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=JetBrains+Mono:wght@500&display=swap');

  .manual-root * { box-sizing: border-box; }
  .manual-root {
    background: var(--paper);
    color: var(--ink);
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    line-height: 1.6;
  }
  .manual-root h1, .manual-root h2, .manual-root h3, .manual-root h4 { font-family: 'Fraunces', serif; font-weight: 600; text-wrap: balance; margin: 0; }
  .manual-root a { color: inherit; }
  .manual-root .mono { font-family: 'JetBrains Mono', monospace; }

  .manual-root .shell {
    display: grid;
    grid-template-columns: 260px minmax(0,1fr);
    max-width: 1200px;
    margin: 0 auto;
  }
  @media (max-width: 860px) {
    .manual-root .shell { grid-template-columns: 1fr; }
  }

  .manual-root .toc {
    position: sticky;
    top: 0;
    align-self: start;
    height: 100vh;
    overflow-y: auto;
    padding: 28px 20px 28px 24px;
    border-right: 1px solid var(--line);
  }
  @media (max-width: 860px) {
    .manual-root .toc { display: none; }
  }
  .manual-root .toc-brand {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }
  .manual-root .toc-brand .dot {
    width: 9px; height: 9px; border-radius: 50%;
    background: var(--field);
  }
  .manual-root .toc-brand span {
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ink-faint);
    font-weight: 600;
  }
  .manual-root .toc h1 {
    font-size: 20px;
    margin-bottom: 22px;
    line-height: 1.25;
  }
  .manual-root .toc nav {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .manual-root .toc-group {
    font-size: 10.5px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ink-faint);
    font-weight: 600;
    margin: 16px 0 6px;
  }
  .manual-root .toc-group:first-of-type { margin-top: 0; }
  .manual-root .toc a.toc-link {
    display: block;
    padding: 6px 10px;
    border-radius: 6px;
    font-size: 13.5px;
    color: var(--ink-soft);
    text-decoration: none;
    transition: background 120ms, color 120ms;
  }
  .manual-root .toc a.toc-link:hover { background: var(--badge-bg); color: var(--ink); }
  .manual-root .toc a.toc-link.active { background: var(--field-soft); color: var(--field); font-weight: 600; }

  .manual-root main { padding: 0; min-width: 0; }

  .manual-root .hero {
    padding: 64px 48px 48px;
    border-bottom: 1px solid var(--line);
  }
  @media (max-width: 860px) { .manual-root .hero { padding: 40px 20px 32px; } }
  .manual-root .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--field);
    font-weight: 600;
    margin-bottom: 16px;
  }
  .manual-root .eyebrow .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--field); }
  .manual-root .hero h1 { font-size: clamp(32px, 5vw, 46px); margin-bottom: 14px; max-width: 15ch; }
  .manual-root .hero p.lede { font-size: 17px; color: var(--ink-soft); max-width: 56ch; margin-bottom: 24px; }
  .manual-root .hero-meta {
    display: flex; flex-wrap: wrap; gap: 10px;
  }
  .manual-root .chip {
    font-size: 12px;
    padding: 6px 12px;
    border-radius: 999px;
    border: 1px solid var(--line-strong);
    color: var(--ink-soft);
    background: var(--paper-raised);
  }

  .manual-root section.block {
    padding: 48px;
    border-bottom: 1px solid var(--line);
    scroll-margin-top: 20px;
  }
  @media (max-width: 860px) { .manual-root section.block { padding: 36px 20px; } }

  .manual-root .block-head { margin-bottom: 28px; max-width: 68ch; }
  .manual-root .block-head .num {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: var(--terra);
    margin-bottom: 8px;
    display: block;
  }
  .manual-root .block-head h2 { font-size: 27px; margin-bottom: 10px; }
  .manual-root .block-head p { color: var(--ink-soft); font-size: 15px; }

  .manual-root .two-col {
    display: grid;
    grid-template-columns: minmax(0,1fr) minmax(0,1fr);
    gap: 32px;
    align-items: start;
  }
  @media (max-width: 780px) { .manual-root .two-col { grid-template-columns: 1fr; } }
  .manual-root .two-col.reverse { direction: rtl; }
  .manual-root .two-col.reverse > * { direction: ltr; }

  .manual-root .notes { display: flex; flex-direction: column; gap: 16px; }
  .manual-root .note {
    padding: 14px 16px;
    border-radius: 10px;
    background: var(--paper-raised);
    border: 1px solid var(--line);
  }
  .manual-root .note .label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: var(--field);
    text-transform: uppercase;
    margin-bottom: 4px;
  }
  .manual-root .note p { margin: 0; color: var(--ink-soft); font-size: 13.5px; }

  .manual-root .device {
    border-radius: 14px;
    background: var(--paper-raised);
    border: 1px solid var(--line);
    box-shadow: var(--shadow);
    overflow: hidden;
  }
  .manual-root .device-bar {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 14px;
    border-bottom: 1px solid var(--line);
    background: var(--badge-bg);
  }
  .manual-root .device-bar .traffic { width: 8px; height: 8px; border-radius: 50%; background: var(--line-strong); }
  .manual-root .device-bar .url {
    margin-left: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10.5px;
    color: var(--ink-faint);
    background: var(--paper);
    border-radius: 5px;
    padding: 3px 10px;
    border: 1px solid var(--line);
  }
  .manual-root .device-screen { padding: 22px 24px; background: var(--paper); }
  .manual-root .device-screen.tight { padding: 16px; }

  .manual-root .mk-eyebrow { font-size: 9.5px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--field); font-weight: 700; margin-bottom: 6px; }
  .manual-root .mk-h1 { font-family: 'Fraunces', serif; font-size: 20px; margin-bottom: 3px; }
  .manual-root .mk-sub { font-size: 11.5px; color: var(--ink-soft); margin-bottom: 16px; }

  .manual-root .mk-field { margin-bottom: 12px; }
  .manual-root .mk-label { font-size: 10.5px; color: var(--ink-faint); margin-bottom: 4px; }
  .manual-root .mk-input {
    border: 1px solid var(--line-strong);
    border-radius: 7px;
    padding: 8px 10px;
    font-size: 12px;
    color: var(--ink);
    background: var(--paper-raised);
  }
  .manual-root .mk-input.muted { color: var(--ink-faint); }
  .manual-root .mk-btn {
    display: inline-block;
    background: var(--field);
    color: var(--paper);
    font-size: 12px;
    font-weight: 600;
    padding: 9px 16px;
    border-radius: 7px;
  }
  .manual-root .mk-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .manual-root .mk-nav {
    display: flex; gap: 6px; margin-bottom: 18px;
  }
  .manual-root .mk-navlink { font-size: 11px; padding: 5px 10px; border-radius: 6px; color: var(--ink-soft); }
  .manual-root .mk-navlink.active { background: var(--field); color: var(--paper); font-weight: 600; }

  .manual-root .mk-card { border: 1px solid var(--line); border-radius: 9px; padding: 12px 14px; background: var(--paper-raised); }
  .manual-root .mk-listrow { display:flex; justify-content: space-between; align-items:center; padding: 10px 0; border-bottom: 1px solid var(--line); }
  .manual-root .mk-listrow:last-child { border-bottom: none; }
  .manual-root .mk-name { font-size: 12.5px; font-weight: 600; }
  .manual-root .mk-sub2 { font-size: 10.5px; color: var(--ink-faint); margin-top: 2px; }
  .manual-root .mk-value { font-size: 12.5px; font-weight: 600; color: var(--field); }
  .manual-root .mk-badge { font-size: 9px; padding: 2px 8px; border-radius: 999px; font-weight: 700; }
  .manual-root .mk-badge.done { background: var(--field-soft); color: var(--field); }
  .manual-root .mk-badge.draft { background: var(--terra-soft); color: var(--terra); }

  .manual-root .mk-result {
    border: 1px solid var(--field);
    background: var(--field-soft);
    border-radius: 9px;
    padding: 12px 14px;
    margin-top: 14px;
  }
  .manual-root .mk-result .big { font-family: 'Fraunces', serif; font-size: 21px; color: var(--field); margin-top: 4px; }

  .manual-root .mk-tabs { display:flex; gap:4px; background: var(--badge-bg); padding:3px; border-radius: 8px; margin-bottom: 14px; width: fit-content; }
  .manual-root .mk-tab { font-size: 10.5px; padding: 5px 10px; border-radius: 6px; color: var(--ink-soft); }
  .manual-root .mk-tab.active { background: var(--paper-raised); color: var(--ink); font-weight: 600; }

  .manual-root table.mk-table { width: 100%; border-collapse: collapse; font-size: 11px; }
  .manual-root table.mk-table th { text-align: left; font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ink-faint); padding: 6px 8px; border-bottom: 1px solid var(--line-strong); }
  .manual-root table.mk-table td { padding: 6px 8px; border-bottom: 1px solid var(--line); }

  .manual-root .steps { counter-reset: step; display: flex; flex-direction: column; gap: 18px; }
  .manual-root .step { display: flex; gap: 14px; }
  .manual-root .step .num {
    counter-increment: step;
    flex-shrink: 0;
    width: 28px; height: 28px; border-radius: 50%;
    background: var(--field);
    color: var(--paper);
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    display: flex; align-items: center; justify-content: center;
  }
  .manual-root .step .num::before { content: counter(step); }
  .manual-root .step h4 { font-size: 14.5px; margin-bottom: 3px; }
  .manual-root .step p { margin: 0; color: var(--ink-soft); font-size: 13.5px; }

  .manual-root .field-table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  .manual-root .field-table th {
    text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em;
    color: var(--ink-faint); padding: 10px 12px; border-bottom: 1px solid var(--line-strong);
  }
  .manual-root .field-table td { padding: 12px; border-bottom: 1px solid var(--line); font-size: 13.5px; vertical-align: top; }
  .manual-root .field-table td.fname { font-weight: 600; white-space: nowrap; }
  .manual-root .field-table td.fdesc { color: var(--ink-soft); }
  .manual-root .tag-opt { font-size: 10px; background: var(--terra-soft); color: var(--terra); padding: 1px 7px; border-radius: 999px; font-weight: 700; margin-left: 6px; }

  .manual-root .formula {
    background: var(--paper-raised);
    border: 1px solid var(--line);
    border-radius: 12px;
    padding: 20px 22px;
    box-shadow: var(--shadow);
  }
  .manual-root .formula .title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--field); font-weight: 700; margin-bottom: 10px; }
  .manual-root .formula .eq {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13.5px;
    line-height: 2;
    color: var(--ink);
  }
  .manual-root .formula .eq .op { color: var(--terra); margin: 0 6px; }
  .manual-root .formula .eq .var { color: var(--field); font-weight: 600; }

  .manual-root .source-list { display: flex; flex-direction: column; gap: 12px; margin-top: 16px; }
  .manual-root .source {
    display: flex; gap: 12px; align-items: flex-start;
    padding: 12px 14px;
    border: 1px solid var(--line);
    border-radius: 10px;
    background: var(--paper-raised);
  }
  .manual-root .source .ic {
    flex-shrink: 0; width: 30px; height: 30px; border-radius: 8px;
    background: var(--terra-soft); color: var(--terra);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; font-family: 'Fraunces', serif;
  }
  .manual-root .source h4 { font-size: 13.5px; margin-bottom: 2px; }
  .manual-root .source p { margin: 0; font-size: 12.5px; color: var(--ink-soft); }

  .manual-root .estado-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 10px; }
  @media (max-width: 560px) { .manual-root .estado-grid { grid-template-columns: repeat(2,1fr); } }
  .manual-root .estado-chip {
    border: 1px solid var(--line);
    border-radius: 9px;
    padding: 9px 10px;
    background: var(--paper-raised);
  }
  .manual-root .estado-chip .code { font-family: 'JetBrains Mono', monospace; font-weight: 700; color: var(--field); font-size: 13px; }
  .manual-root .estado-chip .desc { font-size: 10.5px; color: var(--ink-soft); margin-top: 2px; }

  .manual-root .faq { display: flex; flex-direction: column; gap: 10px; }
  .manual-root details.faq-item {
    border: 1px solid var(--line);
    border-radius: 10px;
    background: var(--paper-raised);
    padding: 4px 16px;
  }
  .manual-root details.faq-item summary {
    cursor: pointer;
    padding: 12px 0;
    font-weight: 600;
    font-size: 14px;
    list-style: none;
    display: flex; justify-content: space-between; align-items: center;
    gap: 12px;
  }
  .manual-root details.faq-item summary::-webkit-details-marker { display: none; }
  .manual-root details.faq-item summary::after { content: "+"; font-family: 'JetBrains Mono', monospace; color: var(--ink-faint); font-size: 16px; flex-shrink:0; }
  .manual-root details.faq-item[open] summary::after { content: "\\2013"; }
  .manual-root details.faq-item p { margin: 0 0 14px; color: var(--ink-soft); font-size: 13.5px; }

  .manual-root footer.manual-footer {
    padding: 40px 48px 64px;
    color: var(--ink-faint);
    font-size: 12.5px;
  }
  @media (max-width: 860px) { .manual-root footer.manual-footer { padding: 32px 20px 56px; } }

  .manual-root .mobile-toc {
    display: none;
    position: sticky; top: 0; z-index: 5;
    background: var(--paper);
    border-bottom: 1px solid var(--line);
    padding: 12px 20px;
  }
  @media (max-width: 860px) { .manual-root .mobile-toc { display: block; } }
  .manual-root .mobile-toc select {
    width: 100%;
    padding: 9px 12px;
    border-radius: 8px;
    border: 1px solid var(--line-strong);
    background: var(--paper-raised);
    color: var(--ink);
    font-size: 13px;
  }
`;
