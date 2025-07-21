
const USERS = {
  ana: "Ana1234",
  joao: "João1234"
};

function login() {
  const user = document.getElementById("user").value;
  const password = document.getElementById("password").value;
  const status = document.getElementById("login-status");

  if (USERS[user] === password) {
    window.location.href = "cadastro.html";
  } else {
    status.innerText = "Usuário ou senha incorretos.";
  }
}
