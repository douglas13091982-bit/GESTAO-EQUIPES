begin;
create function public.gestposto_novo_usuario() returns trigger language plpgsql security definer set search_path='' as $$ begin
insert into public.profiles(id,nome,cpf,telefone,nascimento,funcao) values(new.id,new.raw_user_meta_data->>'nome',new.raw_user_meta_data->>'cpf',new.raw_user_meta_data->>'telefone',(new.raw_user_meta_data->>'nascimento')::date,new.raw_user_meta_data->>'funcao');
insert into public.user_roles(user_id,role) values(new.id,'colaborador');
return new; end $$;
create trigger gestposto_novo_usuario after insert on auth.users for each row execute function public.gestposto_novo_usuario();
create function public.gestposto_auditar() returns trigger language plpgsql security definer set search_path='' as $$ begin
insert into public.auditoria(ator,tabela,operacao,registro_id) values(auth.uid(),tg_table_name,tg_op,coalesce(to_jsonb(new)->>'id',to_jsonb(old)->>'id'));
if tg_op='DELETE' then return old; end if; return new; end $$;
do $$ declare t text; begin foreach t in array array['profiles','postos','vinculos','pontos','documentos'] loop execute format('create trigger gestposto_audit after insert or update or delete on public.%I for each row execute function public.gestposto_auditar()',t); end loop; end $$;
commit;
