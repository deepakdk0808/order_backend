import Customer from "../models/customer.js";
import { exportCustomerOrdersToCSV } from "../utils/csvExporter.js";

// Admin: Get all customers
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json({ success: true, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Self: View own profile
export const getMyProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id);
    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }
    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Self: Update own profile
export const updateMyProfile = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }
    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Self: Delete own profile
export const deleteMyProfile = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.user.id);
    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: View any customer with full order info
export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .select("-password")
      .populate({
        path: "orders",
        select:
          "name email phone address status paymentCollected cancelled createdAt updatedAt", // Include top-level fields you want
        populate: {
          path: "items.inventoryItem",
          model: "Inventory",
          select: "name price description imageUrl",
        },
       
      });

    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Admin: Update any customer
export const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

     const populatedCustomer = await Customer.findById(req.params.id)
       .select("-password")
       .populate({
         path: "orders",
         select:
           "name email phone address status paymentCollected cancelled createdAt updatedAt", // Include top-level fields you want
         populate: {
           path: "items.inventoryItem",
           model: "Inventory",
           select: "name price description imageUrl",
         },
       });
    res.status(200).json({ success: true, data: populatedCustomer });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Admin: Delete any customer
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


//CSVexporter
export const exportCustomerCSV = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .select("-password")
      .populate({
        path: "orders",
        populate: {
          path: "items.inventoryItem",
          model: "Inventory",
          select: "name price description imageUrl",
        },
      });

    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    const csv = exportCustomerOrdersToCSV(customer); // new util function
    res.header("Content-Type", "text/csv");
    res.attachment(`customer_${customer._id}_orders.csv`);
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};