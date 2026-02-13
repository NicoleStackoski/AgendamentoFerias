const User = require("../models/User");
const bcrypt = require("bcryptjs");

class AuthController {
  async login(req, res) {
    const { login, senha } = req.body;

    const user = User.findByLogin(login);

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
      login: user.login,
      tipo: user.tipo,
      cargo: user.cargo
    });
  }

  async setPassword(req, res) {
    const { login, senha } = req.body;

    const hash = await bcrypt.hash(senha, 10);
    User.update(login, { senha: hash });

    return res.json({ message: "Senha cadastrada com sucesso!" });
  }
}

module.exports = new AuthController();
