// src/App.jsx
import { useEffect, useState } from "react";
import { db } from "./firebase-config";
import {
  collection,
  addDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore";

const USERS = {
  "Ana Buck": "Ana1234",
  "João Buck": "João1234",
};

export default function App() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [logged, setLogged] = useState(false);
  const [selectedUser, setSelectedUser] = useState("Ana Buck");
  const [tab, setTab] = useState("cadastro");

  function handleLogin() {
    if (USERS[selectedUser] === password) {
      setUser(selectedUser);
      setLogged(true);
    } else {
      alert("Senha incorreta");
    }
  }

  return (
    <div className="min-h-screen bg-rose-50 text-brown-800 p-4">
      <h1 className="text-3xl font-bold text-center mb-4">Buck Doces</h1>

      {!logged ? (
        <div className="max-w-sm mx-auto bg-white p-6 rounded-2xl shadow space-y-3">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full p-2 rounded border"
          >
            <option>Ana Buck</option>
            <option>João Buck</option>
          </select>
          <input
            type="password"
            placeholder="Senha"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleLogin}
            className="w-full bg-rose-400 hover:bg-rose-500 text-white p-2 rounded"
          >
            Entrar
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-around mb-4">
            <button
              onClick={() => setTab("cadastro")}
              className={`p-2 rounded ${tab === "cadastro" ? "bg-rose-300" : "bg-white"}`}
            >
              Cadastrar
            </button>
            <button
              onClick={() => setTab("dashboard")}
              className={`p-2 rounded ${tab === "dashboard" ? "bg-rose-300" : "bg-white"}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setTab("cobranca")}
              className={`p-2 rounded ${tab === "cobranca" ? "bg-rose-300" : "bg-white"}`}
            >
              Cobrança
            </button>
          </div>

          {tab === "cadastro" && <CadastroVenda user={user} />}
          {tab === "dashboard" && <Dashboard />}
          {tab === "cobranca" && <Cobranca />}
        </>
      )}
    </div>
  );
}

function CadastroVenda({ user }) {
  const [cliente, setCliente] = useState("");
  const [local, setLocal] = useState("");
  const [valor, setValor] = useState("");
  const [status, setStatus] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("");
  const [valorParcial, setValorParcial] = useState("");
  const [faltaReceber, setFaltaReceber] = useState("");
  const [dataReceber, setDataReceber] = useState("");

  async function salvarVenda() {
    if (!cliente || !local || !valor || !status) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    const venda = {
      user,
      cliente,
      local,
      valor: parseFloat(valor),
      status,
      formaPagamento,
      valorParcial: valorParcial || null,
      faltaReceber: faltaReceber || null,
      dataReceber: dataReceber || null,
      data: new Date().toISOString().split("T")[0],
      criadoEm: Timestamp.now(),
    };

    await addDoc(collection(db, "vendas"), venda);
    alert("Venda cadastrada com sucesso!");
    setCliente("");
    setLocal("");
    setValor("");
    setStatus("");
    setFormaPagamento("");
    setValorParcial("");
    setFaltaReceber("");
    setDataReceber("");
  }

  return (
    <div className="space-y-3 bg-white p-4 rounded-2xl shadow">
      <input placeholder="Cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} className="w-full p-2 border rounded" />
      <input placeholder="Local" value={local} onChange={(e) => setLocal(e.target.value)} className="w-full p-2 border rounded" />
      <input type="number" placeholder="Valor" value={valor} onChange={(e) => setValor(e.target.value)} className="w-full p-2 border rounded" />

      <div className="flex gap-2">
        <button onClick={() => setStatus("pago")} className={`flex-1 p-2 rounded ${status === "pago" ? "bg-green-200" : "bg-gray-100"}`}>Pago</button>
        <button onClick={() => setStatus("nao")} className={`flex-1 p-2 rounded ${status === "nao" ? "bg-red-200" : "bg-gray-100"}`}>Não Pago</button>
        <button onClick={() => setStatus("parcial")} className={`flex-1 p-2 rounded ${status === "parcial" ? "bg-yellow-200" : "bg-gray-100"}`}>Parcial</button>
      </div>

      {status === "pago" && (
        <select value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value)} className="w-full p-2 border rounded">
          <option value="">Forma de pagamento</option>
          <option value="dinheiro">Dinheiro</option>
          <option value="cartao">Cartão</option>
          <option value="pix">Pix</option>
        </select>
      )}

      {status === "nao" && (
        <>
          <input type="date" value={dataReceber} onChange={(e) => setDataReceber(e.target.value)} className="w-full p-2 border rounded" />
          <select value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value)} className="w-full p-2 border rounded">
            <option value="">Forma futura</option>
            <option value="dinheiro">Dinheiro</option>
            <option value="cartao">Cartão</option>
            <option value="pix">Pix</option>
          </select>
        </>
      )}

      {status === "parcial" && (
        <>
          <input type="number" placeholder="Valor pago" value={valorParcial} onChange={(e) => setValorParcial(e.target.value)} className="w-full p-2 border rounded" />
          <input type="number" placeholder="Falta receber" value={faltaReceber} onChange={(e) => setFaltaReceber(e.target.value)} className="w-full p-2 border rounded" />
          <input type="date" value={dataReceber} onChange={(e) => setDataReceber(e.target.value)} className="w-full p-2 border rounded" />
        </>
      )}

      <button onClick={salvarVenda} className="w-full bg-rose-400 hover:bg-rose-500 text-white p-2 rounded">
        Cadastrar Venda
      </button>
    </div>
  );
}

function Dashboard() {
  const [vendas, setVendas] = useState([]);
  const [mesFiltro, setMesFiltro] = useState("");

  useEffect(() => {
    async function carregar() {
      const snap = await getDocs(collection(db, "vendas"));
      setVendas(snap.docs.map((doc) => doc.data()));
    }
    carregar();
  }, []);

  const hoje = new Date().toISOString().split("T")[0];
  const vendasHoje = vendas.filter((v) => v.data === hoje);
  const totalHoje = vendasHoje.reduce((acc, v) => acc + Number(v.valor || 0), 0);
  const aReceber = vendas.filter((v) => v.status !== "pago").reduce((acc, v) => acc + Number(v.faltaReceber || v.valor), 0);

  const filtradas = mesFiltro
    ? vendas.filter((v) => (v.dataReceber || "").includes(`-${mesFiltro}-`))
    : [];

  return (
    <div className="bg-white p-4 rounded-2xl shadow space-y-2">
      <p><strong>Vendas Hoje:</strong> {vendasHoje.length}</p>
      <p><strong>Total:</strong> R$ {totalHoje.toFixed(2)}</p>
      <p><strong>A receber:</strong> R$ {aReceber.toFixed(2)}</p>

      <select onChange={(e) => setMesFiltro(e.target.value)} className="w-full p-2 border rounded mt-4">
        <option value="">Filtrar mês</option>
        {Array.from({ length: 12 }, (_, i) => {
          const m = String(i + 1).padStart(2, "0");
          return <option key={m} value={m}>{m}</option>;
        })}
      </select>

      <ul className="mt-2 space-y-1">
        {filtradas.map((v, i) => (
          <li key={i} className="text-sm">{v.dataReceber} - {v.cliente} ({v.local}) - R$ {v.faltaReceber || v.valor}</li>
        ))}
      </ul>
    </div>
  );
}

function Cobranca() {
  const [vendas, setVendas] = useState([]);
  const [mesFiltro, setMesFiltro] = useState("");

  useEffect(() => {
    async function carregar() {
      const snap = await getDocs(collection(db, "vendas"));
      setVendas(snap.docs.map((doc) => doc.data()));
    }
    carregar();
  }, []);

  const hoje = new Date().toISOString().split("T")[0];
  const cobrarHoje = vendas.filter((v) => v.dataReceber === hoje);
  const cobrarMes = mesFiltro
    ? vendas.filter((v) => (v.dataReceber || "").includes(`-${mesFiltro}-`))
    : [];

  return (
    <div className="bg-white p-4 rounded-2xl shadow space-y-2">
      <h2 className="font-semibold">Cobrar Hoje</h2>
      {cobrarHoje.map((v, i) => (
        <p key={i} className="text-sm">{v.cliente} - {v.local} - R$ {v.faltaReceber || v.valor}</p>
      ))}

      <select onChange={(e) => setMesFiltro(e.target.value)} className="w-full p-2 border rounded mt-4">
        <option value="">Filtrar mês</option>
        {Array.from({ length: 12 }, (_, i) => {
          const m = String(i + 1).padStart(2, "0");
          return <option key={m} value={m}>{m}</option>;
        })}
      </select>

      {cobrarMes.map((v, i) => (
        <p key={i} className="text-sm">{v.dataReceber} - {v.cliente} - {v.local} - R$ {v.faltaReceber || v.valor}</p>
      ))}
    </div>
  );
}
