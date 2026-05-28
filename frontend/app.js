// Estado da calculadora
let estado = {
  expressao: '0',
  aguardandoNumero: true,
  ultimoFoiIgual: false,
  ultimoFoiOp: false,
};

// Detecta se está em produção ou local
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000'
  : '';

// =====================
// Funções de display
// =====================
function atualizarDisplay() {
  const el = document.getElementById('expression');
  el.textContent = estado.expressao;
  el.classList.remove('error');

  // Preview em tempo real
  const preview = document.getElementById('result-preview');
  const expr = estado.expressao;
  if (!estado.aguardandoNumero && !estado.ultimoFoiOp && expr !== '0' && /[\+\-\*\/]/.test(expr)) {
    try {
      const r = Function('"use strict"; return (' + expr + ')')();
      if (isFinite(r)) {
        preview.textContent = '= ' + formatarNumero(r);
        return;
      }
    } catch (_) {}
  }
  preview.textContent = '';
}

function formatarNumero(n) {
  if (Number.isInteger(n) && Math.abs(n) < 1e15) return n.toString();
  const s = parseFloat(n.toFixed(10)).toString();
  return s;
}

// =====================
// Ações dos botões
// =====================
function addNum(num) {
  if (estado.ultimoFoiIgual) {
    estado.expressao = num;
    estado.ultimoFoiIgual = false;
  } else if (estado.aguardandoNumero || estado.expressao === '0') {
    if (estado.ultimoFoiOp) {
      estado.expressao += num;
    } else {
      estado.expressao = num;
    }
    estado.aguardandoNumero = false;
  } else {
    if (estado.expressao.length < 20) {
      estado.expressao += num;
    }
  }
  estado.ultimoFoiOp = false;
  atualizarDisplay();
}

function addOp(op) {
  // Evita dois operadores seguidos
  if (estado.ultimoFoiOp) {
    estado.expressao = estado.expressao.slice(0, -1) + op;
    atualizarDisplay();
    return;
  }
  estado.expressao += op;
  estado.ultimoFoiOp = true;
  estado.ultimoFoiIgual = false;
  estado.aguardandoNumero = false;
  atualizarDisplay();

  // Destaca o botão de operador
  document.querySelectorAll('.btn-op').forEach(b => b.classList.remove('active-op'));
  const opMap = {'+': '+', '-': '−', '*': '×', '/': '÷'};
  document.querySelectorAll('.btn-op').forEach(b => {
    if (b.textContent.trim() === opMap[op]) b.classList.add('active-op');
  });
}

function addDecimal() {
  const partes = estado.expressao.split(/[\+\-\*\/]/);
  const atual = partes[partes.length - 1];
  if (atual.includes('.')) return;

  if (estado.ultimoFoiIgual || estado.ultimoFoiOp || estado.aguardandoNumero) {
    estado.expressao += '0.';
    estado.ultimoFoiIgual = false;
    estado.ultimoFoiOp = false;
    estado.aguardandoNumero = false;
  } else {
    estado.expressao += '.';
  }
  atualizarDisplay();
}

function limpar() {
  estado = {
    expressao: '0',
    aguardandoNumero: true,
    ultimoFoiIgual: false,
    ultimoFoiOp: false,
  };
  document.querySelectorAll('.btn-op').forEach(b => b.classList.remove('active-op'));
  document.getElementById('result-preview').textContent = '';
  atualizarDisplay();
}

function toggleSign() {
  if (estado.expressao === '0') return;
  if (estado.expressao.startsWith('-')) {
    estado.expressao = estado.expressao.slice(1);
  } else {
    estado.expressao = '-' + estado.expressao;
  }
  atualizarDisplay();
}

function percentagem() {
  try {
    const val = parseFloat(Function('"use strict"; return (' + estado.expressao + ')')());
    estado.expressao = formatarNumero(val / 100);
    atualizarDisplay();
  } catch (_) {}
}

// =====================
// Calcular via API
// =====================
async function calcular() {
  const expr = estado.expressao;
  if (!expr || expr === '0' || estado.ultimoFoiOp) return;

  document.querySelectorAll('.btn-op').forEach(b => b.classList.remove('active-op'));

  try {
    const res = await fetch(`${API_BASE}/api/calcular`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expressao: expr })
    });

    const data = await res.json();

    if (!res.ok) {
      mostrarErro(data.erro || 'Erro ao calcular');
      return;
    }

    const resultado = formatarNumero(data.resultado);
    estado.expressao = resultado;
    estado.ultimoFoiIgual = true;
    estado.ultimoFoiOp = false;
    estado.aguardandoNumero = false;
    document.getElementById('result-preview').textContent = '';
    atualizarDisplay();

    carregarHistorico();
  } catch (err) {
    // Fallback offline: calcula localmente
    try {
      const r = Function('"use strict"; return (' + expr + ')')();
      if (!isFinite(r)) { mostrarErro('Divisão por zero'); return; }
      estado.expressao = formatarNumero(r);
      estado.ultimoFoiIgual = true;
      estado.ultimoFoiOp = false;
      document.getElementById('result-preview').textContent = '';
      atualizarDisplay();
      adicionarHistoricoLocal(expr, r);
    } catch (_) {
      mostrarErro('Expressão inválida');
    }
  }
}

// =====================
// Histórico
// =====================
async function carregarHistorico() {
  try {
    const res = await fetch(`${API_BASE}/api/historico`);
    const data = await res.json();
    renderizarHistorico(data);
  } catch (_) {
    // silencioso
  }
}

function adicionarHistoricoLocal(expressao, resultado) {
  const item = {
    id: Date.now(),
    expressao,
    resultado,
    data: new Date().toISOString()
  };
  historicoLocal.unshift(item);
  if (historicoLocal.length > 20) historicoLocal.pop();
  renderizarHistorico(historicoLocal);
}

let historicoLocal = [];

function renderizarHistorico(itens) {
  const lista = document.getElementById('history-list');

  if (!itens || itens.length === 0) {
    lista.innerHTML = `
      <div class="history-empty">
        <span class="history-empty-icon">∅</span>
        <p>Nenhum cálculo ainda</p>
      </div>`;
    return;
  }

  lista.innerHTML = itens.map(item => {
    const hora = new Date(item.data).toLocaleTimeString('pt-BR', {
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    return `
      <div class="history-item" onclick="usarDoHistorico('${item.resultado}')">
        <div class="history-expr">${item.expressao} =</div>
        <div class="history-result">${formatarNumero(item.resultado)}</div>
        <div class="history-time">${hora}</div>
      </div>`;
  }).join('');
}

async function limparHistorico() {
  historicoLocal = [];
  try {
    await fetch(`${API_BASE}/api/historico`, { method: 'DELETE' });
  } catch (_) {}
  renderizarHistorico([]);
}

function usarDoHistorico(valor) {
  estado.expressao = String(valor);
  estado.ultimoFoiIgual = true;
  estado.ultimoFoiOp = false;
  atualizarDisplay();
  mostrarToast('Valor carregado ✓');
}

// =====================
// Teclado físico
// =====================
document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') addNum(e.key);
  else if (e.key === '+') addOp('+');
  else if (e.key === '-') addOp('-');
  else if (e.key === '*') addOp('*');
  else if (e.key === '/') { e.preventDefault(); addOp('/'); }
  else if (e.key === '.' || e.key === ',') addDecimal();
  else if (e.key === 'Enter' || e.key === '=') calcular();
  else if (e.key === 'Escape' || e.key === 'Delete') limpar();
  else if (e.key === 'Backspace') {
    if (estado.expressao.length > 1 && !estado.ultimoFoiIgual) {
      estado.expressao = estado.expressao.slice(0, -1);
    } else {
      estado.expressao = '0';
      estado.aguardandoNumero = true;
    }
    estado.ultimoFoiOp = false;
    atualizarDisplay();
  }
  else if (e.key === '%') percentagem();
});

// =====================
// Utilitários
// =====================
function mostrarErro(msg) {
  const el = document.getElementById('expression');
  el.textContent = msg;
  el.classList.add('error');
  setTimeout(() => {
    estado.expressao = '0';
    estado.aguardandoNumero = true;
    atualizarDisplay();
  }, 1500);
}

let toastTimeout;
function mostrarToast(msg) {
  const t = document.querySelector('.toast');
  if (t) t.remove();
  clearTimeout(toastTimeout);
  const div = document.createElement('div');
  div.className = 'toast';
  div.textContent = msg;
  document.body.appendChild(div);
  toastTimeout = setTimeout(() => div.remove(), 2000);
}

// =====================
// Status do servidor
// =====================
async function verificarStatus() {
  const label = document.getElementById('status-label');
  try {
    const res = await fetch(`${API_BASE}/api/health`);
    if (res.ok) {
      label.textContent = 'API Online';
    }
  } catch (_) {
    label.textContent = 'Modo Local';
    document.querySelector('.status-dot').style.background = '#f59e0b';
    document.querySelector('.status-dot').style.boxShadow = '0 0 8px rgba(245,158,11,0.7)';
  }
}

// Inicialização
atualizarDisplay();
carregarHistorico();
verificarStatus();
