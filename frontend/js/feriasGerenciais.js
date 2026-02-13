const API = "http://localhost:3000/ferias-gerenciais";

const usuarioLogado =
  localStorage.getItem("usuarioLogado") ||
  localStorage.getItem("usuario") ||
  localStorage.getItem("nome");

const tipoUsuario = localStorage.getItem("tipoUsuario");

if (!usuarioLogado) {
  alert("Você precisa fazer login primeiro!");
  window.location.href = "index.html";
}

const nomeSpan = document.getElementById("nomeUsuario");
if (nomeSpan) nomeSpan.textContent = usuarioLogado;

const btnLiberarPortal = document.getElementById("btnLiberarPortal");
if (btnLiberarPortal && tipoUsuario === "master") {
  btnLiberarPortal.style.display = "block";
  btnLiberarPortal.onclick = () =>
    window.location.href = "liberar-portal.html";
}


const meses = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
];

const mes = document.getElementById("mes");
const ano = document.getElementById("ano");
const calendar = document.getElementById("calendar");
const tabela = document.getElementById("tabela");
const filtroMes = document.getElementById("filtroMes");
const filtroAno = document.getElementById("filtroAno");
const gerente = document.getElementById("gerente");
const observacao = document.getElementById("observacao");
const btnSalvar = document.getElementById("salvar");


let inicio = null;
let fim = null;

let dropdownValues = {
  filial: [],
  canal: [],
  marca: [],
  cobertura: []
};

document.addEventListener("DOMContentLoaded", () => {
  initSelects();
  initDropdowns();
  carregarTabela();
});

function initSelects() {
  mes.innerHTML = `<option value="">mês</option>`;
  filtroMes.innerHTML = `<option value="">mês</option>`;

  meses.forEach((m, i) => {
    mes.innerHTML += `<option value="${i}">${m}</option>`;
    filtroMes.innerHTML += `<option value="${i}">${m}</option>`;
  });

  const anoAtual = new Date().getFullYear();
  ano.innerHTML = `<option value="">ano</option>`;
  filtroAno.innerHTML = `<option value="">ano</option>`;

  for (let a = anoAtual - 1; a <= anoAtual + 2; a++) {
    ano.innerHTML += `<option value="${a}">${a}</option>`;
    filtroAno.innerHTML += `<option value="${a}">${a}</option>`;
  }

  mes.onchange = resetCalendar;
  ano.onchange = resetCalendar;
  filtroMes.onchange = carregarTabela;
  filtroAno.onchange = carregarTabela;
}


function resetCalendar() {
  inicio = null;
  fim = null;
  renderCalendar();
}

function renderCalendar() {
  if (!mes.value || !ano.value) {
    calendar.innerHTML = "";
    return;
  }

  calendar.innerHTML = "";
  const total = new Date(ano.value, Number(mes.value) + 1, 0).getDate();

  for (let d = 1; d <= total; d++) {
    const div = document.createElement("div");
    div.className = "day";
    div.textContent = d;

    const data = formatDate(d);

    if (data === inicio || data === fim) div.classList.add("selected");
    if (inicio && fim && data > inicio && data < fim)
      div.classList.add("range");

    div.onclick = () => selecionarDia(data);
    calendar.appendChild(div);
  }
}

function selecionarDia(data) {
  if (!inicio) {
    inicio = data;
    fim = null;
  } else if (!fim) {
    fim = data < inicio ? inicio : data;
    inicio = data < inicio ? data : inicio;
  } else {
    inicio = data;
    fim = null;
  }
  renderCalendar();
}

function formatDate(d) {
  return `${ano.value}-${String(+mes.value + 1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
}


function initDropdowns() {
  document.querySelectorAll(".dropdown").forEach(drop => {
    const btn = drop.querySelector(".dropdown-btn");
    if (!btn.dataset.label) btn.dataset.label = btn.textContent.trim();

    btn.onclick = e => {
      e.stopPropagation();
      fecharDropdowns();
      drop.querySelector(".dropdown-options").style.display = "block";
    };

    drop.querySelectorAll("input").forEach(input => {
      input.onchange = () => {
        dropdownValues[drop.dataset.name] =
          [...drop.querySelectorAll("input:checked")].map(i => i.value);

        btn.textContent =
          dropdownValues[drop.dataset.name].length
            ? dropdownValues[drop.dataset.name].join(", ")
            : btn.dataset.label;
      };
    });
  });

  document.onclick = fecharDropdowns;
}

function fecharDropdowns() {
  document.querySelectorAll(".dropdown-options")
    .forEach(d => d.style.display = "none");
}


btnSalvar.onclick = async () => {
  if (!gerente.value || !inicio || !fim) {
    alert("Preencha todos os campos");
    return;
  }

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      gerente: gerente.value,
      dataInicio: inicio,
      dataFim: fim,
      ...dropdownValues,
      observacao: observacao.value
    })
  });

  alert("Férias salvas!");
  resetCalendar();
  observacao.value = "";
  carregarTabela();
};


async function carregarTabela() {
  const res = await fetch(API);
  let dados = await res.json();

  const mesSelecionado = filtroMes.value;
  const anoSelecionado = filtroAno.value;

  if (mesSelecionado !== "" || anoSelecionado !== "") {
    dados = dados.filter(d => {
      const [y, m] = d.dataInicio.split("-");
      return (
        (mesSelecionado === "" || Number(m) - 1 === Number(mesSelecionado)) &&
        (anoSelecionado === "" || y === anoSelecionado)
      );
    });
  }

  tabela.innerHTML = "";

  dados.forEach(d => {
    tabela.innerHTML += `
      <tr>
        <td>${d.gerente}</td>
        <td>${formatar(d.dataInicio)}</td>
        <td>${formatar(d.dataFim)}</td>
        <td>${(d.filial || []).join(", ")}</td>
        <td>${(d.marca || []).join(", ")}</td>
        <td>${(d.canal || []).join(", ")}</td>
        <td>${(d.cobertura || []).join(", ")}</td>
        <td>${d.observacao || ""}</td>
        <td>
          <button class="btn-trash" data-id="${d.id}">🗑</button>
        </td>
      </tr>
    `;
  });
}


document.addEventListener("click", async e => {
  if (!e.target.classList.contains("btn-trash")) return;

  const id = e.target.dataset.id;
  if (!id) return alert("ID não encontrado.");

  if (!confirm("Deseja excluir este registro?")) return;

  const res = await fetch(`${API}/${id}`, { method: "DELETE" });

  if (!res.ok) {
    alert("Erro ao excluir");
    return;
  }

  carregarTabela();
});


function formatar(data) {
  if (!data) return "";
  const [y,m,d] = data.split("-");
  return `${d}/${m}/${y}`;
}
