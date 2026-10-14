// Regras fixas das missas (0 = domingo, 3 = quarta, 5 = sexta, 6 = sábado)
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
  import { getFirestore, doc, onSnapshot, runTransaction } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyA9dfIj35sDVi-OZeT-m79x2mOFsrSm1D8",
    authDomain: "escala-acolitos-bc40d.firebaseapp.com",
    projectId: "escala-acolitos-bc40d",
    storageBucket: "escala-acolitos-bc40d.firebasestorage.app",
    messagingSenderId: "601240414706",
    appId: "1:601240414706:web:7cda8f1a1041335472236b"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

const horariosMissa = [
  { diaSemana: 3, hora: "19:00" },
  { diaSemana: 6, hora: "19:00" },
  { diaSemana: 0, hora: "08:00" },
  { diaSemana: 0, hora: "19:00" },
  { diaSemana: 5, hora: "19:00", apenasPrimeira: true }
];

// Gera todas as missas de um mês específico
function gerarMissasDoMes(ano, mes) {
  const missas = [];
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();

  for (let dia = 1; dia <= diasNoMes; dia++) {
    const data = new Date(ano, mes, dia);
    const diaSemana = data.getDay();

    for (const horario of horariosMissa) {
      if (horario.diaSemana !== diaSemana) continue;
      if (horario.apenasPrimeira && dia > 7) continue;

      const dataTexto = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
      missas.push({
        id: `${dataTexto}-${horario.hora}`,
        data: dataTexto,
        hora: horario.hora
      });
    }
  }

  return missas;
}

let ANO = new Date().getFullYear();
let MES = new Date().getMonth();

const nomesDias = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

function formatarData(dataTexto) {
  const [ano, mes, dia] = dataTexto.split("-");
  const data = new Date(ano, mes - 1, dia);
  return `${nomesDias[data.getDay()]}, ${dia}/${mes}`;
}

function mostrarHorarios() {
  const lista = document.getElementById("lista-horarios");
  const missas = gerarMissasDoMes(ANO, MES);

  for (const missa of missas) {
    const label = document.createElement("label");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = missa.id;

    label.append(checkbox, ` ${formatarData(missa.data)} às ${missa.hora}`);
    lista.appendChild(label);
  }
}

const LIMITE = 2;

function missaCheia(id) {
  return (escolhas[id] || []).length >= POR_MISSA;
}

function quantasEscolhas(nome) {
  let total = 0;
  for (const id in escolhas) {
    if (escolhas[id].includes(nome)) total++;
  }
  return total;
}

function jaEscolheu(id, nome) {
  return nome !== "" && (escolhas[id] || []).includes(nome);
}

function atualizarContador() {
  const nome = document.getElementById("nome").value;
  const bloqueado = quantasEscolhas(nome) >= LIMITE;
  const marcadas = document.querySelectorAll("#lista-horarios input:checked");
  document.getElementById("contador").textContent = marcadas.length;
    const aviso = document.getElementById("aviso");
  aviso.textContent = bloqueado
    ? `${nome} já escolheu os ${LIMITE} horários do mês.`
    : "";

  const todas = document.querySelectorAll("#lista-horarios input");
  for (const caixa of todas) {
    if (!caixa.checked) {
      caixa.disabled =
        bloqueado ||
        marcadas.length >= LIMITE ||
        missaCheia(caixa.value) ||
        jaEscolheu(caixa.value, nome);
    }
  }
}

document
  .getElementById("lista-horarios")
  .addEventListener("change", atualizarContador);
  const acolitos = [
  "Luiza Monteiro", "Ani Beatriz", "Lauanny", "Ana Beatriz", "Camila",
  "Davi", "Eduarda", "Gabriel", "Giovanna", "Isa", "Isabeli", "Bela",
  "Lavínia", "Luís", "Luna", "Maria", "Maria Veiga", "Myllena", "Otávio",
  "Pedro Claudino", "Pedro", "Yuri Sena", "Yuri Amorim", "Lucas", "Antonela"
];

function preencherNomes() {
  const select = document.getElementById("nome");
  const ordenados = [...acolitos].sort((a, b) => a.localeCompare(b, "pt-BR"));

  for (const nome of ordenados) {
    const opcao = document.createElement("option");
    opcao.value = nome;
    opcao.textContent = nome;
    select.appendChild(opcao);
  }
}

preencherNomes();
const POR_MISSA = 2;
let CHAVE = `escala-${ANO}-${MES}`;

// Formato: { "2026-11-04-19:00": ["Davi", "Luna"], ... }
let escolhas = {};

async function confirmarEscolha() {
  const nome = document.getElementById("nome").value;
  const marcadas = document.querySelectorAll("#lista-horarios input:checked");

  if (nome === "") {
    alert("Selecione seu nome.");
    return;
  }
  if (quantasEscolhas(nome) >= LIMITE) {
    alert(`${nome} já escolheu os ${LIMITE} horários do mês.`);
    return;
  }
  if (marcadas.length !== LIMITE) {
    alert(`Escolha exatamente ${LIMITE} horários.`);
    return;
  }
  for (const caixa of marcadas) {
    if (missaCheia(caixa.value) || jaEscolheu(caixa.value, nome)) {
      alert("Uma das missas escolhidas já está completa ou você já está nela. Atualize a página.");
      return;
    }
  }
    const ids = Array.from(marcadas, (caixa) => caixa.value);
  const ref = doc(db, "escalas", CHAVE);

  let resultado;
  try {
    resultado = await runTransaction(db, async (transacao) => {
      const snap = await transacao.get(ref);
      const atuais = snap.exists() ? snap.data().escolhas || {} : {};

      let total = 0;
      for (const id in atuais) {
        if (atuais[id].includes(nome)) total++;
      }
      if (total + ids.length > LIMITE) {
        return { ok: false, motivo: `${nome} já escolheu os ${LIMITE} horários do mês.` };
      }

      for (const id of ids) {
        const lista = atuais[id] || [];
        if (lista.length >= POR_MISSA) {
          return { ok: false, motivo: "Uma das missas escolhidas acabou de ficar completa. Escolha outra." };
        }
        if (lista.includes(nome)) {
          return { ok: false, motivo: "Você já está em uma das missas escolhidas." };
        }
        atuais[id] = [...lista, nome];
      }

      transacao.set(ref, { escolhas: atuais });
      return { ok: true };
    });
  } catch (erro) {
    console.error(erro);
    alert("Não foi possível salvar. Verifique a internet e tente de novo.");
    return;
  }

  if (!resultado.ok) {
    alert(resultado.motivo);
    return;
  }

  for (const caixa of marcadas) caixa.checked = false;
  document.getElementById("nome").value = "";
  atualizarContador();
}

function mostrarEscala() {
  const corpo = document.getElementById("tabela-escala");
  corpo.innerHTML = "";

  for (const missa of gerarMissasDoMes(ANO, MES)) {
    const nomes = escolhas[missa.id] || [];
    const faltam = POR_MISSA - nomes.length;

    const textoNomes = nomes.join(", ") || "—";
    const status = faltam > 0 ? ` (faltam ${faltam})` : "";

    const linha = document.createElement("tr");
    let situacao = "completa";
    if (faltam === 1) situacao = "parcial";
    if (faltam >= 2) situacao = "vazia";
    linha.classList.add(situacao);
    linha.innerHTML = `
      <td>${formatarData(missa.data)}</td>
      <td>${missa.hora}</td>
      <td>${textoNomes}${status}</td>`;
    corpo.appendChild(linha);
  }
}

document.getElementById("btn-confirmar").addEventListener("click", confirmarEscolha);
document.getElementById("nome").addEventListener("change", () => {
  const todas = document.querySelectorAll("#lista-horarios input");
  for (const caixa of todas) caixa.checked = false;
  atualizarContador();
});
const nomesMeses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

let cancelarEscuta = null;

function carregarMes() {
  CHAVE = `${ANO}-${String(MES + 1).padStart(2, "0")}`;

  if (cancelarEscuta) cancelarEscuta();

  document.getElementById("lista-horarios").innerHTML = "";
  mostrarHorarios();

  cancelarEscuta = onSnapshot(doc(db, "escalas", CHAVE), (snap) => {
    escolhas = snap.exists() ? snap.data().escolhas || {} : {};
    mostrarEscala();
    atualizarContador();
  });
}

function preencherSeletorMes() {
  const selectMes = document.getElementById("select-mes");
  const selectAno = document.getElementById("select-ano");

  nomesMeses.forEach((nome, indice) => {
    const opcao = document.createElement("option");
    opcao.value = indice;
    opcao.textContent = nome;
    selectMes.appendChild(opcao);
  });

  const anoAtual = new Date().getFullYear();
  for (let ano = anoAtual - 1; ano <= anoAtual + 2; ano++) {
    const opcao = document.createElement("option");
    opcao.value = ano;
    opcao.textContent = ano;
    selectAno.appendChild(opcao);
  }

  selectMes.value = MES;
  selectAno.value = ANO;

  const trocarMes = () => {
    MES = Number(selectMes.value);
    ANO = Number(selectAno.value);
    document.getElementById("nome").value = "";
    carregarMes();
  };

  selectMes.addEventListener("change", trocarMes);
  selectAno.addEventListener("change", trocarMes);
}

preencherSeletorMes();
carregarMes();