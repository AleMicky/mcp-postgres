import { pool } from "../../db/postgres.js";
import type { ItemVenta, ItemVentaPorNombre } from "./ventas.types.js";

export async function registrarVentaRepo(items: ItemVenta[]) {
    const result = await pool.query(
        `SELECT * FROM registrar_venta($1::jsonb)`,
        [JSON.stringify(items)]
    );

    return result.rows[0];
}

export async function registrarVentaPorNombreRepo(items: ItemVentaPorNombre[]) {
    const itemsConId = [];

    for (const item of items) {
        const result = await pool.query(
            `
      SELECT id, nombre
      FROM productos
      WHERE nombre ILIKE $1
      LIMIT 1
      `,
            [`%${item.nombre}%`]
        );

        if (result.rows.length === 0) {
            throw new Error(`Producto no encontrado: ${item.nombre}`);
        }

        itemsConId.push({
            producto_id: result.rows[0].id,
            cantidad: item.cantidad,
        });
    }

    const venta = await pool.query(
        `SELECT * FROM registrar_venta($1::jsonb)`,
        [JSON.stringify(itemsConId)]
    );

    return venta.rows[0];
}

export async function ventasHoyRepo() {
    const result = await pool.query(`
    SELECT
      COUNT(*)::int AS cantidad_ventas,
      COALESCE(SUM(total), 0)::numeric AS total_vendido
    FROM ventas
    WHERE DATE(fecha) = CURRENT_DATE
  `);

    return result.rows[0];
}

export async function detalleVentaRepo(ventaId: number) {
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

export async function anularVentaRepo(ventaId: number) {
    const result = await pool.query(
        `SELECT * FROM anular_venta($1)`,
        [ventaId]
    );

    return result.rows[0];
}