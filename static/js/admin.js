/**
 * Admin client-only: CRUD de posts e editais via localStorage.
 */

(function(){
  const POSTS_KEY = 'titas_posts';
  const EDITAIS_KEY = 'titas_editais';
  const PASS_KEY = 'titas_admin_password';
  const SESSION_KEY = 'titas_is_admin';

  const initialPassword = '@Isadora100504';
  if (!localStorage.getItem(PASS_KEY)) {
    localStorage.setItem(PASS_KEY, initialPassword);
  }

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

  function readPosts() { return readItems(POSTS_KEY); }
  function savePosts(posts) { saveItems(POSTS_KEY, posts); }
  function readEditais() { return readItems(EDITAIS_KEY); }
  function saveEditais(editais) { saveItems(EDITAIS_KEY, editais); }

  function slugify(str){
    return (str || '').toString().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  function nowIso(){ return new Date().toISOString(); }
  function generateId(){ return String(Date.now()) + Math.floor(Math.random() * 1000); }
  function isLoggedIn(){ return sessionStorage.getItem(SESSION_KEY) === '1'; }
  function setLogged(flag){ sessionStorage.setItem(SESSION_KEY, flag ? '1' : '0'); }
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

  window.loadPosts = function(){
    const category = document.getElementById('filter-category')?.value || '';
    const status = document.getElementById('filter-status')?.value || '';
    const postsList = document.getElementById('posts-list');
    const filtered = readPosts().slice().reverse().filter(p => {
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
          <span class="category">${p.category}</span>
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
    const post = readPosts().find(x => x.id === id);
    if (!post) return alert('Post não encontrado');
    sessionStorage.setItem('titas_preview', JSON.stringify(post));
    window.open('/blog.html#preview-' + post.id, '_blank');
  };

  window.handlePostSubmit = async function(e){
    e.preventDefault();
    const title = document.getElementById('title').value.trim();
    if (!title) return alert('Título é obrigatório');

    const cover = await readImageFile(document.getElementById('cover_image'));
    const id = generateId();
    const post = {
      id,
      slug: slugify(title) || id,
      title,
      category: document.getElementById('category').value,
      status: document.getElementById('status').value,
      summary: document.getElementById('summary').value,
      body: document.getElementById('body').value,
      cover_image: cover,
      created_at: nowIso(),
      updated_at: nowIso()
    };

    const posts = readPosts();
    posts.push(post);
    savePosts(posts);
    document.getElementById('post-form').reset();
    document.getElementById('image-preview').innerHTML = '';
    loadPosts();
    switchTab('posts');
    alert('Post salvo localmente. Use Exportar para baixar o JSON.');
  };

  window.editPost = function(id){
    const p = readPosts().find(x => x.id === id);
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

  window.handleEditSubmit = async function(e){
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const posts = readPosts();
    const idx = posts.findIndex(x => x.id === id);
    if (idx === -1) return alert('Post não encontrado');

    posts[idx].title = document.getElementById('edit-title').value;
    posts[idx].slug = slugify(posts[idx].title) || posts[idx].slug || id;
    posts[idx].category = document.getElementById('edit-category').value;
    posts[idx].status = document.getElementById('edit-status').value;
    posts[idx].summary = document.getElementById('edit-summary').value;
    posts[idx].body = document.getElementById('edit-body').value;
    posts[idx].updated_at = nowIso();

    const cover = await readImageFile(document.getElementById('edit-cover_image'));
    if (cover) posts[idx].cover_image = cover;

    savePosts(posts);
    closeEditModal();
    loadPosts();
    alert('Alterações salvas');
  };

  window.closeEditModal = function(){
    document.getElementById('edit-modal').style.display = 'none';
    document.getElementById('edit-form').reset();
    document.getElementById('edit-image-preview').innerHTML = '';
  };

  window.deletePost = function(id){
    if (!confirm('Tem certeza que quer deletar este post?')) return;
    savePosts(readPosts().filter(p => p.id !== id));
    loadPosts();
    alert('Post removido');
  };

  window.loadEditais = function(){
    const status = document.getElementById('filter-edital-status')?.value || '';
    const editaisList = document.getElementById('editais-list');
    const filtered = readEditais().slice().reverse().filter(edital => !status || edital.status === status);

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
          <span class="date">Início: ${formatDate(edital.start_date)}</span>
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
    if (!title) return alert('Título é obrigatório');

    const image = await readImageFile(document.getElementById('edital-image'));
    const id = generateId();
    const edital = {
      id,
      slug: slugify(title) || id,
      title,
      status: document.getElementById('edital-status').value,
      description: document.getElementById('edital-description').value,
      body: document.getElementById('edital-body').value,
      start_date: document.getElementById('edital-start').value,
      end_date: document.getElementById('edital-end').value,
      document: document.getElementById('edital-document').value.trim(),
      image,
      created_at: nowIso(),
      updated_at: nowIso()
    };

    const editais = readEditais();
    editais.push(edital);
    saveEditais(editais);
    document.getElementById('edital-form').reset();
    document.getElementById('edital-image-preview').innerHTML = '';
    loadEditais();
    switchTab('editais');
    alert('Edital salvo localmente. Use Exportar para baixar o JSON.');
  };

  window.editEdital = function(id){
    const edital = readEditais().find(x => x.id === id);
    if (!edital) return alert('Edital não encontrado');
    document.getElementById('edit-edital-id').value = edital.id;
    document.getElementById('edit-edital-title').value = edital.title;
    document.getElementById('edit-edital-status').value = edital.status;
    document.getElementById('edit-edital-description').value = edital.description || '';
    document.getElementById('edit-edital-body').value = edital.body || '';
    document.getElementById('edit-edital-start').value = edital.start_date || '';
    document.getElementById('edit-edital-end').value = edital.end_date || '';
    document.getElementById('edit-edital-document').value = edital.document || '';
    document.getElementById('edit-edital-image-preview').innerHTML = edital.image ? `<img src="${edital.image}" style="max-height:200px;">` : '';
    document.getElementById('edit-edital-modal').style.display = 'block';
  };

  window.handleEditalEditSubmit = async function(e){
    e.preventDefault();
    const id = document.getElementById('edit-edital-id').value;
    const editais = readEditais();
    const idx = editais.findIndex(x => x.id === id);
    if (idx === -1) return alert('Edital não encontrado');

    editais[idx].title = document.getElementById('edit-edital-title').value;
    editais[idx].slug = slugify(editais[idx].title) || editais[idx].slug || id;
    editais[idx].status = document.getElementById('edit-edital-status').value;
    editais[idx].description = document.getElementById('edit-edital-description').value;
    editais[idx].body = document.getElementById('edit-edital-body').value;
    editais[idx].start_date = document.getElementById('edit-edital-start').value;
    editais[idx].end_date = document.getElementById('edit-edital-end').value;
    editais[idx].document = document.getElementById('edit-edital-document').value.trim();
    editais[idx].updated_at = nowIso();

    const image = await readImageFile(document.getElementById('edit-edital-image'));
    if (image) editais[idx].image = image;

    saveEditais(editais);
    closeEditalModal();
    loadEditais();
    alert('Alterações do edital salvas');
  };

  window.closeEditalModal = function(){
    document.getElementById('edit-edital-modal').style.display = 'none';
    document.getElementById('edit-edital-form').reset();
    document.getElementById('edit-edital-image-preview').innerHTML = '';
  };

  window.deleteEdital = function(id){
    if (!confirm('Tem certeza que quer deletar este edital?')) return;
    saveEditais(readEditais().filter(edital => edital.id !== id));
    loadEditais();
    alert('Edital removido');
  };

  window.previewEdital = function(id){
    const edital = readEditais().find(x => x.id === id);
    if (!edital) return alert('Edital não encontrado');
    window.open('/editais.html#' + (edital.slug || edital.id), '_blank');
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
        if (!Array.isArray(imported)) throw new Error(`Formato inválido: esperado array de ${label}`);
        const existing = readItems(key);
        imported.forEach(item => {
          if (!item.id || existing.find(x => x.id === item.id)) item.id = generateId();
          if (!item.slug) item.slug = slugify(item.title || item.id);
          existing.push(item);
        });
        saveItems(key, existing);
        reload();
        alert('Import concluído');
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
    if (isLoggedIn()) showDashboard();
  });

  function showDashboard(){
    document.getElementById('login-tab').classList.remove('active');
    document.getElementById('dashboard').style.display = 'block';
    loadPosts();
    loadEditais();
  }

  window._titas_readPosts = readPosts;
  window._titas_readEditais = readEditais;
  window._titas_reset = function(){
    localStorage.removeItem(POSTS_KEY);
    localStorage.removeItem(EDITAIS_KEY);
    localStorage.removeItem(PASS_KEY);
    alert('Reset feito');
  };
})();
