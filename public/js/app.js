// Link direto para o backend Express na Vercel
const API_URL = 'https://estoque-back-ruddy.vercel.app/api';

let html5QrcodeScanner = null;
let produtoAtualMovimentacao = null;

// ======================================================
// INICIALIZAÇÃO
// ======================================================
document.addEventListener('DOMContentLoaded', () => {
  carregarProdutos();
  carregarFamilias();
  carregarTipos();
  setupFiltros();
  initPWA();
});

// Navegação entre Abas
function switchTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.tab-btn').forEach(el => {
    el.classList.remove('border-indigo-600', 'text-indigo-600');
    el.classList.add('border-transparent', 'text-slate-500');
  });

  document.getElementById(`sec-${tabName}`).classList.remove('hidden');
  const activeTabBtn = document.getElementById(`tab-${tabName}`);
  if (activeTabBtn) {
    activeTabBtn.classList.add('border-indigo-600', 'text-indigo-600');
    activeTabBtn.classList.remove('border-transparent', 'text-slate-500');
  }

  if (tabName !== 'scanner' && html5QrcodeScanner) {
    pararLeitor();
  }
  if (tabName === 'historico') {
    carregarHistorico();
  }
}

// Filtros de Tabela
function setupFiltros() {
  const busca = document.getElementById('filtro-busca');
  const fam = document.getElementById('filtro-familia');
  const tipo = document.getElementById('filtro-tipo');
  const baixo = document.getElementById('filtro-estoque-baixo');

  const aplicar = () => carregarProdutos();

  busca.addEventListener('input', aplicar);
  fam.addEventListener('change', aplicar);
  tipo.addEventListener('change', aplicar);
  baixo.addEventListener('change', aplicar);
}

// ======================================================
// PRODUTOS
// ======================================================
async function carregarProdutos() {
  try {
    const busca = document.getElementById('filtro-busca').value;
    const familia_id = document.getElementById('filtro-familia').value;
    const tipo_id = document.getElementById('filtro-tipo').value;
    const estoque_baixo = document.getElementById('filtro-estoque-baixo').checked;

    const params = new URLSearchParams();
    if (busca) params.append('busca', busca);
    if (familia_id) params.append('familia_id', familia_id);
    if (tipo_id) params.append('tipo_id', tipo_id);
    if (estoque_baixo) params.append('estoque_baixo', 'true');

    const res = await fetch(`${API_URL}/produtos?${params.toString()}`);
    const data = await res.json();

    if (data.sucesso) {
      renderizarProdutos(data.dados);
    }
  } catch (err) {
    showToast('Erro ao carregar produtos.', true);
  }
}

function renderizarProdutos(produtos) {
  const tbody = document.getElementById('lista-produtos');
  tbody.innerHTML = '';

  if (produtos.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center p-6 text-slate-400">Nenhum item encontrado.</td></tr>`;
    return;
  }

  produtos.forEach(p => {
    const isBaixo = p.quantidade <= p.estoque_minimo;
    const tr = document.createElement('tr');
    tr.className = `hover:bg-slate-50 transition ${isBaixo ? 'bg-rose-50/50' : ''}`;

    tr.innerHTML = `
      <td class="p-4 font-mono font-bold text-indigo-700">${p.sku}</td>
      <td class="p-4">
        <div class="font-semibold text-slate-800">${p.nome}</div>
        <div class="text-xs text-slate-400">${p.descricao || ''}</div>
      </td>
      <td class="p-4 text-xs">
        <span class="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border">${p.familias?.nome || '-'}</span>
        <span class="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border">${p.tipos?.nome || '-'}</span>
      </td>
      <td class="p-4 text-xs text-slate-600"><i class="fa-solid fa-location-dot text-slate-400 mr-1"></i>${p.localizacao}</td>
      <td class="p-4 text-center">
        <span class="font-bold px-2 py-1 rounded-full text-xs ${isBaixo ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}">
          ${p.quantidade}
        </span>
      </td>
      <td class="p-4 text-center text-xs text-slate-500">${p.estoque_minimo}</td>
      <td class="p-4 text-right space-x-1">
        <button onclick="abrirModalMovimentacaoSKU('${p.sku}', 'ENTRADA')" title="Entrada" class="p-1.5 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200">
          <i class="fa-solid fa-plus"></i>
        </button>
        <button onclick="abrirModalMovimentacaoSKU('${p.sku}', 'SAIDA')" title="Saída" class="p-1.5 bg-amber-100 text-amber-700 rounded hover:bg-amber-200">
          <i class="fa-solid fa-minus"></i>
        </button>
        <button onclick="gerarQRCodeEtiqueta('${p.sku}', '${p.nome}', '${p.localizacao}')" title="Ver QR Code" class="p-1.5 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200">
          <i class="fa-solid fa-qrcode"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Modal Cadastro de Produto
async function abrirModalNovoProduto() {
  document.getElementById('form-produto').reset();
  await carregarFamiliasSelect();
  abrirModal('modal-produto');
}

async function carregarFamiliasSelect() {
  const res = await fetch(`${API_URL}/familias`);
  const data = await res.json();
  const select = document.getElementById('prod-familia');
  select.innerHTML = '<option value="">Selecione...</option>';
  if (data.sucesso) {
    data.dados.forEach(f => {
      select.innerHTML += `<option value="${f.id}">${f.codigo} - ${f.nome}</option>`;
    });
  }
}

async function carregarTiposPorFamiliaModal(familia_id) {
  const select = document.getElementById('prod-tipo');
  select.innerHTML = '<option value="">Carregando...</option>';
  if (!familia_id) {
    select.innerHTML = '<option value="">Selecione a Família...</option>';
    return;
  }
  const res = await fetch(`${API_URL}/tipos?familia_id=${familia_id}`);
  const data = await res.json();
  select.innerHTML = '<option value="">Selecione...</option>';
  if (data.sucesso) {
    data.dados.forEach(t => {
      select.innerHTML += `<option value="${t.id}">${t.codigo} - ${t.nome}</option>`;
    });
  }
}

async function salvarProduto(e) {
  e.preventDefault();
  const body = {
    familia_id: document.getElementById('prod-familia').value,
    tipo_id: document.getElementById('prod-tipo').value,
    nome: document.getElementById('prod-nome').value,
    descricao: document.getElementById('prod-desc').value,
    localizacao: document.getElementById('prod-loc').value,
    quantidade: Number(document.getElementById('prod-qtd').value),
    estoque_minimo: Number(document.getElementById('prod-min').value)
  };

  try {
    const res = await fetch(`${API_URL}/produtos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (data.sucesso) {
      showToast('Produto cadastrado com sucesso!');
      fecharModal('modal-produto');
      carregarProdutos();
      gerarQRCodeEtiqueta(data.dados.sku, data.dados.nome, data.dados.localizacao);
    } else {
      showToast(data.mensagem || 'Erro ao salvar.', true);
    }
  } catch (err) {
    showToast('Erro ao comunicar com servidor.', true);
  }
}

// ======================================================
// LEITOR QR CODE & MOVIMENTAÇÕES
// ======================================================
function iniciarLeitor() {
  document.getElementById('btn-start-scanner').classList.add('hidden');
  document.getElementById('btn-stop-scanner').classList.remove('hidden');

  html5QrcodeScanner = new Html5Qrcode("reader");
  html5QrcodeScanner.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: { width: 250, height: 250 } },
    (qrCodeMessage) => {
      pararLeitor();
      abrirModalMovimentacaoSKU(qrCodeMessage.trim(), 'ENTRADA');
    },
    () => {}
  ).catch(() => {
    showToast('Erro ao acessar a câmera.', true);
    pararLeitor();
  });
}

function pararLeitor() {
  if (html5QrcodeScanner) {
    html5QrcodeScanner.stop().then(() => {
      html5QrcodeScanner.clear();
      html5QrcodeScanner = null;
      document.getElementById('btn-start-scanner').classList.remove('hidden');
      document.getElementById('btn-stop-scanner').classList.add('hidden');
    }).catch(() => {});
  }
}

function buscarSKUManual() {
  const sku = document.getElementById('manual-sku').value.trim();
  if (sku) abrirModalMovimentacaoSKU(sku, 'ENTRADA');
}

async function abrirModalMovimentacaoSKU(sku, tipoPadrao = 'ENTRADA') {
  try {
    const res = await fetch(`${API_URL}/produtos/sku/${encodeURIComponent(sku)}`);
    const data = await res.json();

    if (!data.sucesso || !data.dados) {
      showToast('Produto não encontrado para o SKU: ' + sku, true);
      return;
    }

    produtoAtualMovimentacao = data.dados;
    document.getElementById('mov-sku-display').innerText = `SKU: ${produtoAtualMovimentacao.sku}`;
    document.getElementById('mov-nome-display').innerText = produtoAtualMovimentacao.nome;
    document.getElementById('mov-loc-display').innerHTML = `<i class="fa-solid fa-location-dot"></i> ${produtoAtualMovimentacao.localizacao}`;
    document.getElementById('mov-saldo-display').innerText = `Saldo Atual: ${produtoAtualMovimentacao.quantidade}`;
    document.getElementById('mov-sku-input').value = produtoAtualMovimentacao.sku;

    document.getElementById('form-movimentacao').reset();
    definirTipoMovimentacao(tipoPadrao);
    abrirModal('modal-movimentacao');

  } catch (err) {
    showToast('Erro ao consultar o SKU.', true);
  }
}

function definirTipoMovimentacao(tipo) {
  document.getElementById('mov-tipo-input').value = tipo;
  const btnEntrada = document.getElementById('btn-tab-entrada');
  const btnSaida = document.getElementById('btn-tab-saida');
  const btnSubmit = document.getElementById('btn-submit-mov');
  const lblMotivo = document.getElementById('lbl-motivo');

  if (tipo === 'ENTRADA') {
    btnEntrada.className = 'flex-1 py-2 font-bold text-sm text-emerald-600 border-b-2 border-emerald-600';
    btnSaida.className = 'flex-1 py-2 font-bold text-sm text-slate-400 border-b-2 border-transparent';
    btnSubmit.className = 'px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700';
    btnSubmit.innerText = 'Confirmar Entrada';
    lblMotivo.innerText = 'Motivo / Observação (Opcional)';
  } else {
    btnSaida.className = 'flex-1 py-2 font-bold text-sm text-amber-600 border-b-2 border-amber-600';
    btnEntrada.className = 'flex-1 py-2 font-bold text-sm text-slate-400 border-b-2 border-transparent';
    btnSubmit.className = 'px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-semibold hover:bg-amber-700';
    btnSubmit.innerText = 'Confirmar Saída';
    lblMotivo.innerText = 'Motivo da Retirada *';
  }
}

async function executarMovimentacao(e) {
  e.preventDefault();
  const tipo = document.getElementById('mov-tipo-input').value;
  const body = {
    sku: document.getElementById('mov-sku-input').value,
    quantidade: Number(document.getElementById('mov-qtd').value),
    responsavel: document.getElementById('mov-resp').value,
    motivo: document.getElementById('mov-motivo').value
  };

  const endpoint = tipo === 'ENTRADA' ? `${API_URL}/movimentacoes/entrada` : `${API_URL}/movimentacoes/saida`;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();

    if (data.sucesso) {
      showToast(`${tipo === 'ENTRADA' ? 'Entrada' : 'Saída'} realizada com sucesso!`);
      fecharModal('modal-movimentacao');
      carregarProdutos();
    } else {
      showToast(data.mensagem || 'Falha ao processar movimentação.', true);
    }
  } catch (err) {
    showToast('Erro de comunicação.', true);
  }
}

// ======================================================
// ETIQUETAS E QR CODE
// ======================================================
function gerarQRCodeEtiqueta(sku, nome, localizacao) {
  document.getElementById('qr-sku').innerText = sku;
  document.getElementById('qr-nome').innerText = nome;
  document.getElementById('qr-loc').innerText = localizacao;

  const container = document.getElementById('qrcode-container');
  container.innerHTML = '';
  new QRCode(container, {
    text: sku,
    width: 150,
    height: 150
  });

  abrirModal('modal-qrcode');
}

// ======================================================
// FAMÍLIAS & TIPOS
// ======================================================
async function carregarFamilias() {
  const res = await fetch(`${API_URL}/familias`);
  const data = await res.json();

  const tbody = document.getElementById('lista-familias');
  const selectFiltro = document.getElementById('filtro-familia');
  tbody.innerHTML = '';

  if (data.sucesso) {
    data.dados.forEach(f => {
      tbody.innerHTML += `
        <tr>
          <td class="p-2 font-mono font-bold">${f.codigo}</td>
          <td class="p-2">${f.nome}</td>
          <td class="p-2 text-right">
            <button onclick="deletarFamilia('${f.id}')" class="text-rose-600 hover:text-rose-800"><i class="fa-solid fa-trash"></i></button>
          </td>
        </tr>
      `;
      selectFiltro.innerHTML += `<option value="${f.id}">${f.codigo} - ${f.nome}</option>`;
    });
  }
}

async function carregarTipos() {
  const res = await fetch(`${API_URL}/tipos`);
  const data = await res.json();

  const tbody = document.getElementById('lista-tipos');
  const selectFiltro = document.getElementById('filtro-tipo');
  tbody.innerHTML = '';

  if (data.sucesso) {
    data.dados.forEach(t => {
      tbody.innerHTML += `
        <tr>
          <td class="p-2 text-slate-500">${t.familias?.nome || '-'}</td>
          <td class="p-2 font-mono font-bold">${t.codigo}</td>
          <td class="p-2">${t.nome}</td>
          <td class="p-2 text-right">
            <button onclick="deletarTipo('${t.id}')" class="text-rose-600 hover:text-rose-800"><i class="fa-solid fa-trash"></i></button>
          </td>
        </tr>
      `;
      selectFiltro.innerHTML += `<option value="${t.id}">${t.codigo} - ${t.nome}</option>`;
    });
  }
}

function abrirModalFamilia() { abrirModal('modal-familia'); }
async function abrirModalTipo() {
  const res = await fetch(`${API_URL}/familias`);
  const data = await res.json();
  const select = document.getElementById('tipo-familia-select');
  select.innerHTML = '<option value="">Selecione...</option>';
  if (data.sucesso) {
    data.dados.forEach(f => {
      select.innerHTML += `<option value="${f.id}">${f.codigo} - ${f.nome}</option>`;
    });
  }
  abrirModal('modal-tipo');
}

async function salvarFamilia(e) {
  e.preventDefault();
  const body = {
    codigo: document.getElementById('fam-codigo').value,
    nome: document.getElementById('fam-nome').value,
    descricao: document.getElementById('fam-desc').value
  };
  const res = await fetch(`${API_URL}/familias`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await res.json();
  if (data.sucesso) {
    showToast('Família criada!');
    fecharModal('modal-familia');
    carregarFamilias();
  } else {
    showToast(data.mensagem, true);
  }
}

async function salvarTipo(e) {
  e.preventDefault();
  const body = {
    familia_id: document.getElementById('tipo-familia-select').value,
    codigo: document.getElementById('tipo-codigo').value,
    nome: document.getElementById('tipo-nome').value
  };
  const res = await fetch(`${API_URL}/tipos`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await res.json();
  if (data.sucesso) {
    showToast('Tipo criado!');
    fecharModal('modal-tipo');
    carregarTipos();
  } else {
    showToast(data.mensagem, true);
  }
}

async function deletarFamilia(id) {
  if (confirm('Deseja excluir esta família?')) {
    await fetch(`${API_URL}/familias/${id}`, { method: 'DELETE' });
    carregarFamilias();
  }
}

async function deletarTipo(id) {
  if (confirm('Deseja excluir este tipo?')) {
    await fetch(`${API_URL}/tipos/${id}`, { method: 'DELETE' });
    carregarTipos();
  }
}

// ======================================================
// HISTÓRICO
// ======================================================
async function carregarHistorico() {
  const sku = document.getElementById('filtro-hist-sku').value;
  const resp = document.getElementById('filtro-hist-resp').value;
  const tipo = document.getElementById('filtro-hist-tipo').value;

  const params = new URLSearchParams();
  if (sku) params.append('sku', sku);
  if (resp) params.append('responsavel', resp);
  if (tipo) params.append('tipo', tipo);

  const res = await fetch(`${API_URL}/movimentacoes?${params.toString()}`);
  const data = await res.json();

  const tbody = document.getElementById('lista-historico');
  tbody.innerHTML = '';

  if (data.sucesso && data.dados.length > 0) {
    data.dados.forEach(h => {
      const dataHora = new Date(h.created_at).toLocaleString('pt-BR');
      const isEntrada = h.tipo_movimentacao === 'ENTRADA';

      tbody.innerHTML += `
        <tr class="hover:bg-slate-50">
          <td class="p-3 font-mono">${dataHora}</td>
          <td class="p-3">
            <span class="px-2 py-0.5 rounded font-bold text-[10px] ${isEntrada ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
              ${h.tipo_movimentacao}
            </span>
          </td>
          <td class="p-3">
            <span class="font-mono font-bold text-indigo-700">${h.produtos?.sku || '-'}</span> - ${h.produtos?.nome || ''}
          </td>
          <td class="p-3 text-center font-bold">${h.quantidade}</td>
          <td class="p-3 text-center text-slate-500">${h.estoque_anterior} &#8594; <strong>${h.estoque_posterior}</strong></td>
          <td class="p-3 font-medium">${h.responsavel}</td>
          <td class="p-3 text-slate-500">${h.motivo || '-'}</td>
        </tr>
      `;
    });
  } else {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center p-6 text-slate-400">Nenhuma movimentação encontrada.</td></tr>`;
  }
}

// ======================================================
// UTILITÁRIOS & PWA
// ======================================================
function abrirModal(id) { document.getElementById(id).classList.remove('hidden'); }
function fecharModal(id) { document.getElementById(id).classList.add('hidden'); }

function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  const msg = document.getElementById('toast-message');
  msg.innerText = message;
  toast.className = `fixed bottom-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg text-white font-medium flex items-center gap-2 transition-all duration-300 ${isError ? 'bg-rose-600' : 'bg-emerald-600'}`;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3500);
}

let deferredPrompt;
function initPWA() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById('pwa-install-container').classList.remove('hidden');
  });

  document.getElementById('btn-install-pwa')?.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        document.getElementById('pwa-install-container').classList.add('hidden');
      }
      deferredPrompt = null;
    }
  });
}