const componentsData = [
    { id: 'cpu', name: 'Processador (CPU)', desc: 'Núcleo de processamento', hasRotation: true },
    { id: 'eps', name: 'Cabo EPS 8-Pin', desc: 'Alimentação dedicada CPU', hasRotation: false },
    { id: 'ram', name: 'Módulos RAM DDR5', desc: 'Dual-Channel A2/B2', hasRotation: false },
    { id: 'nvme', name: 'SSD M.2 NVMe', desc: '4x PCIe Lanes diretas', hasRotation: false },
    { id: 'gpu', name: 'Placa Gráfica (GPU)', desc: '16x PCIe Lanes diretas', hasRotation: false }
];

let state = {
    score: 0,
    cpuRotation: 90, // Começa desalinhado (0 é o correto)
    cpuPlaced: false,
    cpuLocked: false,
    installed: new Set()
};

const partsList = document.getElementById('parts-list');
const feedbackBox = document.getElementById('feedback-box');
const scoreDisplay = document.getElementById('score');
const cpuLever = document.getElementById('cpu-lever');

function initGame() {
    partsList.innerHTML = '';
    componentsData.forEach(part => {
        const div = document.createElement('div');
        div.className = 'part-item';
        div.draggable = true;
        div.id = `part-${part.id}`;
        div.dataset.id = part.id;

        div.innerHTML = `
            <div>
                <strong>${part.name}</strong><br>
                <small style="color:#8b949e">${part.desc}</small>
            </div>
            ${part.hasRotation ? `<div class="cpu-badge" id="cpu-icon" style="transform: rotate(${state.cpuRotation}deg)"></div>` : ''}
        `;

        div.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text/plain', part.id);
        });

        partsList.appendChild(div);
    });
}

// Botão Rodar CPU
document.getElementById('btn-rotate').addEventListener('click', () => {
    if (state.cpuPlaced) return;
    state.cpuRotation = (state.cpuRotation + 90) % 360;
    const icon = document.getElementById('cpu-icon');
    if (icon) icon.style.transform = `rotate(${state.cpuRotation}deg)`;
    
    if (state.cpuRotation === 0) {
        setFeedback('Triângulo dourado alinhado! Podes inserir a CPU no socket.', 'info');
    } else {
        setFeedback(`CPU rodada a ${state.cpuRotation}°. O triângulo dourado ainda não coincide com o canto inferior esquerdo.`, 'info');
    }
});

// Configurar zonas de Drop
document.querySelectorAll('.slot').forEach(slot => {
    slot.addEventListener('dragover', e => {
        e.preventDefault();
        slot.classList.add('drag-over');
    });

    slot.addEventListener('dragleave', () => {
        slot.classList.remove('drag-over');
    });

    slot.addEventListener('drop', e => {
        e.preventDefault();
        slot.classList.remove('drag-over');
        const partId = e.dataTransfer.getData('text/plain');
        const targetId = slot.dataset.target;

        handleDrop(partId, targetId, slot);
    });
});

function handleDrop(partId, targetId, slotEl) {
    if (partId !== targetId) {
        updateScore(-10);
        setFeedback('❌ Encaixe incorreto! Verifica a compatibilidade física e a etiqueta do slot.', 'error');
        return;
    }

    // Validação específica da CPU
    if (partId === 'cpu') {
        if (state.cpuRotation !== 0) {
            updateScore(-20);
            setFeedback('⚠️ Perigo! O triângulo dourado da CPU não está alinhado com o socket. Roda a CPU antes de encaixar.', 'error');
            return;
        }
        state.cpuPlaced = true;
        slotEl.classList.add('filled');
        slotEl.querySelector('.label').textContent = 'CPU ENCAIXADA (DESTRANCADA)';
        document.getElementById('part-cpu').classList.add('installed');
        updateScore(50);
        setFeedback('✅ CPU posicionada! Agora clica na alavanca metálica à direita do socket para trancar o mecanismo LGA.', 'success');
        return;
    }

    // Exigir CPU instalada e trancada para ativar barramentos
    if (!state.cpuLocked) {
        setFeedback('⚠️ Instala e tranca primeiro a CPU no socket antes de ligar os barramentos e alimentação.', 'error');
        return;
    }

    // Instalar restantes componentes
    if (!state.installed.has(partId)) {
        state.installed.add(partId);
        slotEl.classList.add('filled');
        document.getElementById(`part-${partId}`).classList.add('installed');
        updateScore(30);
        activateBus(partId);
    }
}

// Trancar alavanca do Socket
cpuLever.addEventListener('click', () => {
    if (!state.cpuPlaced || state.cpuLocked) return;
    state.cpuLocked = true;
    cpuLever.classList.add('locked');
    document.getElementById('slot-cpu').querySelector('.label').textContent = 'CPU TRANCADA (LGA 1700)';
    document.getElementById('status-cpu').textContent = '🟢 Socket CPU: Ativo e Trancado';
    updateScore(25);
    setFeedback('🔒 Socket trancado com sucesso! Já podes ligar o cabo de alimentação EPS e os componentes dos barramentos.', 'success');
});

function activateBus(partId) {
    const messages = {
        eps: {
            statusId: 'status-eps',
            statusText: '🟢 Alimentação VRM (EPS 8-Pin): 12V Estáveis',
            msg: '⚡ Cabo EPS ligado! Os VRMs agora fornecem energia limpa e regulada aos núcleos da CPU.'
        },
        ram: {
            statusId: 'status-ram',
            statusText: '🟢 Controlador de Memória: Dual-Channel Ativo',
            msg: '🧠 Memória RAM ligada diretamente ao controlador integrado na CPU (IMC) em modo Dual-Channel.',
            trace: 'trace-ram'
        },
        nvme: {
            statusId: 'status-m2',
            statusText: '🟢 Barramento NVMe: 4x PCIe Lanes Diretas',
            msg: '💾 SSD M.2 instalado no slot primário ligado diretamente às pistas PCIe da CPU (menor latência).',
            trace: 'trace-m2'
        },
        gpu: {
            statusId: 'status-pcie',
            statusText: '🟢 Linhas PCIe x16: Largura de Banda Máxima',
            msg: '🎮 Placa Gráfica ligada às 16 pistas PCIe principais da CPU.',
            trace: 'trace-pcie'
        }
    };

    const info = messages[partId];
    document.getElementById(info.statusId).textContent = info.statusText;
    if (info.trace) document.getElementById(info.trace).classList.add('active');
    setFeedback(info.msg, 'success');

    if (state.installed.size === 4) {
        document.getElementById('level-title').textContent = '2. Verificação Final';
        setTimeout(showQuiz, 1200);
    }
}

function showQuiz() {
    const modal = document.getElementById('quiz-modal');
    const optionsDiv = document.getElementById('quiz-options');
    modal.classList.remove('hidden');

    const answers = [
        { text: 'Conector ATX de 24 pinos', correct: false },
        { text: 'Conector EPS de 8 pinos (CPU Power)', correct: true },
        { text: 'Barramento PCIe x16', correct: false }
    ];

    optionsDiv.innerHTML = '';
    answers.forEach(ans => {
        const btn = document.createElement('button');
        btn.textContent = ans.text;
        btn.onclick = () => {
            if (ans.correct) {
                updateScore(50);
                alert(`Parabéns! Sistema montado e validado com ${state.score} pontos.`);
                modal.classList.add('hidden');
            } else {
                updateScore(-15);
                alert('Incorreto! O conector EPS de 8 pinos é o responsável pela alimentação dedicada da CPU.');
            }
        };
        optionsDiv.appendChild(btn);
    });
}

function updateScore(points) {
    state.score = Math.max(0, state.score + points);
    scoreDisplay.textContent = state.score;
}

function setFeedback(text, type) {
    feedbackBox.innerHTML = text;
    feedbackBox.className = `feedback ${type}`;
}

document.getElementById('btn-reset').addEventListener('click', () => location.reload());

initGame();
