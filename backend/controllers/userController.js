const User = require("../models/User");

class UserController {
  async listar(req, res) {
    const lista = User.getAll();
    return res.json(lista);
  }
}

module.exports = new UserController();
