import { pool } from "../db/postgres.js";

export async function eliminarProducto(id: number) {
  const result = await pool.query(
    `
    DELETE FROM productos
    WHERE id = $1
    RETURNING id, nombre, stock, precio
    `,
    [id]
  );

  return result.rows[0];
}