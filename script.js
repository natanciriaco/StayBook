
const USUARIO_FIXO = {
    usuario: 'admin',
    senha: 'admin',
    nome: 'Administrador'
};
let isLoggedIn = false;

const DADOS_IMOVEIS = [
    { id: 1, titulo: 'Casa Aconchegante na Serra', tipo: 'residencial', valorDiaria: 350, localizacao: 'Gramado, RS', descricao: 'Chalé com lareira e vista panorâmica.', imagem: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
    { id: 2, titulo: 'Apartamento Corporativo Luxo', tipo: 'corporativo', valorDiaria: 450, localizacao: 'Berrini, SP', descricao: 'Próximo a centros empresariais. Ideal para executivos.', imagem: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
    { id: 3, titulo: 'Loft Moderno Centro', tipo: 'residencial', valorDiaria: 120, localizacao: 'Fortaleza, CE', descricao: 'Design minimalista e acesso fácil.', imagem: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
    { id: 4, titulo: 'Escritório Compartilhado', tipo: 'corporativo', valorDiaria: 180, localizacao: 'Rio de Janeiro, RJ', descricao: 'Espaço de coworking com salas privativas.', imagem: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
    { id: 5, titulo: 'Bangalô à Beira Mar', tipo: 'residencial', valorDiaria: 600, localizacao: 'Florianópolis, SC', descricao: 'Acesso direto à praia e deck privativo.', imagem: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
    { id: 6, titulo: 'Studio Executivo', tipo: 'corporativo', valorDiaria: 220, localizacao: 'Brasília, DF', descricao: 'Prático para viagens de negócios rápidas.', imagem: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
];

let DADOS_RESERVAS = [];


const imoveisGrid = document.getElementById('imoveis-grid');
const modalLogin = document.getElementById('modal-login');
const modalReserva = document.getElementById('modal-reserva');
const modalVisualizarReservas = document.getElementById('modal-visualizar-reservas');
const formLogin = document.getElementById('form-login');
const formBusca = document.getElementById('form-busca');     
const btnLogout = document.getElementById('btn-logout');
const btnMenu = document.getElementById('btn-menu-hamburguer');
const btnReservasCadastradas = document.getElementById('btn-reservas-cadastradas');
const formRegistroReserva = document.getElementById('form-registro-reserva');
const msgLoginReserva = document.getElementById('msg-login-reserva');
const msgErroReserva = document.getElementById('msg-erro-reserva');
const inputCheckIn = document.getElementById('reserva-data-checkin');
const inputCheckOut = document.getElementById('reserva-data-checkout');


let imovelSelecionadoId = null;


function openModal(modal) { modal.style.display = 'block'; }
function closeModal(modal) { modal.style.display = 'none'; }


document.querySelectorAll('.close-button').forEach(button => {
    button.onclick = function() { closeModal(this.closest('.modal')); }
});


window.onclick = function(event) {
    if (event.target.classList.contains('modal')) { closeModal(event.target); }
}


function irParaLogin() {
    closeModal(modalReserva); 
    openModal(modalLogin);
}


function updateUIForLoginState() {
    const initial = isLoggedIn ? USUARIO_FIXO.nome.charAt(0).toUpperCase() : '';
    
    
    btnMenu.innerHTML = isLoggedIn
        ? `<div class="avatar-circle">${initial}</div>`
        : '<span class="icon-line"></span><span class="icon-line"></span><span class="icon-line"></span>';
    
    btnMenu.className = isLoggedIn ? 'user-avatar' : 'menu-hamburguer';
    
    
    formLogin.style.display = isLoggedIn ? 'none' : 'block';
    btnLogout.style.display = isLoggedIn ? 'block' : 'none';

   
    if (modalReserva.style.display === 'block') {
        abrirModalReserva(imovelSelecionadoId, false); 
    }
}




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
        updateUIForLoginState(); 
    } else {
        alert('Credenciais inválidas. Tente: admin / admin');
    }
}

function handleLogout() {
    isLoggedIn = false;
    closeModal(modalLogin);
    formLogin.reset();
    updateUIForLoginState(); 
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
        <h3 style="margin-top: 15px;">R$${imovel.valorDiaria} <span style="font-size: 0.8em; font-weight: normal">por noite</span></h3>
    `;

    
    formRegistroReserva.style.display = isLoggedIn ? 'block' : 'none';
    msgLoginReserva.style.display = isLoggedIn ? 'none' : 'block';
    msgErroReserva.textContent = ''; 

    openModal(modalReserva);
}

function temConflitoDeReserva(idImovel, checkInNovo, checkOutNovo) {
    const reservasDoImovel = DADOS_RESERVAS.filter(r => r.idImovel === idImovel);
    for (const reserva of reservasDoImovel) {
        const checkInExistente = new Date(reserva.dataCheckIn + 'T00:00:00');
        const checkOutExistente = new Date(reserva.dataCheckOut + 'T00:00:00');
        
        if ((checkInNovo < checkOutExistente) && (checkOutNovo > checkInExistente)) {
            return true;
        }
    }
    return false;
}

function registrarReserva(event) {
    event.preventDefault();
    
    
    const checkinVal = inputCheckIn.value;
    const checkoutVal = inputCheckOut.value;
    const imovel = DADOS_IMOVEIS.find(i => i.id === imovelSelecionadoId);

    if(!checkinVal || !checkoutVal) {
        msgErroReserva.textContent = "Preencha as datas.";
        return;
    }

    const dataCheckIn = new Date(checkinVal + 'T00:00:00');
    const dataCheckOut = new Date(checkoutVal + 'T00:00:00');
    const hoje = new Date();
    hoje.setHours(0,0,0,0);

    if (dataCheckIn < hoje) {
        msgErroReserva.textContent = 'A data de check-in não pode ser no passado.';
        return;
    }
    if (dataCheckIn >= dataCheckOut) {
        msgErroReserva.textContent = 'O check-out deve ser após o check-in.';
        return;
    }

    if (temConflitoDeReserva(imovelSelecionadoId, dataCheckIn, dataCheckOut)) {
        msgErroReserva.textContent = 'Indisponível nestas datas.';
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
    alert(`Reserva Confirmada!\n${imovel.titulo}\nTotal: R$${valorTotal}`);
    
    formRegistroReserva.reset();
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
                <p style="font-weight:bold; margin: 5px 0;">Total: R$${reserva.valorTotal}</p>
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


document.addEventListener('DOMContentLoaded', () => {
    renderImoveis(DADOS_IMOVEIS);

    
    updateUIForLoginState(); 

    btnMenu.addEventListener('click', () => {
        if (!isLoggedIn) {
            openModal(modalLogin);
        } else {
            if(confirm('Você está logado. Deseja abrir o menu de Login/Sair?')) openModal(modalLogin);
        }
    });

    formLogin.addEventListener('submit', handleLogin);
    btnLogout.addEventListener('click', handleLogout);
    formRegistroReserva.addEventListener('submit', registrarReserva);
    formBusca.addEventListener('submit', handleBusca); 
    btnReservasCadastradas.addEventListener('click', visualizarReservas);
});
