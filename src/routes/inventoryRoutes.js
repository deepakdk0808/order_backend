import express from "express";
import {
  createItem,
  getAllInventory,
  getItemById,
  updateItem,
  deleteItem,
} from "../controllers/inventoryController.js";

import { authenticate, authorizeRoles } from "../middlewares/middleware.js";

const router = express.Router();

// Admin only: Create item
router.post("/", authenticate, authorizeRoles("admin"), createItem);

// Admin only: Update item by ID
router.put("/:id", authenticate, authorizeRoles("admin"), updateItem);

// Admin only: Delete item by ID
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteItem);

// Public: Get all items
router.get("/", getAllInventory);

// Public: Get item by ID
router.get("/:id", authenticate, getItemById);


export default router;
