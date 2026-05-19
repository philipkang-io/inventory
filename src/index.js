const express = require("express");

const app = express();
app.use(express.json());

const inventoryBySku = new Map();
let itemCounter = 1;

function addItem({ sku, name, quantity }) {
  const id = `i${itemCounter++}`;
  const item = {
    id,
    sku,
    name,
    quantity: quantity || 0,
    available: (quantity || 0) > 0,
    updatedAt: new Date().toISOString(),
  };
  inventoryBySku.set(sku, item);
  return item;
}

app.post("/v1/inventory", (req, res) => {
  const { sku, name, quantity } = req.body || {};
  if (!sku || !name) {
    return res.status(400).json({ message: "sku and name are required" });
  }
  const item = addItem({ sku, name, quantity: quantity || 10 });
  return res.status(201).json(item);
});

app.get("/v1/inventory/:sku", (req, res) => {
  const item = inventoryBySku.get(req.params.sku);
  if (!item) {
    return res.status(404).json({ message: "inventory item not found" });
  }
  return res.json(item);
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "inventory" });
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`inventory listening on port ${port}`);
});
