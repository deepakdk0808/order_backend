import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests. Please try again later.",
});
