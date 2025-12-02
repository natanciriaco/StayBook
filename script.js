// --- DADOS FICTÍCIOS ---
const USUARIO_FIXO = {
    usuario: 'admin',
    senha: 'admin',
    nome: 'Administrador'
};
let isLoggedIn = false;

// Dados dos Imóveis (Usei URLs externas para facilitar o teste sem precisar de pasta 'assets')
const DADOS_IMOVEIS = [
    { id: 1, titulo: 'Casa Aconchegante na Serra', tipo: 'residencial', valorDiaria: 350, localizacao: 'Gramado, RS', descricao: 'Chalé com lareira e vista panorâmica.', imagem: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
    { id: 2, titulo: 'Apartamento Corporativo Luxo', tipo: 'corporativo', valorDiaria: 450, localizacao: 'Berrini, SP', descricao: 'Próximo a centros empresariais. Ideal para executivos.', imagem: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
    { id: 3, titulo: 'Loft Moderno Centro', tipo: 'residencial', valorDiaria: 120, localizacao: 'Fortaleza, CE', descricao: 'Design minimalista e acesso fácil.', imagem: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
    { id: 4, titulo: 'Escritório Compartilhado', tipo: 'corporativo', valorDiaria: 180, localizacao: 'Rio de Janeiro, RJ', descricao: 'Espaço de coworking com salas privativas.', imagem: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
    { id: 5, titulo: 'Bangalô à Beira Mar', tipo: 'residencial', valorDiaria: 600, localizacao: 'Florianópolis, SC', descricao: 'Acesso direto à praia e deck privativo.', imagem: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
    { id: 6, titulo: 'Studio Executivo', tipo: 'corporativo', valorDiaria: 220, localizacao: 'Brasília, DF', descricao: 'Prático para viagens de negócios rápidas.', imagem: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
];

// Dados de Reservas (Inicia vazio ou com simulações)
let DADOS_RESERVAS = [];

// --- ELEMENTOS DO DOM ---
const imoveisGrid = document.getElementById('imoveis-grid');
const modalLogin = document.getElementById('modal-login');
const modalReserva = document.getElementById('modal-reserva');
const modalVisualizarReservas = document.getElementById('modal-visualizar-reservas');
const formLogin = document.getElementById('form-login');
const btnLogout = document.getElementById('btn-logout');
const btnMenu = document.getElementById('btn-menu-hamburguer');
const btnReservasCadastradas = document.getElementById('btn-reservas-cadastradas');
const formBusca = document.getElementById('form-busca');
const btnBuscar = document.getElementById('btn-buscar');

let imovelSelecionadoId = null;

// --- CONTROLE DE MODAIS ---
function openModal(modal) { modal.style.display = 'block'; }
function closeModal(modal) { modal.style.display = 'none'; }

// Fecha modais ao clicar no 'X'
document.querySelectorAll('.close-button').forEach(button => {
    button.onclick = function() { closeModal(this.closest('.modal')); }
});

// Fecha modais ao clicar fora
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) { closeModal(event.target); }
}

// NOVO: Função para transicionar da Reserva para o Login
function irParaLogin() {
    closeModal(modalReserva); 
    openModal(modalLogin);
}

// --- FUNÇÕES PRINCIPAIS ---

function renderImoveis(imoveis) {
    imoveisGrid.innerHTML = ''; 
    if (imoveis.length === 0) {
        imoveisGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Nenhum imóvel encontrado com os filtros aplicados.</p>';
        return;
    }

    imoveis.forEach(imovel => {
        const card = document.createElement('div');
        card.className = 'imovel-card';
        card.onclick = () => abrirModalReserva(imovel.id);
        
        card.innerHTML = `
            <img src="${imovel.imagem}" alt="${imovel.titulo}">
            <div class="imovel-card-info">
                <p><strong>${imovel.localizacao}</strong></p>
                <h3>${imovel.titulo}</h3>
                <p class="price">R$${imovel.valorDiaria} <span>por noite</span></p>
            </div>
        `;
        imoveisGrid.appendChild(card);
    });
}

function handleLogin(event) {
    event.preventDefault();
    const usuarioInput = document.getElementById('login-usuario').value;
    const senhaInput = document.getElementById('login-senha').value;

    if (usuarioInput === USUARIO_FIXO.usuario && senhaInput === USUARIO_FIXO.senha) {
        isLoggedIn = true;
        closeModal(modalLogin);
        
        formLogin.style.display = 'none';
        btnLogout.style.display = 'block';
        
        const inicial = USUARIO_FIXO.nome.charAt(0).toUpperCase();
        btnMenu.innerHTML = `<div class="avatar-circle">${inicial}</div>`;
        btnMenu.className = 'user-avatar';
        
        if(modalReserva.style.display === 'block') {
             // Se o modal de reserva estava aberto, atualiza para mostrar o form
            abrirModalReserva(imovelSelecionadoId); 
        }
    } else {
        alert('Credenciais inválidas. Tente: admin / admin');
    }
}

function handleLogout() {
    isLoggedIn = false;
    closeModal(modalLogin);
    
    formLogin.style.display = 'block';
    btnLogout.style.display = 'none';
    formLogin.reset();
    
    btnMenu.innerHTML = '<span class="icon-line"></span><span class="icon-line"></span><span class="icon-line"></span>';
    btnMenu.className = 'menu-hamburguer';

    alert('Você saiu da conta.');
}

function abrirModalReserva(id) {
    const imovel = DADOS_IMOVEIS.find(i => i.id === id);
    if (!imovel) return;

    imovelSelecionadoId = id;

    document.getElementById('reserva-titulo').textContent = imovel.titulo;
    document.getElementById('reserva-detalhes').innerHTML = `
        <p style="color: #555; margin-bottom: 10px;">${imovel.localizacao} • ${imovel.tipo.charAt(0).toUpperCase() + imovel.tipo.slice(1)}</p>
        <p>${imovel.descricao}</p>
        <h3 style="margin-top: 15px;">R$${imovel.valorDiaria.toFixed(2)} <span style="font-size: 0.8em; font-weight: normal">por noite</span></h3>
    `;

    const formReserva = document.getElementById('form-registro-reserva');
    const msgLogin = document.getElementById('msg-login-reserva');
    document.getElementById('msg-erro-reserva').textContent = '';

    if (isLoggedIn) {
        formReserva.style.display = 'block';
        msgLogin.style.display = 'none';
    } else {
        formReserva.style.display = 'none';
        msgLogin.style.display = 'block';
    }

    openModal(modalReserva);
}

function temConflitoDeReserva(idImovel, checkInNovo, checkOutNovo) {
    const reservasDoImovel = DADOS_RESERVAS.filter(r => r.idImovel === idImovel);
    for (const reserva of reservasDoImovel) {
        const checkInExistente = new Date(reserva.dataCheckIn + 'T00:00:00');
        const checkOutExistente = new Date(reserva.dataCheckOut + 'T00:00:00');
        
        // As datas de entrada/saída já foram transformadas em Date objects na função registrarReserva
        if ((checkInNovo < checkOutExistente) && (checkOutNovo > checkInExistente)) {
            return true;
        }
    }
    return false;
}

function registrarReserva(event) {
    event.preventDefault();
    const checkinVal = document.getElementById('reserva-data-checkin').value;
    const checkoutVal = document.getElementById('reserva-data-checkout').value;
    const imovel = DADOS_IMOVEIS.find(i => i.id === imovelSelecionadoId);
    const msgErro = document.getElementById('msg-erro-reserva');

    if(!checkinVal || !checkoutVal) {
        msgErro.textContent = "Preencha as datas.";
        return;
    }

    // Criando datas com 'T00:00:00' para garantir que sejam tratadas como dia inteiro
    const dataCheckIn = new Date(checkinVal + 'T00:00:00');
    const dataCheckOut = new Date(checkoutVal + 'T00:00:00');
    const hoje = new Date();
    hoje.setHours(0,0,0,0);

    if (dataCheckIn < hoje) {
        msgErro.textContent = 'A data de check-in não pode ser no passado.';
        return;
    }
    if (dataCheckIn >= dataCheckOut) {
        msgErro.textContent = 'O check-out deve ser após o check-in.';
        return;
    }

    if (temConflitoDeReserva(imovelSelecionadoId, dataCheckIn, dataCheckOut)) {
        msgErro.textContent = 'Indisponível nestas datas.';
        return;
    }

    const diffTime = Math.abs(dataCheckOut - dataCheckIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    const valorTotal = diffDays * imovel.valorDiaria;

    const novaReserva = {
        id: Date.now(), 
        idImovel: imovelSelecionadoId,
        titulo: imovel.titulo,
        dataCheckIn: checkinVal,
        dataCheckOut: checkoutVal,
        valorTotal: valorTotal
    };

    DADOS_RESERVAS.push(novaReserva);
    
    closeModal(modalReserva);
    alert(`Reserva Confirmada!\n${imovel.titulo}\nTotal: R$${valorTotal.toFixed(2)}`);
    
    document.getElementById('form-registro-reserva').reset();
}

function deletarReserva(id) {
    if (confirm('Cancelar esta reserva?')) {
        DADOS_RESERVAS = DADOS_RESERVAS.filter(r => r.id !== id);
        visualizarReservas(); 
    }
}

function visualizarReservas() {
    const listaReservas = document.getElementById('lista-reservas');
    listaReservas.innerHTML = '';
    
    if (DADOS_RESERVAS.length === 0) {
        listaReservas.innerHTML = '<p>Você não tem reservas ativas.</p>';
    } else {
        DADOS_RESERVAS.forEach(reserva => {
            const item = document.createElement('div');
            item.style.borderBottom = '1px solid #eee';
            item.style.padding = '10px 0';
            item.innerHTML = `
                <h4 style="margin-bottom:5px;">${reserva.titulo}</h4>
                <p style="font-size:0.9em; color:#555;">${reserva.dataCheckIn} até ${reserva.dataCheckOut}</p>
                <p style="font-weight:bold; margin: 5px 0;">Total: R$${reserva.valorTotal.toFixed(2)}</p>
                <button class="btn-delete-reserva" onclick="deletarReserva(${reserva.id})">Cancelar</button>
            `;
            listaReservas.appendChild(item);
        });
    }
    openModal(modalVisualizarReservas);
}

function handleBusca(event) {
    event.preventDefault();
    const termo = document.getElementById('input-localizacao').value.toLowerCase();
    const filtrados = DADOS_IMOVEIS.filter(imovel => 
        imovel.localizacao.toLowerCase().includes(termo) ||
        imovel.titulo.toLowerCase().includes(termo)
    );
    renderImoveis(filtrados);
}

// --- EVENTOS ---
document.addEventListener('DOMContentLoaded', () => {
    renderImoveis(DADOS_IMOVEIS);

    btnMenu.addEventListener('click', () => {
        if (!isLoggedIn) {
            openModal(modalLogin);
        } else {
            // Se estiver logado, abre a opção de sair (Simplificado)
            if(confirm('Você está logado. Deseja abrir o menu de Login/Sair?')) openModal(modalLogin);
        }
    });

    formBusca.addEventListener('submit', handleBusca);
    btnLogout.addEventListener('click', handleLogout);
    document.getElementById('form-registro-reserva').addEventListener('submit', registrarReserva);
    btnBuscar.addEventListener('click', handleBusca);
    btnReservasCadastradas.addEventListener('click', visualizarReservas);
});