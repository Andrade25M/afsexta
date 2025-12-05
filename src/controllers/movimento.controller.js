import Movimento from "../models/Movimento.js";

export async function criarMovimento(req, res) {
  try {
    const { tipo, categoria, descricao, valor, data } = req.body;
    if (!tipo || !["receita", "despesa"].includes(tipo)) {
      return res.status(400).json({ error: "Tipo inválido. 'receita' ou 'despesa'" });
    }
    if (!categoria) return res.status(400).json({ error: "Categoria é obrigatória" });
    if (!descricao) return res.status(400).json({ error: "Descrição é obrigatória" });
    if (valor == null || isNaN(Number(valor))) return res.status(400).json({ error: "Valor inválido" });

    const mov = await Movimento.create({ tipo, categoria, descricao, valor, data });
    res.status(201).json(mov);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    console.error(error);
    res.status(500).json({ error: "Erro ao criar movimento" });
  }
}

export async function listarMovimentos(req, res) {
  try {
    const { tipo, categoria, startDate, endDate, page = 1, limit = 100 } = req.query;
    const query = {};
    if (tipo) query.tipo = tipo;
    if (categoria) query.categoria = categoria;
    if (startDate || endDate) {
      query.data = {};
      if (startDate) query.data.$gte = new Date(startDate);
      if (endDate) query.data.$lte = new Date(endDate);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const movs = await Movimento.find(query).sort({ data: -1 }).skip(skip).limit(Number(limit));
    res.json(movs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao listar movimentos" });
  }
}

export async function obterMovimento(req, res) {
  try {
    const { id } = req.params;
    const mov = await Movimento.findById(id);
    if (!mov) return res.status(404).json({ error: "Movimento não encontrado" });
    res.json(mov);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar movimento" });
  }
}

export async function atualizarMovimento(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const mov = await Movimento.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!mov) return res.status(404).json({ error: "Movimento não encontrado" });
    res.json(mov);
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Erro ao atualizar movimento" });
  }
}

export async function deletarMovimento(req, res) {
  try {
    const { id } = req.params;
    const mov = await Movimento.findByIdAndDelete(id);
    if (!mov) return res.status(404).json({ error: "Movimento não encontrado" });
    res.json({ message: "Movimento excluído com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao excluir movimento" });
  }
}

export async function obterSaldo(req, res) {
  try {
    const results = await Movimento.aggregate([
      {
        $group: {
          _id: "$tipo",
          total: { $sum: "$valor" },
        },
      },
    ]);

    let totalReceitas = 0;
    let totalDespesas = 0;
    results.forEach((r) => {
      if (r._id === "receita") totalReceitas = r.total;
      if (r._id === "despesa") totalDespesas = r.total;
    });

    res.json({ totalReceitas, totalDespesas, saldo: totalReceitas - totalDespesas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao calcular saldo" });
  }
}
