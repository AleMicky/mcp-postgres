import { z } from "zod";
import { textResponse } from "../../mcp/tool-response.js";
import {
    actualizarStockRepo,
    buscarProductoRepo,
    crearProductoRepo,
    eliminarProductoRepo,
    listarProductosRepo,
    stockBajoRepo,
} from "./productos.repository.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerProductosTools(server: McpServer) {
    server.registerTool(
        "listar_productos",
        {
            title: "Listar productos",
            description: "Lista productos disponibles",
            inputSchema: {},
        },
        async () => {
            try {
                const productos = await listarProductosRepo();

                if (productos.length === 0) {
                    return textResponse("No hay productos.");
                }

                const texto = productos
                    .map(
                        (p) => `#${p.id} ${p.nombre} | stock: ${p.stock} | precio: ${p.precio}`
                    )
                    .join("\n");

                return textResponse(texto);
            } catch (error) {
                console.error(error);
                return textResponse("Error al listar productos.");
            }
        }
    );

    server.registerTool(
        "buscar_producto",
        {
            title: "Buscar producto",
            description: "Busca productos por nombre",
            inputSchema: {
                nombre: z.string().min(1),
            },
        },
        async ({ nombre }: { nombre: string }) => {
            try {
                const productos = await buscarProductoRepo(nombre);

                if (productos.length === 0) {
                    return textResponse(`No se encontraron productos con el nombre "${nombre}".`);
                }

                const texto = productos
                    .map(
                        (p) => `#${p.id} ${p.nombre} | stock: ${p.stock} | precio: ${p.precio}`
                    )
                    .join("\n");

                return textResponse(texto);
            } catch (error) {
                console.error(error);
                return textResponse("Error al buscar productos.");
            }
        }
    );

    server.registerTool(
        "crear_producto",
        {
            title: "Crear producto",
            description: "Crea un producto en la base de datos",
            inputSchema: {
                nombre: z.string().min(1),
                stock: z.number().min(0),
                precio: z.number().positive(),
            },
        },
        async ({ nombre, stock, precio }: { nombre: string; stock: number; precio: number }) => {
            try {
                const producto = await crearProductoRepo({ nombre, stock, precio });
                return textResponse(
                    `Producto creado correctamente: #${producto.id} ${producto.nombre} | stock: ${producto.stock} | precio: ${producto.precio}`
                );
            } catch (error) {
                console.error(error);
                return textResponse("Error al crear el producto.");
            }
        }
    );

    server.registerTool(
        "actualizar_stock",
        {
            title: "Actualizar stock",
            description: "Actualiza el stock de un producto por ID",
            inputSchema: {
                id: z.number().int().positive(),
                stock: z.number().min(0),
            },
        },
        async ({ id, stock }: { id: number; stock: number }) => {
            try {
                const producto = await actualizarStockRepo({ id, stock });

                if (!producto) {
                    return textResponse(`No se encontró el producto con ID ${id}.`);
                }

                return textResponse(
                    `Stock actualizado: #${producto.id} ${producto.nombre} → nuevo stock: ${producto.stock}`
                );
            } catch (error) {
                console.error(error);
                return textResponse("Error al actualizar el stock.");
            }
        }
    );

    server.registerTool(
        "eliminar_producto",
        {
            title: "Eliminar producto",
            description: "Elimina un producto por ID",
            inputSchema: {
                id: z.number().int().positive(),
            },
        },
        async ({ id }: { id: number }) => {
            try {
                const producto = await eliminarProductoRepo(id);

                if (!producto) {
                    return textResponse(`No se encontró el producto con ID ${id}.`);
                }

                return textResponse(`Producto eliminado correctamente: #${producto.id} ${producto.nombre}`);
            } catch (error) {
                console.error(error);
                return textResponse("Error al eliminar el producto.");
            }
        }
    );

    server.registerTool(
        "stock_bajo",
        {
            title: "Productos con bajo stock",
            description: "Lista productos con stock menor o igual a un valor",
            inputSchema: {
                minimo: z.number().min(0).default(10),
            },
        },
        async ({ minimo }: { minimo: number }) => {
            try {
                const productos = await stockBajoRepo(minimo);

                if (productos.length === 0) {
                    return textResponse(`No hay productos con stock menor o igual a ${minimo}.`);
                }

                const texto = productos
                    .map(
                        (p) => `#${p.id} ${p.nombre} | stock: ${p.stock} | precio: ${p.precio}`
                    )
                    .join("\n");

                return textResponse(`Productos con bajo stock:\n${texto}`);
            } catch (error) {
                console.error(error);
                return textResponse("Error al consultar stock bajo.");
            }
        }
    );
}