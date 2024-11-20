import express from "express";
import fs from "fs/promises";
import path from "path";
import { __dirname } from "../path.js";

const router = express.Router();
const productsFilePath = path.join(__dirname, "../db/productos.json");

// Leer productos desde el archivo
const readProducts = async () => {
  const data = await fs.readFile(productsFilePath, "utf8");
  return JSON.parse(data);
};

// Escribir productos al archivo
const writeProducts = async (products) => {
  await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
};

// Obtener todos los productos
router.get("/", async (req, res) => {
  const products = await readProducts();
  const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
  res.json(products.slice(0, limit));
});

// Obtener producto por ID
router.get("/:pid", async (req, res) => {
  const products = await readProducts();
  const product = products.find((p) => p.id === req.params.pid);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

// Agregar un nuevo producto
router.post("/", async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnails = []
  } = req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ error: "Todos los campos son obligatorios, excepto thumbnails" });
  }

  const products = await readProducts();
  const newProduct = {
    id: String(Date.now()),
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
  };

  products.push(newProduct);
  await writeProducts(products);
  res.status(201).json(newProduct);
});

// Actualizar producto por ID
router.put("/:pid", async (req, res) => {
  const products = await readProducts();
  const productIndex = products.findIndex((p) => p.id === req.params.pid);
  if (productIndex === -1) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
  } = req.body;

  const updatedProduct = {
    ...products[productIndex],
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
  };

  products[productIndex] = updatedProduct;
  await writeProducts(products);
  res.json(updatedProduct);
});

// Eliminar producto por ID
router.delete("/:pid", async (req, res) => {
  const products = await readProducts();
  const updatedProducts = products.filter((p) => p.id !== req.params.pid);
  if (products.length === updatedProducts.length) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  await writeProducts(updatedProducts);
  res.status(204).end();
});

export default router;
