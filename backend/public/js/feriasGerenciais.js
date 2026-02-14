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

const meses = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
];

const mes = document.getElementById("mes");
const ano = document.getElementById("ano");
const filtroMes = document.getElementById("filtroMes");
const filtroAno = document.getElementById("filtroAno");
const calendar = document.getElementById("calendar");
const tabela = document.getElementById("tabela");
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

/* -------------------- SELECTS -------------------- */

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

/* -------------------- CALENDÁRIO -------------------- */

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

    if (data === inicio || data === fim)
      div.classList.add("selected");

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
    if (data < inicio) {
      fim = inicio;
      inicio = data;
    } else {
      fim = data;
    }
  } else {
    inicio = data;
    fim = null;
  }

  renderCalendar();
}

function formatDate(dia) {
  return `${ano.value}-${String(+mes.value + 1).padStart(2,"0")}-${String(dia).padStart(2,"0")}`;
}

/* -------------------- DROPDOWNS -------------------- */

function initDropdowns() {
  document.querySelectorAll(".dropdown").forEach(drop => {
    const btn = drop.querySelector(".dropdown-btn");
    const options = drop.querySelector(".dropdown-options");

    if (!btn || !options) return;

    btn.dataset.label = btn.textContent.trim();

    btn.onclick = e => {
      e.stopPropagation();
      fecharDropdowns();
      options.style.display = "block";
    };

    options.querySelectorAll("input").forEach(input => {
      input.onchange = () => {
        const selecionados = [
          ...options.querySelectorAll("input:checked")
        ].map(i => i.value);

        dropdownValues[drop.dataset.name] = selecionados;

        btn.textContent =
          selecionados.length > 0
            ? selecionados.join(", ")
            : btn.dataset.label;
      };
    });
  });

  document.addEventListener("click", fecharDropdowns);
}

function fecharDropdowns() {
  document.querySelectorAll(".dropdown-options")
    .forEach(d => d.style.display = "none");
}

/* -------------------- SALVAR -------------------- */

btnSalvar.onclick = async () => {
  if (!gerente.value || !inicio || !fim) {
    alert("Preencha todos os campos");
    return;
  }

  await fetch("/ferias-gerenciais", {
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

/* -------------------- TABELA -------------------- */

async function carregarTabela() {
  const res = await fetch("/ferias-gerenciais");
  let dados = await res.json();

  const mesSelecionado = filtroMes.value;
  const anoSelecionado = filtroAno.value;

  if (mesSelecionado !== "" || anoSelecionado !== "") {
    dados = dados.filter(d => {
      const [y, m] = d.data_inicio.split("-");
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
        <td>${d.nome_gerente}</td>
        <td>${formatarData(d.data_inicio)}</td>
        <td>${formatarData(d.data_fim)}</td>
        <td>${d.filial || ""}</td>
        <td>${d.marca || ""}</td>
        <td>${d.canal || ""}</td>
        <td>${d.cobertura || ""}</td>
        <td>${d.observacao || ""}</td>
        <td>
          <button class="btn-trash" data-id="${d.id}">🗑</button>
        </td>
      </tr>
    `;
  });
}

/* -------------------- EXCLUIR -------------------- */

document.addEventListener("click", async e => {
  if (!e.target.classList.contains("btn-trash")) return;

  const id = e.target.dataset.id;
  if (!confirm("Deseja excluir este registro?")) return;

  await fetch(`/ferias-gerenciais/${id}`, {
    method: "DELETE"
  });

  carregarTabela();
});

/* -------------------- FORMATAÇÃO -------------------- */

function formatarData(dataISO) {
  if (!dataISO) return "";

  const data = new Date(dataISO);

  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();

  return `${dia}/${mes}/${ano}`;
}
