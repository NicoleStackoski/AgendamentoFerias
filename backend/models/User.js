const { readUsers, writeUsers } = require("../database/jsonDB");

class User {
  static findByLogin(login) {
    const users = readUsers();
    return users.find(u => u.login === login);
  }

  static getAll() {
    return readUsers();
  }

  static create(data) {
    const users = readUsers();
    users.push(data);
    writeUsers(users);
  }

  static update(login, newData) {
    const users = readUsers();
    const index = users.findIndex(u => u.login === login);
    if (index !== -1) {
      users[index] = { ...users[index], ...newData };
      writeUsers(users);
    }
  }
}

module.exports = User;
