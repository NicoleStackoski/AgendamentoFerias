
const usuario =
  localStorage.getItem("usuarioLogado") ||
  localStorage.getItem("usuario") ||
  localStorage.getItem("nome");

const tipo = localStorage.getItem("tipoUsuario");

if (!usuario) {
  alert("Você precisa fazer login.");
  window.location.href = "login.html";
}


document.getElementById("nomeUsuario").textContent = usuario;


const btnLiberarPortal = document.getElementById("btnLiberarPortal");
if (tipo === "master") {
  btnLiberarPortal.style.display = "block";
} else {
  btnLiberarPortal.style.display = "none";
  document.getElementById("btnLiberar").disabled = true;
}


async function carregarUsuarios() {
  const select = document.getElementById("selectUsuarios");
  select.innerHTML = `<option value="">Selecione um usuário</option>`;

  try {
    const res = await fetch("http://localhost:3000/liberar/usuarios");
    const lista = await res.json();

    lista
     
      .sort((a, b) => a.login.localeCompare(b.login))
      .forEach(u => {
        const opt = document.createElement("option");
        opt.value = u.login;
        opt.textContent = u.login;
        select.appendChild(opt);
      });

  } catch (err) {
    console.error("Erro usuários:", err);
  }
}


document.getElementById("btnLiberar").addEventListener("click", async () => {
  if (tipo !== "master") {
    alert("Apenas MASTER pode liberar usuários.");
    return;
  }

  const usuarioSel = document.getElementById("selectUsuarios").value;
  if (!usuarioSel) {
    alert("Selecione um usuário.");
    return;
  }

  await fetch("http://localhost:3000/liberar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario: usuarioSel })
  });

  carregarLiberados();
});


async function carregarLiberados() {
  const tbody = document.getElementById("listaLiberados");
  tbody.innerHTML = "";

  try {
    const res = await fetch("http://localhost:3000/liberar");
    const lista = await res.json();

    lista.forEach(item => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${item.usuario}</td>
        <td>
          <button class="btn-excluir" data-user="${item.usuario}">
            🗑
          </button>
        </td>
      `;

      tbody.appendChild(tr);
    });

    document.querySelectorAll(".btn-excluir").forEach(btn => {
      btn.onclick = async () => {
        if (tipo !== "master") return;

        const user = btn.dataset.user;
        await fetch(`http://localhost:3000/liberar/${user}`, {
          method: "DELETE"
        });

        carregarLiberados();
      };
    });

  } catch (err) {
    console.error("Erro liberados:", err);
  }
}

carregarUsuarios();
carregarLiberados();
