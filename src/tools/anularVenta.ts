import { pool } from "../db/postgres.js";

export async function anularVenta(ventaId: number) {
  const result = await pool.query(
    `SELECT * FROM anular_venta($1)`,
    [ventaId]
  );

  return result.rows[0];
}