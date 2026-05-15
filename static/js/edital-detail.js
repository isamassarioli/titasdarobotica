/**
 * Edital Detail - carrega um edital pelo slug ou id e renderiza a página de detalhe.
 */

function getEditalIdentifier() {
    const params = new URLSearchParams(window.location.search);
    return params.get('slug') || params.get('id') || window.location.hash.replace(/^#/, '');
}

function normalizeEditalStatus(status) {
    return (status || '')
        .toString()
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

function formatEditalDate(dateString) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatEditalBody(text) {
    return (text || '')
        .split(/\n{2,}/)
        .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
        .join('');
}

function normalizeEdital(edital) {
    const status = normalizeEditalStatus(edital.status);

    return {
        ...edital,
        status: status === 'publicado' ? 'published' : status,
        image: edital.image || edital.cover_image || '/static/images/image.png',
        document: edital.document || null,
        description: edital.description || edital.summary || '',
        body: edital.body || edital.rules || '',
        start_date: edital.start_date || edital.created_at || null,
        end_date: edital.end_date || edital.start_date || edital.created_at || null
    };
}

function editalMatchesIdentifier(edital, identifier) {
    if (!identifier) return false;
    const value = String(identifier).trim();
    return String(edital.id) === value || String(edital.slug || '') === value;
}

async function fetchEditalFromCollection(identifier) {
    const response = await blogApi.getEditals();
    const results = Array.isArray(response?.results) ? response.results : (Array.isArray(response) ? response : []);
    return results.map(normalizeEdital).find(edital => editalMatchesIdentifier(edital, identifier)) || null;
}

async function loadEditalDetail() {
    const identifier = getEditalIdentifier();
    const container = document.getElementById('edital-detail');

    if (!identifier) {
        renderMessage('Edital não encontrado.');
        return;
    }

    try {
        let edital = null;

        try {
            edital = await blogApi.getEditalBySlug(identifier);
        } catch (error) {
            edital = null;
        }

        if (!edital) {
            edital = await fetchEditalFromCollection(identifier);
        }

        if (!edital) {
            renderMessage('Edital não encontrado.');
            return;
        }

        renderEdital(normalizeEdital(edital));
    } catch (error) {
        console.error('Erro ao carregar edital:', error);
        renderMessage('Não foi possível carregar este edital agora.');
    }
}

function renderEdital(edital) {
    const container = document.getElementById('edital-detail');
    const title = edital.title || 'Edital';
    const date = edital.start_date || edital.created_at || edital.updated_at;
    const statusLabel = {
        published: 'Publicado',
        open: 'Aberto',
        closed: 'Fechado',
        archived: 'Arquivado',
        draft: 'Rascunho'
    }[edital.status] || edital.status || 'Edital';

    document.title = `${title} - Titãs da Robótica`;
    container.innerHTML = `
        <article class="edital-detail">
            <a href="inscreva-se.html" class="edital-back-link">&larr; Voltar para inscrições</a>
            <div class="edital-detail-hero">
                ${edital.image ? `<img class="edital-detail-image" src="${edital.image}" alt="${title}">` : ''}
                <p class="edital-detail-meta">${statusLabel}${date ? ` · ${formatEditalDate(date)}` : ''}</p>
                <h1 class="edital-detail-title">${title}</h1>
                ${edital.description ? `<p class="edital-detail-summary">${edital.description}</p>` : ''}
                <div class="edital-detail-body">${formatEditalBody(edital.body || edital.description || '')}</div>
            </div>

            <section class="edital-links">
                <h2>LINKS</h2>
                <br>
                <div class="edital-link-list">
                    <a href="inscreva-se.html" class="edital-link-btn primary">Voltar para inscrições</a>
                    ${edital.document ? `<a href="${edital.document}" target="_blank" rel="noopener noreferrer" class="edital-link-btn">Abrir documento</a>` : ''}
                    <a href="contato.html" class="edital-link-btn">Fale conosco</a>
                </div>
            </section>
        </article>
    `;
}

function renderMessage(message) {
    const container = document.getElementById('edital-detail');
    container.innerHTML = `
        <div class="edital-detail-message">
            <p>${message}</p>
            <a href="inscreva-se.html" class="edital-back-link">Voltar para inscrições</a>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', loadEditalDetail);
