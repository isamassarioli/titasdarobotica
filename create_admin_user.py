import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User

username = "admin"
email = "isadoramassarioli@gmail.com"
password = "@Isadora100504"

# Deletar usuário antigo se existir
if User.objects.filter(username=username).exists():
    User.objects.filter(username=username).delete()
    print(f"❌ Usuário '{username}' antigo deletado")

# Criar novo superuser
user = User.objects.create_superuser(username, email, password)
print(f"✅ Superuser criado com sucesso!")
print(f"   Usuário: {username}")
print(f"   Email: {email}")
print(f"   Senha: {password}")
print(f"\n🔐 Use essas credenciais para fazer login no admin!")
