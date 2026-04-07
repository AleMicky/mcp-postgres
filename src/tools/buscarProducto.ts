import { pool } from "../db/postgres.js";

export async function buscarProducto(nombre: string) {
  const result = await pool.query(
    `
    SELECT id, nombre, stock, precio
    FROM productos
    WHERE nombre ILIKE $1
    ORDER BY id
    LIMIT 20
    `,
    [`%${nombre}%`]
  );

  return result.rows;
}