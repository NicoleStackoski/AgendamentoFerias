const {
  readFeriasGerenciais,
  writeFeriasGerenciais
} = require("../database/jsonDB");

const { v4: uuid } = require("uuid");

//Listar
function listarFeriasGerenciais(req, res) {
  try {
    const dados = readFeriasGerenciais();
    res.json(dados);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao listar férias gerenciais" });
  }
}

//Criar
function criarFeriasGerenciais(req, res) {
  try {
    const {
      gerente,
      dataInicio,
      dataFim,
      filial = [],
      canal = [],
      marca = [],
      cobertura = [],
      observacao = ""
    } = req.body;

    if (!gerente || !dataInicio || !dataFim) {
      return res.status(400).json({
        error: "Gerente e período são obrigatórios"
      });
    }

    const dados = readFeriasGerenciais();

    const novoRegistro = {
      id: uuid(),
      gerente,
      dataInicio,
      dataFim,
      filial: Array.isArray(filial) ? filial : [filial],
      canal: Array.isArray(canal) ? canal : [canal],
      marca: Array.isArray(marca) ? marca : [marca],
      cobertura: Array.isArray(cobertura) ? cobertura : [cobertura],
      observacao
    };

    dados.push(novoRegistro);
    writeFeriasGerenciais(dados);

    res.status(201).json(novoRegistro);
  } catch (err) {
    console.error("ERRO AO SALVAR FÉRIAS GERENCIAIS:", err);
    res.status(500).json({ error: "Erro ao salvar férias gerenciais" });
  }
}

//Excluir

function excluirFeriasGerenciais(req, res) {
  try {
    const { id } = req.params;

    let dados = readFeriasGerenciais();
    dados = dados.filter(item => item.id !== id);

    writeFeriasGerenciais(dados);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao excluir férias gerenciais" });
  }
}

module.exports = {
  listarFeriasGerenciais,
  criarFeriasGerenciais,
  excluirFeriasGerenciais
};
