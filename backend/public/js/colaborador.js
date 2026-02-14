let dataInicio = null;
let dataFim = null;
let mesAtual = null;
let anoAtual = null;
let selecionados = [];

const usuarioLogado =
  localStorage.getItem("usuarioLogado") ||
  localStorage.getItem("usuario") ||
  localStorage.getItem("nome");

const tipoUsuario = localStorage.getItem("tipoUsuario");
const cargoUsuario = localStorage.getItem("cargoUsuario") || "adm";

if (!usuarioLogado) {
  alert("Você precisa fazer login primeiro!");
  window.location.href = "index.html";
}

document.querySelector(".user-label").textContent = `Olá, ${usuarioLogado}`;

const meses = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
];

const mesSelect = document.getElementById("mesSelect");
const anoSelect = document.getElementById("anoSelect");
const coberturaBox = document.getElementById("coberturaBox");
const coberturaLabel = document.getElementById("coberturaLabel");
const coberturaOptions = document.getElementById("coberturaOptions");
const btnLiberarPortal = document.getElementById("btnLiberarPortal");

if (tipoUsuario === "master" && btnLiberarPortal) {
  btnLiberarPortal.style.display = "block";
  btnLiberarPortal.onclick = () =>
    window.location.href = "liberar-portal.html";
}

// 🔹 Carrega usuários para cobertura
async function carregarUsuarios() {
  const res = await fetch("/users");
  const lista = await res.json();

  coberturaOptions.innerHTML = "";

  lista.forEach(u => {
    if (u.nome !== usuarioLogado) {
      const opt = document.createElement("div");
      opt.textContent = u.nome;
      opt.dataset.value = u.nome;
      opt.onclick = () => selecionarCobertura(opt);
      coberturaOptions.appendChild(opt);
    }
  });
}

carregarUsuarios();

function selecionarCobertura(elem) {
  const nome = elem.dataset.value;

  if (selecionados.includes(nome)) {
    selecionados = selecionados.filter(n => n !== nome);
    elem.classList.remove("selected");
  } else {
    if (selecionados.length === 2) {
      alert("Você só pode selecionar até 2 pessoas.");
      return;
    }
    selecionados.push(nome);
    elem.classList.add("selected");
  }

  coberturaLabel.textContent =
    selecionados.length === 0
      ? "Selecione quem vai cobrir"
      : selecionados.join(", ");
}

coberturaBox.onclick = e => {
  e.stopPropagation();
  coberturaBox.classList.toggle("open");
};

document.onclick = () => coberturaBox.classList.remove("open");

// 🔹 Popula selects
meses.forEach((m, i) =>
  mesSelect.innerHTML += `<option value="${i}">${m}</option>`
);

for (let ano = 2024; ano <= 2035; ano++)
  anoSelect.innerHTML += `<option value="${ano}">${ano}</option>`;

mesSelect.onchange = gerarCalendario;
anoSelect.onchange = gerarCalendario;

function gerarCalendario() {
  if (!mesSelect.value || !anoSelect.value) return;

  mesAtual = +mesSelect.value;
  anoAtual = +anoSelect.value;

  const primeiroDia = new Date(anoAtual, mesAtual, 1).getDay();
  const totalDias = new Date(anoAtual, mesAtual + 1, 0).getDate();

  const tbody = document.getElementById("calendarBody");
  tbody.innerHTML = "";

  let linha = document.createElement("tr");

  for (let i = 0; i < primeiroDia; i++)
    linha.appendChild(document.createElement("td"));

  for (let dia = 1; dia <= totalDias; dia++) {
    if (linha.children.length === 7) {
      tbody.appendChild(linha);
      linha = document.createElement("tr");
    }

    const td = document.createElement("td");
    td.textContent = dia.toString().padStart(2, "0");
    td.onclick = () => selecionarDia(td);
    linha.appendChild(td);
  }

  tbody.appendChild(linha);
  marcarUltimaSemana();
}

function marcarUltimaSemana() {
  const linhas = document.querySelectorAll("#calendarBody tr");
  linhas[linhas.length - 1]
    .querySelectorAll("td")
    .forEach(td => td.textContent && td.classList.add("ultima-semana"));
}

function selecionarDia(td) {
  const dia = parseInt(td.textContent);
  if (!dia) return;

  const data = new Date(anoAtual, mesAtual, dia);

  if (!dataInicio) {
    dataInicio = data;
    td.classList.add("selecionado");
    return;
  }

  if (!dataFim) {
    if (data < dataInicio) return alert("Data final inválida.");
    dataFim = data;
    marcarIntervalo();
    return;
  }

  limparSelecao();
  dataInicio = data;
  td.classList.add("selecionado");
}

function marcarIntervalo() {
  document.querySelectorAll("#calendarBody td").forEach(td => {
    const dia = parseInt(td.textContent);
    if (!dia) return;

    const d = new Date(anoAtual, mesAtual, dia);
    if (d >= dataInicio && d <= dataFim)
      td.classList.add("selecionado");
  });
}

function limparSelecao() {
  dataInicio = null;
  dataFim = null;
  document.querySelectorAll(".selecionado")
    .forEach(td => td.classList.remove("selecionado"));
}

// 🔹 Salvar férias
document.getElementById("btnSalvar").onclick = async () => {
  if (!dataInicio || !dataFim)
    return alert("Selecione o período.");

  await fetch("/ferias", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      login: usuarioLogado,
      cargo: cargoUsuario,
      inicio: dataInicio.toISOString().split("T")[0],
      fim: dataFim.toISOString().split("T")[0],
      cobertura: selecionados,
      observacao: document.getElementById("observacao").value
    })
  });

  alert("Férias cadastradas!");
  limparSelecao();
  window.location.href = "painel-ferias.html";
};

// 🔹 Botão painel
document.getElementById("btnVerPainel").onclick = () =>
  window.location.href = "painel-ferias.html";
