-- Esquema limpio para Supabase: solo catalogo
-- Tablas incluidas: categories y products
-- Pensado para una app de catalogo + carrito local + derivacion a WhatsApp

create extension if not exists "pgcrypto";

create table if not exists public.categories (
  id text primary key,
  name text not null,
  description text,
  image text
);

create table if not exists public.products (
  id text primary key,
  name text not null,
  description text,
  price numeric not null,
  category text references public.categories(id) on delete set null,
  image text,
  in_stock boolean default true,
  created_at timestamptz default now()
);

alter table public.categories enable row level security;
alter table public.products enable row level security;

drop policy if exists "public_select_categories" on public.categories;
drop policy if exists "public_select_products" on public.products;

create policy "public_select_categories" on public.categories
  for select using (true);

create policy "public_select_products" on public.products
  for select using (true);

insert into public.categories (id, name, description, image)
values
  ('contramoldes', 'Contramoldes', 'Contramoldes y moldes de yeso', '/images/categories/contramoldes.jpg'),
  ('engobes-rahue', 'Engobes Rahue', 'Engobes de terminación y decoración', '/images/categories/engobes-rahue.jpg'),
  ('herramientas', 'Herramientas', 'Herramientas para modelado y taller', '/images/categories/herramientas.jpg'),
  ('stencils', 'Stencils', 'Plantillas para decoración y repetición de patrones', '/images/categories/stencils.jpg'),
  ('transfers', 'Transfers', 'Transfers cerámicos para decoración', '/images/categories/transfers.jpg'),
  ('quimica', 'Química', 'Productos químicos para proceso y formulación', '/images/categories/quimica.jpg'),
  ('pigmentos', 'Pigmentos', 'Pigmentos para coloración y decoración', '/images/categories/pigmentos.jpg'),
  ('oxidos', 'Oxidos', 'Óxidos y colorantes cerámicos', '/images/categories/oxidos.jpg'),
  ('cortantes', 'Cortantes', 'Herramientas de corte y perforado', '/images/categories/cortantes.jpg'),
  ('sellos', 'Sellos', 'Sellos decorativos para cerámica', '/images/categories/sellos.jpg'),
  ('arcillas', 'Arcillas', 'Arcillas naturales y preparadas', '/images/categories/arcillas.jpg'),
  ('barbotinas', 'Barbotinas', 'Barbotinas y pastas líquidas', '/images/categories/barbotinas.jpg'),
  ('esmaltes', 'Esmaltes', 'Esmaltes de alta y baja temperatura', '/images/categories/esmaltes.jpg'),
  ('sellos-de-goma', 'Sellos de goma', 'Sellos de goma para impresión y decoración', '/images/categories/sellos-de-goma.jpg')
on conflict (id) do nothing;

-- Si quieres cargar productos, puedes insertar filas en public.products
-- o importarlos desde CSV en el editor de Supabase.