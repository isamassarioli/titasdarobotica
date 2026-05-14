/**
 * Admin Dashboard - Gerenciador de Posts
 * Interface simples para gerenciar blog posts via API
 */

// Detectar se é desenvolvimento ou produção
const isDev = window.location.protocol !== 'https:' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === '');
const defaultApiUrl = 'http://localhost:8000/api';
const API_URL = localStorage.getItem('apiUrl') || defaultApiUrl;

console.log('🔧 Debug - API Configuration:');
console.log('  Hostname:', window.location.hostname);
console.log('  Protocol:', window.location.protocol);
console.log('  API_URL:', API_URL);
console.log('  isDev:', isDev);

let authToken = localStorage.getItem('authToken') || null;
let isLoggedIn = false;

// ========== AUTENTICAÇÃO ==========

async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('login-error');

    try {
        errorMsg.textContent = 'Autenticando...';
        console.log('🔐 Tentando login:', { username, apiUrl: API_URL });
        
        const response = await fetch(`${API_URL}/auth/login/`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'include',
            body: JSON.stringify({ username, password })
        });

        // Se a resposta não foi OK, tente ler o erro detalhado
        if (!response.ok) {
            let errorDetail = `HTTP ${response.status}`;
            try {
                const errorData = await response.json();
                errorDetail = errorData.error || errorData.detail || errorDetail;
            } catch (e) {
                // Se não conseguir ler JSON, usa o status HTTP
            }
            throw new Error(`Erro no servidor: ${errorDetail}`);
        }

        const data = await response.json();
        if (!data.token) {
            throw new Error('Token não recebido do servidor');
        }

        authToken = data.token;
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('apiUrl', API_URL);
        
        console.log('✅ Login bem-sucedido! Token:', authToken.substring(0, 10) + '...');
        errorMsg.textContent = '';
        showDashboard();
    } catch (error) {
        const msg = `❌ ${error.message}`;
        errorMsg.textContent = msg;
        console.error('🔴 Erro no login:', error);
        console.error('📍 API URL:', API_URL);
    }
}

function logout() {
    authToken = null;
    isLoggedIn = false;
    localStorage.removeItem('authToken');
    localStorage.removeItem('apiUrl');
    document.getElementById('login-tab').classList.add('active');
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('login-form').reset();
}

function showDashboard() {
    isLoggedIn = true;
    document.getElementById('login-tab').classList.remove('active');
    document.getElementById('dashboard').style.display = 'block';
    loadPosts();
    setupTabNavigation();
}

// ========== NAVEGAÇÃO ==========

function setupTabNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn:not(.logout)');
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            switchTab(tabName);
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    const tab = document.getElementById(`${tabName}-tab`);
    if (tab) tab.classList.add('active');
}

// ========== CARREGAR POSTS ==========

async function loadPosts() {
    const category = document.getElementById('filter-category')?.value || '';
    const status = document.getElementById('filter-status')?.value || '';
    const postsList = document.getElementById('posts-list');

    postsList.innerHTML = '<p class="loading">Carregando posts...</p>';

    try {
        let url = `${API_URL}/posts/`;
        const params = new URLSearchParams();
        
        if (category) params.append('category', category);
        if (status) params.append('status', status);
        
        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        const response = await fetch(url, {
            headers: {
                'Authorization': `Token ${authToken}`,
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'include'
        });

        if (!response.ok) throw new Error('Erro ao carregar posts');

        const data = await response.json();
        const posts = data.results || data;

        if (!posts.length) {
            postsList.innerHTML = '<p class="no-data">Nenhum post encontrado</p>';
            return;
        }

        postsList.innerHTML = posts.map(post => `
            <div class="post-card">
                <div class="post-header">
                    <h3>${post.title}</h3>
                    <span class="status-badge status-${post.status}">${formatStatus(post.status)}</span>
                </div>
                <div class="post-meta">
                    <span class="category">${post.category}</span>
                    <span class="date">${formatDate(post.updated_at)}</span>
                </div>
                <p class="post-summary">${post.summary.substring(0, 100)}...</p>
                <div class="post-actions">
                    <button class="btn btn-sm btn-edit" onclick="editPost('${post.slug}')">✏️ Editar</button>
                    <button class="btn btn-sm btn-delete" onclick="deletePost('${post.slug}')">🗑️ Deletar</button>
                    <button class="btn btn-sm btn-view" onclick="window.open('/blog.html#${post.slug}', '_blank')">👁️ Ver</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        postsList.innerHTML = `<p class="error">❌ ${error.message}</p>`;
        console.error('Erro ao carregar posts:', error);
    }
}

// ========== CRIAR POST ==========

document.getElementById('post-form')?.addEventListener('change', (e) => {
    if (e.target.id === 'cover_image') {
        previewImage(e.target, 'image-preview');
    }
});

async function handlePostSubmit(event) {
    event.preventDefault();
    const form = document.getElementById('post-form');
    const formData = new FormData(form);
    const messageEl = document.getElementById('form-message');

    try {
        messageEl.textContent = '📤 Enviando...';
        messageEl.className = 'form-message';

        // Prepare form data
        const data = new FormData();
        data.append('title', document.getElementById('title').value);
        data.append('category', document.getElementById('category').value);
        data.append('status', document.getElementById('status').value);
        data.append('summary', document.getElementById('summary').value);
        data.append('body', document.getElementById('body').value);
        
        const imageFile = document.getElementById('cover_image').files[0];
        if (imageFile) {
            data.append('cover_image', imageFile);
        }

        const response = await fetch(`${API_URL}/posts/`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${authToken}`,
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'include',
            body: data
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(JSON.stringify(error));
        }

        messageEl.textContent = '✅ Post criado com sucesso!';
        messageEl.className = 'form-message success';
        form.reset();
        document.getElementById('image-preview').innerHTML = '';
        
        setTimeout(() => {
            loadPosts();
            switchTab('posts');
            document.querySelector('[data-tab="posts"]').click();
        }, 1000);
    } catch (error) {
        messageEl.textContent = `❌ Erro: ${error.message}`;
        messageEl.className = 'form-message error';
        console.error('Erro ao criar post:', error);
    }
}

// ========== EDITAR POST ==========

async function editPost(slug) {
    try {
        const response = await fetch(`${API_URL}/posts/${slug}/`, {
            headers: {
                'Authorization': `Token ${authToken}`,
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'include'
        });

        if (!response.ok) throw new Error('Erro ao carregar post');

        const post = await response.json();
        
        // Preencher formulário de edição
        document.getElementById('edit-id').value = post.slug;
        document.getElementById('edit-title').value = post.title;
        document.getElementById('edit-category').value = post.category;
        document.getElementById('edit-status').value = post.status;
        document.getElementById('edit-summary').value = post.summary;
        document.getElementById('edit-body').value = post.body;
        
        // Preview da imagem atual
        if (post.cover_image) {
            document.getElementById('edit-image-preview').innerHTML = 
                `<img src="${post.cover_image}" alt="Capa" style="max-height: 200px;">`;
        }

        document.getElementById('edit-modal').style.display = 'block';
    } catch (error) {
        alert(`❌ Erro: ${error.message}`);
        console.error('Erro ao editar post:', error);
    }
}

async function handleEditSubmit(event) {
    event.preventDefault();
    const slug = document.getElementById('edit-id').value;
    const messageEl = document.getElementById('edit-form-message');

    try {
        messageEl.textContent = '📤 Atualizando...';
        messageEl.className = 'form-message';

        const data = new FormData();
        data.append('title', document.getElementById('edit-title').value);
        data.append('category', document.getElementById('edit-category').value);
        data.append('status', document.getElementById('edit-status').value);
        data.append('summary', document.getElementById('edit-summary').value);
        data.append('body', document.getElementById('edit-body').value);
        
        const imageFile = document.getElementById('edit-cover_image').files[0];
        if (imageFile) {
            data.append('cover_image', imageFile);
        }

        const response = await fetch(`${API_URL}/posts/${slug}/`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Token ${authToken}`,
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'include',
            body: data
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(JSON.stringify(error));
        }

        messageEl.textContent = '✅ Post atualizado!';
        messageEl.className = 'form-message success';
        
        setTimeout(() => {
            closeEditModal();
            loadPosts();
        }, 1000);
    } catch (error) {
        messageEl.textContent = `❌ Erro: ${error.message}`;
        messageEl.className = 'form-message error';
        console.error('Erro ao atualizar post:', error);
    }
}

function closeEditModal() {
    document.getElementById('edit-modal').style.display = 'none';
    document.getElementById('edit-form').reset();
    document.getElementById('edit-image-preview').innerHTML = '';
}

// ========== DELETAR POST ==========

async function deletePost(slug) {
    if (!confirm('Tem certeza que quer deletar este post?')) return;

    try {
        const response = await fetch(`${API_URL}/posts/${slug}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${authToken}`,
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'include'
        });

        if (!response.ok) throw new Error('Erro ao deletar post');

        alert('✅ Post deletado com sucesso!');
        loadPosts();
    } catch (error) {
        alert(`❌ Erro: ${error.message}`);
        console.error('Erro ao deletar post:', error);
    }
}

// ========== UTILITÁRIOS ==========

function previewImage(input, previewId) {
    const file = input.files[0];
    const preview = document.getElementById(previewId);

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-height: 200px;">`;
        };
        reader.readAsDataURL(file);
    }
}

function formatStatus(status) {
    const statusMap = {
        'draft': 'Rascunho',
        'published': 'Publicado',
        'archived': 'Arquivado'
    };
    return statusMap[status] || status;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// ========== INICIALIZAÇÃO ==========

document.addEventListener('DOMContentLoaded', () => {
    if (authToken) {
        showDashboard();
    }
});

// Fechar modal ao clicar fora
window.onclick = (event) => {
    const modal = document.getElementById('edit-modal');
    if (event.target === modal) {
        closeEditModal();
    }
};
