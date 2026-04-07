import { pool } from "../db/postgres.js";

export async function stockBajo(minimo: number) {
  const result = await pool.query(
    `
    SELECT id, nombre, stock, precio
    FROM productos
    WHERE stock <= $1
    ORDER BY stock ASC
    `,
    [minimo]
  );

  return result.rows;
}