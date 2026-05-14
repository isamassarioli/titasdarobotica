"""
Exemplos de uso do Supabase com Django
Copie e adapte para seus casos de uso
"""

from blog_app.supabase_client import (
    upload_file_to_supabase, 
    get_public_url, 
    query_database,
    insert_record,
    update_record
)


# ========== EXEMPLO 1: Upload de Capa de Post ==========

def example_upload_post_cover(file_obj, post_id):
    """
    Upload da imagem de capa de um post para Supabase Storage
    """
    bucket_name = 'blog-covers'  # Crie este bucket no Supabase
    file_path = f'posts/{post_id}/cover.jpg'
    
    file_content = file_obj.read()
    result = upload_file_to_supabase(bucket_name, file_path, file_content)
    
    if result.get('success'):
        public_url = get_public_url(bucket_name, file_path)
        print(f"Arquivo salvo em: {public_url}")
        return public_url
    else:
        print(f"Erro: {result.get('error')}")
        return None


# ========== EXEMPLO 2: Sincronizar Posts com Supabase ==========

def example_sync_post_to_supabase(post):
    """
    Sincroniza um post Django com tabela Supabase
    Útil para manter dados em sync entre Django e Supabase
    """
    # Você precisa criar uma tabela 'posts' no Supabase com esses campos:
    # id, title, slug, body, status, published_at, author_id, created_at
    
    post_data = {
        'title': post.title,
        'slug': post.slug,
        'body': post.body,
        'status': post.status,
        'published_at': post.published_at.isoformat() if post.published_at else None,
        'author_id': post.author.id if post.author else None,
        'created_at': post.created_at.isoformat(),
    }
    
    # Se post já tem id no Supabase, atualizar; senão, inserir
    if hasattr(post, 'supabase_id') and post.supabase_id:
        result = update_record('posts', post.supabase_id, post_data)
    else:
        result = insert_record('posts', post_data)
        if result.get('success'):
            # Salvar o supabase_id no Django (criar campo no model se necessário)
            post.supabase_id = result['data'][0]['id']
            post.save()
    
    return result


# ========== EXEMPLO 3: Consultar Dados do Supabase ==========

def example_get_published_editals():
    """
    Busca editais publicados do Supabase
    """
    editals = query_database('editals', {'status': 'published'})
    for edital in editals:
        print(f"Edital: {edital['title']} - {edital['start_date']}")
    return editals


# ========== EXEMPLO 4: Usar Supabase em Django View ==========

from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny


@api_view(['GET'])
@permission_classes([AllowAny])
def supabase_posts_api(request):
    """
    Endpoint que retorna posts do Supabase (em vez do Django ORM)
    """
    posts = query_database('posts', {'status': 'published'})
    return JsonResponse({'posts': posts})


# ========== COMO USAR NO ADMIN DJANGO ==========
# Você pode adicionar hook no save() do model para sincronizar com Supabase:

# No blog_app/models.py:
# 
# def save(self, *args, **kwargs):
#     super().save(*args, **kwargs)
#     # Sincronizar com Supabase após salvar
#     from blog_app.supabase_examples import example_sync_post_to_supabase
#     example_sync_post_to_supabase(self)

