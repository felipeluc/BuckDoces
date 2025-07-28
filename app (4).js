
// === CONFIGURAÇÃO FIREBASE ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDGg5JtE_7gVRhTlRY30bpXsmMpvPEQ3tw",
  authDomain: "buckdoces.firebaseapp.com",
  projectId: "buckdoces",
  storageBucket: "buckdoces.appspot.com",
  messagingSenderId: "781727917443",
  appId: "1:781727917443:web:c9709b3813d28ea60982b6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// === INTERFACE LOGIN ===
document.getElementById("root").innerHTML = `
  <h1 style="text-align: center; color: #d48c94">Buck Doces</h1>
  <div class="card login-card">
    <select id="user">
      <option>Ana Buck</option>
      <option>João Buck</option>
    </select>
    <input type="password" id="senha" placeholder="Senha" />
    <button onclick="login()">Entrar</button>
  </div>
  <div id="main"></div>
`;

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
    alert("Senha incorreta");
  }
};

// === MENU PRINCIPAL ===
function showTabs(user) {
  document.getElementById("main").innerHTML = `
    <div class="card">
      <button onclick="showCadastro('${user}')">Cadastrar Venda</button>
      <button onclick="showDashboard()">Dashboard</button>
      <button onclick="showCobranca()">Cobrança</button>
    </div>
    <div id="conteudo" class="card"></div>
  `;
}

// === DASHBOARD (ATUALIZADO COM CALENDÁRIO DE VENDAS) ===
window.showDashboard = async () => {
  const snap = await getDocs(collection(db, "vendas"));
  const vendas = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const hoje = new Date().toISOString().split("T")[0];

  const hojeVendas = vendas.filter(v => v.data === hoje);
  const totalHoje = hojeVendas.reduce((acc, v) => acc + (parseFloat(v.valor) || 0), 0);

  const aReceber = vendas
    .filter(v => v.status !== "pago")
    .reduce((acc, v) => acc + ((parseFloat(v.faltaReceber) > 0) ? parseFloat(v.faltaReceber) : 0), 0);

  document.getElementById("conteudo").innerHTML = `
    <h2>Dashboard</h2>
    <p>Vendas hoje: ${hojeVendas.length}</p>
    <p>Total vendido hoje: R$ ${totalHoje.toFixed(2)}</p>
    <p>Valor a receber: R$ ${aReceber.toFixed(2)}</p>
    <hr>
    <h3>Vendas por dia</h3>
    <input type="month" id="mesDashboard" />
    <div id="calendarioDashboard"></div>
    <div id="vendasDia"></div>
  `;

  document.getElementById("mesDashboard").addEventListener("change", e => {
    const mes = e.target.value;
    if (!mes) return;

    const dias = {};
    vendas.forEach(v => {
      if (v.data?.startsWith(mes)) {
        const dia = v.data.split("-")[2];
        if (!dias[dia]) dias[dia] = [];
        dias[dia].push(v);
      }
    });

    const calendario = Array.from({ length: 31 }, (_, i) => {
      const diaStr = String(i + 1).padStart(2, "0");
      const vendasDoDia = dias[diaStr] || [];

      const totalDia = vendasDoDia.reduce((acc, v) => acc + parseFloat(v.valor || 0), 0);
      const valorHtml = totalDia > 0 ? `<div class="calendar-day-value">R$ ${totalDia.toFixed(2)}</div>` : "";

      return `
        <div class="calendar-day" onclick="mostrarVendasDia('${mes}-${diaStr}')">
          <div>${diaStr}</div>
          ${valorHtml}
        </div>`;
    }).join("");

    document.getElementById("calendarioDashboard").innerHTML = `<div class="calendar">${calendario}</div>`;
  });
};

// === MOSTRAR VENDAS DE UM DIA ===
window.mostrarVendasDia = async (dataCompleta) => {
  const snap = await getDocs(collection(db, "vendas"));
  const vendas = snap.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(v => v.data === dataCompleta);

  if (vendas.length === 0) {
    document.getElementById("vendasDia").innerHTML = "<p>Nenhuma venda neste dia.</p>";
    return;
  }

  const cards = vendas.map(v => {
    const produtos = (v.produtosVendidos || []).map(p => `<div>${p}</div>`).join("");
    return `
      <div class="card">
        <h3>${v.cliente} - ${v.telefone}</h3>
        <p><strong>Local:</strong> ${v.local}</p>
        <p><strong>Valor:</strong> R$ ${parseFloat(v.valor).toFixed(2)}</p>
        <p><strong>Status:</strong> ${v.status}</p>
        <p><strong>Forma de pagamento:</strong> ${v.forma || '-'}</p>
        <p><strong>Produtos:</strong><br>${produtos}</p>
        <button onclick="reenviarComprovante('${v.telefone}', '${v.id}')">Reenviar Comprovante</button>
      </div>
    `;
  }).join("");

  document.getElementById("vendasDia").innerHTML = `<h3>${formatarData(dataCompleta)}</h3>${cards}`;
};

// === REENVIAR COMPROVANTE ===
window.reenviarComprovante = async (telefone, vendaId) => {
  const snap = await getDocs(collection(db, "vendas"));
  const doc = snap.docs.find(d => d.id === vendaId);
  if (!doc) return alert("Venda não encontrada.");

  const v = doc.data();
  const produtos = (v.produtosVendidos || []).map(p => `- ${p}`).join("\n");

  const msg = `Olá ${v.cliente}!

Segue o comprovante da sua compra na Ana Buck Doces:

Produtos:
${produtos}

Valor: R$ ${parseFloat(v.valor).toFixed(2)}
Status: ${v.status.toUpperCase()}${v.status !== "pago" ? `
Pagamento para: ${formatarData(v.dataReceber)}` : ""}

💳 CHAVE PIX (CNPJ): 57.010.512/0001-56
📩 Por favor, envie o comprovante após o pagamento.

Obrigada pela preferência!`;

  const link = `https://wa.me/${telefone}?text=${encodeURIComponent(msg)}`;
  window.open(link, "_blank");
};

// === FORMATAR DATA ===
function formatarData(data) {
  if (!data) return "-";
  const [ano, mes, dia] = data.split("-");
  return `${dia}-${mes}-${ano}`;
}
