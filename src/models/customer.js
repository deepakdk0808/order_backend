import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // ensure no duplicate emails
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // prevent password from being sent by default
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order", // this should match the model name for orders
      },
    ],
    address: String,
    phone: String,
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);
