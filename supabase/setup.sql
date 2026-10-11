-- Run once in a NEW Supabase project's SQL Editor.
create table if not exists public.participants (
 id uuid primary key default gen_random_uuid(), event_id text not null,
 name text not null check(length(name) between 1 and 80), company text not null check(length(company) between 1 and 120),
 phone text not null, session_hash text not null unique, consent_at timestamptz not null default now(),
 marketing_consent boolean not null default false, team_consent_at timestamptz,
 draft jsonb not null default '{"answers":{},"crew":[],"step":0,"reflection":null}',
 scores jsonb, pattern jsonb, report jsonb, report_source text,
 generation_started_at timestamptz, completed_at timestamptz, created_at timestamptz not null default now(),
 team_id uuid, unique(event_id,phone)
);
create table if not exists public.teams (
 id uuid primary key default gen_random_uuid(), event_id text not null,
 name text not null, code text not null unique check(code ~ '^[A-Z]{2}[0-9]{3}$'),
 creator_id uuid not null unique references public.participants(id),
 report jsonb, report_source text, report_member_ids jsonb, report_generated_at timestamptz,
 generation_started_at timestamptz, created_at timestamptz not null default now(), sent_at timestamptz
);
alter table public.participants add constraint participants_team_fk foreign key(team_id) references public.teams(id);
create index participants_event on public.participants(event_id);
create index participants_team on public.participants(team_id);
create table public.request_limits(key text primary key, count integer not null, created_at timestamptz not null default now());
-- Server-only records. Neither browser role can read or write these tables.
alter table public.participants enable row level security;
alter table public.teams enable row level security;
alter table public.request_limits enable row level security;
revoke all on public.participants,public.teams,public.request_limits from anon,authenticated;
grant all on public.participants,public.teams,public.request_limits to service_role;

create function public.take_limit(p_key text,p_limit integer) returns boolean
language plpgsql security definer set search_path=public as $$
declare n integer;
begin
 insert into request_limits(key,count) values(p_key,1)
 on conflict(key) do update set count=request_limits.count+1 returning count into n;
 delete from request_limits where created_at<now()-interval '2 days';
 return n<=p_limit;
end $$;

create function public.create_team(p_participant uuid,p_code text) returns public.teams
language plpgsql security definer set search_path=public as $$
declare p participants; t teams;
begin
 select * into p from participants where id=p_participant for update;
 if p.id is null or p.completed_at is null then raise exception 'Complete your snapshot first'; end if;
 if p.team_id is not null then select * into t from teams where id=p.team_id; return t; end if;
 insert into teams(event_id,name,code,creator_id) values(p.event_id,p.company,p_code,p.id) returning * into t;
 update participants set team_id=t.id,team_consent_at=now() where id=p.id;
 return t;
end $$;

create function public.join_team(p_participant uuid,p_code text) returns public.teams
language plpgsql security definer set search_path=public as $$
declare p participants; t teams;
begin
 select * into p from participants where id=p_participant for update;
 select * into t from teams where code=p_code and event_id=p.event_id;
 if p.id is null or t.id is null then raise exception 'Team not found'; end if;
 if p.team_id is not null and p.team_id<>t.id then raise exception 'Already in another team'; end if;
 update participants set team_id=t.id,team_consent_at=now() where id=p.id;
 return t;
end $$;

create function public.claim_snapshot(p_id uuid,p_draft jsonb) returns boolean
language plpgsql security definer set search_path=public as $$
declare n integer;
begin
 update participants set generation_started_at=now(),draft=p_draft where id=p_id and completed_at is null
 and (generation_started_at is null or generation_started_at<now()-interval '90 seconds');
 get diagnostics n=row_count; return n=1;
end $$;

create function public.save_progress(p_id uuid,p_draft jsonb) returns void
language sql security definer set search_path=public as $$
 update participants set draft=p_draft where id=p_id and completed_at is null and generation_started_at is null;
$$;

create function public.claim_team_report(p_id uuid) returns boolean
language plpgsql security definer set search_path=public as $$
declare n integer;
begin
 update teams set generation_started_at=now() where id=p_id and
 (generation_started_at is null or generation_started_at<now()-interval '90 seconds');
 get diagnostics n=row_count; return n=1;
end $$;

revoke all on function public.take_limit(text,integer),public.create_team(uuid,text),public.join_team(uuid,text),public.claim_snapshot(uuid,jsonb),public.save_progress(uuid,jsonb),public.claim_team_report(uuid) from public,anon,authenticated;
grant execute on function public.take_limit(text,integer),public.create_team(uuid,text),public.join_team(uuid,text),public.claim_snapshot(uuid,jsonb),public.save_progress(uuid,jsonb),public.claim_team_report(uuid) to service_role;
