/**
 * Blog Post Detail - carrega uma postagem pelo slug no Supabase.
 */

const SUPABASE_URL = 'https://mbpwppopfqensjeksxoy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1icHdwcG9wZnFlbnNqZWtzeG95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3OTI3MTEsImV4cCI6MjA5NDM2ODcxMX0.xkXGSgSlq1Vavtf5gULVD6h7M60C3h3SP3GLNLvT2nM';

function supabaseHeaders() {
    return {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Accept: 'application/json'
    };
}

function getSlug() {
    const params = new URLSearchParams(window.location.search);
    return params.get('slug') || window.location.hash.replace(/^#/, '');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function plainTextToHtml(text) {
    return (text || '')
        .split(/\n{2,}/)
        .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
        .join('');
}

async function fetchPost(slug) {
    const params = new URLSearchParams({
        select: '*',
        slug: `eq.${slug}`,
        limit: '1'
    });

    const response = await fetch(`${SUPABASE_URL}/rest/v1/posts?${params}`, {
        headers: supabaseHeaders()
    });

    if (!response.ok) {
        throw new Error(`Erro ao carregar post: ${response.status}`);
    }

    const posts = await response.json();
    return posts[0] || null;
}

function renderPost(post) {
    const container = document.getElementById('post-detail');
    const title = post.title || 'Post';
    const date = post.published_at || post.created_at || post.updated_at;

    document.title = `${title} - Titãs da Robótica`;
    container.innerHTML = `
        <article class="post-detail">
            <a href="blog.html" class="post-back-link">&larr; Voltar ao blog</a>
            ${post.cover_image ? `<img class="post-detail-image" src="${post.cover_image}" alt="${title}">` : ''}
            <p class="post-detail-meta">${formatDate(date)}${post.category ? ` · ${post.category}` : ''}</p>
            <h1 class="post-detail-title">${title}</h1>
            ${post.summary ? `<p class="post-detail-summary">${post.summary}</p>` : ''}
            <div class="post-detail-body">${plainTextToHtml(post.body || post.summary || '')}</div>
        </article>
    `;
}

function renderMessage(message) {
    const container = document.getElementById('post-detail');
    container.innerHTML = `
        <div class="post-detail-message">
            <p>${message}</p>
            <a href="blog.html" class="post-back-link">Voltar ao blog</a>
        </div>
    `;
}

async function loadPostDetail() {
    const slug = getSlug();

    if (!slug) {
        renderMessage('Post não encontrado.');
        return;
    }

    try {
        const post = await fetchPost(slug);
        if (!post) {
            renderMessage('Post não encontrado.');
            return;
        }
        renderPost(post);
    } catch (error) {
        console.error('Erro ao carregar post:', error);
        renderMessage('Não foi possível carregar este post agora.');
    }
}

document.addEventListener('DOMContentLoaded', loadPostDetail);
