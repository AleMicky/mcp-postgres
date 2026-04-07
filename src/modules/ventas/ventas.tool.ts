import { z } from "zod";
import { textResponse } from "../../mcp/tool-response.js";
import {
    anularVentaRepo,
    detalleVentaRepo,
    registrarVentaPorNombreRepo,
    registrarVentaRepo,
    ventasHoyRepo,
} from "./ventas.repository.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerVentasTools(server: McpServer) {
    server.registerTool(
        "registrar_venta",
        {
            title: "Registrar venta",
            description: "Registra una venta y descuenta stock",
            inputSchema: {
                items: z.array(
                    z.object({
                        producto_id: z.number().int().positive(),
                        cantidad: z.number().int().positive(),
                    })
                ).min(1),
            },
        },
        async ({ items }: { items: Array<{ producto_id: number; cantidad: number }> }) => {
            try {
                const venta = await registrarVentaRepo(items);
                return textResponse(
                    `Venta registrada correctamente. ID venta: ${venta.venta_id} | total: ${venta.total}`
                );
            } catch (error) {
                console.error(error);
                return textResponse(
                    error instanceof Error ? `Error al registrar la venta: ${error.message}` : "Error al registrar la venta."
                );
            }
        }
    );

    server.registerTool(
        "registrar_venta_por_nombre",
        {
            title: "Registrar venta por nombre",
            description: "Registra una venta usando nombres de productos",
            inputSchema: {
                items: z.array(
                    z.object({
                        nombre: z.string(),
                        cantidad: z.number().int().positive(),
                    })
                ).min(1),
            },
        },
        async ({ items }: { items: Array<{ nombre: string; cantidad: number }> }) => {
            try {
                const venta = await registrarVentaPorNombreRepo(items);
                return textResponse(`Venta registrada: ID ${venta.venta_id} | total: ${venta.total}`);
            } catch (error) {
                console.error(error);
                return textResponse(error instanceof Error ? error.message : "Error en la venta");
            }
        }
    );

    server.registerTool(
        "ventas_hoy",
        {
            title: "Ventas de hoy",
            description: "Muestra cuántas ventas hubo hoy y el total vendido",
            inputSchema: {},
        },
        async () => {
            try {
                const data = await ventasHoyRepo();
                return textResponse(
                    `Hoy hubo ${data.cantidad_ventas} venta(s) y el total vendido es ${data.total_vendido}.`
                );
            } catch (error) {
                console.error(error);
                return textResponse("Error al consultar las ventas de hoy.");
            }
        }
    );

    server.registerTool(
        "detalle_venta",
        {
            title: "Detalle de venta",
            description: "Muestra el detalle de una venta por ID",
            inputSchema: {
                venta_id: z.number().int().positive(),
            },
        },
        async ({ venta_id }: { venta_id: number }) => {
            try {
                const detalles = await detalleVentaRepo(venta_id);

                if (detalles.length === 0) {
                    return textResponse(`No se encontró la venta con ID ${venta_id}.`);
                }

                const header = detalles[0];

                const items = detalles
                    .map(
                        (d) =>
                            `- ${d.nombre} | cant: ${d.cantidad} | precio: ${d.precio_unitario} | subtotal: ${d.subtotal}`
                    )
                    .join("\n");

                return textResponse(
                    `Venta #${header.venta_id}
Fecha: ${header.fecha}
Total: ${header.total}

Detalle:
${items}`
                );
            } catch (error) {
                console.error(error);
                return textResponse("Error al obtener el detalle de la venta.");
            }
        }
    );

    server.registerTool(
        "anular_venta",
        {
            title: "Anular venta",
            description: "Anula una venta y devuelve el stock",
            inputSchema: {
                venta_id: z.number().int().positive(),
            },
        },
        async ({ venta_id }: { venta_id: number }) => {
            try {
                const result = await anularVentaRepo(venta_id);
                return textResponse(result.mensaje);
            } catch (error) {
                console.error(error);
                return textResponse("Error al anular la venta.");
            }
        }
    );
}