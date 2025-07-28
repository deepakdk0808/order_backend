import Inventory from "../models/inventory.js";

// POST /inventory — Admin only
export const createItem = async (req, res) => {
  try {
    const {
      productId,
      name,
      category,
      price,
      description,
      imageUrl,
      isAvailable,
    } = req.body;

    if (!productId || !name || !category || price == null) {
      return res.status(400).json({
        message: "Required fields: productId, name, category, price",
      });
    }

    const existing = await Inventory.findOne({ productId });
    if (existing) {
      return res.status(409).json({ message: "Product ID already exists" });
    }

    const item = await Inventory.create({
      productId,
      name,
      category,
      price,
      description,
      imageUrl,
      isAvailable,
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({
      message: "Error creating item",
      error: err.message,
    });
  }
};

// GET /inventory — Public
export const getAllInventory = async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching inventory",
      error: err.message,
    });
  }
};

// GET /inventory/:id — Public
export const getItemById = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching item",
      error: err.message,
    });
  }
};

// PUT /inventory/:id — Admin only
export const updateItem = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedItem = await Inventory.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({
      message: "Error updating item",
      error: err.message,
    });
  }
};

// DELETE /inventory/:id — Admin only
export const deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedItem = await Inventory.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting item",
      error: err.message,
    });
  }
};
