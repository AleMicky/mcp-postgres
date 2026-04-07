import { pool } from "../db/postgres.js";

export async function detalleVenta(ventaId: number) {
  const result = await pool.query(
    `
    SELECT
      v.id AS venta_id,
      v.fecha,
      v.total,
      dv.producto_id,
      p.nombre,
      dv.cantidad,
      dv.precio_unitario,
      dv.subtotal
    FROM ventas v
    JOIN detalle_venta dv ON dv.venta_id = v.id
    JOIN productos p ON p.id = dv.producto_id
    WHERE v.id = $1
    `,
    [ventaId]
  );

  return result.rows;
}