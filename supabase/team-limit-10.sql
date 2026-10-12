-- Apply to the EXISTING Team Instinct project before uploading the new site files.
-- Safe to rerun. Keeps participants, reports and teams. Existing oversized teams
-- remain intact, but cannot add anyone while at or above ten members.
BEGIN;

-- Briefly block membership writes while counts and trigger are installed.
LOCK TABLE public.teams, public.participants IN SHARE ROW EXCLUSIVE MODE;
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS member_count integer NOT NULL DEFAULT 0;
UPDATE public.teams t
SET member_count = (SELECT count(*)::integer FROM public.participants p WHERE p.team_id=t.id);

CREATE OR REPLACE FUNCTION public.enforce_team_capacity()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE
 previous_team uuid;
 next_team uuid;
 team_event text;
 locked_id uuid;
 updated_count integer;
BEGIN
 IF TG_OP <> 'INSERT' THEN previous_team := OLD.team_id; END IF;
 IF TG_OP <> 'DELETE' THEN next_team := NEW.team_id; END IF;

 -- A consistent lock order also protects simultaneous transfers between teams.
 FOR locked_id IN
  SELECT id FROM public.teams
  WHERE id=previous_team OR id=next_team ORDER BY id FOR UPDATE
 LOOP
  NULL;
 END LOOP;

 IF next_team IS NOT NULL THEN
  SELECT event_id INTO team_event FROM public.teams WHERE id=next_team;
  IF NOT FOUND THEN RAISE EXCEPTION 'Team not found' USING ERRCODE='23503'; END IF;
  IF team_event <> NEW.event_id THEN
   RAISE EXCEPTION 'Team belongs to a different event' USING ERRCODE='23514';
  END IF;
 END IF;

 IF previous_team IS NOT DISTINCT FROM next_team THEN
  IF TG_OP='DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
 END IF;

 IF next_team IS NOT NULL THEN
  -- Atomic guarded increment: two simultaneous joiners cannot claim slot ten.
  UPDATE public.teams SET member_count=member_count+1
  WHERE id=next_team AND member_count<10 RETURNING member_count INTO updated_count;
  IF NOT FOUND THEN
   RAISE EXCEPTION 'This team is full. Maximum 10 people, including the creator.'
   USING ERRCODE='P0010';
  END IF;
 END IF;

 IF previous_team IS NOT NULL THEN
  UPDATE public.teams SET member_count=GREATEST(member_count-1,0) WHERE id=previous_team;
 END IF;

 IF TG_OP='DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END $$;

DROP TRIGGER IF EXISTS enforce_team_capacity ON public.participants;
CREATE TRIGGER enforce_team_capacity
BEFORE INSERT OR UPDATE OF team_id,event_id OR DELETE ON public.participants
FOR EACH ROW EXECUTE FUNCTION public.enforce_team_capacity();

-- Return fresh counters after the trigger updates them.
CREATE OR REPLACE FUNCTION public.create_team(p_participant uuid,p_code text) RETURNS public.teams
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE p participants; t teams;
BEGIN
 SELECT * INTO p FROM participants WHERE id=p_participant FOR UPDATE;
 IF p.id IS NULL OR p.completed_at IS NULL THEN RAISE EXCEPTION 'Complete your snapshot first'; END IF;
 IF p.team_id IS NOT NULL THEN SELECT * INTO t FROM teams WHERE id=p.team_id; RETURN t; END IF;
 INSERT INTO teams(event_id,name,code,creator_id) VALUES(p.event_id,p.company,p_code,p.id) RETURNING * INTO t;
 UPDATE participants SET team_id=t.id,team_consent_at=now() WHERE id=p.id;
 SELECT * INTO t FROM teams WHERE id=t.id;
 RETURN t;
END $$;

CREATE OR REPLACE FUNCTION public.join_team(p_participant uuid,p_code text) RETURNS public.teams
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE p participants; t teams;
BEGIN
 SELECT * INTO p FROM participants WHERE id=p_participant FOR UPDATE;
 SELECT * INTO t FROM teams WHERE code=p_code AND event_id=p.event_id;
 IF p.id IS NULL OR t.id IS NULL THEN RAISE EXCEPTION 'Team not found'; END IF;
 IF p.team_id IS NOT NULL AND p.team_id<>t.id THEN RAISE EXCEPTION 'Already in another team'; END IF;
 UPDATE participants SET team_id=t.id,team_consent_at=now() WHERE id=p.id;
 SELECT * INTO t FROM teams WHERE id=t.id;
 RETURN t;
END $$;

REVOKE ALL ON FUNCTION public.create_team(uuid,text),public.join_team(uuid,text) FROM public,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.create_team(uuid,text),public.join_team(uuid,text) TO service_role;
REVOKE ALL ON FUNCTION public.enforce_team_capacity() FROM public,anon,authenticated;
-- Trigger execution uses PostgreSQL's trigger mechanism; the browser cannot call it.
COMMIT;
