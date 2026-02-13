const BASE_URL = "https://agendamentoferias.onrender.com"; // URL pública do Render

document.getElementById("btnEntrar").addEventListener("click", async () => {
  const login = document.getElementById("login").value.trim();
  const senha = document.getElementById("senha").value.trim();

  if (!login) {
    alert("Informe seu login");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, senha })
    });

    const data = await res.json();

    if (res.status === 401 && data.firstAccess === true) {
      const novaSenha = prompt("Primeiro acesso! Cadastre uma senha:");

      if (!novaSenha) return;

      await fetch(`${BASE_URL}/auth/set-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, senha: novaSenha })
      });

      alert("Senha cadastrada! Agora faça login novamente.");
      return;
    }

    if (res.status === 200) {
      localStorage.setItem("usuarioLogado", data.login || login);
      localStorage.setItem("tipoUsuario", data.tipo);
      localStorage.setItem("cargoUsuario", data.cargo || "adm");

      window.location.href = "colaborador.html";
      return;
    }

    alert(data.message || "Erro no login");

  } catch (error) {
    console.error(error);
    alert("Erro de conexão com o servidor");
  }
});
