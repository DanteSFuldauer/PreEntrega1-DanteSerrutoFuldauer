import express from "express";
import path from "path";
import { __dirname } from "./path.js";
import productRouter from "./routes/productos.routes.js";
import cartRouter from "./routes/carritos.routes.js";
import imageRouter from "./routes/imagenes.routes.js";

export const createServer = () => {
  const app = express();

  // Middleware para parsear JSON
  app.use(express.json());

  // Ruta para servir archivos estáticos
  app.use(express.static(path.join(__dirname, "public")));

  // Rutas
  app.use("/api/products", productRouter);
  app.use("/api/carts", cartRouter);
  app.use("/api/images", imageRouter);

  return app;
};
