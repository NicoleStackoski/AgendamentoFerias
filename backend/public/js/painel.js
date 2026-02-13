
const usuario =
  localStorage.getItem("usuarioLogado") ||
  localStorage.getItem("usuario") ||
  localStorage.getItem("nome");

const tipoUsuario = localStorage.getItem("tipoUsuario");

if (!usuario) {
  alert("Você precisa fazer login primeiro!");
  window.location.href = "index.html";
}

document.querySelector(".user-label").textContent = `Olá, ${usuario}`;

const btnLiberarPortal = document.getElementById("btnLiberarPortal");

if (tipoUsuario === "master" && btnLiberarPortal) {
  btnLiberarPortal.style.display = "block";
  btnLiberarPortal.onclick = () =>
    window.location.href = "liberar-portal.html";
}


document.getElementById("btnAgendar").onclick = () =>
  window.location.href = "colaborador.html";

document.getElementById("btnPainel").onclick = () =>
  window.location.href = "painel-ferias.html";


const meses = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
];

const mesFiltro = document.getElementById("mesFiltro");
const anoFiltro = document.getElementById("anoFiltro");

meses.forEach((m, i) => {
  mesFiltro.innerHTML += `<option value="${i}">${m}</option>`;
});

for (let a = 2024; a <= 2035; a++) {
  anoFiltro.innerHTML += `<option value="${a}">${a}</option>`;
}

let listaOriginal = [];

async function carregarFerias() {
  const res = await fetch("http://localhost:3000/ferias");
  listaOriginal = await res.json();
  aplicarFiltro();
}

function aplicarFiltro() {
  let lista = [...listaOriginal];

  if (mesFiltro.value !== "") {
    lista = lista.filter(f =>
      parseInt(f.inicio.split("-")[1]) === parseInt(mesFiltro.value) + 1
    );
  }

  if (anoFiltro.value !== "") {
    lista = lista.filter(f =>
      parseInt(f.inicio.split("-")[0]) === parseInt(anoFiltro.value)
    );
  }

  mostrarFerias(lista);
}

mesFiltro.onchange = aplicarFiltro;
anoFiltro.onchange = aplicarFiltro;

function mostrarFerias(lista) {
  const tbody = document.getElementById("tabelaCorpo");
  tbody.innerHTML = "";

  lista.forEach((item, index) => {
    const statusHTML =
      item.status === "rejeitada"
        ? `<span class="status-rejeitado" data-motivo="${item.motivoRejeicao}">
             ❌ Rejeitada
           </span>`
        : `<span class="status-pendente">⏳ Pendente</span>`;

    const podeExcluir = item.login === usuario;
    const cargoClasse = `cargo-${item.cargo || "adm"}`;

    tbody.innerHTML += `
      <tr>
        <td>#${index + 1}</td>
        <td>${formatarDataHora(item.dataSolicitacao)}</td>
        <td class="${cargoClasse}">${item.login}</td>
        <td>${formatar(item.inicio)}</td>
        <td>${formatar(item.fim)}</td>
        <td>${(item.cobertura || []).join(", ")}</td>
        <td>${item.observacao || ""}</td>
        <td>${statusHTML}</td>
        <td class="acoes-coluna">
          ${
            tipoUsuario === "master" && item.status !== "rejeitada"
              ? `<button class="btn-rejeitar" data-id="${item.id}">✏️</button>`
              : ""
          }
          ${
            podeExcluir
              ? `<button class="btn-excluir" data-id="${item.id}">
                   <img src="img/lixo.svg">
                 </button>`
              : ""
          }
        </td>
      </tr>
    `;
  });

  
  document.querySelectorAll(".status-rejeitado").forEach(el => {
    el.onclick = () => {
      document.getElementById("textoMotivo").textContent =
        el.dataset.motivo || "Motivo não informado.";
      document.getElementById("modalRejeicao").classList.remove("hidden");
    };
  });

  document.getElementById("btnFecharModal").onclick = () =>
    document.getElementById("modalRejeicao").classList.add("hidden");

  
  document.querySelectorAll(".btn-excluir").forEach(btn => {
    btn.onclick = async () => {
      if (!confirm("Excluir férias?")) return;

      await fetch(
        `http://localhost:3000/ferias/${btn.dataset.id}?usuario=${usuario}`,
        { method: "DELETE" }
      );

      carregarFerias();
    };
  });

  document.querySelectorAll(".btn-rejeitar").forEach(btn => {
    btn.onclick = async () => {
      const motivo = prompt("Motivo da rejeição:");
      if (!motivo) return;

      await fetch(
        `http://localhost:3000/ferias/rejeitar/${btn.dataset.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ motivo })
        }
      );

      carregarFerias();
    };
  });
}


function formatar(d) {
  if (!d) return "-";
  const [y, m, day] = d.split("-");
  return `${day}/${m}`;
}

function formatarDataHora(dataISO) {
  if (!dataISO) return "-";
  const d = new Date(dataISO);
  return (
    d.toLocaleDateString("pt-BR") +
    " " +
    d.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit"
    })
  );
}

carregarFerias();
