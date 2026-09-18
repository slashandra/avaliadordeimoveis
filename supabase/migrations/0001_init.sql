-- Avaliador de Imóveis — schema inicial
-- Método evolutivo (urbano): valor do terreno + valor da construção depreciada (Ross-Heidecke)

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Avaliadores (perfil ligado ao auth.users)
-- ---------------------------------------------------------------------------
create table public.avaliadores (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  masp text,
  created_at timestamptz not null default now()
);

alter table public.avaliadores enable row level security;

create policy "avaliador vê o próprio perfil"
  on public.avaliadores for select
  using (auth.uid() = id);

create policy "avaliador edita o próprio perfil"
  on public.avaliadores for update
  using (auth.uid() = id);

create policy "avaliador cria o próprio perfil"
  on public.avaliadores for insert
  with check (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- Clientes
-- ---------------------------------------------------------------------------
create table public.clientes (
  id uuid primary key default gen_random_uuid(),
  avaliador_id uuid not null references public.avaliadores(id) on delete cascade,
  nome text not null,
  documento text,
  telefone text,
  email text,
  created_at timestamptz not null default now()
);

alter table public.clientes enable row level security;

create policy "avaliador gerencia os próprios clientes"
  on public.clientes for all
  using (auth.uid() = avaliador_id)
  with check (auth.uid() = avaliador_id);

-- ---------------------------------------------------------------------------
-- Parâmetros de referência (compartilhados entre avaliadores, editáveis)
-- ---------------------------------------------------------------------------

-- Índice de cada cidade sobre os valores-base de Passos/MG (Passos = 1.0)
create table public.cidades (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  indice numeric(4,2) not null default 1.0,
  created_at timestamptz not null default now()
);

-- Valor-base do m² de terreno em Passos/MG por categoria/padrão de localização
create table public.parametros_terreno (
  id uuid primary key default gen_random_uuid(),
  categoria text not null check (categoria in ('central', 'perimetral', 'periferica')),
  padrao text not null check (padrao in ('maxima', 'media', 'minima')),
  valor_m2 numeric(12,2) not null,
  unique (categoria, padrao)
);

-- Custo unitário básico (CUB/m²) por padrão construtivo (SINDUSCOM/MG, NBR 12.721)
create table public.padroes_construtivos (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  tipo text not null check (tipo in ('residencial', 'comercial', 'industrial')),
  valor_m2 numeric(12,2) not null
);

-- Vida útil (anos) por tipo de construção — Tabela Bureau of Internal Revenue
create table public.tipos_construcao (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  vida_util_anos integer not null
);

-- Tabela de Ross-Heidecke (fator de depreciação) — idade em % da vida útil × estado de conservação
create table public.ross_heidecke_fatores (
  idade_pct integer not null check (idade_pct between 2 and 100 and idade_pct % 2 = 0),
  estado_conservacao char(1) not null check (estado_conservacao in ('A','B','C','D','E','F','G','H')),
  fator numeric(6,4) not null,
  primary key (idade_pct, estado_conservacao)
);

alter table public.cidades enable row level security;
alter table public.parametros_terreno enable row level security;
alter table public.padroes_construtivos enable row level security;
alter table public.tipos_construcao enable row level security;
alter table public.ross_heidecke_fatores enable row level security;

create policy "autenticados leem cidades" on public.cidades for select using (auth.role() = 'authenticated');
create policy "autenticados editam cidades" on public.cidades for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "autenticados leem parametros_terreno" on public.parametros_terreno for select using (auth.role() = 'authenticated');
create policy "autenticados editam parametros_terreno" on public.parametros_terreno for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "autenticados leem padroes_construtivos" on public.padroes_construtivos for select using (auth.role() = 'authenticated');
create policy "autenticados editam padroes_construtivos" on public.padroes_construtivos for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "autenticados leem tipos_construcao" on public.tipos_construcao for select using (auth.role() = 'authenticated');
create policy "autenticados editam tipos_construcao" on public.tipos_construcao for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "autenticados leem ross_heidecke_fatores" on public.ross_heidecke_fatores for select using (auth.role() = 'authenticated');
create policy "autenticados editam ross_heidecke_fatores" on public.ross_heidecke_fatores for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- Avaliações
-- ---------------------------------------------------------------------------
create table public.avaliacoes (
  id uuid primary key default gen_random_uuid(),
  avaliador_id uuid not null references public.avaliadores(id) on delete cascade,
  cliente_id uuid references public.clientes(id) on delete set null,
  tipo text not null check (tipo in ('urbano', 'rural')),
  cidade_id uuid references public.cidades(id),
  endereco text,
  status text not null default 'rascunho' check (status in ('rascunho', 'concluida')),
  dados jsonb not null default '{}'::jsonb,
  resultado jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.avaliacoes enable row level security;

create policy "avaliador gerencia as próprias avaliações"
  on public.avaliacoes for all
  using (auth.uid() = avaliador_id)
  with check (auth.uid() = avaliador_id);

create index avaliacoes_avaliador_id_idx on public.avaliacoes (avaliador_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Seed: dados do prompt de avaliação (Método Evolutivo — Passos/MG, nov/2023)
-- ---------------------------------------------------------------------------

insert into public.cidades (nome, indice) values
  ('Passos', 1.0),
  ('Cássia', 0.8),
  ('Piumhi', 0.8),
  ('Itaú de Minas', 0.7),
  ('Alpinópolis', 0.7),
  ('Pratápolis', 0.6),
  ('Pimenta', 0.6),
  ('Carmo do Rio Claro', 0.6),
  ('Ibiraci', 0.6),
  ('Fortaleza de Minas', 0.6),
  ('São João Batista do Glória', 0.6),
  ('São José da Barra', 0.6),
  ('Capitólio', 0.6),
  ('Claraval', 0.6),
  ('Capetinga', 0.6),
  ('Delfinópolis', 0.6),
  ('São Roque de Minas', 0.6),
  ('Vargem Bonita', 0.6),
  ('Conceição da Aparecida', 0.6);

insert into public.parametros_terreno (categoria, padrao, valor_m2) values
  ('central', 'maxima', 1500.00),
  ('central', 'media', 1100.00),
  ('central', 'minima', 980.00),
  ('perimetral', 'maxima', 1100.00),
  ('perimetral', 'media', 900.00),
  ('perimetral', 'minima', 750.00),
  ('periferica', 'maxima', 500.00),
  ('periferica', 'media', 300.00),
  ('periferica', 'minima', 100.00);

insert into public.padroes_construtivos (nome, tipo, valor_m2) values
  ('Residencial Popular', 'residencial', 2216.58),
  ('Residencial Baixo', 'residencial', 1958.58),
  ('Residencial Normal', 'residencial', 2157.66),
  ('Residencial Alto', 'residencial', 2643.26),
  ('Comercial Normal', 'comercial', 2498.96),
  ('Comercial Alto', 'comercial', 2698.04),
  ('Galpão Industrial', 'industrial', 1152.28);

insert into public.tipos_construcao (nome, vida_util_anos) values
  ('Apartamentos', 60),
  ('Casas de Alvenaria', 65),
  ('Casas de Madeira', 45),
  ('Hotéis', 50),
  ('Lojas', 70),
  ('Armazéns', 75),
  ('Fábricas', 50),
  ('Construções Rurais', 60),
  ('Garagens', 60),
  ('Edifícios de Escritórios', 70),
  ('Galpões (Depósitos)', 70),
  ('Silos', 75);

insert into public.ross_heidecke_fatores (idade_pct, estado_conservacao, fator) values
(2, 'A', 0.9898),
(2, 'B', 0.9895),
(2, 'C', 0.9649),
(2, 'D', 0.9097),
(2, 'E', 0.811),
(2, 'F', 0.607),
(2, 'G', 0.469),
(2, 'H', 0.246),
(4, 'A', 0.9792),
(4, 'B', 0.9789),
(4, 'C', 0.9545),
(4, 'D', 0.9),
(4, 'E', 0.802),
(4, 'F', 0.654),
(4, 'G', 0.464),
(4, 'H', 0.243),
(6, 'A', 0.9682),
(6, 'B', 0.9679),
(6, 'C', 0.9438),
(6, 'D', 0.89),
(6, 'E', 0.793),
(6, 'F', 0.647),
(6, 'G', 0.459),
(6, 'H', 0.24),
(8, 'A', 0.9568),
(8, 'B', 0.9565),
(8, 'C', 0.9327),
(8, 'D', 0.879),
(8, 'E', 0.784),
(8, 'F', 0.639),
(8, 'G', 0.454),
(8, 'H', 0.237),
(10, 'A', 0.945),
(10, 'B', 0.9447),
(10, 'C', 0.9212),
(10, 'D', 0.868),
(10, 'E', 0.774),
(10, 'F', 0.631),
(10, 'G', 0.448),
(10, 'H', 0.234),
(12, 'A', 0.9328),
(12, 'B', 0.9325),
(12, 'C', 0.9093),
(12, 'D', 0.857),
(12, 'E', 0.764),
(12, 'F', 0.623),
(12, 'G', 0.442),
(12, 'H', 0.231),
(14, 'A', 0.9202),
(14, 'B', 0.9199),
(14, 'C', 0.897),
(14, 'D', 0.846),
(14, 'E', 0.754),
(14, 'F', 0.615),
(14, 'G', 0.436),
(14, 'H', 0.228),
(16, 'A', 0.9072),
(16, 'B', 0.9069),
(16, 'C', 0.884),
(16, 'D', 0.834),
(16, 'E', 0.743),
(16, 'F', 0.606),
(16, 'G', 0.43),
(16, 'H', 0.225),
(18, 'A', 0.894),
(18, 'B', 0.894),
(18, 'C', 0.871),
(18, 'D', 0.822),
(18, 'E', 0.732),
(18, 'F', 0.597),
(18, 'G', 0.424),
(18, 'H', 0.222),
(20, 'A', 0.88),
(20, 'B', 0.88),
(20, 'C', 0.858),
(20, 'D', 0.809),
(20, 'E', 0.721),
(20, 'F', 0.582),
(20, 'G', 0.417),
(20, 'H', 0.218),
(22, 'A', 0.866),
(22, 'B', 0.866),
(22, 'C', 0.844),
(22, 'D', 0.796),
(22, 'E', 0.709),
(22, 'F', 0.578),
(22, 'G', 0.41),
(22, 'H', 0.215),
(24, 'A', 0.851),
(24, 'B', 0.851),
(24, 'C', 0.83),
(24, 'D', 0.782),
(24, 'E', 0.697),
(24, 'F', 0.569),
(24, 'G', 0.404),
(24, 'H', 0.211),
(26, 'A', 0.836),
(26, 'B', 0.836),
(26, 'C', 0.815),
(26, 'D', 0.769),
(26, 'E', 0.685),
(26, 'F', 0.559),
(26, 'G', 0.396),
(26, 'H', 0.207),
(28, 'A', 0.821),
(28, 'B', 0.821),
(28, 'C', 0.8),
(28, 'D', 0.754),
(28, 'E', 0.672),
(28, 'F', 0.548),
(28, 'G', 0.389),
(28, 'H', 0.204),
(30, 'A', 0.805),
(30, 'B', 0.805),
(30, 'C', 0.785),
(30, 'D', 0.74),
(30, 'E', 0.659),
(30, 'F', 0.538),
(30, 'G', 0.382),
(30, 'H', 0.2),
(32, 'A', 0.789),
(32, 'B', 0.789),
(32, 'C', 0.769),
(32, 'D', 0.725),
(32, 'E', 0.646),
(32, 'F', 0.527),
(32, 'G', 0.374),
(32, 'H', 0.196),
(34, 'A', 0.772),
(34, 'B', 0.772),
(34, 'C', 0.753),
(34, 'D', 0.71),
(34, 'E', 0.632),
(34, 'F', 0.516),
(34, 'G', 0.366),
(34, 'H', 0.192),
(36, 'A', 0.755),
(36, 'B', 0.755),
(36, 'C', 0.736),
(36, 'D', 0.695),
(36, 'E', 0.619),
(36, 'F', 0.505),
(36, 'G', 0.358),
(36, 'H', 0.187),
(38, 'A', 0.738),
(38, 'B', 0.738),
(38, 'C', 0.719),
(38, 'D', 0.678),
(38, 'E', 0.604),
(38, 'F', 0.493),
(38, 'G', 0.35),
(38, 'H', 0.183),
(40, 'A', 0.712),
(40, 'B', 0.712),
(40, 'C', 0.7031),
(40, 'D', 0.662),
(40, 'E', 0.59),
(40, 'F', 0.481),
(40, 'G', 0.341),
(40, 'H', 0.179),
(42, 'A', 0.701),
(42, 'B', 0.701),
(42, 'C', 0.684),
(42, 'D', 0.645),
(42, 'E', 0.575),
(42, 'F', 0.469),
(42, 'G', 0.333),
(42, 'H', 0.174),
(44, 'A', 0.683),
(44, 'B', 0.683),
(44, 'C', 0.666),
(44, 'D', 0.628),
(44, 'E', 0.56),
(44, 'F', 0.456),
(44, 'G', 0.324),
(44, 'H', 0.169),
(46, 'A', 0.664),
(46, 'B', 0.664),
(46, 'C', 0.648),
(46, 'D', 0.611),
(46, 'E', 0.544),
(46, 'F', 0.444),
(46, 'G', 0.315),
(46, 'H', 0.165),
(48, 'A', 0.644),
(48, 'B', 0.644),
(48, 'C', 0.629),
(48, 'D', 0.593),
(48, 'E', 0.528),
(48, 'F', 0.431),
(48, 'G', 0.306),
(48, 'H', 0.16),
(50, 'A', 0.625),
(50, 'B', 0.625),
(50, 'C', 0.609),
(50, 'D', 0.574),
(50, 'E', 0.512),
(50, 'F', 0.418),
(50, 'G', 0.296),
(50, 'H', 0.155),
(52, 'A', 0.605),
(52, 'B', 0.605),
(52, 'C', 0.581),
(52, 'D', 0.56),
(52, 'E', 0.495),
(52, 'F', 0.404),
(52, 'G', 0.287),
(52, 'H', 0.15),
(54, 'A', 0.584),
(54, 'B', 0.584),
(54, 'C', 0.57),
(54, 'D', 0.537),
(54, 'E', 0.479),
(54, 'F', 0.39),
(54, 'G', 0.277),
(54, 'H', 0.145),
(56, 'A', 0.563),
(56, 'B', 0.563),
(56, 'C', 0.549),
(56, 'D', 0.518),
(56, 'E', 0.461),
(56, 'F', 0.376),
(56, 'G', 0.267),
(56, 'H', 0.14),
(58, 'A', 0.542),
(58, 'B', 0.542),
(58, 'C', 0.528),
(58, 'D', 0.498),
(58, 'E', 0.444),
(58, 'F', 0.362),
(58, 'G', 0.257),
(58, 'H', 0.134),
(60, 'A', 0.512),
(60, 'B', 0.512),
(60, 'C', 0.507),
(60, 'D', 0.478),
(60, 'E', 0.426),
(60, 'F', 0.347),
(60, 'G', 0.247),
(60, 'H', 0.129),
(62, 'A', 0.498),
(62, 'B', 0.498),
(62, 'C', 0.485),
(62, 'D', 0.458),
(62, 'E', 0.408),
(62, 'F', 0.333),
(62, 'G', 0.246),
(62, 'H', 0.123),
(64, 'A', 0.475),
(64, 'B', 0.475),
(64, 'C', 0.463),
(64, 'D', 0.437),
(64, 'E', 0.389),
(64, 'F', 0.317),
(64, 'G', 0.225),
(64, 'H', 0.118),
(66, 'A', 0.452),
(66, 'B', 0.452),
(66, 'C', 0.441),
(66, 'D', 0.416),
(66, 'E', 0.37),
(66, 'F', 0.302),
(66, 'G', 0.214),
(66, 'H', 0.112),
(68, 'A', 0.429),
(68, 'B', 0.429),
(68, 'C', 0.418),
(68, 'D', 0.394),
(68, 'E', 0.351),
(68, 'F', 0.286),
(68, 'G', 0.203),
(68, 'H', 0.106),
(70, 'A', 0.405),
(70, 'B', 0.405),
(70, 'C', 0.395),
(70, 'D', 0.372),
(70, 'E', 0.332),
(70, 'F', 0.271),
(70, 'G', 0.192),
(70, 'H', 0.096),
(72, 'A', 0.378),
(72, 'B', 0.378),
(72, 'C', 0.371),
(72, 'D', 0.35),
(72, 'E', 0.312),
(72, 'F', 0.254),
(72, 'G', 0.181),
(72, 'H', 0.091),
(74, 'A', 0.356),
(74, 'B', 0.356),
(74, 'C', 0.347),
(74, 'D', 0.327),
(74, 'E', 0.292),
(74, 'F', 0.238),
(74, 'G', 0.169),
(74, 'H', 0.088),
(76, 'A', 0.331),
(76, 'B', 0.331),
(76, 'C', 0.323),
(76, 'D', 0.304),
(76, 'E', 0.271),
(76, 'F', 0.221),
(76, 'G', 0.157),
(76, 'H', 0.082),
(78, 'A', 0.306),
(78, 'B', 0.306),
(78, 'C', 0.278),
(78, 'D', 0.281),
(78, 'E', 0.251),
(78, 'F', 0.204),
(78, 'G', 0.145),
(78, 'H', 0.076),
(80, 'A', 0.28),
(80, 'B', 0.28),
(80, 'C', 0.273),
(80, 'D', 0.257),
(80, 'E', 0.229),
(80, 'F', 0.187),
(80, 'G', 0.133),
(80, 'H', 0.069),
(82, 'A', 0.254),
(82, 'B', 0.254),
(82, 'C', 0.247),
(82, 'D', 0.233),
(82, 'E', 0.208),
(82, 'F', 0.17),
(82, 'G', 0.12),
(82, 'H', 0.063),
(84, 'A', 0.227),
(84, 'B', 0.227),
(84, 'C', 0.222),
(84, 'D', 0.209),
(84, 'E', 0.186),
(84, 'F', 0.155),
(84, 'G', 0.108),
(84, 'H', 0.056),
(86, 'A', 0.2),
(86, 'B', 0.2),
(86, 'C', 0.195),
(86, 'D', 0.184),
(86, 'E', 0.164),
(86, 'F', 0.134),
(86, 'G', 0.095),
(86, 'H', 0.05),
(88, 'A', 0.173),
(88, 'B', 0.173),
(88, 'C', 0.168),
(88, 'D', 0.159),
(88, 'E', 0.142),
(88, 'F', 0.115),
(88, 'G', 0.082),
(88, 'H', 0.043),
(90, 'A', 0.145),
(90, 'B', 0.145),
(90, 'C', 0.141),
(90, 'D', 0.133),
(90, 'E', 0.119),
(90, 'F', 0.097),
(90, 'G', 0.069),
(90, 'H', 0.036),
(92, 'A', 0.117),
(92, 'B', 0.117),
(92, 'C', 0.114),
(92, 'D', 0.107),
(92, 'E', 0.096),
(92, 'F', 0.078),
(92, 'G', 0.059),
(92, 'H', 0.022),
(94, 'A', 0.088),
(94, 'B', 0.088),
(94, 'C', 0.086),
(94, 'D', 0.081),
(94, 'E', 0.072),
(94, 'F', 0.059),
(94, 'G', 0.042),
(94, 'H', 0.022),
(96, 'A', 0.059),
(96, 'B', 0.059),
(96, 'C', 0.058),
(96, 'D', 0.054),
(96, 'E', 0.049),
(96, 'F', 0.04),
(96, 'G', 0.028),
(96, 'H', 0.015),
(98, 'A', 0.03),
(98, 'B', 0.03),
(98, 'C', 0.029),
(98, 'D', 0.027),
(98, 'E', 0.024),
(98, 'F', 0.02),
(98, 'G', 0.02),
(98, 'H', 0.002),
(100, 'A', 0),
(100, 'B', 0),
(100, 'C', 0),
(100, 'D', 0),
(100, 'E', 0),
(100, 'F', 0),
(100, 'G', 0),
(100, 'H', 0);

-- Cria automaticamente o perfil de avaliador no signup
create function public.handle_novo_avaliador()
returns trigger as $$
begin
  insert into public.avaliadores (id, nome, masp)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'masp'
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_novo_avaliador();
