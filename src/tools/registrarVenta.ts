import { pool } from "../db/postgres.js";

interface ItemVenta {
  producto_id: number;
  cantidad: number;
}

export async function registrarVenta(items: ItemVenta[]) {
  const result = await pool.query(
    `SELECT * FROM registrar_venta($1::jsonb)`,
    [JSON.stringify(items)]
  );

  return result.rows[0];
}