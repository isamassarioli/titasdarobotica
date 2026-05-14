/**
 * Admin client-only: localStorage CRUD + Export/Import
 * Keys: 'titas_posts', 'titas_admin_password'
 */

(function(){
  const POSTS_KEY = 'titas_posts';
  const PASS_KEY = 'titas_admin_password';
  const SESSION_KEY = 'titas_is_admin';

  // inicializa senha se não existir
  const initialPassword = '@Isadora100504';
  if (!localStorage.getItem(PASS_KEY)) {
    localStorage.setItem(PASS_KEY, initialPassword);
  }

  // utilitários
  function readPosts() {
    try {
      return JSON.parse(localStorage.getItem(POSTS_KEY) || '[]');
    } catch (e) { return []; }
  }
  function savePosts(posts) {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  }
  function slugify(str){
    return (str||'').toString().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  }
  function nowIso(){ return new Date().toISOString(); }
  function generateId(){ return String(Date.now()) + Math.floor(Math.random()*1000); }

  // sessão
  function isLoggedIn(){ return sessionStorage.getItem(SESSION_KEY) === '1'; }
  function setLogged(flag){ sessionStorage.setItem(SESSION_KEY, flag ? '1' : '0'); }

  // UI helpers
  function formatDate(d){ try { return new Date(d).toLocaleString('pt-BR'); } catch(e){ return d; } }
  function formatStatus(s){
    return ({draft:'Rascunho', published:'Publicado', archived:'Arquivado'})[s] || s;
  }

  // Login
  window.handleLogin = function(e){
    e.preventDefault();
    const pass = document.getElementById('password').value;
    const stored = localStorage.getItem(PASS_KEY);
    const err = document.getElementById('login-error');
    if (pass === stored) {
      setLogged(true);
      err.textContent = '';
      showDashboard();
    } else {
      err.textContent = 'Senha incorreta';
    }
  };

  window.logout = function(){
    setLogged(false);
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('login-tab').classList.add('active');
  };

  // Navegação de abas
  function setupTabNavigation(){
    const navBtns = document.querySelectorAll('.nav-btn:not(.logout)');
    navBtns.forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const tabName = btn.dataset.tab;
        switchTab(tabName);
        navBtns.forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }
  function switchTab(tabName){
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    const tab = document.getElementById(`${tabName}-tab`);
    if (tab) tab.classList.add('active');
  }

  // Carregar posts (lista)
  window.loadPosts = function(){
    const category = document.getElementById('filter-category')?.value || '';
    const status = document.getElementById('filter-status')?.value || '';
    const posts = readPosts().slice().reverse();
    const postsList = document.getElementById('posts-list');
    if (!posts.length) {
      postsList.innerHTML = '<p class="no-data">Nenhum post encontrado</p>';
      return;
    }
    const filtered = posts.filter(p=>{
      if (category && p.category !== category) return false;
      if (status && p.status !== status) return false;
      return true;
    });
    postsList.innerHTML = filtered.map(p=>`
      <div class="post-card">
        <div class="post-header">
          <h3>${p.title}</h3>
          <span class="status-badge status-${p.status}">${formatStatus(p.status)}</span>
        </div>
        <div class="post-meta">
          <span class="category">${p.category}</span>
          <span class="date">${formatDate(p.updated_at||p.created_at)}</span>
        </div>
        <p class="post-summary">${(p.summary||'').substring(0,200)}${(p.summary||'').length>200?'...':''}</p>
        <div class="post-actions">
          <button class="btn btn-sm btn-edit" onclick="editPost('${p.id}')">✏️ Editar</button>
          <button class="btn btn-sm btn-delete" onclick="deletePost('${p.id}')">🗑️ Deletar</button>
          <button class="btn btn-sm btn-view" onclick="previewPublic('${p.id}')">👁️ Ver</button>
        </div>
      </div>
    `).join('');
  };

  // Visualizar (abre em nova aba usando blog.html#slug)
  window.previewPublic = function(id){
    const posts = readPosts();
    const p = posts.find(x=>x.id===id);
    if (!p) return alert('Post não encontrado');
    sessionStorage.setItem('titas_preview', JSON.stringify(p));
    window.open('/blog.html#preview-'+p.id, '_blank');
  };

  // preview image util (define base64 temporário)
  let currentCoverBase64 = null;
  window.previewImage = function(input, previewId){
    const file = input.files[0];
    const preview = document.getElementById(previewId);
    if (!file) { preview.innerHTML = ''; currentCoverBase64 = null; return; }
    const reader = new FileReader();
    reader.onload = (e)=>{
      currentCoverBase64 = e.target.result;
      preview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-height:200px;">`;
    };
    reader.readAsDataURL(file);
  };

  // Criar post
  window.handlePostSubmit = function(e){
    e.preventDefault();
    const title = document.getElementById('title').value.trim();
    if (!title) return alert('Título é obrigatório');
    const category = document.getElementById('category').value;
    const status = document.getElementById('status').value;
    const summary = document.getElementById('summary').value;
    const body = document.getElementById('body').value;
    const id = generateId();
    const slug = slugify(title) || id;
    const cover = currentCoverBase64;
    const post = {
      id, slug, title, category, status, summary, body,
      cover_image: cover || null,
      created_at: nowIso(),
      updated_at: nowIso()
    };
    const posts = readPosts();
    posts.push(post);
    savePosts(posts);
    document.getElementById('post-form').reset();
    document.getElementById('image-preview').innerHTML = '';
    currentCoverBase64 = null;
    loadPosts();
    switchTab('posts');
    alert('✅ Post salvo localmente (localStorage). Use Exportar para baixar o JSON.');
  };

  // Editar
  window.editPost = function(id){
    const posts = readPosts();
    const p = posts.find(x=>x.id===id);
    if (!p) return alert('Post não encontrado');
    document.getElementById('edit-id').value = p.id;
    document.getElementById('edit-title').value = p.title;
    document.getElementById('edit-category').value = p.category;
    document.getElementById('edit-status').value = p.status;
    document.getElementById('edit-summary').value = p.summary;
    document.getElementById('edit-body').value = p.body;
    document.getElementById('edit-image-preview').innerHTML = p.cover_image ? `<img src="${p.cover_image}" style="max-height:200px;">` : '';
    document.getElementById('edit-modal').style.display = 'block';
  };

  window.handleEditSubmit = function(e){
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const posts = readPosts();
    const idx = posts.findIndex(x=>x.id===id);
    if (idx===-1) return alert('Post não encontrado');
    posts[idx].title = document.getElementById('edit-title').value;
    posts[idx].category = document.getElementById('edit-category').value;
    posts[idx].status = document.getElementById('edit-status').value;
    posts[idx].summary = document.getElementById('edit-summary').value;
    posts[idx].body = document.getElementById('edit-body').value;
    const fileInput = document.getElementById('edit-cover_image');
    if (fileInput && fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev)=>{
        posts[idx].cover_image = ev.target.result;
        posts[idx].updated_at = nowIso();
        savePosts(posts);
        closeEditModal();
        loadPosts();
        alert('✅ Alterações salvas');
      };
      reader.readAsDataURL(fileInput.files[0]);
    } else {
      posts[idx].updated_at = nowIso();
      savePosts(posts);
      closeEditModal();
      loadPosts();
      alert('✅ Alterações salvas');
    }
  };

  window.closeEditModal = function(){
    document.getElementById('edit-modal').style.display = 'none';
    document.getElementById('edit-form').reset();
    document.getElementById('edit-image-preview').innerHTML = '';
  };

  // Deletar
  window.deletePost = function(id){
    if (!confirm('Tem certeza que quer deletar este post?')) return;
    const posts = readPosts().filter(p=>p.id!==id);
    savePosts(posts);
    loadPosts();
    alert('✅ Post removido');
  };

  // Export / Import
  window.exportPosts = function(){
    const posts = readPosts();
    const blob = new Blob([JSON.stringify(posts, null, 2)], {type:'application/json'});
    const name = `posts-export-${(new Date()).toISOString().slice(0,10)}.json`;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  window.triggerImport = function(){ document.getElementById('import-file').click(); };

  window.handleImportFile = function(e){
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev)=>{
      try {
        const imported = JSON.parse(ev.target.result);
        if (!Array.isArray(imported)) throw new Error('Formato inválido: esperado array de posts');
        const existing = readPosts();
        // merge: keep existing ids, add new ones; if id exists, add with new id
        imported.forEach(p=>{
          if (!p.id || existing.find(x=>x.id===p.id)) { p.id = generateId(); p.slug = slugify(p.title||p.id); }
          existing.push(p);
        });
        savePosts(existing);
        loadPosts();
        alert('✅ Import concluído');
      } catch (err) {
        alert('Erro ao importar: ' + err.message);
      }
    };
    reader.readAsText(f);
    e.target.value = '';
  };

  // Inicialização
  window.addEventListener('DOMContentLoaded', ()=>{
    setupTabNavigation();
    document.getElementById('cover_image')?.addEventListener('change', (e)=>previewImage(e.target, 'image-preview'));
    document.getElementById('edit-cover_image')?.addEventListener('change', (e)=>previewImage(e.target, 'edit-image-preview'));
    document.getElementById('import-file')?.addEventListener('change', (e)=>handleImportFile(e));
    if (isLoggedIn()) {
      showDashboard();
    }
  });

  function showDashboard(){
    document.getElementById('login-tab').classList.remove('active');
    document.getElementById('dashboard').style.display = 'block';
    loadPosts();
    setupTabNavigation();
  }

  window._titas_readPosts = readPosts;
  window._titas_reset = function(){ localStorage.removeItem(POSTS_KEY); localStorage.removeItem(PASS_KEY); alert('Reset feito'); };
})();
