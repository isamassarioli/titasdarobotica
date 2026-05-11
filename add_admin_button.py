import os
import re

# Lista de arquivos HTML (excluindo admin.html e index.html/blog.html que já foram feitos)
html_files = [
    'equipes.html',
    'contato.html',
    'inscreva-se.html',
    'apoio.html',
    'depoimentos.html',
]

# Código a ser adicionado antes de </body>
admin_button_code = '''
    <!-- Admin Hidden Access -->
    <div id="admin-access" style="
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        opacity: 0.15;
        cursor: pointer;
        transition: opacity 0.3s;
        font-size: 24px;
    " title="Admin (Ctrl+Shift+A)">⚙️</div>

    <style>
        #admin-access:hover {
            opacity: 0.4;
        }
    </style>

    <script>
        // Admin button access
        const adminBtn = document.getElementById('admin-access');
        
        // Click access
        adminBtn.addEventListener('click', function() {
            window.location.href = 'admin.html';
        });

        // Keyboard shortcut: Ctrl+Shift+A
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                window.location.href = 'admin.html';
            }
        });
    </script>
'''

base_path = 'c:\\Users\\Isadora\\Documents\\GitHub\\titasdarobotica\\'

for filename in html_files:
    filepath = os.path.join(base_path, filename)
    
    if not os.path.exists(filepath):
        print(f"❌ Arquivo não encontrado: {filename}")
        continue
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Verificar se o botão admin já foi adicionado
        if 'admin-access' in content:
            print(f"✅ {filename} - Botão admin já existe")
            continue
        
        # Adicionar antes de </body>
        if '</body>' in content:
            content = content.replace('</body>', admin_button_code + '\n</body>')
        else:
            print(f"⚠️ {filename} - Não encontrou </body>")
            continue
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ {filename} - Botão admin adicionado com sucesso!")
    
    except Exception as e:
        print(f"❌ {filename} - Erro: {e}")

print("\n✨ Processo concluído!")
