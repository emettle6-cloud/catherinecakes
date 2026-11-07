create table products(id text primary key,name text not null,price numeric not null,category text);
create table orders(id uuid primary key default gen_random_uuid(),reference text unique,name text,phone text,network text,address text,items jsonb,amount numeric,status text default 'pending',created_at timestamptz default now());
alter table products enable row level security;
alter table orders enable row level security;
create policy "public read products" on products for select using (true);
insert into products values
('choc','Chocolate Dream Cake',320,'cakes'),('van','Vanilla Bliss Cake',280,'cakes'),
('cup','Assorted Cupcakes (6pcs)',120,'cupcakes'),('puff','Puff Pastries (6pcs)',90,'pastries'),
('pie','Meat Pie (6pcs)',80,'pastries'),('plat','Snack Platter',150,'snacks');
