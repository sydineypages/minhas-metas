let metas = JSON.parse(localStorage.getItem('metas')) || []; // Carrega metas do localStorage
let metasConcluidas = [];
let metasNaoConcluidas = [];
let metasAnteriores = [];

// Evento de envio do formulário
document.getElementById('metaForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const metaTexto = document.getElementById('metaInput').value;
    const metaHora = document.getElementById('metaTime').value;
    const metaData = document.getElementById('metaDate').value;

    if (metaTexto && metaHora && metaData) {
        const meta = {
            texto: metaTexto,
            hora: metaHora,
            data: metaData,
            concluido: false,
            justificativa: "",
            horarioRealizado: null
        };

        metas.push(meta); // Adiciona a meta ao array 'metas'
        salvarMetas(); // Salva as metas no localStorage
        atualizarLista(); // Atualiza a lista de metas exibida na página

        // Limpa os campos do formulário
        document.getElementById('metaInput').value = '';
        document.getElementById('metaTime').value = '';
        document.getElementById('metaDate').value = '';

        // Exibir mensagem de sucesso
        exibirMensagemSucesso();

        // Exibe a aba de metas adicionadas automaticamente
        mostrarAba('metaPage');
    }
});

// Função para atualizar a lista de metas
function atualizarLista() {
    const metaList = document.getElementById('metaList');
    metaList.innerHTML = '';

    metas.sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora)); // Ordena as metas por data e hora

    metas.forEach((meta, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${meta.texto} - ${meta.data} ${meta.hora}</span>
            <input type="checkbox" ${meta.concluido ? 'checked' : ''} onchange="marcarConcluido(${index})">
            ${meta.concluido ? '' : `<button onclick="justificar(${index})">Justificar</button>`}
            <button onclick="deletarMeta(${index})">🗑️</button>
        `;
        metaList.appendChild(li);
    });
}

// Função para salvar metas no localStorage
function salvarMetas() {
    localStorage.setItem('metas', JSON.stringify(metas));
}

function exibirMensagemSucesso() {
    const mensagem = document.getElementById('mensagemSucesso');
    mensagem.style.display = 'block';
    setTimeout(() => {
        mensagem.style.display = 'none';
    }, 2000);
}

// Função para mostrar uma aba específica
function mostrarAba(aba) {
    const abas = ['metaPage', 'concluidasPage', 'naoConcluidasPage', 'anterioresPage'];
    abas.forEach(id => {
        document.getElementById(id).style.display = 'none';
    });
    document.getElementById(aba).style.display = 'block';
}

// Eventos para as abas
document.getElementById('verMetas').addEventListener('click', function () {
    mostrarAba('metaPage');
});
document.getElementById('verConcluidas').addEventListener('click', function () {
    mostrarAba('concluidasPage');
    atualizarMetasConcluidas();
});
document.getElementById('verNaoConcluidas').addEventListener('click', function () {
    mostrarAba('naoConcluidasPage');
    atualizarMetasNaoConcluidas();
});
document.getElementById('verAnteriores').addEventListener('click', function () {
    mostrarAba('anterioresPage');
    atualizarMetasAnteriores();
});

// Função para marcar meta como concluída ou não
function marcarConcluido(index) {
    const agora = new Date();
    metas[index].concluido = !metas[index].concluido;
    metas[index].horarioRealizado = agora.toLocaleTimeString();
    
    if (metas[index].concluido) {
        metasConcluidas.push(metas[index]);
    }
    
    salvarMetas(); // Salva as metas no localStorage
    atualizarLista();
}

// Função para justificar meta não concluída
function justificar(index) {
    const justificativa = prompt("Por que não concluiu essa meta?");
    if (justificativa) {
        metas[index].justificativa = justificativa;
        metasNaoConcluidas.push(metas[index]);
        deletarMeta(index); // Remove da lista de metas ativas
        atualizarMetasNaoConcluidas();
    }
}

// Função para deletar meta
function deletarMeta(index) {
    metas.splice(index, 1); // Remove a meta da lista
    salvarMetas(); // Salva as metas no localStorage
    atualizarLista(); // Atualiza a lista
}

// Função para atualizar metas concluídas
function atualizarMetasConcluidas() {
    const metaConcluidasList = document.getElementById('metaConcluidasList');
    metaConcluidasList.innerHTML = '';

    metasConcluidas.forEach((meta) => {
        const li = document.createElement('li');
        li.textContent = `${meta.texto} - ${meta.data} ${meta.hora} (Realizado às: ${meta.horarioRealizado})`;
        metaConcluidasList.appendChild(li);
    });
}

// Função para atualizar metas não concluídas
function atualizarMetasNaoConcluidas() {
    const metaNaoConcluidasList = document.getElementById('metaNaoConcluidasList');
    metaNaoConcluidasList.innerHTML = '';

    metasNaoConcluidas.forEach((meta) => {
        const li = document.createElement('li');
        li.innerHTML = `${meta.texto} - ${meta.data} ${meta.hora} <br> Justificativa: ${meta.justificativa}`;
        metaNaoConcluidasList.appendChild(li);
    });
}

// Função para atualizar metas anteriores
function atualizarMetasAnteriores() {
    const metaAnterioresList = document.getElementById('metaAnterioresList');
    metaAnterioresList.innerHTML = '';

    metas.forEach((meta) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${meta.texto} - ${meta.data} ${meta.hora} 
            ${meta.concluido ? `(Concluído às: ${meta.horarioRealizado})` : `(Justificativa: ${meta.justificativa})`}
        `;
        metaAnterioresList.appendChild(li);
    });
}

// Carrega as metas do localStorage ao iniciar a página
window.onload = atualizarLista;
