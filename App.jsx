
// buck-doces-app
// Sistema em React com Firebase para controle de vendas

import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_BUCKET",
  messagingSenderId: "SEU_ID",
  appId: "SEU_APP_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const usuarios = {
  "Ana Buck": "Ana1234",
  "João Buck": "Joao1234",
};

function App() {
  const [tela, setTela] = useState("login");
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [vendasHoje, setVendasHoje] = useState([]);
  const [filtroMes, setFiltroMes] = useState(null);

  const [cadastro, setCadastro] = useState({
    nome: "",
    local: "",
    valor: "",
    status: "",
    metodo: "",
    valorRecebido: "",
    valorFaltando: "",
    dataReceber: "",
  });

  const handleLogin = () => {
    if (usuarios[usuario] === senha) {
      setTela("cadastro");
    } else {
      alert("Usuário ou senha incorretos");
    }
  };

  const salvarVenda = async () => {
    try {
      await addDoc(collection(db, "vendas"), {
        ...cadastro,
        usuario,
        data: Timestamp.now(),
      });
      alert("Venda cadastrada!");
      setCadastro({ nome: "", local: "", valor: "", status: "", metodo: "", valorRecebido: "", valorFaltando: "", dataReceber: "" });
    } catch (e) {
      alert("Erro ao salvar: " + e.message);
    }
  };

  const buscarVendasDoMes = async (mes) => {
    const q = query(collection(db, "vendas"));
    const snapshot = await getDocs(q);
    const filtradas = snapshot.docs
      .map((doc) => doc.data())
      .filter((v) => new Date(v.data.seconds * 1000).getMonth() + 1 === mes);
    setVendasHoje(filtradas);
  };

  if (tela === "login") {
    return (
      <div className="login">
        <h1>Buck Doces</h1>
        <div>
          <button onClick={() => setUsuario("Ana Buck")}>Ana Buck</button>
          <button onClick={() => setUsuario("João Buck")}>João Buck</button>
        </div>
        <input
          type="password"
          placeholder="Digite a senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <button onClick={handleLogin}>Entrar</button>
      </div>
    );
  }

  if (tela === "cadastro") {
    return (
      <div className="cadastro">
        <h2>Cadastrar Venda</h2>
        <input placeholder="Nome do Cliente" value={cadastro.nome} onChange={(e) => setCadastro({ ...cadastro, nome: e.target.value })} />
        <input placeholder="Local da Venda" value={cadastro.local} onChange={(e) => setCadastro({ ...cadastro, local: e.target.value })} />
        <input type="number" placeholder="Valor" value={cadastro.valor} onChange={(e) => setCadastro({ ...cadastro, valor: e.target.value })} />
        <div className="status">
          <button onClick={() => setCadastro({ ...cadastro, status: "pago" })}>Pago</button>
          <button onClick={() => setCadastro({ ...cadastro, status: "nao_pago" })}>Não Pago</button>
          <button onClick={() => setCadastro({ ...cadastro, status: "parcial" })}>Pago Parcial</button>
        </div>
        <div className="metodo">
          <button onClick={() => setCadastro({ ...cadastro, metodo: "dinheiro" })}>Dinheiro</button>
          <button onClick={() => setCadastro({ ...cadastro, metodo: "cartao" })}>Cartão</button>
          <button onClick={() => setCadastro({ ...cadastro, metodo: "pix" })}>PIX</button>
        </div>
        <input type="date" placeholder="Data para receber" value={cadastro.dataReceber} onChange={(e) => setCadastro({ ...cadastro, dataReceber: e.target.value })} />
        <button onClick={salvarVenda}>Salvar</button>
      </div>
    );
  }

  return <div>Dashboard (em construção)</div>;
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
