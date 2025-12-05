import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import movimentoRoutes from "./routes/movimento.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

app.use("/movimentos", movimentoRoutes);

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("MONGO_URI não está definido em .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB conectado com sucesso!");
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  } catch (err) {
    console.error("Erro ao conectar MongoDB:", err);
    process.exit(1);
  }
}

startServer();
