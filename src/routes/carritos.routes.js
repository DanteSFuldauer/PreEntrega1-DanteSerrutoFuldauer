import express from "express";
import fs from "fs/promises";
import path from "path";
import { __dirname } from "../path.js";

const router = express.Router();
const cartsFilePath = path.join(__dirname, "../db/carrito.json");

// Leer carritos desde el archivo
const readCarts = async () => {
  const data = await fs.readFile(cartsFilePath, "utf8");
  return JSON.parse(data);
};

// Escribir carritos al archivo
const writeCarts = async (carts) => {
  await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));
};

// Crear un nuevo carrito
router.post("/", async (req, res) => {
  const carts = await readCarts();
  const newCart = {
    id: String(Date.now()),
    products: []
  };

  carts.push(newCart);
  await writeCarts(carts);
  res.status(201).json(newCart);
});

// Listar productos de un carrito por ID
router.get("/:cid", async (req, res) => {
  const carts = await readCarts();
  const cart = carts.find((c) => c.id === req.params.cid);
  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ error: "Carrito no encontrado" });
  }
});

// Agregar producto a un carrito
router.post("/:cid/product/:pid", async (req, res) => {
  const carts = await readCarts();
  const cartIndex = carts.findIndex((c) => c.id === req.params.cid);
  if (cartIndex === -1) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  const productId = req.params.pid;
  const cart = carts[cartIndex];
  const productIndex = cart.products.findIndex((p) => p.id === productId);

  if (productIndex !== -1) {
    cart.products[productIndex].quantity += 1;
  } else {
    cart.products.push({ id: productId, quantity: 1 });
  }

  carts[cartIndex] = cart;
  await writeCarts(carts);
  res.status(201).json(cart);
});

export default router;
