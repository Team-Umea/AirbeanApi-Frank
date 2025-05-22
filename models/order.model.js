export const dbCreateOrder = async (cart) => {
  const result = await pool.query(
    `INSERT INTO "order" (account_id, order_sum)
        VALUES ($1, $2) RETURNING *`,
    [cart.account_id, cart.order_sum]
  );
  result.rows[0];
};

export const dbOrderHistory = async () => {};

export const dbGetOrder = async () => {};
