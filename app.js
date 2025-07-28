const users = {
  felipe: "felipe1234",
  joao: "joao1234",
  iamillis: "iamillis1234"
};

function login() {
  const user = document.getElementById("user-select").value;
  const password = document.getElementById("password").value;
  const error = document.getElementById("login-error");

  if (user && password === `${user}1234`) {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("app-container").style.display = "block";
    error.textContent = "";
  } else {
    error.textContent = "Usuário ou senha incorretos.";
  }
}

function showSection(id) {
  document.querySelectorAll('.section').forEach(section => {
    section.style.display = "none";
  });
  document.getElementById(id).style.display = "block";
}

// Funções extras para adicionar campos, calcular e atualizar valores virão na próxima parte
const users = {
  felipe: "felipe1234",
  joao: "joao1234",
  iamillis: "iamillis1234"
};

let salario = 0;
let gastosFixos = [];
let gastosVariaveis = [];

let limiteCartao = 0;
let cartaoFixos = [];
let cartaoGastos = [];
let cartaoOutros = [];

let previsoes = {};

function login() {
  const user = document.getElementById("user-select").value;
  const password = document.getElementById("password").value;
  const error = document.getElementById("login-error");

  if (user && password === `${user}1234`) {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("app-container").style.display = "block";
    error.textContent = "";
  } else {
    error.textContent = "Usuário ou senha incorretos.";
  }
}

function showSection(id) {
  document.querySelectorAll('.section').forEach(section => {
    section.style.display = "none";
  });
  document.getElementById(id).style.display = "block";
}

function salvarSalario() {
  salario = parseFloat(document.getElementById("salario").value) || 0;
  atualizarResumoDinheiro();
}

function adicionarGastoFixo() {
  const id = Date.now();
  document.getElementById("gastos-fixos").insertAdjacentHTML('beforeend', `
    <div class="card" id="gasto-fixo-${id}">
      <input type="text" placeholder="Nome do gasto" id="fixo-nome-${id}" />
      <input type="number" placeholder="Valor" id="fixo-valor-${id}" />
      <button onclick="salvarGastoFixo(${id})">Salvar</button>
    </div>
  `);
}

function salvarGastoFixo(id) {
  const nome = document.getElementById(`fixo-nome-${id}`).value;
  const valor = parseFloat(document.getElementById(`fixo-valor-${id}`).value) || 0;
  gastosFixos.push({ nome, valor });
  atualizarResumoDinheiro();
}

function adicionarGastoVariavel() {
  const id = Date.now();
  document.getElementById("gastos-variaveis").insertAdjacentHTML('beforeend', `
    <div class="card" id="gasto-var-${id}">
      <input type="number" placeholder="Valor" id="var-valor-${id}" />
      <select id="var-cat-${id}">
        <option>Comida</option>
        <option>Lazer</option>
        <option>Transporte</option>
        <option>Pagamento de Contas</option>
      </select>
      <button onclick="salvarGastoVariavel(${id})">Adicionar</button>
    </div>
  `);
}

function salvarGastoVariavel(id) {
  const valor = parseFloat(document.getElementById(`var-valor-${id}`).value) || 0;
  const categoria = document.getElementById(`var-cat-${id}`).value;
  gastosVariaveis.push({ valor, categoria });
  atualizarResumoDinheiro();
}

function atualizarResumoDinheiro() {
  const totalFixos = gastosFixos.reduce((acc, g) => acc + g.valor, 0);
  const totalVariavel = gastosVariaveis.reduce((acc, g) => acc + g.valor, 0);
  const total = totalFixos + totalVariavel;
  document.getElementById("gasto-total").textContent = total.toFixed(2);
  document.getElementById("saldo-restante").textContent = (salario - total).toFixed(2);
}

// ================= MEU CARTÃO ===================

function salvarLimiteCartao() {
  limiteCartao = parseFloat(document.getElementById("limite-cartao").value) || 0;
  atualizarResumoCartao();
}

function adicionarCartaoFixo() {
  const id = Date.now();
  document.getElementById("cartao-fixos").insertAdjacentHTML('beforeend', `
    <div class="card" id="cartao-fixo-${id}">
      <input type="text" placeholder="Descrição" id="cf-nome-${id}" />
      <input type="number" placeholder="Valor" id="cf-valor-${id}" />
      <button onclick="salvarCartaoFixo(${id})">Salvar</button>
    </div>
  `);
}

function salvarCartaoFixo(id) {
  const nome = document.getElementById(`cf-nome-${id}`).value;
  const valor = parseFloat(document.getElementById(`cf-valor-${id}`).value) || 0;
  cartaoFixos.push({ nome, valor });
  atualizarResumoCartao();
}

function adicionarCartaoGasto() {
  const id = Date.now();
  document.getElementById("cartao-gastos").insertAdjacentHTML('beforeend', `
    <div class="card" id="cartao-gasto-${id}">
      <input type="number" placeholder="Valor" id="cg-valor-${id}" />
      <select id="cg-cat-${id}">
        <option>Comida</option>
        <option>Lazer</option>
        <option>Transporte</option>
        <option>Pagamento de Contas</option>
      </select>
      <button onclick="salvarCartaoGasto(${id})">Adicionar</button>
    </div>
  `);
}

function salvarCartaoGasto(id) {
  const valor = parseFloat(document.getElementById(`cg-valor-${id}`).value) || 0;
  const categoria = document.getElementById(`cg-cat-${id}`).value;
  cartaoGastos.push({ valor, categoria });
  atualizarResumoCartao();
}

function adicionarCartaoOutro() {
  const id = Date.now();
  document.getElementById("cartao-outras-pessoas").insertAdjacentHTML('beforeend', `
    <div class="card" id="cartao-outro-${id}">
      <input type="text" placeholder="Quem usou" id="co-nome-${id}" />
      <input type="number" placeholder="Valor" id="co-valor-${id}" />
      <button onclick="salvarCartaoOutro(${id})">Salvar</button>
    </div>
  `);
}

function salvarCartaoOutro(id) {
  const nome = document.getElementById(`co-nome-${id}`).value;
  const valor = parseFloat(document.getElementById(`co-valor-${id}`).value) || 0;
  cartaoOutros.push({ nome, valor });
  atualizarResumoCartao();
}

function atualizarResumoCartao() {
  const totalFixos = cartaoFixos.reduce((acc, g) => acc + g.valor, 0);
  const totalGastos = cartaoGastos.reduce((acc, g) => acc + g.valor, 0);
  const totalOutros = cartaoOutros.reduce((acc, g) => acc + g.valor, 0);

  const totalPessoal = totalFixos + totalGastos;
  const totalFinal = totalPessoal + totalOutros;
  const restante = limiteCartao - totalPessoal;

  document.getElementById("total-cartao").textContent = totalPessoal.toFixed(2);
  document.getElementById("gasto-outras-pessoas").textContent = totalOutros.toFixed(2);
  document.getElementById("saldo-cartao").textContent = restante.toFixed(2);
}

// ============ PREVISÃO ==============

function adicionarPrevisao() {
  const mes = document.getElementById("mes-previsao").value;
  if (!mes) return alert("Selecione um mês!");

  const id = Date.now();
  if (!previsoes[mes]) previsoes[mes] = [];

  document.getElementById("previsao-gastos").insertAdjacentHTML('beforeend', `
    <div class="card" id="prev-${id}">
      <input type="text" placeholder="Descrição" id="prev-desc-${id}" />
      <input type="number" placeholder="Valor" id="prev-valor-${id}" />
      <button onclick="salvarPrevisao('${mes}', ${id})">Salvar</button>
    </div>
  `);
}

function salvarPrevisao(mes, id) {
  const descricao = document.getElementById(`prev-desc-${id}`).value;
  const valor = parseFloat(document.getElementById(`prev-valor-${id}`).value) || 0;
  previsoes[mes].push({ descricao, valor });
  alert("Previsão salva!");
}
