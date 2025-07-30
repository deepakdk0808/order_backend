export const exportCustomerOrdersToCSV = (customer) => {
  const header = [
    "Customer Name",
    "Email",
    "Phone",
    "Address",
    "Order ID",
    "Order Status",
    "Payment Collected",
    "Cancelled",
    "Total Items",
    "Created At",
    "Updated At",
    "Ordered Items (Name:Qty:Price)",
  ];

  const rows = customer.orders.map((order) => {
    const itemsDetails = order.items
      .map((item) => {
        const inv = item.inventoryItem;
        return `${inv?.name}:${item.quantity}:${inv?.price}`;
      })
      .join(" | ");

    return [
      customer.name,
      customer.email,
      customer.phone,
      customer.address,
      order._id,
      order.status,
      order.paymentCollected ? "Yes" : "No",
      order.cancelled ? "Yes" : "No",
      order.items.length,
      new Date(order.createdAt).toLocaleString(),
      new Date(order.updatedAt).toLocaleString(),
      itemsDetails,
    ];
  });

  const csv = [header, ...rows]
    .map((row) =>
      row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  return csv;
};
