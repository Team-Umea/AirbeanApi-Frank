export const dbCreateOrder = async (cart) => {
  const result = await pool.query(
    `INSERT INTO "order" (account_id, order_sum)
        VALUES ($1, $2) RETURNING *`,
    [cart.account_id, cart.order_sum]
  );
  const order = result.rows[0];

  for (const item of cart.items) {
await pool.query(
  `
    INSERT INTO order_products (order_id, product_id, quantity)
    VALUES ($1, $2, $3)
  `,
  [order.id, item.product_id, item.quantity]
);
  }

  simulateOrderLifecycle(order.id);

  return order;
};

export const dbOrderHistory = async () => {};

export const dbGetOrder = async () => {};
