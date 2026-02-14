const User = require("../models/User");
const bcrypt = require("bcryptjs");

class AuthController {

  async login(req, res) {
    const { login, senha } = req.body;

    try {
      const user = await User.findByLogin(login);

      if (!user) {
        return res.status(401).json({ message: "Usuário não existe" });
      }

      if (!user.senha || user.senha.trim() === "") {
        return res.status(401).json({
          firstAccess: true,
          message: "Primeiro acesso. Crie sua senha."
        });
      }

      const match = await bcrypt.compare(senha, user.senha);

      if (!match) {
        return res.status(401).json({ message: "Senha incorreta" });
      }

      return res.status(200).json({
  message: "Login OK",
  nome: user.nome,
  tipo: user.tipo,
  cargo: user.cargo
});

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro interno no servidor" });
    }
  }

  async setPassword(req, res) {
    const { login, senha } = req.body;

    try {
      const hash = await bcrypt.hash(senha, 10);

      await User.update(login, { senha: hash });

      return res.json({ message: "Senha cadastrada com sucesso!" });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao cadastrar senha" });
    }
  }
}

module.exports = new AuthController();
