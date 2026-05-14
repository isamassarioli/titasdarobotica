"""
Supabase Client para Titãs da Robótica
Gerencia conexão e operações com Supabase
"""
import os
from supabase import create_client, Client
from decouple import config

# Inicializar cliente Supabase
SUPABASE_URL = config('SUPABASE_URL', default='')
SUPABASE_KEY = config('SUPABASE_KEY', default='')

if SUPABASE_URL and SUPABASE_KEY:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
else:
    supabase = None


# ========== OPERAÇÕES SUPABASE ==========

def upload_file_to_supabase(bucket_name: str, file_path: str, file_content: bytes) -> dict:
    """
    Faz upload de arquivo para Supabase Storage
    
    Args:
        bucket_name: Nome do bucket (ex: 'blog-covers', 'edital-docs')
        file_path: Caminho dentro do bucket (ex: 'posts/banner.jpg')
        file_content: Conteúdo do arquivo em bytes
    
    Returns:
        dict com resultado ou erro
    """
    if not supabase:
        return {'error': 'Supabase não configurado'}
    
    try:
        response = supabase.storage.from_(bucket_name).upload(file_path, file_content)
        return {'success': True, 'path': response.path}
    except Exception as e:
        return {'error': str(e)}


def get_public_url(bucket_name: str, file_path: str) -> str:
    """
    Retorna URL pública de arquivo no Supabase Storage
    
    Args:
        bucket_name: Nome do bucket
        file_path: Caminho do arquivo
    
    Returns:
        URL pública
    """
    if not supabase:
        return ''
    
    try:
        url = supabase.storage.from_(bucket_name).get_public_url(file_path)
        return url
    except Exception as e:
        return ''


def query_database(table_name: str, filters: dict = None) -> list:
    """
    Consulta dados da tabela Supabase
    
    Args:
        table_name: Nome da tabela
        filters: Dicionário com filtros (ex: {'status': 'published'})
    
    Returns:
        Lista de registros
    """
    if not supabase:
        return []
    
    try:
        query = supabase.table(table_name).select('*')
        
        if filters:
            for key, value in filters.items():
                query = query.eq(key, value)
        
        response = query.execute()
        return response.data if response else []
    except Exception as e:
        print(f"Erro ao consultar {table_name}: {str(e)}")
        return []


def insert_record(table_name: str, data: dict) -> dict:
    """
    Insere um novo registro na tabela
    
    Args:
        table_name: Nome da tabela
        data: Dicionário com dados
    
    Returns:
        Registro inserido ou erro
    """
    if not supabase:
        return {'error': 'Supabase não configurado'}
    
    try:
        response = supabase.table(table_name).insert(data).execute()
        return {'success': True, 'data': response.data}
    except Exception as e:
        return {'error': str(e)}


def update_record(table_name: str, record_id: int, data: dict) -> dict:
    """
    Atualiza um registro existente
    
    Args:
        table_name: Nome da tabela
        record_id: ID do registro
        data: Dicionário com dados a atualizar
    
    Returns:
        Registro atualizado ou erro
    """
    if not supabase:
        return {'error': 'Supabase não configurado'}
    
    try:
        response = supabase.table(table_name).update(data).eq('id', record_id).execute()
        return {'success': True, 'data': response.data}
    except Exception as e:
        return {'error': str(e)}
