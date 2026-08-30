-- Esquema con dos niveles: categoriaPrincipal y subcategories
create extension if not exists "pgcrypto";

create table if not exists public.categoriaPrincipal (
  id text primary key,
  name text not null,
  description text,
  image text,
  created_at timestamptz default now()
);

create table if not exists public.subcategories (
  id text primary key,
  name text not null,
  description text,
  image text,
  categoria_principal_id text references public.categoriaPrincipal(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.products (
  id text primary key,
  name text not null,
  description text,
  price numeric not null,
  category text references public.subcategories(id) on delete set null,
  image text,
  in_stock boolean default true,
  created_at timestamptz default now()
);

alter table public.categoriaPrincipal enable row level security;
alter table public.subcategories enable row level security;
alter table public.products enable row level security;

drop policy if exists "public_select_categoria_principal" on public.categoriaPrincipal;
drop policy if exists "public_select_subcategories" on public.subcategories;
drop policy if exists "public_select_products" on public.products;

create policy "public_select_categoria_principal" on public.categoriaPrincipal
  for select using (true);

create policy "public_select_subcategories" on public.subcategories
  for select using (true);

create policy "public_select_products" on public.products
  for select using (true);

insert into public.categoriaPrincipal (id, name, description, image)
values
  ('materias-primas', 'Materias Primas', 'Arcillas, barbotinas y materias básicas para cerámica.', '/images/categories/materias-primas.jpg'),
  ('color-y-acabados', 'Color y Acabados', 'Esmaltes, engobes, pigmentos y óxidos.', '/images/categories/color-y-acabados.jpg'),
  ('herramientas-y-accesorios', 'Herramientas y Accesorios', 'Utensilios para modelado, corte, texturas y moldeado.', '/images/categories/herramientas-y-accesorios.jpg'),
  ('quimica-y-formulas', 'Química y Fórmulas', 'Bases y fundentes para procesos cerámicos.', '/images/categories/quimica-y-formulas.jpg'),
  ('bizcochos', 'Bizcochos', 'Vajillas, decoraciones, utilitarios y piezas de bizcocho.', '/images/categories/bizcochos.jpg')
on conflict (id) do nothing;

insert into public.subcategories (id, name, description, image, categoria_principal_id)
values
  ('arcillas', 'Arcillas', 'Arcillas para modelado y torno.', '/images/categories/arcillas.jpg', 'materias-primas'),
  ('barbotinas', 'Barbotinas', 'Barbotinas y pastas líquidas.', '/images/categories/barbotinas.jpg', 'materias-primas'),
  ('esmaltes', 'Esmaltes', 'Esmaltes para alta y baja temperatura.', '/images/categories/esmaltes.jpg', 'color-y-acabados'),
  ('engobes', 'Engobes', 'Engobes para terminación y decoración.', '/images/categories/engobes.jpg', 'color-y-acabados'),
  ('pigmentos', 'Pigmentos', 'Pigmentos para coloración.', '/images/categories/pigmentos.jpg', 'color-y-acabados'),
  ('oxidos', 'Óxidos', 'Óxidos y colorantes cerámicos.', '/images/categories/oxidos.jpg', 'color-y-acabados'),
  ('de-modelado', 'De Modelado', 'Herramientas para modelado y trabajo artístico.', '/images/categories/de-modelado.jpg', 'herramientas-y-accesorios'),
  ('cortantes', 'Cortantes', 'Herramientas de corte y perforado.', '/images/categories/cortantes.jpg', 'herramientas-y-accesorios'),
  ('texturas-y-moldes', 'Texturas y moldes', 'Texturas, moldes y accesorios decorativos.', '/images/categories/texturas-y-moldes.jpg', 'herramientas-y-accesorios'),
  ('bases-y-fundentes', 'Bases y Fundentes', 'Productos de base y formula para cocción.', '/images/categories/bases-y-fundentes.jpg', 'quimica-y-formulas'),
  ('vajillas', 'Vajillas', 'Piezas de vajilla y servicio.', '/images/categories/vajillas.jpg', 'bizcochos'),
  ('decoracion', 'Decoración', 'Decoraciones para piezas y servicios.', '/images/categories/decoracion.jpg', 'bizcochos'),
  ('utilitarios', 'Utilitarios', 'Utilitarios y piezas funcionales.', '/images/categories/utilitarios.jpg', 'bizcochos'),
  ('otros', 'Otros', 'Otras piezas y elementos del catálogo.', '/images/categories/otros.jpg', 'bizcochos')
on conflict (id) do nothing;
