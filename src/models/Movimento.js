import mongoose from "mongoose";

const MovimentoSchema = new mongoose.Schema({
  tipo: { type: String, enum: ["receita", "despesa"], required: true },
  categoria: { type: String, required: true },
  descricao: { type: String, required: true },
  valor: { type: Number, required: true },
  data: { type: Date, default: Date.now }
});

export default mongoose.model("Movimento", MovimentoSchema);
