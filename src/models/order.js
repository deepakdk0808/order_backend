import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    items: [
      {
        inventoryItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Inventory",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    paymentCollected: {
      type: String,
      enum: ["Paid", "Refunded"],
      default: "Paid",
    },
    status: {
      type: String,
      enum: ["Placed", "Picked", "Shipped", "Delivered", "Cancelled"],
      default: "Placed",
    },
    cancelled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);
