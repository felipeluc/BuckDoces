// === CONFIGURAÇÃO FIREBASE ===
// As importações do Firebase SDK são feitas via CDN no index.html
// Portanto, as variáveis 'firebase' e 'firebase.firestore' já estarão disponíveis globalmente.

const firebaseConfig = {
  apiKey: "AIzaSyDGg5JtE_7gVRhTlRY30bpXsmMpvPEQ3tw",
  authDomain: "buckdoces.firebaseapp.com",
  projectId: "buckdoces",
  storageBucket: "buckdoces.appspot.com",
  messagingSenderId: "781727917443",
  appId: "1:781727917443:web:c9709b3813d28ea60982b6"
};

// Aguarda o carregamento do DOM e do Firebase SDK
document.addEventListener("DOMContentLoaded", function() {
  if (typeof firebase !== "undefined" && typeof firebase.firestore !== "undefined") {
    firebase.initializeApp(firebaseConfig);
    window.db = firebase.firestore(); // Torna a instância do Firestore disponível globalmente
    console.log("Firebase e Firestore inicializados com sucesso.");
  } else {
    console.error("Firebase ou Firestore não carregados. Verifique os scripts CDN no index.html.");
    // Exibe uma mensagem de erro na interface se o Firebase não carregar
    document.getElementById("root").innerHTML = `
      <div style="text-align: center; padding: 50px; color: #dc3545; font-family: 'Poppins', sans-serif;">
        <h1>Erro de Carregamento</h1>
        <p>Não foi possível carregar o Firebase. Por favor, verifique sua conexão com a internet ou tente novamente mais tarde.</p>
        <p>As funcionalidades de banco de dados não estarão disponíveis.</p>
      </div>
    `;
    return;
  }
  
  // Inicializa a interface da aplicação após o carregamento do Firebase
  initializeApp();
});

// === INICIALIZAÇÃO DA APLICAÇÃO ===
function initializeApp() {
  // === INTERFACE LOGIN ===
  document.getElementById("root").innerHTML = `
    <div class="login-container">
      <div class="logo-container">
        <h1><i class="fas fa-cupcake"></i> Buck Doces</h1>
        <p class="subtitle">Sistema de Gestão de Vendas</p>
      </div>
      <div class="card login-card">
        <div class="login-header">
          <i class="fas fa-user-circle"></i>
          <h3>Acesso ao Sistema</h3>
        </div>
        <div class="form-group">
          <label for="user"><i class="fas fa-user"></i> Usuário</label>
          <select id="user">
            <option>Ana Buck</option>
            <option>João Buck</option>
          </select>
        </div>
        <div class="form-group">
          <label for="senha"><i class="fas fa-lock"></i> Senha</label>
          <input type="password" id="senha" placeholder="Digite sua senha" />
        </div>
        <button onclick="login()" class="btn-primary">
          <i class="fas fa-sign-in-alt"></i> Entrar
        </button>
      </div>
    </div>
    <div id="main"></div>
  `;
}

// === USUÁRIOS E SENHAS ===
const senhas = {
  "Ana Buck": "Ana1234",
  "João Buck": "João1234"
};

// === LOGIN ===
window.login = () => {
  const usuario = document.getElementById("user").value;
  const senha = document.getElementById("senha").value;
  if (senhas[usuario] === senha) {
    showTabs(usuario);
  } else {
    // Animação de erro
    const loginCard = document.querySelector(".login-card");
    loginCard.style.animation = "shake 0.5s ease-in-out";
    setTimeout(() => {
      loginCard.style.animation = "";
    }, 500);
    alert("❌ Senha incorreta! Tente novamente.");
  }
};

// === MENU PRINCIPAL ===
function showTabs(user) {
  document.getElementById("main").innerHTML = `
    <div class="main-header">
      <h2><i class="fas fa-tachometer-alt"></i> Painel de Controle</h2>
      <p class="welcome-text">Bem-vindo(a), <strong>${user}</strong>!</p>
    </div>
    <div class="card btn-group">
      <button onclick="showCadastro(\'${user}\')" class="btn-menu">
        <i class="fas fa-plus-circle"></i>
        <span>Cadastrar Venda</span>
      </button>
      <button onclick="showDashboard()" class="btn-menu">
        <i class="fas fa-chart-line"></i>
        <span>Dashboard</span>
      </button>
      <button onclick="showCobranca()" class="btn-menu">
        <i class="fas fa-money-bill-wave"></i>
        <span>Cobrança</span>
      </button>
    </div>
    <div id="conteudo" class="card content-area"></div>
  `;
}

// === LISTA DE PRODUTOS ===
const produtosLista = [
  "Cone", "Trufa", "Bolo de pote", "Pão de mel",
  "Escondidinho de uva", "Bombom de uva", "BomBom de morango",
  "Coxinha de morango", "Camafeu", "Caixinha", "Mousse", "Lanche natural",
  "Maça do amor", "Kit cesta", "Kit caneca", "Morango do amor"
];

// === TELA DE CADASTRO (com suas melhorias solicitadas) ===
window.showCadastro = (usuario) => {
  const produtoOptions = produtosLista.map((produto, index) => `
    <div class="produto-item">
      <label><i class="fas fa-cookie-bite"></i> ${produto}</label>
      <div class="quantidade-controls">
        <button class="btn-quantidade" onclick="alterarQuantidade(${index}, -1)">
          <i class="fas fa-minus"></i>
        </button>
        <span id="quantidade-${index}" class="quantidade-display">0</span>
        <button class="btn-quantidade" onclick="alterarQuantidade(${index}, 1)">
          <i class="fas fa-plus"></i>
        </button>
      </div>
    </div>
  `).join("");

  document.getElementById("conteudo").innerHTML = `
    <div class="form-header">
      <h2><i class="fas fa-shopping-cart"></i> Cadastro de Venda</h2>
      <p>Preencha os dados da venda abaixo</p>
    </div>
    
    <div class="form-section">
      <h3><i class="fas fa-user"></i> Dados do Cliente</h3>
      <div class="form-group">
        <label for="cliente"><i class="fas fa-user"></i> Nome do Cliente</label>
        <input id="cliente" placeholder="Digite o nome completo" />
      </div>
      <div class="form-group">
        <label for="telefone"><i class="fas fa-phone"></i> Telefone</label>
        <input id="telefone" placeholder="(17) 99138-6966" inputmode="numeric" pattern="[0-9]*" maxlength="11" />
      </div>
      <div class="form-group">
        <label for="local"><i class="fas fa-map-marker-alt"></i> Local de Venda</label>
        <select id="local">
          <option value="">Selecione o local</option>
          <option value="Cemei">Cemei</option>
          <option value="Analia Franco">Analia Franco</option>
          <option value="Cemup">Cemup</option>
        </select>
      </div>
    </div>

    <div class="form-section">
      <h3><i class="fas fa-dollar-sign"></i> Valor da Venda</h3>
      <div class="form-group">
        <label for="valor"><i class="fas fa-money-bill"></i> Valor Total</label>
        <input id="valor" placeholder="R$ 0,00" />
      </div>
    </div>

    <div class="form-section">
      <h3><i class="fas fa-shopping-basket"></i> Produtos Vendidos</h3>
      <div class="produtos-container">
        ${produtoOptions}
      </div>
    </div>

    <div class="form-section">
      <h3><i class="fas fa-credit-card"></i> Status do Pagamento</h3>
      <div class="form-group">
        <label for="status"><i class="fas fa-check-circle"></i> Status</label>
        <select id="status">
          <option value="pago">✅ Pago</option>
          <option value="nao">❌ Não pago</option>
          <option value="parcial">⚠️ Parcial</option>
        </select>
      </div>
      <div id="extras" class="extras-container"></div>
    </div>

    <div class="form-actions">
      <button onclick="cadastrar(\'${usuario}\')" class="btn-primary">
        <i class="fas fa-save"></i> Salvar Venda
      </button>
      <button onclick="enviarComprovante()" class="btn-secondary">
        <i class="fab fa-whatsapp"></i> Enviar Comprovante
      </button>
    </div>
  `;

  // === FORMATAÇÃO DE MOEDA AUTOMÁTICA ===
  const valorInput = document.getElementById("valor");
  valorInput.addEventListener("input", () => {
    let val = valorInput.value.replace(/\D/g, "");
    val = (parseInt(val || "0") / 100).toFixed(2);
    valorInput.value = `R$ ${val.replace(".", ",")}`;
  });

  // === FORMATAÇÃO TELEFONE: só números, limite 11 caracteres ===
  const telInput = document.getElementById("telefone");
  telInput.addEventListener("input", () => {
    telInput.value = telInput.value.replace(/\D/g, "").slice(0, 11);
  });

  // === CAMPOS EXTRAS DINÂMICOS ===
  document.getElementById("status").addEventListener("change", (e) => {
    const val = e.target.value;
    let html = "";
    if (val === "pago") {
      html = `
        <div class="form-group">
          <label for="forma"><i class="fas fa-credit-card"></i> Forma de Pagamento</label>
          <select id="forma">
            <option>💵 Dinheiro</option>
            <option>💳 Cartão</option>
            <option>📱 PIX</option>
          </select>
        </div>
      `;
    } else if (val === "nao") {
      html = `
        <div class="form-group">
          <label for="dataReceber"><i class="fas fa-calendar"></i> Data para Receber</label>
          <input type="date" id="dataReceber" />
        </div>
        <div class="form-group">
          <label for="forma"><i class="fas fa-credit-card"></i> Forma de Pagamento</label>
          <select id="forma">
            <option>💵 Dinheiro</option>
            <option>💳 Cartão</option>
            <option>📱 PIX</option>
          </select>
        </div>
      `;
    } else if (val === "parcial") {
      html = `
        <div class="form-group">
          <label for="valorParcial"><i class="fas fa-coins"></i> Valor Recebido Hoje</label>
          <input type="number" id="valorParcial" placeholder="0,00" />
        </div>
        <div class="form-group">
          <label for="falta"><i class="fas fa-exclamation-triangle"></i> Valor que Falta</label>
          <input type="number" id="falta" placeholder="0,00" />
        </div>
        <div class="form-group">
          <label for="dataReceber"><i class="fas fa-calendar"></i> Data para Receber</label>
          <input type="date" id="dataReceber" />
        </div>
        <div class="form-group">
          <label for="forma"><i class="fas fa-credit-card"></i> Forma de Pagamento</label>
          <select id="forma">
            <option>💵 Dinheiro</option>
            <option>💳 Cartão</option>
            <option>📱 PIX</option>
          </select>
        </div>
      `;
    }
    document.getElementById("extras").innerHTML = html;
  });
};

// === ALTERAR QUANTIDADE DE PRODUTO ===
window.alterarQuantidade = (index, delta) => {
  const span = document.getElementById(`quantidade-${index}`);
  let valor = parseInt(span.innerText);
  valor = Math.max(0, valor + delta);
  span.innerText = valor;
  
  // Animação visual
  span.style.transform = "scale(1.2)";
  span.style.color = "#ff69b4";
  setTimeout(() => {
    span.style.transform = "scale(1)";
    span.style.color = "#c06078";
  }, 200);
};

// === OBTÉM PRODUTOS SELECIONADOS ===
function obterProdutosSelecionados() {
  return produtosLista
    .map((produto, index) => {
      const quantidade = parseInt(document.getElementById(`quantidade-${index}`).innerText);
      return quantidade > 0 ? `${produto} (${quantidade})` : null;
    })
    .filter(Boolean);
}

// === CADASTRAR VENDA ===
window.cadastrar = async (usuario) => {
  const cliente = document.getElementById("cliente").value.trim();
  let telefone = document.getElementById("telefone").value.trim();
  const local = document.getElementById("local").value.trim();
  const valorFormatado = document.getElementById("valor").value.trim().replace("R$ ", "").replace(".", "").replace(",", ".");
  const valor = parseFloat(valorFormatado);
  const status = document.getElementById("status").value;
  const forma = document.getElementById("forma")?.value || "";
  const dataReceber = document.getElementById("dataReceber")?.value || "";
  const valorParcial = parseFloat(document.getElementById("valorParcial")?.value || 0);
  const faltaReceber = parseFloat(document.getElementById("falta")?.value || 0);
  const data = new Date().toISOString().split("T")[0];
  const produtosSelecionados = obterProdutosSelecionados();

  // Limpa telefone para ficar só números, remove espaços e caracteres estranhos
  telefone = telefone.replace(/\D/g, "");

  if (!cliente || !telefone || !local || isNaN(valor) || produtosSelecionados.length === 0) {
    alert("⚠️ Preencha todos os campos e selecione ao menos um produto.");
    return;
  }

  // === VERIFICA DUPLICIDADE E SALVA NO FIREBASE ===
  if (window.db) {
    try {
      const vendasRef = window.db.collection("vendas");
      const snap = await vendasRef.get();
      const duplicado = snap.docs.some(doc => {
        const d = doc.data();
        return d.usuario === usuario &&
               d.cliente === cliente &&
               d.local === local &&
               d.valor === valor &&
               d.status === status &&
               JSON.stringify(d.produtosVendidos || []) === JSON.stringify(produtosSelecionados) &&
               d.dataReceber === (status !== "pago" ? dataReceber : null) &&
               d.data === data;
      });

      if (duplicado) {
        alert("⚠️ Venda duplicada! Já existe uma venda com os mesmos dados.");
        return;
      }

      // === SALVA NO FIREBASE ===
      await vendasRef.add({
        usuario, cliente, telefone, local, valor, status, forma,
        valorParcial: status === "parcial" ? valorParcial : 0,
        faltaReceber: status === "parcial" ? faltaReceber : (status === "nao" ? valor : 0),
        dataReceber: status !== "pago" ? dataReceber : null,
        data,
        produtosVendidos: produtosSelecionados
      });

      // Animação de sucesso
      const button = event.target;
      const originalText = button.innerHTML;
      button.innerHTML = "<i class=\"fas fa-check\"></i> Salvo!";
      button.style.background = "linear-gradient(135deg, #27ae60, #2ecc71)";
      
      setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = "";
      }, 2000);

      alert("✅ Venda salva com sucesso!");
    } catch (error) {
      alert("❌ Erro ao salvar venda. Tente novamente.");
      console.error(error);
    }
  } else {
    alert("⚠️ Firebase não está disponível. A venda não foi salva.");
  }
};

// === ENVIAR COMPROVANTE VIA WHATSAPP ===
window.enviarComprovante = () => {
  let numero = document.getElementById("telefone")?.value.trim();
  const valorCampo = document.getElementById("valor")?.value.trim();
  const cliente = document.getElementById("cliente")?.value.trim();
  const status = document.getElementById("status")?.value;
  const dataReceber = document.getElementById("dataReceber")?.value || "";
  const produtosSelecionados = obterProdutosSelecionados();

  if (!numero || !valorCampo || !cliente || produtosSelecionados.length === 0) {
    alert("⚠️ Preencha todos os campos antes de enviar o comprovante.");
    return;
  }

  // Limpa número para ficar só dígitos
  numero = numero.replace(/\D/g, "");

  // Adiciona prefixo 55 automaticamente se não tiver
  if (!numero.startsWith("55")) {
    numero = "55" + numero;
  }

  // Remove o símbolo R$ se houver e ajusta ponto/vírgula
  const valor = parseFloat(valorCampo.replace("R$ ", "").replace(".", "").replace(",", ".")).toFixed(2);
  const listaProdutos = produtosSelecionados.map(p => `🧁 ${p}`).join("\n");

  const mensagem = `🌸 *Buck Doces* 🌸\n\nOlá ${cliente}! 😊\n\n📋 *Comprovante da sua compra:*\n\n🛍️ *Produtos:*\n${listaProdutos}\n\n💰 *Valor:* R$ ${valor}\n📊 *Status:* ${status.toUpperCase()}${status !== "pago" ? `\n📅 *Pagamento para:* ${dataReceber}` : ""}\n\n💳 *CHAVE PIX (CNPJ):* 57.010.512/0001-56  \n📩 *Por favor, envie o comprovante após o pagamento.*\n\nObrigada pela preferência! 💕`;

  const link = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
  window.open(link, "_blank");
};

// === DASHBOARD COMPLETO ===
window.showDashboard = async () => {
  if (!window.db) {
    document.getElementById("conteudo").innerHTML = `
      <div class="dashboard-header">
        <h2><i class="fas fa-chart-line"></i> Dashboard</h2>
        <p>Firebase não está disponível - dados de demonstração</p>
      </div>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-shopping-cart"></i>
          </div>
          <div class="stat-content">
            <h3>5</h3>
            <p>Vendas Hoje</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-money-bill-wave"></i>
          </div>
          <div class="stat-content">
            <h3>R$ 250,00</h3>
            <p>Total Vendido Hoje</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-clock"></i>
          </div>
          <div class="stat-content">
            <h3>R$ 150,00</h3>
            <p>Valor a Receber</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="stat-content">
            <h3>R$ 100,00</h3>
            <p>Valor Recebido</p>
          </div>
        </div>
      </div>
    `;
    return;
  }

  try {
    const snap = await window.db.collection("vendas").get();
    const vendas = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const hoje = new Date();
    const anoAtual = hoje.getFullYear();
    const mesAtual = hoje.getMonth() + 1;

    const mesOptions = Array.from({ length: 12 }, (_, i) => {
      const mesNum = i + 1;
      const mesLabel = new Date(0, mesNum - 1).toLocaleString("pt-BR", { month: "long" });
      return `<option value="${mesNum}" ${mesNum === mesAtual ? "selected" : ""}>${mesLabel}</option>`;
    }).join("");

    const hojeStr = hoje.toISOString().split("T")[0];
    const hojeVendas = vendas.filter(v => v.data === hojeStr);
    const totalHoje = hojeVendas.reduce((acc, v) => acc + (parseFloat(v.valor) || 0), 0);
    const aReceber = vendas.filter(v => v.status !== "pago")
      .reduce((acc, v) => acc + ((parseFloat(v.faltaReceber) > 0) ? parseFloat(v.faltaReceber) : 0), 0);
    const valorRecebido = vendas
      .filter(v => v.status === "pago" || v.status === "parcial")
      .reduce((acc, v) => acc + (parseFloat(v.valorParcial) || 0), 0);

    // === Top 5 dias com maior valor a receber ===
    const diasValores = {};
    vendas.forEach(v => {
      if (v.status !== "pago" && v.dataReceber) {
        diasValores[v.dataReceber] = (diasValores[v.dataReceber] || 0) + (parseFloat(v.faltaReceber) || 0);
      }
    });
    const topDias = Object.entries(diasValores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([data, valor]) => `<li><i class="fas fa-calendar-day"></i> <strong>${formatarData(data)}</strong>: ${valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</li>`)
      .join("");

    // === Top 10 devedores (baseado em telefone) ===
    const devedores = {};
    vendas.forEach(v => {
      if (v.status !== "pago" && v.telefone) {
        devedores[v.telefone] = devedores[v.telefone] || { nome: v.cliente, total: 0 };
        devedores[v.telefone].total += (parseFloat(v.faltaReceber) || 0);
      }
    });
    const topDevedores = Object.entries(devedores)
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 10)
      .map(([tel, data]) => `<li><i class="fas fa-user"></i> <strong>${data.nome}</strong> (${tel}): ${data.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</li>`)
      .join("");

    // === HTML FINAL ===
    document.getElementById("conteudo").innerHTML = `
      <div class="dashboard-header">
        <h2><i class="fas fa-chart-line"></i> Dashboard</h2>
        <p>Visão geral das vendas e cobranças</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-shopping-cart"></i>
          </div>
          <div class="stat-content">
            <h3>${hojeVendas.length}</h3>
            <p>Vendas Hoje</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-money-bill-wave"></i>
          </div>
          <div class="stat-content">
            <h3>${totalHoje.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</h3>
            <p>Total Vendido Hoje</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-clock"></i>
          </div>
          <div class="stat-content">
            <h3>${aReceber.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</h3>
            <p>Valor a Receber</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="stat-content">
            <h3>${valorRecebido.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</h3>
            <p>Valor Recebido</p>
          </div>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="dashboard-section">
          <h3><i class="fas fa-calendar-alt"></i> Dias com Mais Valores a Receber</h3>
          <ul class="dashboard-list">${topDias || "<li><i class=\"fas fa-info-circle\"></i> Nenhum resultado</li>"}</ul>
        </div>

        <div class="dashboard-section">
          <h3><i class="fas fa-users"></i> Pessoas que Mais Devem</h3>
          <ul class="dashboard-list">${topDevedores || "<li><i class=\"fas fa-info-circle\"></i> Nenhum resultado</li>"}</ul>
        </div>
      </div>

      <div class="calendar-section">
        <h3><i class="fas fa-calendar"></i> Vendas por Dia</h3>
        <div class="form-group">
          <label for="mesSelecionado"><i class="fas fa-filter"></i> Selecionar Mês</label>
          <select id="mesSelecionado">${mesOptions}</select>
        </div>
        <div class="calendar" id="dashboardCalendar"></div>
        <div id="detalhesDiaDashboard" class="detalhes-dia"></div>
      </div>
    `;

    const selectMes = document.getElementById("mesSelecionado");
    selectMes.addEventListener("change", () => {
      gerarCalendario(vendas, parseInt(selectMes.value), anoAtual);
    });

    gerarCalendario(vendas, mesAtual, anoAtual);
  } catch (error) {
    console.error("Erro ao carregar dashboard:", error);
    alert("❌ Erro ao carregar dados do dashboard.");
  }
};

// === MOSTRAR DETALHES DO DIA NO DASHBOARD ===
window.mostrarDiaDashboard = async (dataCompleta) => {
  if (!window.db) {
    document.getElementById("detalhesDiaDashboard").innerHTML = `
      <div class="no-data">
        <i class="fas fa-info-circle"></i>
        <p>Firebase não disponível - dados de demonstração não implementados.</p>
      </div>
    `;
    return;
  }

  try {
    const snap = await window.db.collection("vendas").get();
    const todasVendas = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const vendasDoDia = todasVendas.filter(v => v.data === dataCompleta);

    if (!vendasDoDia.length) {
      document.getElementById("detalhesDiaDashboard").innerHTML = `
        <div class="no-data">
          <i class="fas fa-calendar-times"></i>
          <p>Sem vendas neste dia.</p>
        </div>
      `;
      return;
    }

    const cards = vendasDoDia.map(v => {
      const produtos = v.produtosVendidos?.map(p => `<li><i class="fas fa-cookie-bite"></i> ${p}</li>`).join("") || "Nenhum";
      return `
        <div class="compra-info">
          <div class="compra-header">
            <h4><i class="fas fa-user"></i> ${v.cliente}</h4>
            <span class="status-badge status-${v.status}">${v.status.toUpperCase()}</span>
          </div>
          <div class="compra-details">
            <p><i class="fas fa-phone"></i> <strong>Telefone:</strong> ${v.telefone || "Não informado"}</p>
            <p><i class="fas fa-map-marker-alt"></i> <strong>Local:</strong> ${v.local || "Não informado"}</p>
            <p><i class="fas fa-money-bill"></i> <strong>Valor:</strong> ${parseFloat(v.valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
            <p><i class="fas fa-credit-card"></i> <strong>Forma:</strong> ${v.forma || "Não informado"}</p>
            ${v.status !== "pago" ? `<p><i class="fas fa-calendar"></i> <strong>Data Receber:</strong> ${formatarData(v.dataReceber) || "Não informada"}</p>` : ""}
            ${v.status === "parcial" ? `<p><i class="fas fa-coins"></i> <strong>Valor Parcial:</strong> ${parseFloat(v.valorParcial).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>` : ""}
            ${v.status !== "pago" ? `<p><i class="fas fa-exclamation-triangle"></i> <strong>Falta Receber:</strong> ${parseFloat(v.faltaReceber).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>` : ""}
          </div>
          <div class="produtos-vendidos">
            <p><i class="fas fa-shopping-basket"></i> <strong>Produtos Vendidos:</strong></p>
            <ul>${produtos}</ul>
          </div>
        </div>
      `;
    }).join("");

    document.getElementById("detalhesDiaDashboard").innerHTML = cards;
  } catch (error) {
    console.error("Erro ao carregar detalhes do dia:", error);
    alert("❌ Erro ao carregar detalhes do dia.");
  }
};

// === TELA DE COBRANÇA ===
window.showCobranca = async () => {
  if (!window.db) {
    document.getElementById("conteudo").innerHTML = `
      <div class="cobranca-header">
        <h2><i class="fas fa-money-bill-wave"></i> Sistema de Cobrança</h2>
        <p>Gerencie cobranças e pagamentos pendentes</p>
      </div>
      <div class="no-data">
        <i class="fas fa-info-circle"></i>
        <p>Firebase não disponível - funcionalidade de cobrança não implementada.</p>
      </div>
    `;
    return;
  }

  try {
    const snap = await window.db.collection("vendas").get();
    const vendas = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Filtra pendentes
    const pendentes = vendas.filter(v => v.status !== "pago" && v.dataReceber);

    // Salva para uso posterior
    localStorage.setItem("vendas", JSON.stringify(vendas));

    // Monta HTML inicial
    document.getElementById("conteudo").innerHTML = `
      <div class="cobranca-header">
        <h2><i class="fas fa-money-bill-wave"></i> Sistema de Cobrança</h2>
        <p>Gerencie cobranças e pagamentos pendentes</p>
      </div>

      <div class="filtros-container">
        <div class="form-group">
          <label for="localFiltro"><i class="fas fa-map-marker-alt"></i> Local</label>
          <select id="localFiltro">
            <option value="">-- Escolha o local --</option>
            <option value="todos">🌍 Todos os locais</option>
            ${[...new Set(pendentes.map(v => v.local || "Não informado"))]
              .map(local => `<option value="${local}"><i class="fas fa-building"></i> ${local}</option>`).join("")}
          </select>
        </div>
        
        <div class="form-group">
          <label for="clienteFiltro"><i class="fas fa-user"></i> Cliente</label>
          <select id="clienteFiltro" disabled>
            <option value="">-- Primeiro selecione o local --</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="tipoCobranca"><i class="fas fa-filter"></i> Tipo de Cobrança</label>
          <select id="tipoCobranca" disabled>
            <option value="">-- Primeiro selecione o cliente --</option>
          </select>
        </div>
      </div>

      <div id="resultadosCobranca" class="resultados-container"></div>
    `;

    // === EVENTOS DOS FILTROS ===
    document.getElementById("localFiltro").addEventListener("change", (e) => {
      const local = e.target.value;
      const clienteSelect = document.getElementById("clienteFiltro");
      const tipoSelect = document.getElementById("tipoCobranca");
      
      // Reset dos selects dependentes
      clienteSelect.innerHTML = "<option value=\"\">-- Selecione o cliente --</option>";
      tipoSelect.innerHTML = "<option value=\"\">-- Primeiro selecione o cliente --</option>";
      tipoSelect.disabled = true;
      document.getElementById("resultadosCobranca").innerHTML = "";

      if (!local) {
        clienteSelect.disabled = true;
        return;
      }

      clienteSelect.disabled = false;

      // Filtra clientes por local
      let clientesFiltrados = [];
      if (local === "todos") {
        clientesFiltrados = [...new Set(pendentes.map(v => ({
          nome: v.cliente || "Sem nome",
          telefone: (v.telefone || "").replace(/\D/g, "") || "sem-telefone"
        })))];
      } else {
        clientesFiltrados = [...new Set(pendentes
          .filter(v => v.local === local)
          .map(v => ({
            nome: v.cliente || "Sem nome",
            telefone: (v.telefone || "").replace(/\D/g, "") || "sem-telefone"
          })))];
      }

      // Remove duplicatas baseado no telefone
      const clientesUnicos = clientesFiltrados.reduce((acc, cliente) => {
        if (!acc.find(c => c.telefone === cliente.telefone)) {
          acc.push(cliente);
        }
        return acc;
      }, []);

      clienteSelect.innerHTML = `
        <option value="">-- Selecione o cliente --</option>
        <option value="todos">👥 Todos os clientes</option>
        ${clientesUnicos.map(cliente => 
          `<option value="${cliente.telefone}">👤 ${cliente.nome} (${cliente.telefone})</option>`
        ).join("")}
      `;
    });

    document.getElementById("clienteFiltro").addEventListener("change", (e) => {
      const telefone = e.target.value;
      const tipoSelect = document.getElementById("tipoCobranca");
      
      tipoSelect.innerHTML = "<option value=\"\">-- Selecione o tipo --</option>";
      document.getElementById("resultadosCobranca").innerHTML = "";

      if (!telefone) {
        tipoSelect.disabled = true;
        return;
      }

      tipoSelect.disabled = false;
      tipoSelect.innerHTML = `
        <option value="vencidas">🔴 Cobranças Vencidas</option>
        <option value="a_vencer">🟢 Cobranças A Vencer</option>
        <option value="todas">📋 Todas as Cobranças</option>
      `;
    });

    document.getElementById("tipoCobranca").addEventListener("change", (e) => {
      const tipo = e.target.value;
      if (tipo) {
        const local = document.getElementById("localFiltro").value;
        const telefone = document.getElementById("clienteFiltro").value;
        filtrarCobrancas(local, telefone, tipo);
      }
    });
  } catch (error) {
    console.error("Erro ao carregar tela de cobrança:", error);
    alert("❌ Erro ao carregar dados de cobrança.");
  }
};

// === FUNÇÃO PARA FILTRAR COBRANÇAS ===
window.filtrarCobrancas = async (local, telefone, tipo) => {
  if (!window.db) {
    document.getElementById("resultadosCobranca").innerHTML = `
      <div class="no-data">
        <i class="fas fa-info-circle"></i>
        <p>Firebase não disponível - funcionalidade de cobrança não implementada.</p>
      </div>
    `;
    return;
  }

  const todasVendas = JSON.parse(localStorage.getItem("vendas") || "[]");
  
  let vendasCliente = [];
  
  if (telefone === "todos") {
    // Se cliente é "todos", filtra por local
    if (local === "todos") {
      vendasCliente = todasVendas.filter(v => v.status !== "pago" && v.dataReceber);
    } else {
      vendasCliente = todasVendas.filter(v => 
        v.local === local && 
        v.status !== "pago" && 
        v.dataReceber
      );
    }
  } else {
    // Se cliente específico, filtra normalmente
    vendasCliente = todasVendas.filter(v => 
      (v.telefone || "").replace(/\D/g, "") === telefone && 
      v.status !== "pago" && 
      v.dataReceber
    );
  }

  if (!vendasCliente.length) {
    document.getElementById("resultadosCobranca").innerHTML = `
      <div class="no-data">
        <i class="fas fa-search"></i>
        <p>Nenhuma cobrança encontrada para este filtro.</p>
      </div>
    `;
    return;
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  let vendasFiltradas = [];
  let titulo = "";

  switch (tipo) {
    case "vencidas":
      vendasFiltradas = vendasCliente.filter(v => {
        const dataVencimento = new Date(v.dataReceber);
        return dataVencimento < hoje;
      });
      titulo = "🔴 Cobranças Vencidas";
      break;
    case "a_vencer":
      vendasFiltradas = vendasCliente.filter(v => {
        const dataVencimento = new Date(v.dataReceber);
        return dataVencimento >= hoje;
      });
      titulo = "🟢 Cobranças A Vencer";
      break;
    case "todas":
      vendasFiltradas = vendasCliente;
      titulo = "📋 Todas as Cobranças";
      break;
  }

  if (!vendasFiltradas.length) {
    document.getElementById("resultadosCobranca").innerHTML = `
      <div class="no-data">
        <i class="fas fa-info-circle"></i>
        <p>Nenhuma cobrança encontrada para "${titulo}".</p>
      </div>
    `;
    return;
  }

  // Se for "todos" os clientes, agrupa por cliente e data
  let cards = "";
  if (telefone === "todos") {
    // Agrupa por cliente primeiro, depois por data
    const gruposPorCliente = vendasFiltradas.reduce((acc, venda) => {
      const tel = (venda.telefone || "").replace(/\D/g, "") || "sem-telefone";
      if (!acc[tel]) {
        acc[tel] = [];
      }
      acc[tel].push(venda);
      return acc;
    }, {});

    cards = Object.entries(gruposPorCliente).map(([telefoneCliente, vendasDoCliente]) => {
      // Agrupa por data de vencimento dentro do cliente
      const gruposPorData = vendasDoCliente.reduce((acc, venda) => {
        const data = venda.dataReceber;
        if (!acc[data]) {
          acc[data] = [];
        }
        acc[data].push(venda);
        return acc;
      }, {});

      const datasOrdenadas = Object.keys(gruposPorData).sort((a, b) => new Date(a) - new Date(b));

      return datasOrdenadas.map(data => {
        const vendasDaData = gruposPorData[data];
        const nome = vendasDaData[0].cliente || "Sem nome";

        const comprasHtml = vendasDaData.map((venda, index) => {
          const valor = parseFloat(venda.valor || 0);
          const valorPago = parseFloat(venda.valorParcial) || 0;
          const faltaPagar = parseFloat(venda.faltaReceber) || (valor - valorPago);
          const produtosHtml = (venda.produtosVendidos || []).map(p => `<div><i class="fas fa-cookie-bite"></i> ${p}</div>`).join("");
          const borderStyle = index > 0 ? "border-top: 2px dashed #e0a6b1; padding-top: 15px; margin-top: 15px;" : "";

          return `
            <div class="compra-individual" style="${borderStyle}">
              <div class="compra-info-grid">
                <div class="info-item">
                  <i class="fas fa-calendar"></i>
                  <span><strong>Data da Compra:</strong> ${formatarData(venda.data)}</span>
                </div>
                <div class="info-item">
                  <i class="fas fa-map-marker-alt"></i>
                  <span><strong>Local:</strong> ${venda.local || "Não informado"}</span>
                </div>
                <div class="info-item">
                  <i class="fas fa-money-bill"></i>
                  <span><strong>Valor Total:</strong> ${valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                </div>
                <div class="info-item">
                  <i class="fas fa-check-circle"></i>
                  <span><strong>Valor Pago:</strong> ${valorPago.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                </div>
                <div class="info-item">
                  <i class="fas fa-exclamation-triangle"></i>
                  <span><strong>Falta Pagar:</strong> ${faltaPagar.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                </div>
              </div>
              <div class="produtos-section">
                <p><i class="fas fa-shopping-basket"></i> <strong>Produtos:</strong></p>
                <div class="produtos-grid">${produtosHtml || "<div>Nenhum produto listado.</div>"}</div>
              </div>
            </div>
          `;
        }).join("");

        const totalValorGrupo = vendasDaData.reduce((acc, v) => acc + (parseFloat(v.valor) || 0), 0);
        const totalPagoGrupo = vendasDaData.reduce((acc, v) => acc + (parseFloat(v.valorParcial) || 0), 0);
        const totalFaltaPagarGrupo = vendasDaData.reduce((acc, v) => acc + (parseFloat(v.faltaReceber) || 0), 0);

        // Verifica se está vencida
        const dataVencimento = new Date(data);
        const isVencida = dataVencimento < hoje;
        const statusVencimento = isVencida ? "🔴 VENCIDA" : "🟢 A VENCER";

        return `
          <div class="cobranca-card ${isVencida ? "vencida" : "a-vencer"}">
            <div class="cobranca-header">
              <div class="cliente-info">
                <div class="avatar ${isVencida ? "avatar-vencida" : "avatar-ok"}">
                  ${isVencida ? "⚠️" : "✅"}
                </div>
                <div class="cliente-dados">
                  <h3>${nome}</h3>
                  <p class="status-vencimento ${isVencida ? "vencida" : "ok"}">${statusVencimento}</p>
                  <p class="data-vencimento">Vencimento: ${formatarData(data)}</p>
                </div>
              </div>
            </div>
            
            <div class="compras-detalhes">
              ${comprasHtml}
            </div>
            
            <div class="totais-grid">
              <div class="total-item">
                <i class="fas fa-calculator"></i>
                <div>
                  <span class="label">Total Geral</span>
                  <span class="valor">${totalValorGrupo.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                </div>
              </div>
              <div class="total-item">
                <i class="fas fa-check-circle"></i>
                <div>
                  <span class="label">Total Pago</span>
                  <span class="valor pago">${totalPagoGrupo.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                </div>
              </div>
              <div class="total-item">
                <i class="fas fa-exclamation-triangle"></i>
                <div>
                  <span class="label">Total Pendente</span>
                  <span class="valor pendente">${totalFaltaPagarGrupo.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                </div>
              </div>
            </div>
            
            <div class="acoes-cobranca">
              <button class="btn-acao btn-pagar" onclick="marcarPagoGrupo(\'${telefoneCliente}\', \'${data}\')">
                <i class="fas fa-check"></i> Pagar Tudo
              </button>
              <button class="btn-acao btn-parcial" onclick="mostrarFormParcialGrupo(\'${telefoneCliente}\', \'${data}\')">
                <i class="fas fa-coins"></i> Pago Parcial
              </button>
              <button class="btn-acao btn-whatsapp" onclick="cobrarWhats(\'${telefoneCliente}\', \'${data}\')">
                <i class="fab fa-whatsapp"></i> WhatsApp
              </button>
              <button class="btn-acao btn-reagendar" onclick="reagendarGrupo(\'${telefoneCliente}\', \'${data}\')">
                <i class="fas fa-calendar-alt"></i> Reagendar
              </button>
            </div>
            
            <div id="parcial-grupo-${telefoneCliente}-${data.replace(/-/g, "")}" class="form-extra"></div>
            <div id="reagendar-${telefoneCliente}-${data.replace(/-/g, "")}" class="form-extra"></div>
          </div>
        `;
      }).join("");
    }).flat().join("");
  } else {
    // Lógica original para cliente específico (similar ao código anterior, mas com novo design)
    const gruposPorData = vendasFiltradas.reduce((acc, venda) => {
      const data = venda.dataReceber;
      if (!acc[data]) {
        acc[data] = [];
      }
      acc[data].push(venda);
      return acc;
    }, {});

    const datasOrdenadas = Object.keys(gruposPorData).sort((a, b) => new Date(a) - new Date(b));

    cards = datasOrdenadas.map(data => {
      const vendasDaData = gruposPorData[data];
      const nome = vendasDaData[0].cliente || "Sem nome";

      const comprasHtml = vendasDaData.map((venda, index) => {
        const valor = parseFloat(venda.valor || 0);
        const valorPago = parseFloat(venda.valorParcial) || 0;
        const faltaPagar = parseFloat(venda.faltaReceber) || (valor - valorPago);
        const produtosHtml = (venda.produtosVendidos || []).map(p => `<div><i class="fas fa-cookie-bite"></i> ${p}</div>`).join("");
        const borderStyle = index > 0 ? "border-top: 2px dashed #e0a6b1; padding-top: 15px; margin-top: 15px;" : "";

        return `
          <div class="compra-individual" style="${borderStyle}">
            <div class="compra-info-grid">
              <div class="info-item">
                <i class="fas fa-calendar"></i>
                <span><strong>Data da Compra:</strong> ${formatarData(venda.data)}</span>
              </div>
              <div class="info-item">
                <i class="fas fa-money-bill"></i>
                <span><strong>Valor Total:</strong> ${valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
              </div>
              <div class="info-item">
                <i class="fas fa-check-circle"></i>
                <span><strong>Valor Pago:</strong> ${valorPago.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
              </div>
              <div class="info-item">
                <i class="fas fa-exclamation-triangle"></i>
                <span><strong>Falta Pagar:</strong> ${faltaPagar.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
              </div>
            </div>
            <div class="produtos-section">
              <p><i class="fas fa-shopping-basket"></i> <strong>Produtos:</strong></p>
              <div class="produtos-grid">${produtosHtml || "<div>Nenhum produto listado.</div>"}</div>
            </div>
          </div>
        `;
      }).join("");

      const totalValorGrupo = vendasDaData.reduce((acc, v) => acc + (parseFloat(v.valor) || 0), 0);
      const totalPagoGrupo = vendasDaData.reduce((acc, v) => acc + (parseFloat(v.valorParcial) || 0), 0);
      const totalFaltaPagarGrupo = vendasDaData.reduce((acc, v) => acc + (parseFloat(v.faltaReceber) || 0), 0);

      // Verifica se está vencida
      const dataVencimento = new Date(data);
      const isVencida = dataVencimento < hoje;
      const statusVencimento = isVencida ? "🔴 VENCIDA" : "🟢 A VENCER";

      return `
        <div class="cobranca-card ${isVencida ? "vencida" : "a-vencer"}">
          <div class="cobranca-header">
            <div class="cliente-info">
              <div class="avatar ${isVencida ? "avatar-vencida" : "avatar-ok"}">
                ${isVencida ? "⚠️" : "✅"}
              </div>
              <div class="cliente-dados">
                <h3>${nome}</h3>
                <p class="status-vencimento ${isVencida ? "vencida" : "ok"}">${statusVencimento}</p>
                <p class="data-vencimento">Vencimento: ${formatarData(data)}</p>
              </div>
            </div>
          </div>
          
          <div class="compras-detalhes">
            ${comprasHtml}
          </div>
          
          <div class="totais-grid">
            <div class="total-item">
              <i class="fas fa-calculator"></i>
              <div>
                <span class="label">Total Geral</span>
                <span class="valor">${totalValorGrupo.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
              </div>
            </div>
            <div class="total-item">
              <i class="fas fa-check-circle"></i>
              <div>
                <span class="label">Total Pago</span>
                <span class="valor pago">${totalPagoGrupo.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
              </div>
            </div>
            <div class="total-item">
              <i class="fas fa-exclamation-triangle"></i>
              <div>
                <span class="label">Total Pendente</span>
                <span class="valor pendente">${totalFaltaPagarGrupo.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
              </div>
            </div>
          </div>
          
          <div class="acoes-cobranca">
            <button class="btn-acao btn-pagar" onclick="marcarPagoGrupo(\'${telefone}\', \'${data}\')">
              <i class="fas fa-check"></i> Pagar Tudo
            </button>
            <button class="btn-acao btn-parcial" onclick="mostrarFormParcialGrupo(\'${telefone}\', \'${data}\')">
              <i class="fas fa-coins"></i> Pago Parcial
            </button>
            <button class="btn-acao btn-whatsapp" onclick="cobrarWhats(\'${telefone}\', \'${data}\')">
              <i class="fab fa-whatsapp"></i> WhatsApp
            </button>
            <button class="btn-acao btn-reagendar" onclick="reagendarGrupo(\'${telefone}\', \'${data}\')">
              <i class="fas fa-calendar-alt"></i> Reagendar
            </button>
          </div>
          
          <div id="parcial-grupo-${telefone}-${data.replace(/-/g, "")}" class="form-extra"></div>
          <div id="reagendar-${telefone}-${data.replace(/-/g, "")}" class="form-extra"></div>
        </div>
      `;
    }).join("");
  }

  document.getElementById("resultadosCobranca").innerHTML = `
    <div class="resultados-header">
      <h3>${titulo}</h3>
      <p>Total de ${vendasFiltradas.length} cobrança(s) encontrada(s)</p>
    </div>
    ${cards}
  `;
};

// === FUNÇÕES AUXILIARES ===
function formatarData(data) {
  if (!data) return "Data não informada";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

function gerarCalendario(vendas, mes, ano) {
  const diasNoMes = new Date(ano, mes, 0).getDate();
  const primeiroDia = new Date(ano, mes - 1, 1).getDay();
  
  let html = "";
  
  // Dias vazios no início
  for (let i = 0; i < primeiroDia; i++) {
    html += "<div class=\"calendar-day-empty\"></div>";
  }
  
  // Dias do mês
  for (let dia = 1; dia <= diasNoMes; dia++) {
    const dataCompleta = `${ano}-${mes.toString().padStart(2, "0")}-${dia.toString().padStart(2, "0")}`;
    const vendasDoDia = vendas.filter(v => v.data === dataCompleta);
    const totalDia = vendasDoDia.reduce((acc, v) => acc + (parseFloat(v.valor) || 0), 0);
    
    html += `
      <div class="calendar-day" onclick="mostrarDiaDashboard(\'${dataCompleta}\')">
        <div class="calendar-day-number">${dia}</div>
        <div class="calendar-day-value">
          ${totalDia > 0 ? totalDia.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : ""}
        </div>
        ${vendasDoDia.length > 0 ? `<div class="calendar-day-count">${vendasDoDia.length} venda(s)</div>` : ""}
      </div>
    `;
  }
  
  document.getElementById("dashboardCalendar").innerHTML = html;
}

// === FUNÇÕES DE COBRANÇA (mantidas as funcionalidades originais) ===
window.marcarPagoGrupo = async (telefone, data) => {
  if (!window.db) {
    alert("Firebase não disponível. Não é possível marcar como pago.");
    return;
  }
  try {
    const vendasRef = window.db.collection("vendas");
    const snap = await vendasRef.where("telefone", "==", telefone).where("dataReceber", "==", data).get();
    const batch = window.db.batch();
    snap.docs.forEach(doc => {
      batch.update(doc.ref, { status: "pago", faltaReceber: 0, valorParcial: parseFloat(doc.data().valor || 0) });
    });
    await batch.commit();
    alert("Vendas marcadas como pagas!");
    showCobranca(); // Recarrega a tela de cobrança
  } catch (error) {
    console.error("Erro ao marcar como pago:", error);
    alert("Erro ao marcar vendas como pagas.");
  }
};

window.mostrarFormParcialGrupo = (telefone, data) => {
  const containerId = `parcial-grupo-${telefone}-${data.replace(/-/g, "")}`;
  const container = document.getElementById(containerId);
  if (container.style.display === "block") {
    container.style.display = "none";
    return;
  }
  container.style.display = "block";
  container.innerHTML = `
    <div class="form-group">
      <label for="valorParcialGrupo"><i class="fas fa-coins"></i> Valor Recebido Hoje</label>
      <input type="number" id="valorParcialGrupo" placeholder="0,00" />
    </div>
    <button onclick="salvarParcialGrupo(\'${telefone}\', \'${data}\')" class="btn-primary">
      <i class="fas fa-save"></i> Salvar Parcial
    </button>
  `;
};

window.salvarParcialGrupo = async (telefone, data) => {
  if (!window.db) {
    alert("Firebase não disponível. Não é possível salvar pagamento parcial.");
    return;
  }
  const valorParcial = parseFloat(document.getElementById("valorParcialGrupo")?.value || 0);
  if (isNaN(valorParcial) || valorParcial <= 0) {
    alert("Por favor, insira um valor parcial válido.");
    return;
  }

  try {
    const vendasRef = window.db.collection("vendas");
    const snap = await vendasRef.where("telefone", "==", telefone).where("dataReceber", "==", data).get();
    const batch = window.db.batch();

    snap.docs.forEach(doc => {
      const dadosAtuais = doc.data();
      const valorTotal = parseFloat(dadosAtuais.valor || 0);
      const valorJaPago = parseFloat(dadosAtuais.valorParcial || 0);
      const novoValorParcial = valorJaPago + valorParcial;
      const novaFaltaReceber = valorTotal - novoValorParcial;

      if (novaFaltaReceber <= 0) {
        batch.update(doc.ref, { status: "pago", valorParcial: novoValorParcial, faltaReceber: 0 });
      } else {
        batch.update(doc.ref, { status: "parcial", valorParcial: novoValorParcial, faltaReceber: novaFaltaReceber });
      }
    });
    await batch.commit();
    alert("Pagamento parcial salvo!");
    showCobranca(); // Recarrega a tela de cobrança
  } catch (error) {
    console.error("Erro ao salvar parcial:", error);
    alert("Erro ao salvar pagamento parcial.");
  }
};

window.cobrarWhats = async (telefone, data) => {
  if (!window.db) {
    alert("Firebase não disponível. Não é possível enviar cobrança via WhatsApp.");
    return;
  }
  try {
    const vendasRef = window.db.collection("vendas");
    const snap = await vendasRef.where("telefone", "==", telefone).where("dataReceber", "==", data).get();
    const vendasDoGrupo = snap.docs.map(doc => doc.data());

    if (vendasDoGrupo.length === 0) {
      alert("Nenhuma venda encontrada para este cliente e data.");
      return;
    }

    const clienteNome = vendasDoGrupo[0].cliente || "Cliente";
    let numero = telefone.replace(/\D/g, "");
    if (!numero.startsWith("55")) {
      numero = "55" + numero;
    }

    const totalFaltaPagar = vendasDoGrupo.reduce((acc, v) => acc + (parseFloat(v.faltaReceber) || 0), 0);
    const produtosList = vendasDoGrupo.map(v => v.produtosVendidos?.join(", ")).filter(Boolean).join("; ");

    const mensagem = `Olá ${clienteNome}! 👋\n\nEste é um lembrete amigável da Buck Doces sobre seu pagamento pendente.\n\nDetalhes:\n📅 Data de Vencimento: ${formatarData(data)}\n💰 Valor Pendente: R$ ${totalFaltaPagar.toFixed(2).replace(".", ",")}\n🛍️ Produtos: ${produtosList || "Não especificado"}\n\nPor favor, realize o pagamento o mais breve possível.\n\n💳 CHAVE PIX (CNPJ): 57.010.512/0001-56\n📩 Envie o comprovante após o pagamento.\n\nObrigada pela sua atenção! 💕`;

    const link = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    window.open(link, "_blank");
  } catch (error) {
    console.error("Erro ao enviar cobrança via WhatsApp:", error);
    alert("Erro ao enviar cobrança via WhatsApp.");
  }
};

window.reagendarGrupo = (telefone, data) => {
  const containerId = `reagendar-${telefone}-${data.replace(/-/g, "")}`;
  const container = document.getElementById(containerId);
  if (container.style.display === "block") {
    container.style.display = "none";
    return;
  }
  container.style.display = "block";
  container.innerHTML = `
    <div class="form-group">
      <label for="novaDataReceberGrupo"><i class="fas fa-calendar-alt"></i> Nova Data para Receber</label>
      <input type="date" id="novaDataReceberGrupo" />
    </div>
    <button onclick="salvarReagendamentoGrupo(\'${telefone}\', \'${data}\')" class="btn-primary">
      <i class="fas fa-save"></i> Salvar Reagendamento
    </button>
  `;
};

window.salvarReagendamentoGrupo = async (telefone, dataAntiga) => {
  if (!window.db) {
    alert("Firebase não disponível. Não é possível reagendar.");
    return;
  }
  const novaDataReceber = document.getElementById("novaDataReceberGrupo")?.value;
  if (!novaDataReceber) {
    alert("Por favor, selecione uma nova data.");
    return;
  }

  try {
    const vendasRef = window.db.collection("vendas");
    const snap = await vendasRef.where("telefone", "==", telefone).where("dataReceber", "==", dataAntiga).get();
    const batch = window.db.batch();
    snap.docs.forEach(doc => {
      batch.update(doc.ref, { dataReceber: novaDataReceber });
    });
    await batch.commit();
    alert("Vendas reagendadas com sucesso!");
    showCobranca(); // Recarrega a tela de cobrança
  } catch (error) {
    console.error("Erro ao reagendar:", error);
    alert("Erro ao reagendar vendas.");
  }
};

// === ANIMAÇÃO DE SHAKE PARA ERROS ===
const style = document.createElement("style");
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);

