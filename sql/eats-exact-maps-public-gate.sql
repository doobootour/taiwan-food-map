-- Exact Maps URL gate for PUBLIC eats rows (Chris 2026-11-08).
-- Structural place-identity check only — not semantic business/branch verification.
-- Narrow: fires on INSERT/UPDATE; does not backfill or mutate existing rows by itself.

CREATE OR REPLACE FUNCTION public.eats_link_has_place_identity(p_link text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE
    WHEN p_link IS NULL OR btrim(p_link) = '' THEN false
    WHEN btrim(p_link) !~* '^https://' THEN false
    WHEN btrim(p_link) ~* '^https://maps\.app\.goo\.gl/' THEN true
    WHEN btrim(p_link) ~* '^https://goo\.gl/maps' THEN true
    WHEN btrim(p_link) ~* '^https://(www\.)?google\.com/maps'
      OR btrim(p_link) ~* '^https://maps\.google\.com/' THEN
      (btrim(p_link) ~* '/place(/|\?|$)')
      OR (btrim(p_link) ~* '[?&#]query_place_id=')
      OR (btrim(p_link) ~* '[?&#]ftid=')
      OR (btrim(p_link) ~* '[?&#]cid=')
      OR (btrim(p_link) ~* '!1s0x[0-9a-f]+:0x[0-9a-f]+')
    ELSE false
  END;
$$;

CREATE OR REPLACE FUNCTION public.eats_link_publication_block_reason(p_link text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE
    WHEN p_link IS NULL OR btrim(p_link) = '' THEN 'missing_link'
    WHEN public.eats_link_has_place_identity(p_link) THEN NULL
    WHEN btrim(p_link) !~* '^https://' THEN 'malformed_or_disallowed_url'
    WHEN btrim(p_link) !~* '^https://(maps\.app\.goo\.gl/|goo\.gl/maps|(www\.)?google\.com/maps|maps\.google\.com/)'
      THEN 'malformed_or_disallowed_url'
    WHEN btrim(p_link) ~* '[?&#](q|query)=-?[0-9]+(\.[0-9]+)?[[:space:]]*,[[:space:]]*-?[0-9]+(\.[0-9]+)?'
      THEN 'coordinate_only'
    WHEN btrim(p_link) ~* '/maps/search/-?[0-9]+(\.[0-9]+)?[[:space:]]*,[[:space:]]*-?[0-9]+(\.[0-9]+)?'
      THEN 'coordinate_only'
    WHEN btrim(p_link) ~* '/maps/search/' OR btrim(p_link) ~* '[?&#](q|query)='
      THEN 'generic_name_search'
    ELSE 'unsupported_maps_url'
  END;
$$;

CREATE OR REPLACE FUNCTION public.eats_enforce_exact_maps_for_public()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  reason text;
BEGIN
  -- Clear our pending marker when publishing with a structurally exact link.
  IF COALESCE(NEW.hidden, false) = false
     AND public.eats_link_has_place_identity(NEW.link)
     AND NEW.hidden_reason LIKE 'pending_exact_maps_link:%' THEN
    NEW.hidden_reason := NULL;
  END IF;

  -- Gate: cannot be public without structural place identity.
  IF COALESCE(NEW.hidden, false) = false
     AND NOT public.eats_link_has_place_identity(NEW.link) THEN
    reason := COALESCE(public.eats_link_publication_block_reason(NEW.link), 'unsupported_maps_url');
    NEW.hidden := true;
    NEW.hidden_reason := 'pending_exact_maps_link:' || reason;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_eats_enforce_exact_maps_for_public ON public.eats;
CREATE TRIGGER trg_eats_enforce_exact_maps_for_public
  BEFORE INSERT OR UPDATE OF link, hidden, hidden_reason
  ON public.eats
  FOR EACH ROW
  EXECUTE FUNCTION public.eats_enforce_exact_maps_for_public();

COMMENT ON FUNCTION public.eats_link_has_place_identity(text) IS
  'Structural Google Maps place-identity check for taiwanbite public gate. Not semantic business/branch verification.';
COMMENT ON TRIGGER trg_eats_enforce_exact_maps_for_public ON public.eats IS
  'Force hidden+pending_exact_maps_link reason when a row would be public without place-identity Maps URL.';
