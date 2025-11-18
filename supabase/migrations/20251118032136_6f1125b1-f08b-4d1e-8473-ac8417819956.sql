-- Create trigger to automatically assign 'user' role when someone signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer 
set search_path = public
as $$
begin
  insert into public.user_roles (user_id, role)
  values (new.id, 'user'::app_role);
  return new;
end;
$$;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();