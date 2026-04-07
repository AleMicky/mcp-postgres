import { pool } from "../db/postgres.js";

interface ActualizarStockInput {
  id: number;
  stock: number;
}

export async function actualizarStock(data: ActualizarStockInput) {
  const result = await pool.query(
    `
    UPDATE productos
    SET stock = $1
    WHERE id = $2
    RETURNING id, nombre, stock, precio
    `,
    [data.stock, data.id]
  );

  return result.rows[0];
}