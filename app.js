// ================= Firebase + App.js JF Bank =====================

// Importações Firebase via CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Configuração Firebase JF Bank
const firebaseConfig = {
  apiKey: "AIzaSyBFImw6Px0VKLiSVba8L-9PdjLPIU_HmSM",
  authDomain: "financeiro-409db.firebaseapp.com",
  projectId: "financeiro-409db",
  storageBucket: "financeiro-409db.firebasestorage.app",
  messagingSenderId: "124692561019",
  appId: "1:124692561019:web:ceb10e49cf667d61f3b6de"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let currentUser = null;
let userData = {};

// ================= Login =====================

async function login() {
  const user = document.getElementById("user-select").value;
  const password = document.getElementById("password").value;
  const error = document.getElementById("login-error");

  const expectedPassword = `${user}1234`;
  if (password === expectedPassword) {
    currentUser = user;
    const userRef = doc(db, "usuarios", currentUser);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      await setDoc(userRef, {
        nome: currentUser,
        salario: 0,
        gastosFixos: [],
        gastosVariaveis: [],
        limiteCartao: 0,
        cartaoFixos: [],
        cartaoGastos: [],
        cartaoOutros: [],
        previsoes: {}
      });
      userData = {
        salario: 0,
        gastosFixos: [],
        gastosVariaveis: [],
        limiteCartao: 0,
        cartaoFixos: [],
        cartaoGastos: [],
        cartaoOutros: [],
        previsoes: {}
      };
    } else {
      userData = snap.data();
    }

    document.getElementById("login-container").style.display = "none";
    document.getElementById("app-container").style.display = "block";
    error.textContent = "";

    carregarDados();
  } else {
    error.textContent = "Usuário ou senha incorretos.";
  }
}

// ============ Exibe dados salvos ao logar ==============
function carregarDados() {
  document.getElementById("salario").value = userData.salario;
  document.getElementById("limite-cartao").value = userData.limiteCartao;
  atualizarResumoDinheiro();
  atualizarResumoCartao();
}

// ================== Seções ===================
function showSection(id) {
  document.querySelectorAll('.section').forEach(section => {
    section.style.display = "none";
  });
  document.getElementById(id).style.display = "block";
}

// ================== Meu Dinheiro ===================
async function salvarSalario() {
  const valor = parseFloat(document.getElementById("salario").value) || 0;
  userData.salario = valor;
  await updateDoc(doc(db, "usuarios", currentUser), { salario: valor });
  atualizarResumoDinheiro();
}

async function salvarGastoFixo(id) {
  const nome = document.getElementById(`fixo-nome-${id}`).value;
  const valor = parseFloat(document.getElementById(`fixo-valor-${id}`).value) || 0;
  const novoGasto = { nome, valor };
  userData.gastosFixos.push(novoGasto);
  await updateDoc(doc(db, "usuarios", currentUser), {
    gastosFixos: arrayUnion(novoGasto)
  });
  atualizarResumoDinheiro();
}

async function salvarGastoVariavel(id) {
  const valor = parseFloat(document.getElementById(`var-valor-${id}`).value) || 0;
  const categoria = document.getElementById(`var-cat-${id}`).value;
  const gasto = { valor, categoria };
  userData.gastosVariaveis.push(gasto);
  await updateDoc(doc(db, "usuarios", currentUser), {
    gastosVariaveis: arrayUnion(gasto)
  });
  atualizarResumoDinheiro();
}

function atualizarResumoDinheiro() {
  const totalFixos = userData.gastosFixos.reduce((acc, g) => acc + g.valor, 0);
  const totalVars = userData.gastosVariaveis.reduce((acc, g) => acc + g.valor, 0);
  const total = totalFixos + totalVars;
  const saldo = userData.salario - total;
  document.getElementById("gasto-total").textContent = total.toFixed(2);
  document.getElementById("saldo-restante").textContent = saldo.toFixed(2);
}

// ================== Meu Cartão ===================
async function salvarLimiteCartao() {
  const limite = parseFloat(document.getElementById("limite-cartao").value) || 0;
  userData.limiteCartao = limite;
  await updateDoc(doc(db, "usuarios", currentUser), { limiteCartao: limite });
  atualizarResumoCartao();
}

async function salvarCartaoFixo(id) {
  const nome = document.getElementById(`cartao-fixo-nome-${id}`).value;
  const valor = parseFloat(document.getElementById(`cartao-fixo-valor-${id}`).value) || 0;
  const novo = { nome, valor };
  userData.cartaoFixos.push(novo);
  await updateDoc(doc(db, "usuarios", currentUser), {
    cartaoFixos: arrayUnion(novo)
  });
  atualizarResumoCartao();
}

async function salvarCartaoGasto(id) {
  const valor = parseFloat(document.getElementById(`cartao-gasto-valor-${id}`).value) || 0;
  const categoria = document.getElementById(`cartao-gasto-cat-${id}`).value;
  const novo = { valor, categoria };
  userData.cartaoGastos.push(novo);
  await updateDoc(doc(db, "usuarios", currentUser), {
    cartaoGastos: arrayUnion(novo)
  });
  atualizarResumoCartao();
}

async function salvarCartaoOutro(id) {
  const nome = document.getElementById(`cartao-outro-nome-${id}`).value;
  const valor = parseFloat(document.getElementById(`cartao-outro-valor-${id}`).value) || 0;
  const novo = { nome, valor };
  userData.cartaoOutros.push(novo);
  await updateDoc(doc(db, "usuarios", currentUser), {
    cartaoOutros: arrayUnion(novo)
  });
  atualizarResumoCartao();
}

function atualizarResumoCartao() {
  const totalFixos = userData.cartaoFixos.reduce((acc, g) => acc + g.valor, 0);
  const totalGastos = userData.cartaoGastos.reduce((acc, g) => acc + g.valor, 0);
  const totalOutros = userData.cartaoOutros.reduce((acc, g) => acc + g.valor, 0);
  const gastoConsiderado = totalFixos + totalGastos;
  const saldo = userData.limiteCartao - gastoConsiderado;
  document.getElementById("cartao-gasto-total").textContent = gastoConsiderado.toFixed(2);
  document.getElementById("cartao-outros-total").textContent = totalOutros.toFixed(2);
  document.getElementById("cartao-saldo-restante").textContent = saldo.toFixed(2);
}

// ================== Previsão ===================
async function salvarPrevisao() {
  const mes = document.getElementById("previsao-mes").value; // formato yyyy-mm
  const nome = document.getElementById("previsao-nome").value;
  const valor = parseFloat(document.getElementById("previsao-valor").value) || 0;
  if (!userData.previsoes[mes]) {
    userData.previsoes[mes] = [];
  }
  userData.previsoes[mes].push({ nome, valor });
  await updateDoc(doc(db, "usuarios", currentUser), {
    [`previsoes.${mes}`]: arrayUnion({ nome, valor })
  });
  atualizarPrevisao(mes);
}

function atualizarPrevisao(mes) {
  const lista = userData.previsoes[mes] || [];
  const total = lista.reduce((acc, g) => acc + g.valor, 0);
  document.getElementById("previsao-total").textContent = total.toFixed(2);
}
