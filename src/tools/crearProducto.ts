import { pool } from "../db/postgres.js";

interface CrearProductoInput {
  nombre: string;
  stock: number;
  precio: number;
}

export async function crearProducto(data: CrearProductoInput) {
  const result = await pool.query(
    `
    INSERT INTO productos (nombre, stock, precio)
    VALUES ($1, $2, $3)
    RETURNING id, nombre, stock, precio
    `,
    [data.nombre, data.stock, data.precio]
  );

  return result.rows[0];
}