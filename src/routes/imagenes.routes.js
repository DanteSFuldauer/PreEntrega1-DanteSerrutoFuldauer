import express from "express";
import path from "path";
import { __dirname } from "../path.js";

const router = express.Router();

// Ruta para servir imágenes estáticas
router.get("/:imageName", (req, res) => {
  const imagePath = path.join(__dirname, "../public", req.params.imageName);
  res.sendFile(imagePath);
});

export default router;
