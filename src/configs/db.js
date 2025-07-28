import mongoose from "mongoose";

 const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error(
      "Error: MONGO_URI is not defined in the environment variables."
    );
    process.exit(1); // Exit the process with failure
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit the process with failure
  }
};


export default connectDB;