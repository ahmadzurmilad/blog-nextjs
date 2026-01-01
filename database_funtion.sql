-- ============================================================
-- FUNCTION: sync_profile_to_auth
-- ============================================================

CREATE OR REPLACE FUNCTION public.sync_profile_to_auth()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Sync ke auth.users
  UPDATE auth.users
  SET
    raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb)
      || jsonb_build_object('role', NEW.role),

    raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb)
      || jsonb_build_object(
          'first_name', NEW.first_name,
          'last_name', NEW.last_name,
          'phone', NEW.phone,
          'avatar_url',NEW.avatar_url,
          'bio', NEW.bio
        )
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$;

-- Pastikan function dapat diakses
GRANT EXECUTE ON FUNCTION public.sync_profile_to_auth() TO authenticated, service_role;


-- ============================================================
-- TRIGGER: on_profile_change
-- ============================================================

DROP TRIGGER IF EXISTS on_profile_change ON public.profiles;

CREATE TRIGGER on_profile_change
AFTER INSERT OR UPDATE OF role, first_name, last_name, phone, avatar_url, bio
ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.sync_profile_to_auth();




-- ============================================================
-- FUNCTION TRIGGER UNTUK HANDLE NEW USER, KETIKA MENAMBAH USER DI SUPABASE MAKA AKAN DIMASUKAN JUGA KE public.profiles
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
 insert into public.profiles (id, email, role)
 values (new.id, new.email, 'guest');
 return new;
end;
$$;

-- ===================================================================
-- TRIGGER: handle_new_user ketika user baru dibuat pada supabase
-- ====================================================================

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();