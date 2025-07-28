// routes/orderRoutes.js
import express from "express";
import {
  getAllOrders,
  getMyOrders,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getMyOrderHistory,
  getMyCurrentOrders,
} from "../controllers/orderController.js";
import { authenticate, authorizeRoles } from "../middlewares/middleware.js";

const router = express.Router();

// Admin: Get all orders
router.get("/", authenticate, authorizeRoles("admin"), getAllOrders);

// Customer: Get own orders
router.get("/my", authenticate, getMyOrders);

// Customer: Create order
router.post("/", authenticate, authorizeRoles("customer"), createOrder);

// Admin: Update order status
router.patch(
  "/:id/status",
  authenticate,
  authorizeRoles("admin"),
  updateOrderStatus
);

// Customer/Admin: Cancel order
router.put("/:id/cancel", authenticate, cancelOrder);

router.get("/my/history", authenticate, getMyOrderHistory);
router.get("/my/current", authenticate, getMyCurrentOrders);

export default router;
