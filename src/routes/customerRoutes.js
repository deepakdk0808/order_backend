import express from "express";
import {
  getAllCustomers,
  getMyProfile,
  updateMyProfile,
  deleteMyProfile,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController.js";
import { authenticate, authorizeRoles } from "../middlewares/middleware.js";

const router = express.Router();

// Admin can view all customers
router.get("/", authenticate, authorizeRoles("admin"), getAllCustomers);

// Self-access routes
router.get("/me", authenticate, getMyProfile);
router.put("/me", authenticate, updateMyProfile);
router.delete("/me", authenticate, deleteMyProfile);

// Admin-only access for any customer by ID
router.get("/:id", authenticate, authorizeRoles("admin"), getCustomerById);
router.put("/:id", authenticate, authorizeRoles("admin"), updateCustomer);
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteCustomer);

export default router;
