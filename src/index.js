import express from "express";
import http from "http"; 
import { Server } from "socket.io"; 
import connectDB from "./configs/db.js";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import healthCheckRoute from "./routes/healthz.js";
import Order from "./models/order.js";

import { limiter } from "./utils/rateLimiter.js";
import logger from "./middlewares/loggers.js";
import errorHandler from "./middlewares/errorHandler.js";


dotenv.config();
connectDB()
  .then(() => {
    const app = express(); 
    // Create HTTP server
    const server = http.createServer(app);
    const PORT = process.env.PORT || 5000;
    const allowedOrigin =  "https://order-frontend-beta.vercel.app/"; 

// Initialize socket.io server
const io = new Server(server, {
  cors: {
    origin:
       "https://order-frontend-beta.vercel.app/", 
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});


// Express middleware
app.use(
    cors({
        origin: allowedOrigin,
        credentials: true,
    })
);
app.use(express.json());
app.use(limiter);
app.use(logger);

// Middleware to make `io` accessible in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});


// Routes
app.use("/api/orders", orderRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/auth", authRoutes);
app.use("/healthz", healthCheckRoute);

app.use(errorHandler);


// socket.io handlers
io.on("connection", (socket) => {
    console.log(" New client connected:", socket.id);
    
    socket.on("disconnect", () => {
        console.log(" Client disconnected:", socket.id);
    });
});



server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

setInterval(async () => {
      try {
        const statusFlow = ["Placed", "Picked", "Shipped", "Delivered"];

        const activeOrders = await Order.find({
          status: { $in: ["Placed", "Picked", "Shipped"] },
        });

        for (const order of activeOrders) {
          const index = statusFlow.indexOf(order.status);

          if (index !== -1 && index < statusFlow.length - 1) {
            order.status = statusFlow[index + 1];

            if (order.status === "Delivered") {
              order.paymentCollected = "Paid";
            }

            await order.save();
            io.emit("orderStatusUpdated", order);
            console.log(
              `Order ${order._id} status updated to ${order.status}`
            );
          }
        }
      } catch (error) {
        console.error("Error updating order statuses:", error.message);
      }
    }, 60000); // every 60s
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });
