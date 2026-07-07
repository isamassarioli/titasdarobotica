/**
 * Team Detail - carrega a subequipe pelo slug na URL.
 */

const TEAM_DETAILS = {
    cospace: {
        title: 'CoSpace Rescue',
        kicker: 'Equipe de simulação 3D',
        summary: 'Programação de robôs virtuais para missões de resgate em ambientes simulados.',
        image: '/static/images/cospace1.jpg',
        badge: 'Categoria CoSpace Rescue',
        stats: [
            { value: '5', label: 'Membros' },
            { value: '8', label: 'Competições' },
            { value: '3', label: 'Prêmios' }
        ],
        description: [
            'A CoSpace trabalha com planejamento de rotas, tomada de decisão e ajuste fino de código em um ambiente virtual de alto ritmo.',
            'O objetivo é simular cenários de resgate com precisão, testando estratégias e autonomia antes de levar os aprendizados para competições reais.'
        ],
        highlights: [
            'Programação de robôs virtuais',
            'Missões de resgate em 3D',
            'Tomada de decisão em tempo real'
        ],
        orientadores: ['Jean Eduardo Glazar']
    },
    'futebol-2d': {
        title: 'Futebol 2D',
        kicker: 'Simulação estratégica',
        summary: 'Partidas de futebol com robôs virtuais, integrando estratégia, inteligência artificial e programação colaborativa.',
        image: '/static/images/futebol2d2025.jpg',
        badge: 'Categoria Futebol 2D',
        stats: [
            { value: '5', label: 'Membros' },
            { value: '6', label: 'Competições' },
            { value: '2', label: 'Prêmios' }
        ],
        description: [
            'A equipe desenvolve táticas, coordenação de agentes e análise de partidas para tomar decisões cada vez mais consistentes.',
            'É uma subequipe ideal para quem gosta de programação, estratégia e experimentação com inteligência artificial aplicada.'
        ],
        highlights: [
            'Estratégia e IA',
            'Programação colaborativa',
            'Leitura de jogo em simulação'
        ],
        orientadores: ['Jean Eduardo Glazar', 'Giovany Frossard Teixeira']
    },
    humanoide: {
        title: 'Humanóide',
        kicker: 'Robótica de alto desafio',
        summary: 'Robôs com forma humanoide que competem em modalidades como caminhada, futebol e dança.',
        image: '/static/images/humanoide.jpg',
        badge: 'Categoria Humanóide',
        stats: [
            { value: '6', label: 'Membros' },
            { value: '10', label: 'Competições' },
            { value: '5', label: 'Prêmios' }
        ],
        description: [
            'Essa subequipe reúne mecânica, eletrônica e software em um mesmo fluxo de trabalho, com foco em estabilidade e controle fino.',
            'O desenvolvimento exige integração constante entre hardware e algoritmos para dar vida a movimentos mais naturais e precisos.'
        ],
        highlights: [
            'Mecânica e controle',
            'Integração de sensores',
            'Movimento e equilíbrio'
        ],
        orientadores: ['Julio César Goldner Vendramini']
    },
    pesquisa: {
        title: 'Pesquisa',
        kicker: 'Experimentação e inovação',
        summary: 'Desenvolvimento de projetos de pesquisa em robótica, com foco em estudo, prototipagem e validação.',
        image: '/static/images/pesquisa2025.jpeg',
        badge: 'Núcleo de pesquisa',
        stats: [],
        description: [
            'A pesquisa conecta desafios reais com soluções criativas, abrindo espaço para experimentos, testes e documentação técnica.',
            'É uma porta de entrada para ideias novas que depois podem evoluir para projetos de competição ou aplicações práticas.'
        ],
        highlights: [
            'Protótipos e testes',
            'Validação de ideias',
            'Base para novos projetos'
        ],
        orientadores: ['Eduardo Max Amaro Amaral', 'Igor Carlos Pulini', 'Renan Osório Rios']
    },
    pratica: {
        title: 'OBR Prática',
        kicker: 'Montagem e treino',
        summary: 'Subequipe voltada para a modalidade prática da OBR, unindo construção, testes e ajustes de desempenho.',
        image: '/static/images/obrprática2025.jpg',
        badge: 'Categoria prática',
        stats: [],
        description: [
            'A prática é o espaço onde o robô sai da ideia e vira máquina de verdade, com foco em montagem, calibração e evolução contínua.',
            'Aqui entram ajustes mecânicos, validação de sensores, estratégia de prova e toda a rotina de preparação para competição.'
        ],
        highlights: [
            'Montagem e calibração',
            'Testes em pista',
            'Preparação para competição'
        ],
        orientadores: ['Alan Balardino', 'André Avelino', 'Arthur Belato', 'Dione Souza Albuquerque de Lima', 'Fabio Bigati', 'Jaimel de Oliveira Lima', 'Josiane Dalmasio Clabunde', 'Luis Fernando Reinoso']
    },
    'seguidor-de-linha': {
        title: 'Seguidor de Linha',
        kicker: 'Robótica clássica',
        summary: 'Categoria tradicional da OBR com robôs autônomos que seguem linha, desviam de obstáculos e resgatam vítimas simuladas.',
        image: '/static/images/seguidordelinha.jpg',
        badge: 'Categoria Seguidor de Linha',
        stats: [
            { value: '8', label: 'Membros' },
            { value: '15', label: 'Competições' },
            { value: '10', label: 'Prêmios' }
        ],
        description: [
            'É uma das trilhas mais clássicas da robótica educacional e concentra aprendizado de eletrônica, mecânica e lógica de controle.',
            'A equipe trabalha para construir robôs rápidos, estáveis e confiáveis, capazes de reagir bem em pistas desafiadoras.'
        ],
        highlights: [
            'Seguimento de trilha',
            'Desvio de obstáculos',
            'Resgate simulado'
        ],
        orientadores: ['Diego Rossi Mafioletti', 'Julio César Goldner Vendramini']
    },
    osorin: {
        title: 'Osorin',
        kicker: 'Robótica teórica',
        summary: 'Equipe focada em simulação, algoritmos avançados e estudo técnico aplicado à robótica.',
        image: '/static/images/equipeosorin.jpg',
        badge: 'Categoria teórica',
        stats: [],
        description: [
            'A Osorin reúne quem gosta de aprofundar conceitos, estudar soluções e experimentar estratégias computacionais mais sofisticadas.',
            'O trabalho da equipe também ajuda a disseminar conhecimento entre as outras subequipes, conectando teoria com prática.'
        ],
        highlights: [
            'Algoritmos avançados',
            'Simulação e estudo',
            'Base teórica para as equipes'
        ],
        orientadores: ['Ailton Souza Duarte', 'Alextian Bartholomeu Liberato', 'Ricardo Tedesco da Silva', 'Eduardo Max Amaro Amaral']
    },
    'obr-teorica': {
        title: 'OBR Teórica',
        kicker: 'Lógica e programação',
        summary: 'Modalidade teórica da Olimpíada Brasileira de Robótica com foco em programação, raciocínio e resolução de problemas.',
        image: '/static/images/obrteórica.jpg',
        badge: 'Categoria OBR Teórica',
        stats: [],
        description: [
            'A equipe se dedica a desafios teóricos da olimpíada, construindo uma base sólida de lógica e interpretação de enunciados.',
            'É uma frente importante para formar estudantes com raciocínio analítico e preparação para competições de programação.'
        ],
        highlights: [
            'Programação competitiva',
            'Raciocínio lógico',
            'Preparação para a OBR'
        ],
        orientadores: ['Alan Balardino', 'André Avelino', 'Arthur Belato', 'Dione Souza Albuquerque de Lima', 'Fabio Bigati', 'Jaimel de Oliveira Lima', 'Josiane Dalmasio Clabunde', 'Luis Fernando Reinoso']
    },
    challenger: {
        title: 'Challenger',
        kicker: 'Desafios especiais',
        summary: 'Subequipe dedicada a desafios especiais e competições alternativas, com espaço para experimentação e resposta rápida.',
        image: '/static/images/challenger2025.jpg',
        badge: 'Categoria Challenger',
        stats: [],
        description: [
            'A Challenger trabalha com missões e formatos menos previsíveis, exigindo adaptabilidade e bom alinhamento entre projeto e execução.',
            'É um ambiente interessante para testar ideias novas e combinar conhecimentos que vêm de outras subequipes.'
        ],
        highlights: [
            'Desafios especiais',
            'Competição alternativa',
            'Experimentação rápida'
        ],
        orientadores: ['Julio César Goldner Vendramini']
    },
    coordenacao: {
        title: 'Coordenação e Orientadores',
        kicker: 'Estrutura do projeto',
        summary: 'Área que organiza as subequipes, a orientação e o acompanhamento das trilhas do Titãs da Robótica.',
        image: '/static/images/Equipes.png',
        badge: 'Gestão do projeto',
        stats: [],
        description: [
            'A coordenação faz a ponte entre estudantes, orientadores e as demandas de cada categoria, mantendo o projeto alinhado e sustentável.',
            'Ela também ajuda a distribuir prioridades, acompanhar evolução e dar suporte para que cada equipe tenha espaço para crescer.'
        ],
        highlights: [
            'Organização das subequipes',
            'Acompanhamento de orientadores',
            'Planejamento do projeto'
        ],
        groups: [
            { title: 'SEK (Standard Educational Kit)', members: ['Igor Carlos Pulini', 'Renan Osório Rios'] },
            { title: 'Futebol 2D', members: ['Jean Eduardo Glazar', 'Giovany Frossard Teixeira'] },
            { title: 'CoSpace', members: ['Jean Eduardo Glazar'] },
            { title: 'Humanóide', members: ['Julio César Goldner Vendramini'] },
            { title: 'Seguidor de Linha', members: ['Diego Rossi Mafioletti', 'Julio César Goldner Vendramini'] },
            { title: 'ADM (Administrativa)', members: ['Joanita Araújo Espanhol'] },
            { title: 'Lego Sumô', members: ['Igor Carlos Pulini', 'Renan Osório Rios'] },
            { title: 'Drone', members: ['Igor Carlos Pulini', 'Renan Osório Rios', 'Gustavo Ludovico Guidoni'] },
            { title: 'Osorin', members: ['Ailton Souza Duarte', 'Alextian Bartholomeu Liberato', 'Ricardo Tedesco da Silva', 'Eduardo Max Amaro Amaral'] },
            { title: 'Challenger', members: ['Julio César Goldner Vendramini'] },
            { title: 'Pesquisa', members: ['Eduardo Max Amaro Amaral', 'Igor Carlos Pulini', 'Renan Osório Rios'] },
            { title: 'OBR Teórica', members: ['Alan Balardino', 'André Avelino', 'Arthur Belato', 'Dione Souza Albuquerque de Lima', 'Fabio Bigati', 'Jaimel de Oliveira Lima', 'Josiane Dalmasio Clabunde', 'Luis Fernando Reinoso'] }
        ]
    }
};

const TEAM_SLUG_ALIASES = {
    seguidor: 'seguidor-de-linha',
    futebol2d: 'futebol-2d',
    'obrteórica': 'obr-teorica',
    teorica: 'obr-teorica'
};

function getTeamSlug() {
    const params = new URLSearchParams(window.location.search);
    const rawSlug = params.get('slug') || window.location.hash.replace(/^#/, '');
    if (!rawSlug) return 'cospace';
    return TEAM_SLUG_ALIASES[rawSlug] || rawSlug;
}

function renderStats(stats) {
    if (!stats || !stats.length) return '';

    return `
        <div class="team-detail-grid">
            ${stats.map(stat => `
                <article class="card text-center">
                    <div class="counter team-stat-number">${stat.value}</div>
                    <div class="team-stat-label">${stat.label}</div>
                </article>
            `).join('')}
        </div>
    `;
}

function renderHighlights(highlights) {
    if (!highlights || !highlights.length) return '';

    return `
        <div class="team-detail-list">
            ${highlights.map(highlight => `
                <div class="team-detail-list-card">
                    <h3>${highlight}</h3>
                </div>
            `).join('')}
        </div>
    `;
}

function renderOrientadores(orientadores) {
    if (!orientadores || !orientadores.length) return '';

    return `
        <section class="team-detail-section">
            <h2 class="section-title">Orientadores</h2>
            <div class="team-detail-list">
                <div class="team-detail-list-card" style="grid-column: 1 / -1;">
                    <ul>
                        ${orientadores.map(name => `<li>${name}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </section>
    `;
}

function renderCoordinatorGroups(groups) {
    if (!groups || !groups.length) return '';

    return `
        <section class="team-detail-section">
            <h2 class="section-title">Estrutura de orientação</h2>
            <div class="team-detail-list">
                ${groups.map(group => `
                    <div class="team-detail-list-card">
                        <h3>${group.title}</h3>
                        <ul>
                            ${group.members.map(member => `<li>${member}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        </section>
    `;
}

function renderTeamDetail(team) {
    const root = document.getElementById('team-detail-root');
    document.title = `${team.title} - Titãs da Robótica`;

    root.innerHTML = `
        <article class="team-detail-panel">
            <div class="team-detail-hero">
                <div class="team-detail-copy">
                    <p class="team-detail-kicker">${team.kicker}</p>
                    <h1 class="team-detail-title">${team.title}</h1>
                    <p class="team-detail-summary">${team.summary}</p>
                    <div class="team-detail-actions">
                        <a href="equipes.html" class="team-detail-button primary">Voltar às equipes</a>
                        <a href="blog.html" class="team-detail-button secondary">Ver o blog</a>
                    </div>
                </div>
                <div class="team-detail-media">
                    <img src="${team.image}" alt="${team.title}">
                    <div class="team-detail-badge">${team.badge}</div>
                </div>
            </div>
            <div style="padding: 0 40px 40px;">
                ${renderStats(team.stats)}
                <section class="team-detail-section">
                    <h2 class="section-title">Sobre a equipe</h2>
                    <div class="team-detail-body">
                        ${team.description.map(paragraph => `<p class="team-detail-paragraph">${paragraph}</p>`).join('')}
                    </div>
                </section>
                <section class="team-detail-section">
                    <h2 class="section-title">Destaques</h2>
                    ${renderHighlights(team.highlights)}
                </section>
                ${renderOrientadores(team.orientadores)}
                ${renderCoordinatorGroups(team.groups)}
            </div>
        </article>
    `;
}

function renderMessage(message) {
    const root = document.getElementById('team-detail-root');
    root.innerHTML = `
        <div class="team-detail-panel team-detail-message">
            <p>${message}</p>
            <a href="equipes.html" class="team-detail-button primary">Voltar às equipes</a>
        </div>
    `;
}

function loadTeamDetail() {
    const slug = getTeamSlug();
    const team = TEAM_DETAILS[slug];

    if (!team) {
        renderMessage('Equipe não encontrada.');
        return;
    }

    renderTeamDetail(team);
}

document.addEventListener('DOMContentLoaded', loadTeamDetail);