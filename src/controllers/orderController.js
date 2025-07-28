import Order from "../models/order.js";
import Customer from "../models/customer.js";

// Admin: Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer")
      .populate("items.inventoryItem");
    res.status(200).json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: err.message });
  }
};

// Customer: Get own all orders (History: Cancelled & Delivered)
export const getMyOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({
      customer: req.user._id,
      status: { $in: ["Cancelled", "Delivered"] },
    }).populate("items.inventoryItem");

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching order history",
      error: err.message,
    });
  }
};

// Customer: Get own current active orders (Placed, Picked, Shipped)
export const getMyCurrentOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      customer: req.user._id,
      status: { $in: ["Placed", "Picked", "Shipped"] },
    }).populate("items.inventoryItem");

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching current orders",
      error: err.message,
    });
  }
};

// Customer: Get all orders (optional, already exists)
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).populate(
      "items.inventoryItem"
    );
    res.status(200).json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching your orders", error: err.message });
  }
};

// Customer: Place order
export const createOrder = async (req, res) => {
  try {
    const { items, paymentCollected } = req.body;

    // Validate request body
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items are required" });
    }

    // Validate paymentCollected
    const validPayments = ["Paid", "Refunded"];
    if (paymentCollected && !validPayments.includes(paymentCollected)) {
      return res
        .status(400)
        .json({ message: "Invalid payment status provided" });
    }

    // Create and save the order
    const order = new Order({
      customer: req.user._id,
      items,
      paymentCollected: paymentCollected || "Paid", // default to "Paid" if not provided
      status: "Placed",
    });

    await order.save();

    // Push this order into customer's orders array
    await Customer.findByIdAndUpdate(req.user._id, {
      $push: { orders: order._id },
    });
    
    res.status(201).json(order);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error placing order", error: err.message });
  }
};


// Cancel order - customer or admin
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (
      order.customer.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Unauthorized to cancel order" });
    }

    order.status = "Cancelled";
    order.paymentCollected = "Refunded";
    await order.save();

    req.io.emit("orderStatusUpdated", order); // Real-time event
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({
      message: "Error cancelling order",
      error: err.message,
    });
  }
};

// Admin: Update order status manually or cancel
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (["Cancelled", "Delivered"].includes(order.status)) {
      return res.status(400).json({ message: "Cannot update status further" });
    }

    const statusPipeline = ["Placed", "Picked", "Shipped", "Delivered"];
    const currentIndex = statusPipeline.indexOf(order.status);

    if (req.body.status === "Cancelled") {
      order.status = "Cancelled";
      order.paymentCollected = "Refunded";
      await order.save();
      req.io.emit("orderStatusUpdated", order);
      return res.status(200).json(order);
    }

    // Move to next status
    if (currentIndex >= 0 && currentIndex < statusPipeline.length - 1) {
      order.status = statusPipeline[currentIndex + 1];
      if (order.status === "Delivered") {
        order.paymentCollected = "Paid";
      }
      await order.save();
      req.io.emit("orderStatusUpdated", order);
      return res.status(200).json(order);
    }

    res.status(400).json({ message: "Invalid status transition" });
  } catch (err) {
    res.status(500).json({
      message: "Error updating order status",
      error: err.message,
    });
  }
};

