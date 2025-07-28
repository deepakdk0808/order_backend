export const exportOrdersToCSV = (orders) => {
  const header = [
    "Order ID",
    "Customer Name",
    "Email",
    "Status",
    "Payment Collected",
    "Total Price",
    "Created At",
  ];
  const rows = orders.map((order) => [
    order._id,
    order.customerName,
    order.customerEmail,
    order.status,
    order.paymentCollected ? "Yes" : "No",
    order.totalPrice,
    new Date(order.createdAt).toLocaleString(),
  ]);

  const csv = [header, ...rows]
    .map((row) =>
      row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  return csv;
};
