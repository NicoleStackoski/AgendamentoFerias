const fs = require("fs");
const path = require("path");

// Caminhos
const usersPath = path.join(__dirname, "..", "data", "users.json");
const feriasPath = path.join(__dirname, "..", "data", "ferias.json");
const liberadosPath = path.join(__dirname, "..", "data", "liberados.json");
const notificacoesPath = path.join(__dirname, "..", "data", "notificacoes.json");
const feriasGerenciaisPath = path.join(__dirname, "..", "data", "feriasGerenciais.json");

// Garantir arquivos
function ensureFile(file) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, "[]");
  }
}

// Users
function readUsers() {
  ensureFile(usersPath);
  return JSON.parse(fs.readFileSync(usersPath, "utf8"));
}

function writeUsers(data) {
  fs.writeFileSync(usersPath, JSON.stringify(data, null, 2));
}

// Férias colaborador
function readFerias() {
  ensureFile(feriasPath);
  return JSON.parse(fs.readFileSync(feriasPath, "utf8"));
}

function writeFerias(data) {
  fs.writeFileSync(feriasPath, JSON.stringify(data, null, 2));
}

// Liberados
function readLiberados() {
  ensureFile(liberadosPath);
  return JSON.parse(fs.readFileSync(liberadosPath, "utf8"));
}

function writeLiberados(data) {
  fs.writeFileSync(liberadosPath, JSON.stringify(data, null, 2));
}

//Notificações
function readNotificacoes() {
  ensureFile(notificacoesPath);
  return JSON.parse(fs.readFileSync(notificacoesPath, "utf8"));
}

function writeNotificacoes(data) {
  fs.writeFileSync(notificacoesPath, JSON.stringify(data, null, 2));
}

// Férias gerenciais
function readFeriasGerenciais() {
  ensureFile(feriasGerenciaisPath);
  return JSON.parse(fs.readFileSync(feriasGerenciaisPath, "utf8"));
}

function writeFeriasGerenciais(data) {
  fs.writeFileSync(
    feriasGerenciaisPath,
    JSON.stringify(data, null, 2)
  );
}

// Export
module.exports = {
  readUsers,
  writeUsers,
  readFerias,
  writeFerias,
  readLiberados,
  writeLiberados,
  readNotificacoes,
  writeNotificacoes,
  readFeriasGerenciais,
  writeFeriasGerenciais
};
