import { pool } from "../db/postgres.js";

interface ItemInput {
  nombre: string;
  cantidad: number;
}

export async function registrarVentaPorNombre(items: ItemInput[]) {
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

    const producto = result.rows[0];

    itemsConId.push({
      producto_id: producto.id,
      cantidad: item.cantidad,
    });
  }

  // llamar a función en PostgreSQL
  const venta = await pool.query(
    `SELECT * FROM registrar_venta($1::jsonb)`,
    [JSON.stringify(itemsConId)]
  );

  return venta.rows[0];
}