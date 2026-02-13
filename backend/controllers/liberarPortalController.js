const fs = require("fs");
const path = require("path");

const usersPath = path.join(__dirname, "../data/users.json");
const liberadosPath = path.join(__dirname, "../data/liberados.json");

// ler arquivo json
function readJSON(filePath) {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

// escreve arquivo json
function writeJSON(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = {
    // Listar users
    getUsuarios(req, res) {
        try {
            const users = readJSON(usersPath);
            res.json(users);
        } catch (err) {
            res.status(500).json({ message: "Erro ao carregar usuários" });
        }
    },

    // Listar liberados
    getLiberados(req, res) {
        try {
            const liberados = readJSON(liberadosPath);
            res.json(liberados);
        } catch (err) {
            res.status(500).json({ message: "Erro ao carregar liberados" });
        }
    },

    // Liberar users
    liberarUsuario(req, res) {
        try {
            const { usuario } = req.body;
            if (!usuario) return res.status(400).json({ message: "Usuário é obrigatório" });

            let liberados = readJSON(liberadosPath);

            if (!liberados.includes(usuario)) {
                liberados.push(usuario);
                writeJSON(liberadosPath, liberados);
            }

            res.json({ message: "Usuário liberado", liberados });
        } catch {
            res.status(500).json({ message: "Erro ao liberar usuário" });
        }
    },

    // Remove
    removerLiberacao(req, res) {
        try {
            const { usuario } = req.params;
            let liberados = readJSON(liberadosPath);

            liberados = liberados.filter(u => u !== usuario);
            writeJSON(liberadosPath, liberados);

            res.json({ message: "Liberação removida", liberados });
        } catch {
            res.status(500).json({ message: "Erro ao remover liberação" });
        }
    }
};
