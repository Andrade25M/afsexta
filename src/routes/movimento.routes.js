import { Router } from "express";
import {
	criarMovimento,
	listarMovimentos,
	obterMovimento,
	atualizarMovimento,
	deletarMovimento,
	obterSaldo,
} from "../controllers/movimento.controller.js";

const router = Router();

router.post("/", criarMovimento);
router.get("/", listarMovimentos);
router.get("/saldo", obterSaldo);
router.get("/:id", obterMovimento);
router.put("/:id", atualizarMovimento);
router.delete("/:id", deletarMovimento);

export default router;
