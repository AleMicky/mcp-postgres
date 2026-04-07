import { pool } from "../db/postgres.js";

export async function ventasHoy() {
  const result = await pool.query(`
    SELECT
      COUNT(*)::int AS cantidad_ventas,
      COALESCE(SUM(total), 0)::numeric AS total_vendido
    FROM ventas
    WHERE DATE(fecha) = CURRENT_DATE
  `);

  return result.rows[0];
}