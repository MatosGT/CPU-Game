const componentsData = [
    { id: 'cpu', name: 'Processador (CPU)', desc: 'Socket LGA & Alinhamento', hasRotation: true },
    { id: 'eps', name: 'Cabo EPS 8-Pin', desc: 'Alimentação VRMs da CPU', hasRotation: false },
    { id: 'atx', name: 'Cabo ATX 24-Pin', desc: 'Energia Motherboard & Chipset', hasRotation: false },
    { id: 'ram', name: 'Memória RAM DDR5', desc: 'Controlador IMC (A2/B2)', hasRotation: false },
    { id: 'nvme', name: 'SSD M.2 NVMe', desc: '4x PCIe Lanes Diretas', hasRotation: false },
    { id: 'gpu', name: 'Placa Gráfica (GPU)', desc: '16x PCIe Lanes Diretas', hasRotation: false }
];

const theoryDatabase = {
    cpu: {
        pill: '1. Socket LGA vs PGA',
        title: '1. O Socket da CPU: Arquitetura LGA vs PGA',
        body: `<p>O <strong>Socket</strong> estabelece a ligação mecânica e elétrica entre o processador e a placa-mãe (motherboard).</p>
               <ul>
                   <li><strong>LGA (Land Grid Array):</strong> Usado pela Intel e AMD AM5. Os milhares de pinos delicados estão na <em>motherboard</em> e a CPU tem contactos planos dourados.</li>
                   <li><strong>PGA (Pin Grid Array):</strong> Usado no antigo AMD AM4. Os pinos estão na base do próprio processador.</li>
               </ul>
               <p><strong>Alinhamento (Keying):</strong> O triângulo dourado no canto da CPU deve coincidir com a marca no socket para evitar curto-circuitos ou danos físicos.</p>`,
        note: 'A alavanca de retenção exerce pressão uniforme sobre o IHS (Integrated Heat Spreader) para garantir contacto perfeito com todos os pinos.'
    },
    eps: {
        pill: '2. Energia EPS & VRMs',
        title: '2. Alimentação EPS 12V e Circuito VRM',
        body: `<p>Os processadores modernos consomem muita potência (de 65W a mais de 250W), mas operam a tensões muito baixas (cerca de <strong>1.1V a 1.35V</strong>).</p>
               <p>O cabo <strong>EPS (4+4 pinos)</strong> transporta corrente de 12V diretamente da fonte de alimentação para os <strong>VRMs (Voltage Regulator Modules)</strong> situados à volta do socket, que convertem os 12V na tensão exata exigida pelos núcleos.</p>`,
        note: 'Sem o cabo EPS ligado, as ventoinhas podem rodar, mas a CPU não recebe energia e o sistema não inicia (sem POST).'
    },
    atx: {
        pill: '3. Cabo ATX 24-Pin',
        title: '3. Alimentação Principal ATX de 24 Pinos',
        body: `<p>O conector <strong>ATX de 24 pinos</strong> (localizado na borda direita da motherboard) fornece as linhas principais de <strong>+3.3V, +5V e +12V</strong> para o funcionamento geral da placa.</p>
               <p>Alimenta o Chipset, os slots de memória RAM, as portas USB, o áudio integrado e fornece até 75W diretamente através da ranhura PCIe.</p>`,
        note: 'Inclui o pino PS_ON# (fio verde nos cabos tradicionais) que permite ao botão de ligar da caixa ativar a fonte de alimentação.'
    },
    ram: {
        pill: '4. RAM & IMC',
        title: '4. Controlador de Memória (IMC) e Dual-Channel',
        body: `<p>Antigamente, a CPU comunicava com a RAM através de um chip externo (Northbridge). Hoje, o <strong>IMC (Integrated Memory Controller)</strong> está dentro da própria CPU, reduzindo drasticamente a latência.</p>
               <p>Ao instalar módulos nos slots <strong>A2 e B2</strong>, ativamos o modo <strong>Dual-Channel</strong>, duplicando a largura de barramento de 64 bits para <strong>128 bits</strong>.</p>`,
        note: 'Em motherboards com 4 slots (topologia Daisy-Chain), A2 e B2 são sempre os prioritários para evitar interferências de sinal nas pontas das pistas.'
    },
    nvme: {
        pill: '5. M.2 NVMe',
        title: '5. Armazenamento M.2 NVMe e Pistas PCIe Diretas',
        body: `<p>Ao contrário dos antigos discos SATA (limitados a ~550 MB/s), os SSDs <strong>M.2 NVMe</strong> ligam-se diretamente ao barramento <strong>PCI Express</strong>.</p>
               <p>O slot primário (<strong>M.2_1</strong>) liga-se diretamente a <strong>4 pistas (lanes) PCIe</strong> da CPU, atingindo velocidades superiores a 7.000 MB/s (PCIe 4.0) ou 14.000 MB/s (PCIe 5.0).</p>`,
        note: 'Os slots M.2 secundários ligam-se normalmente ao Chipset e partilham largura de banda com outros periféricos.'
    },
    gpu: {
        pill: '6. PCIe x16',
        title: '6. Barramento PCIe x16 e Linhas da CPU',
        body: `<p>O barramento <strong>PCI Express (PCIe)</strong> é uma ligação ponto-a-ponto de alta velocidade organizada em pistas (<em>lanes</em>: x1, x4, x8, x16).</p>
               <p>O primeiro slot <strong>PCIe x16</strong> possui 16 pistas ligadas diretamente à CPU, garantindo máxima largura de banda e mínima latência para a placa gráfica (GPU).</p>`,
        note: 'Uma CPU desktop moderna oferece normalmente 20 a 28 pistas PCIe diretas: 16 para a GPU + 4 para o M.2 principal + 4/8 para comunicar com o Chipset.'
    },
    chipset: {
        pill: '7. Chipset & DMI',
        title: '7. Chipset (PCH) e Barramento DMI',
        body: `<p>Como a CPU tem um número limitado de pinos e pistas diretas, o <strong>Chipset (Platform Controller Hub)</strong> funciona como um gestor de tráfego para os restantes componentes.</p>
               <p>A CPU comunica com o Chipset através do barramento <strong>DMI (Direct Media Interface)</strong>, e o Chipset distribui ligações para portas USB, portas SATA, placa de rede, Wi-Fi, áudio e slots PCIe secundários.</p>`,
        note: 'É o modelo do Chipset (ex: B760, Z790, B650, X670) que define funcionalidades como capacidade de overclocking e número total de portas USB/M.2.'
    }
};

const quizQuestions = [
    {
        q: '1. Qual é a principal vantagem de ligar a RAM e o primeiro SSD M.2 diretamente à CPU em vez de passar pelo Chipset?',
        options: [
            'Consome menos energia da fonte ATX',
            'Menor latência e maior largura de banda dedicada',
            'Permite usar memórias DDR3 e DDR5 ao mesmo tempo'
        ],
        correct: 1,
        explanation: 'A ligação direta ao controlador integrado da CPU evita o gargalo do barramento DMI do Chipset.'
    },
    {
        q: '2. Qual a função dos VRMs alimentados pelo cabo EPS de 8 pinos?',
        options: [
            'Converter os 12V da fonte numa tensão baixa e estável (~1.2V) para a CPU',
            'Aumentar a velocidade das ventoinhas da caixa',
            'Transferir dados entre a placa gráfica e o monitor'
        ],
        correct: 0,
        explanation: 'Os VRMs regulam a tensão de 12V para os níveis exatos necessários aos núcleos do processador.'
    },
    {
        q: '3. Na arquitetura LGA (Land Grid Array), onde se encontram os pinos de contacto?',
        options: [
            'Na parte inferior do processador (CPU)',
            'No interior do socket da motherboard',
            'Nos módulos de memória RAM'
        ],
        correct: 1,
        explanation: 'Em sockets LGA, os pinos estão na motherboard e a CPU possui apenas contactos planos.'
    },
    {
        q: '4. Como comunica a CPU com dispositivos periféricos como portas USB, discos SATA e rede?',
        options: [
            'Diretamente através do cabo EPS',
            'Através do Chipset (PCH) ligado à CPU pelo barramento DMI',
            'Através dos slots de memória DIMM'
        ],
        correct: 1,
        explanation: 'O Chipset gere os periféricos secundários e comunica com a CPU via barramento DMI.'
    }
];

let state = {
    score: 0,
    cpuRotation: 90,
    cpuPlaced: false,
    cpuLocked: false,
    installed: new Set(),
    selectedPart: null,
    draggedPart: null,
    currentQuizIndex: 0
};

const partsList = document.getElementById('parts-list');
const feedbackBox = document.getElementById('feedback-box');
const scoreDisplay = document.getElementById('score');
const progressDisplay = document.getElementById('progress-count');
const cpuLever = document.getElementById('cpu-lever');

function initGame() {
    partsList.innerHTML = '';
    componentsData.forEach(part => {
        const div = document.createElement('div');
        div.className = 'part-item';
        div.draggable = true;
        div.id = `part-${part.id}`;

        const infoWrap = document.createElement('div');
        infoWrap.innerHTML = `<strong>${part.name}</strong><br><small style="color:#8b949e">${part.desc}</small>`;

        const actionsWrap = document.createElement('div');
        actionsWrap.className = 'part-actions';

        if (part.hasRotation) {
            const badge = document.createElement('div');
            badge.className = 'cpu-badge';
            badge.id = 'cpu-icon';
            badge.style.transform = `rotate(${state.cpuRotation}deg)`;
            actionsWrap.appendChild(badge);
        }

        const qBtn = document.createElement('button');
        qBtn.className = 'info-btn';
        qBtn.type = 'button';
        qBtn.title = 'Estudar esta matéria';
        qBtn.textContent = '?';
        qBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openTheory(part.id, true);
        });
        actionsWrap.appendChild(qBtn);

        div.appendChild(infoWrap);
        div.appendChild(actionsWrap);

        div.addEventListener('click', () => {
            if (state.installed.has(part.id) || (part.id === 'cpu' && state.cpuPlaced)) return;
            selectPart(part.id);
        });

        div.addEventListener('dragstart', e => {
            if (state.installed.has(part.id) || (part.id === 'cpu' && state.cpuPlaced)) {
                e.preventDefault();
                return;
            }
            state.draggedPart = part.id;
            selectPart(part.id);
            if (e.dataTransfer) {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', part.id);
            }
        });

        div.addEventListener('dragend', () => {
            state.draggedPart = null;
        });

        partsList.appendChild(div);
    });

    initTheoryPills();
    openTheory('cpu', false);
}

function selectPart(partId) {
    state.selectedPart = partId;
    document.querySelectorAll('.part-item').forEach(el => {
        el.classList.toggle('selected', el.id === `part-${partId}`);
    });
}

function clearSelection() {
    state.selectedPart = null;
    state.draggedPart = null;
    document.querySelectorAll('.part-item').forEach(el => el.classList.remove('selected'));
}

function initTheoryPills() {
    const pillsContainer = document.getElementById('topic-pills');
    pillsContainer.innerHTML = '';

    Object.keys(theoryDatabase).forEach(key => {
        const btn = document.createElement('button');
        btn.className = 'pill-btn';
        btn.type = 'button';
        btn.id = `pill-${key}`;
        btn.textContent = theoryDatabase[key].pill;
        btn.addEventListener('click', () => openTheory(key, true));
        pillsContainer.appendChild(btn);
    });
}

function openTheory(topicKey, autoSwitch = true) {
    if (autoSwitch) switchTab('tab-theory');
    const data = theoryDatabase[topicKey];
    if (!data) return;
    const viewer = document.getElementById('theory-viewer');

    viewer.innerHTML = `
        <h3>${data.title}</h3>
        ${data.body}
        <div class="tech-note">💡 <strong>Nota de Arquitetura:</strong> ${data.note}</div>
    `;

    document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
    const activePill = document.getElementById(`pill-${topicKey}`);
    if (activePill) activePill.classList.add('active');
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('hidden', content.id !== tabId);
        content.classList.toggle('active', content.id === tabId);
    });
}

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

const chipsetBtn = document.getElementById('chipset-btn');
if (chipsetBtn) {
    chipsetBtn.addEventListener('click', () => openTheory('chipset', true));
}

document.getElementById('btn-rotate').addEventListener('click', () => {
    if (state.cpuPlaced) return;
    state.cpuRotation = (state.cpuRotation + 90) % 360;
    const icon = document.getElementById('cpu-icon');
    if (icon) icon.style.transform = `rotate(${state.cpuRotation}deg)`;

    switchTab('tab-diag');
    if (state.cpuRotation === 0) {
        setFeedback('✅ Triângulo dourado alinhado (0°)! Arrasta ou clica no Socket LGA para instalar a CPU.', 'info');
    } else {
        setFeedback(`CPU a ${state.cpuRotation}°. Continua a rodar até o triângulo dourado ficar no canto inferior esquerdo (0°).`, 'info');
    }
});

document.querySelectorAll('.slot').forEach(slot => {
    slot.addEventListener('dragenter', e => {
        e.preventDefault();
        slot.classList.add('drag-over');
    });

    slot.addEventListener('dragover', e => {
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
        slot.classList.add('drag-over');
    });

    slot.addEventListener('dragleave', () => {
        slot.classList.remove('drag-over');
    });

    slot.addEventListener('drop', e => {
        e.preventDefault();
        slot.classList.remove('drag-over');
        const partId = (e.dataTransfer && e.dataTransfer.getData('text/plain')) || state.draggedPart || state.selectedPart;
        if (!partId) return;

        switchTab('tab-diag');
        handleInstall(partId, slot.dataset.target, slot);
    });

    slot.addEventListener('click', (e) => {
        if (e.target === cpuLever) return;
        if (!state.selectedPart) return;

        switchTab('tab-diag');
        handleInstall(state.selectedPart, slot.dataset.target, slot);
    });
});

function handleInstall(partId, targetId, slotEl) {
    if (partId !== targetId) {
        updateScore(-10);
        setFeedback('❌ Encaixe incompatível! Clica no botão "?" do componente para ver onde deve ser ligado.', 'error');
        return;
    }

    if (partId === 'cpu') {
        if (state.cpuPlaced) return;
        if (state.cpuRotation !== 0) {
            updateScore(-20);
            setFeedback('⚠️ Orientação errada! Alinha o triângulo dourado a 0° antes de pousar a CPU no socket LGA.', 'error');
            return;
        }
        state.cpuPlaced = true;
        slotEl.classList.add('filled');
        slotEl.querySelector('.label').textContent = 'CPU POSICIONADA\n(Clica na alavanca)';
        const partEl = document.getElementById('part-cpu');
        partEl.classList.add('installed');
        partEl.draggable = false;
        cpuLever.classList.add('ready');
        clearSelection();
        updateScore(40);
        setFeedback('👍 CPU assente no socket! Agora clica na alavanca dourada à direita do socket para trancar a retenção.', 'success');
        return;
    }

    if (!state.cpuLocked) {
        setFeedback('⚠️ Instala e tranca primeiro a CPU no socket antes de ligar a alimentação e os barramentos.', 'error');
        return;
    }

    if (!state.installed.has(partId)) {
        state.installed.add(partId);
        slotEl.classList.add('filled');
        const partEl = document.getElementById(`part-${partId}`);
        partEl.classList.add('installed');
        partEl.draggable = false;
        clearSelection();
        updateScore(30);
        activateBus(partId);
    }
}

cpuLever.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!state.cpuPlaced || state.cpuLocked) return;
    state.cpuLocked = true;
    state.installed.add('cpu');
    cpuLever.classList.remove('ready');
    cpuLever.classList.add('locked');
    document.getElementById('slot-cpu').querySelector('.label').textContent = 'CPU TRANCADA\n(LGA 1700)';
    document.getElementById('status-cpu').textContent = '🟢 Socket CPU: Ativo e Trancado';
    updateScore(30);
    updateProgress();
    switchTab('tab-diag');
    setFeedback('🔒 Socket trancado! Já podes ligar os cabos de alimentação (EPS e ATX) e os barramentos de dados.', 'success');
});

function activateBus(partId) {
    const infoMap = {
        eps: {
            statusId: 'status-eps',
            statusText: '🟢 Alimentação VRM (EPS 8-Pin): 12V -> ~1.2V Ativos',
            msg: '⚡ Cabo EPS ligado! Os VRMs regulam agora os 12V para alimentar os núcleos da CPU.'
        },
        atx: {
            statusId: 'status-atx',
            statusText: '🟢 Alimentação Geral (ATX 24-Pin): Chipset Ativo',
            msg: '🔌 Cabo ATX 24-Pin ligado! Motherboard e Chipset (PCH) energizados via barramento DMI.',
            trace: 'trace-dmi'
        },
        ram: {
            statusId: 'status-ram',
            statusText: '🟢 Controlador IMC: Dual-Channel (128-bit) Ativo',
            msg: '🧠 Memória RAM instalada em A2/B2! Comunicação direta com o controlador integrado na CPU.',
            trace: 'trace-ram'
        },
        nvme: {
            statusId: 'status-m2',
            statusText: '🟢 Barramento NVMe: 4x PCIe Lanes Diretas',
            msg: '💾 SSD M.2 NVMe ligado diretamente às 4 pistas PCIe da CPU sem passar pelo Chipset.',
            trace: 'trace-m2'
        },
        gpu: {
            statusId: 'status-pcie',
            statusText: '🟢 Barramento PCIe x16: 16x Lanes Diretas',
            msg: '🎮 Placa Gráfica ligada às 16 pistas PCIe de alta velocidade da CPU.',
            trace: 'trace-pcie'
        }
    };

    const data = infoMap[partId];
    document.getElementById(data.statusId).textContent = data.statusText;
    if (data.trace) document.getElementById(data.trace).classList.add('active');
    setFeedback(data.msg, 'success');
    updateProgress();

    if (state.installed.size === 6) {
        setTimeout(startQuiz, 1200);
    }
}

function updateProgress() {
    progressDisplay.textContent = `${state.installed.size}/6`;
}

function startQuiz() {
    state.currentQuizIndex = 0;
    document.getElementById('quiz-modal').classList.remove('hidden');
    renderQuizQuestion();
}

function renderQuizQuestion() {
    const qData = quizQuestions[state.currentQuizIndex];
    document.getElementById('quiz-step').textContent = `Pergunta ${state.currentQuizIndex + 1} de ${quizQuestions.length}`;
    document.getElementById('quiz-question').textContent = qData.q;
    const optionsDiv = document.getElementById('quiz-options');
    const fbDiv = document.getElementById('quiz-feedback');
    
    optionsDiv.innerHTML = '';
    fbDiv.textContent = '';

    qData.options.forEach((optText, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = optText;
        btn.addEventListener('click', () => {
            if (idx === qData.correct) {
                updateScore(25);
                fbDiv.style.color = '#2ea043';
                fbDiv.textContent = `✅ Correto! ${qData.explanation}`;
                setTimeout(() => {
                    state.currentQuizIndex++;
                    if (state.currentQuizIndex < quizQuestions.length) {
                        renderQuizQuestion();
                    } else {
                        document.getElementById('quiz-modal').classList.add('hidden');
                        setFeedback(`🏆 Parabéns! Concluíste a montagem e o teste teórico com ${state.score} pontos!`, 'success');
                    }
                }, 1600);
            } else {
                updateScore(-10);
                fbDiv.style.color = '#f85149';
                fbDiv.textContent = '❌ Resposta incorreta. Consulta a aba "Matéria Completa" se precisares de rever!';
            }
        });
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

document.getElementById('btn-reset').addEventListener('click', () => {
    state = {
        score: 0,
        cpuRotation: 90,
        cpuPlaced: false,
        cpuLocked: false,
        installed: new Set(),
        selectedPart: null,
        draggedPart: null,
        currentQuizIndex: 0
    };
    scoreDisplay.textContent = '0';
    progressDisplay.textContent = '0/6';
    document.querySelectorAll('.slot').forEach(slot => slot.classList.remove('filled', 'drag-over'));
    document.getElementById('slot-cpu').querySelector('.label').textContent = 'SOCKET LGA 1700';
    cpuLever.classList.remove('locked', 'ready');
    document.querySelectorAll('.traces path').forEach(p => p.classList.remove('active'));
    document.getElementById('status-cpu').textContent = '🔴 Socket CPU: Vazio';
    document.getElementById('status-eps').textContent = '🔴 Alimentação VRM (EPS 8-Pin): Desligada';
    document.getElementById('status-atx').textContent = '🔴 Alimentação Geral (ATX 24-Pin): Desligada';
    document.getElementById('status-ram').textContent = '🔴 Controlador de Memória (IMC): Inativo';
    document.getElementById('status-m2').textContent = '🔴 Barramento NVMe (4x Lanes): Sem disco';
    document.getElementById('status-pcie').textContent = '🔴 Barramento PCIe x16 (16x Lanes): Vazio';
    document.getElementById('quiz-modal').classList.add('hidden');
    setFeedback('Começa por alinhar o triângulo dourado da <strong>CPU</strong> (roda a 0°) e coloca-a no <strong>Socket LGA</strong>.', 'info');
    initGame();
});

initGame();
