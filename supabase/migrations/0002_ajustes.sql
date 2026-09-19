-- Ajustes: protocolo ITCD, foto do imóvel, parâmetros travados (visíveis, não editáveis)

-- ---------------------------------------------------------------------------
-- Protocolo ITCD + foto do imóvel na avaliação
-- ---------------------------------------------------------------------------
alter table public.avaliacoes
  add column if not exists protocolo text,
  add column if not exists foto_url text,
  add column if not exists proprietario_nome text;

-- ---------------------------------------------------------------------------
-- Storage: bucket para as fotos dos imóveis avaliados
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('fotos-imoveis', 'fotos-imoveis', true)
on conflict (id) do nothing;

create policy "avaliador envia fotos de imoveis"
  on storage.objects for insert
  with check (bucket_id = 'fotos-imoveis' and auth.role() = 'authenticated');

create policy "avaliador atualiza as proprias fotos"
  on storage.objects for update
  using (bucket_id = 'fotos-imoveis' and auth.role() = 'authenticated');

create policy "avaliador remove as proprias fotos"
  on storage.objects for delete
  using (bucket_id = 'fotos-imoveis' and auth.role() = 'authenticated');

create policy "fotos de imoveis sao publicas para leitura"
  on storage.objects for select
  using (bucket_id = 'fotos-imoveis');

-- ---------------------------------------------------------------------------
-- Parâmetros de referência: travados. Ficam visíveis (select) mas deixam de
-- ser editáveis pelos avaliadores via app, pra manter o mesmo padrão de
-- análise entre todos. Atualização de valores passa a ser feita só via
-- SQL editor do Supabase.
-- ---------------------------------------------------------------------------
drop policy if exists "autenticados editam cidades" on public.cidades;
drop policy if exists "autenticados editam parametros_terreno" on public.parametros_terreno;
drop policy if exists "autenticados editam padroes_construtivos" on public.padroes_construtivos;
drop policy if exists "autenticados editam tipos_construcao" on public.tipos_construcao;
drop policy if exists "autenticados editam ross_heidecke_fatores" on public.ross_heidecke_fatores;
