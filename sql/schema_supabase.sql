-- Supabase schema for products, categories, carts, orders
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

-- 4) Carts (one per user, but users can have multiple if you want)
create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  status text default 'active', -- active | ordered | cancelled
  created_at timestamptz default now()
);

-- 5) Cart items
create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid references public.carts(id) on delete cascade,
  product_id text references public.products(id),
  quantity int not null default 1,
  price numeric not null,
  inserted_at timestamptz default now()
);

-- 6) Orders and order items (for checkout)
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  total numeric not null,
  status text default 'pending', -- pending | paid | cancelled
  created_at timestamptz default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  product_id text references public.products(id),
  quantity int not null default 1,
  price numeric not null
);

-- 7) Enable Row Level Security where appropriate
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- 8) Policies
-- Allow anyone to read products and categories
create policy "public_select_products" on public.products
  for select using (true);
create policy "public_select_categories" on public.categories
  for select using (true);

-- Allow authenticated users to manage their own carts
create policy "users_manage_own_carts" on public.carts
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Allow users to manage cart_items only for carts they own
create policy "cart_items_users" on public.cart_items
  for all using (
    exists (select 1 from public.carts c where c.id = cart_items.cart_id and c.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.carts c where c.id = cart_items.cart_id and c.user_id = auth.uid())
  );

-- Allow users to create orders for themselves and read their orders
create policy "orders_user_read_create" on public.orders
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Order items policy: allow if order belongs to user
create policy "order_items_user" on public.order_items
  for all using (
    exists (select 1 from public.orders o where o.id = order_items.order_id and o.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.orders o where o.id = order_items.order_id and o.user_id = auth.uid())
  );

-- 9) Example seed for categories (optional)
insert into public.categories (id, name, description, image)
values
  ('arcillas', 'Arcillas', 'Arcillas naturales y preparadas', '/images/categories/arcillas.jpg')
on conflict (id) do nothing;

-- You can add product seeds similarly or import CSV via Supabase UI
