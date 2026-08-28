-- Supabase schema for catalog only: products and categories
-- Run this in Supabase SQL editor (Project -> SQL)

-- 1) Enable UUID generator
create extension if not exists "pgcrypto";

-- 2) Categories
create table if not exists public.categories (
  id text primary key,
  name text not null,
  description text,
  image text
);

-- 3) Products
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

-- 4) Policies
-- Allow anyone to read products and categories
create policy "public_select_products" on public.products
  for select using (true);
create policy "public_select_categories" on public.categories
  for select using (true);

-- 5) Example seed for categories (optional)
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

-- You can add product seeds similarly or import CSV via Supabase UI