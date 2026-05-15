/**
 * Admin client-only: CRUD de posts e editais no Supabase.
 * localStorage fica como fallback offline e import/export.
 */

(function(){
  const SUPABASE_URL = 'https://trnxdkbkkgtkyuddtvaj.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRybnhka2Jra2d0a3l1ZGR0dmFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0ODgyODQsImV4cCI6MjA5NDA2NDI4NH0.XKvVOzob-OAUypjJaF91zgpO2F_p0v3Md_4zwqJywr4';
  const POSTS_KEY = 'titas_posts';
  const EDITAIS_KEY = 'titas_editais';
  const SESSION_KEY = 'titas_supabase_session';

  function readItems(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(value) ? value : [];
    } catch (e) {
      return [];
    }
  }

  function saveItems(key, items) {
    localStorage.setItem(key, JSON.stringify(items));
  }

  function readSession() {
    try {
      return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
    } catch (e) {
      return null;
    }
  }

  function saveSession(session) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  function clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
  }

  function accessToken() {
    return readSession()?.access_token || null;
  }

  function authHeaders(token = accessToken()) {
    return {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${token || SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };
  }

  async function supabaseFetch(path, options = {}) {
    const response = await fetch(`${SUPABASE_URL}${path}`, {
      ...options,
      headers: {
        ...authHeaders(),
        ...(options.headers || {})
      }
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `Supabase error ${response.status}`);
    }

    if (response.status === 204) return null;
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  function slugify(str){
    return (str || '').toString().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  function nowIso(){ return new Date().toISOString(); }
  function generateId(){ return String(Date.now()) + Math.floor(Math.random() * 1000); }
  function formatDate(d){ try { return new Date(d).toLocaleString('pt-BR'); } catch(e){ return d || ''; } }

  function formatStatus(s){
    return ({
      draft: 'Rascunho',
      published: 'Publicado',
      archived: 'Arquivado',
      open: 'Aberto',
      closed: 'Fechado'
    })[s] || s;
  }

  function readImageFile(input) {
    return new Promise((resolve, reject) => {
      const file = input?.files?.[0];
      if (!file) {
        resolve(null);
        return;
      }

      const reader = new FileReader();
      reader.onload = event => resolve(event.target.result);
      reader.onerror = () => reject(new Error('Erro ao ler imagem'));
      reader.readAsDataURL(file);
    });
  }

  function previewFile(input, previewId) {
    const preview = document.getElementById(previewId);
    const file = input.files[0];
    if (!preview) return;
    if (!file) {
      preview.innerHTML = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = event => {
      preview.innerHTML = `<img src="${event.target.result}" alt="Preview" style="max-height:200px;">`;
    };
    reader.readAsDataURL(file);
  }

  async function signIn(email, password) {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: authHeaders(SUPABASE_ANON_KEY),
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error('Email ou senha incorretos');
    }

    return response.json();
  }

  window.handleLogin = async function(e){
    e.preventDefault();
    const email = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const err = document.getElementById('login-error');
    err.textContent = '';

    try {
      const session = await signIn(email, password);
      saveSession(session);
      showDashboard();
    } catch (error) {
      err.textContent = error.message;
    }
  };

  window.logout = function(){
    clearSession();
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('login-tab').classList.add('active');
  };

  function setupTabNavigation(){
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

  function switchTab(tabName){
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    const tab = document.getElementById(`${tabName}-tab`);
    if (tab) tab.classList.add('active');
  }

  function postToForm(post) {
    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      category: post.category,
      status: post.status,
      summary: post.summary || '',
      body: post.body || '',
      cover_image: post.cover_image || null,
      published_at: post.published_at,
      created_at: post.created_at,
      updated_at: post.updated_at
    };
  }

  function editalToForm(edital) {
    return {
      id: edital.id,
      slug: edital.slug,
      title: edital.title,
      status: edital.status,
      description: edital.description || '',
      rules: edital.rules || edital.body || '',
      body: edital.body || edital.rules || '',
      start_date: edital.start_date,
      end_date: edital.end_date,
      image: edital.image || null,
      document: edital.document || null,
      created_at: edital.created_at,
      updated_at: edital.updated_at
    };
  }

  async function fetchPosts() {
    const data = await supabaseFetch('/rest/v1/posts?select=*&order=created_at.desc');
    saveItems(POSTS_KEY, data || []);
    return data || [];
  }

  async function fetchEditais() {
    const data = await supabaseFetch('/rest/v1/editals?select=*&order=created_at.desc');
    saveItems(EDITAIS_KEY, data || []);
    return data || [];
  }

  window.loadPosts = async function(){
    const category = document.getElementById('filter-category')?.value || '';
    const status = document.getElementById('filter-status')?.value || '';
    const postsList = document.getElementById('posts-list');
    let posts = [];

    try {
      posts = await fetchPosts();
    } catch (error) {
      console.error('Erro ao carregar posts do Supabase:', error);
      posts = readItems(POSTS_KEY).slice().reverse();
    }

    const filtered = posts.filter(p => {
      if (category && p.category !== category) return false;
      if (status && p.status !== status) return false;
      return true;
    });

    if (!filtered.length) {
      postsList.innerHTML = '<p class="no-data">Nenhum post encontrado</p>';
      return;
    }

    postsList.innerHTML = filtered.map(p => `
      <div class="post-card">
        <div class="post-header">
          <h3>${p.title}</h3>
          <span class="status-badge status-${p.status}">${formatStatus(p.status)}</span>
        </div>
        <div class="post-meta">
          <span class="category">${p.category || ''}</span>
          <span class="date">${formatDate(p.updated_at || p.created_at)}</span>
        </div>
        <p class="post-summary">${(p.summary || '').substring(0, 200)}${(p.summary || '').length > 200 ? '...' : ''}</p>
        <div class="post-actions">
          <button class="btn btn-sm btn-edit" onclick="editPost('${p.id}')">Editar</button>
          <button class="btn btn-sm btn-delete" onclick="deletePost('${p.id}')">Deletar</button>
          <button class="btn btn-sm btn-view" onclick="previewPost('${p.id}')">Ver</button>
        </div>
      </div>
    `).join('');
  };

  window.previewPost = function(id){
    window.open('/blog.html#post-' + id, '_blank');
  };

  window.handlePostSubmit = async function(e){
    e.preventDefault();
    const title = document.getElementById('title').value.trim();
    if (!title) return alert('Titulo e obrigatorio');

    const cover = await readImageFile(document.getElementById('cover_image'));
    const post = postToForm({
      slug: slugify(title) || generateId(),
      title,
      category: document.getElementById('category').value,
      status: document.getElementById('status').value,
      summary: document.getElementById('summary').value,
      body: document.getElementById('body').value,
      cover_image: cover,
      published_at: document.getElementById('status').value === 'published' ? nowIso() : null,
      created_at: nowIso(),
      updated_at: nowIso()
    });
    delete post.id;

    try {
      await supabaseFetch('/rest/v1/posts', {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify(post)
      });
      document.getElementById('post-form').reset();
      document.getElementById('image-preview').innerHTML = '';
      await loadPosts();
      switchTab('posts');
      alert('Post salvo no Supabase.');
    } catch (error) {
      alert('Erro ao salvar post: ' + error.message);
    }
  };

  window.editPost = function(id){
    const p = readItems(POSTS_KEY).find(x => String(x.id) === String(id));
    if (!p) return alert('Post nao encontrado');
    document.getElementById('edit-id').value = p.id;
    document.getElementById('edit-title').value = p.title;
    document.getElementById('edit-category').value = p.category || 'novidades';
    document.getElementById('edit-status').value = p.status || 'draft';
    document.getElementById('edit-summary').value = p.summary || '';
    document.getElementById('edit-body').value = p.body || '';
    document.getElementById('edit-image-preview').innerHTML = p.cover_image ? `<img src="${p.cover_image}" style="max-height:200px;">` : '';
    document.getElementById('edit-modal').style.display = 'block';
  };

  window.handleEditSubmit = async function(e){
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const status = document.getElementById('edit-status').value;
    const previous = readItems(POSTS_KEY).find(x => String(x.id) === String(id)) || {};
    const cover = await readImageFile(document.getElementById('edit-cover_image'));
    const post = {
      title: document.getElementById('edit-title').value,
      slug: slugify(document.getElementById('edit-title').value) || previous.slug || id,
      category: document.getElementById('edit-category').value,
      status,
      summary: document.getElementById('edit-summary').value,
      body: document.getElementById('edit-body').value,
      cover_image: cover || previous.cover_image || null,
      published_at: status === 'published' ? (previous.published_at || nowIso()) : previous.published_at || null,
      updated_at: nowIso()
    };

    try {
      await supabaseFetch(`/rest/v1/posts?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify(post)
      });
      closeEditModal();
      await loadPosts();
      alert('Alteracoes salvas no Supabase.');
    } catch (error) {
      alert('Erro ao editar post: ' + error.message);
    }
  };

  window.closeEditModal = function(){
    document.getElementById('edit-modal').style.display = 'none';
    document.getElementById('edit-form').reset();
    document.getElementById('edit-image-preview').innerHTML = '';
  };

  window.deletePost = async function(id){
    if (!confirm('Tem certeza que quer deletar este post?')) return;
    try {
      await supabaseFetch(`/rest/v1/posts?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' });
      await loadPosts();
      alert('Post removido do Supabase.');
    } catch (error) {
      alert('Erro ao deletar post: ' + error.message);
    }
  };

  window.loadEditais = async function(){
    const status = document.getElementById('filter-edital-status')?.value || '';
    const editaisList = document.getElementById('editais-list');
    let editais = [];

    try {
      editais = await fetchEditais();
    } catch (error) {
      console.error('Erro ao carregar editais do Supabase:', error);
      editais = readItems(EDITAIS_KEY).slice().reverse();
    }

    const filtered = editais.filter(edital => !status || edital.status === status);

    if (!filtered.length) {
      editaisList.innerHTML = '<p class="no-data">Nenhum edital encontrado</p>';
      return;
    }

    editaisList.innerHTML = filtered.map(edital => `
      <div class="post-card">
        <div class="post-header">
          <h3>${edital.title}</h3>
          <span class="status-badge status-${edital.status}">${formatStatus(edital.status)}</span>
        </div>
        <div class="post-meta">
          <span class="date">Inicio: ${formatDate(edital.start_date)}</span>
          <span class="date">Fim: ${formatDate(edital.end_date)}</span>
        </div>
        <p class="post-summary">${(edital.description || '').substring(0, 200)}${(edital.description || '').length > 200 ? '...' : ''}</p>
        <div class="post-actions">
          <button class="btn btn-sm btn-edit" onclick="editEdital('${edital.id}')">Editar</button>
          <button class="btn btn-sm btn-delete" onclick="deleteEdital('${edital.id}')">Deletar</button>
          <button class="btn btn-sm btn-view" onclick="previewEdital('${edital.id}')">Ver</button>
        </div>
      </div>
    `).join('');
  };

  window.handleEditalSubmit = async function(e){
    e.preventDefault();
    const title = document.getElementById('edital-title').value.trim();
    if (!title) return alert('Titulo e obrigatorio');

    const image = await readImageFile(document.getElementById('edital-image'));
    const body = document.getElementById('edital-body').value;
    const edital = editalToForm({
      slug: slugify(title) || generateId(),
      title,
      status: document.getElementById('edital-status').value,
      description: document.getElementById('edital-description').value,
      rules: body,
      body,
      start_date: document.getElementById('edital-start').value || null,
      end_date: document.getElementById('edital-end').value || null,
      document: document.getElementById('edital-document').value.trim() || null,
      image,
      created_at: nowIso(),
      updated_at: nowIso()
    });
    delete edital.id;

    try {
      await supabaseFetch('/rest/v1/editals', {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify(edital)
      });
      document.getElementById('edital-form').reset();
      document.getElementById('edital-image-preview').innerHTML = '';
      await loadEditais();
      switchTab('editais');
      alert('Edital salvo no Supabase.');
    } catch (error) {
      alert('Erro ao salvar edital: ' + error.message);
    }
  };

  window.editEdital = function(id){
    const edital = readItems(EDITAIS_KEY).find(x => String(x.id) === String(id));
    if (!edital) return alert('Edital nao encontrado');
    document.getElementById('edit-edital-id').value = edital.id;
    document.getElementById('edit-edital-title').value = edital.title;
    document.getElementById('edit-edital-status').value = edital.status || 'draft';
    document.getElementById('edit-edital-description').value = edital.description || '';
    document.getElementById('edit-edital-body').value = edital.body || edital.rules || '';
    document.getElementById('edit-edital-start').value = edital.start_date ? String(edital.start_date).slice(0, 10) : '';
    document.getElementById('edit-edital-end').value = edital.end_date ? String(edital.end_date).slice(0, 10) : '';
    document.getElementById('edit-edital-document').value = edital.document || '';
    document.getElementById('edit-edital-image-preview').innerHTML = edital.image ? `<img src="${edital.image}" style="max-height:200px;">` : '';
    document.getElementById('edit-edital-modal').style.display = 'block';
  };

  window.handleEditalEditSubmit = async function(e){
    e.preventDefault();
    const id = document.getElementById('edit-edital-id').value;
    const previous = readItems(EDITAIS_KEY).find(x => String(x.id) === String(id)) || {};
    const image = await readImageFile(document.getElementById('edit-edital-image'));
    const body = document.getElementById('edit-edital-body').value;
    const edital = {
      title: document.getElementById('edit-edital-title').value,
      slug: slugify(document.getElementById('edit-edital-title').value) || previous.slug || id,
      status: document.getElementById('edit-edital-status').value,
      description: document.getElementById('edit-edital-description').value,
      rules: body,
      body,
      start_date: document.getElementById('edit-edital-start').value || null,
      end_date: document.getElementById('edit-edital-end').value || null,
      document: document.getElementById('edit-edital-document').value.trim() || null,
      image: image || previous.image || null,
      updated_at: nowIso()
    };

    try {
      await supabaseFetch(`/rest/v1/editals?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify(edital)
      });
      closeEditalModal();
      await loadEditais();
      alert('Alteracoes do edital salvas no Supabase.');
    } catch (error) {
      alert('Erro ao editar edital: ' + error.message);
    }
  };

  window.closeEditalModal = function(){
    document.getElementById('edit-edital-modal').style.display = 'none';
    document.getElementById('edit-edital-form').reset();
    document.getElementById('edit-edital-image-preview').innerHTML = '';
  };

  window.deleteEdital = async function(id){
    if (!confirm('Tem certeza que quer deletar este edital?')) return;
    try {
      await supabaseFetch(`/rest/v1/editals?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' });
      await loadEditais();
      alert('Edital removido do Supabase.');
    } catch (error) {
      alert('Erro ao deletar edital: ' + error.message);
    }
  };

  window.previewEdital = function(id){
    window.open('/editais.html#edital-' + id, '_blank');
  };

  function exportJson(key, prefix) {
    const blob = new Blob([JSON.stringify(readItems(key), null, 2)], {type: 'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${prefix}-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function importJson(file, key, reload, label) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const imported = JSON.parse(ev.target.result);
        if (!Array.isArray(imported)) throw new Error(`Formato invalido: esperado array de ${label}`);
        saveItems(key, imported);
        reload();
        alert('Import concluido localmente. Para publicar, crie/salve os itens no admin.');
      } catch (err) {
        alert('Erro ao importar: ' + err.message);
      }
    };
    reader.readAsText(file);
  }

  window.exportPosts = function(){ exportJson(POSTS_KEY, 'posts'); };
  window.exportEditais = function(){ exportJson(EDITAIS_KEY, 'editais'); };
  window.triggerImport = function(){ document.getElementById('import-file').click(); };
  window.triggerEditaisImport = function(){ document.getElementById('import-editais-file').click(); };
  window.handleImportFile = function(e){
    importJson(e.target.files[0], POSTS_KEY, loadPosts, 'posts');
    e.target.value = '';
  };
  window.handleEditaisImportFile = function(e){
    importJson(e.target.files[0], EDITAIS_KEY, loadEditais, 'editais');
    e.target.value = '';
  };

  window.addEventListener('DOMContentLoaded', () => {
    setupTabNavigation();
    document.getElementById('cover_image')?.addEventListener('change', e => previewFile(e.target, 'image-preview'));
    document.getElementById('edit-cover_image')?.addEventListener('change', e => previewFile(e.target, 'edit-image-preview'));
    document.getElementById('edital-image')?.addEventListener('change', e => previewFile(e.target, 'edital-image-preview'));
    document.getElementById('edit-edital-image')?.addEventListener('change', e => previewFile(e.target, 'edit-edital-image-preview'));
    document.getElementById('import-file')?.addEventListener('change', handleImportFile);
    document.getElementById('import-editais-file')?.addEventListener('change', handleEditaisImportFile);
    if (accessToken()) showDashboard();
  });

  async function showDashboard(){
    document.getElementById('login-tab').classList.remove('active');
    document.getElementById('dashboard').style.display = 'block';
    await loadPosts();
    await loadEditais();
  }

  window._titas_readPosts = () => readItems(POSTS_KEY);
  window._titas_readEditais = () => readItems(EDITAIS_KEY);
})();
