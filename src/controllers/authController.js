import Customer from "../models/customer.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  try {
    const { name, email, password, role = "customer" } = req.body;

    const existing = await Customer.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const customer = await Customer.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ message: "Signup successful", customer });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const customer = await Customer.findOne({ email }).select("+password");
    if (!customer) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: customer._id, role: customer.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    next(err);
  }
};
