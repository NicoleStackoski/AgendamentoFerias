const express = require("express");
const cors = require("cors");

const app = express();

//MIDDLEWARES

app.use(cors());
app.use(express.json());

// Rotas
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const feriasRoutes = require("./routes/feriasRoutes");
const liberarPortalRoutes = require("./routes/liberarPortal");
const feriasGerenciaisRoutes = require("./routes/feriasGerenciaisRoutes");

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/ferias", feriasRoutes);
app.use("/liberar", liberarPortalRoutes);
app.use("/ferias-gerenciais", feriasGerenciaisRoutes);

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
