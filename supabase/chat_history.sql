create extension if not exists pgcrypto;

create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'New Chat',
  subtitle text not null default 'Start a new conversation',
  pinned boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'bot')),
  content text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.touch_chat_session_updated_at()
returns trigger as $$
begin
  update public.chat_sessions
  set updated_at = timezone('utc', now())
  where id = new.session_id;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_touch_chat_session_updated_at on public.chat_messages;
create trigger trg_touch_chat_session_updated_at
after insert on public.chat_messages
for each row
execute procedure public.touch_chat_session_updated_at();

alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;

drop policy if exists "Users can read own chat sessions" on public.chat_sessions;
create policy "Users can read own chat sessions"
on public.chat_sessions
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own chat sessions" on public.chat_sessions;
create policy "Users can insert own chat sessions"
on public.chat_sessions
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own chat sessions" on public.chat_sessions;
create policy "Users can update own chat sessions"
on public.chat_sessions
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own chat sessions" on public.chat_sessions;
create policy "Users can delete own chat sessions"
on public.chat_sessions
for delete
using (auth.uid() = user_id);

drop policy if exists "Users can read own chat messages" on public.chat_messages;
create policy "Users can read own chat messages"
on public.chat_messages
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own chat messages" on public.chat_messages;
create policy "Users can insert own chat messages"
on public.chat_messages
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own chat messages" on public.chat_messages;
create policy "Users can delete own chat messages"
on public.chat_messages
for delete
using (auth.uid() = user_id);
