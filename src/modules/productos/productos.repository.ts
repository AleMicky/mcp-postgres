import { pool } from "../../db/postgres.js";
import type { ActualizarStockInput, CrearProductoInput } from "./productos.types.js";

export async function listarProductosRepo() {
    const result = await pool.query(`
    SELECT id, nombre, stock, precio
    FROM productos
    ORDER BY id
    LIMIT 20
  `);

    return result.rows;
}

export async function buscarProductoRepo(nombre: string) {
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

export async function crearProductoRepo(data: CrearProductoInput) {
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

export async function actualizarStockRepo(data: ActualizarStockInput) {
    const result = await pool.query(
        `
    UPDATE productos
    SET stock = $1
    WHERE id = $2
    RETURNING id, nombre, stock, precio
    `,
        [data.stock, data.id]
    );

    return result.rows[0];
}

export async function eliminarProductoRepo(id: number) {
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

export async function stockBajoRepo(minimo: number) {
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