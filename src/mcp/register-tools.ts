import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerProductosTools } from "../modules/productos/productos.tool.js";
import { registerVentasTools } from "../modules/ventas/ventas.tool.js";

export function registerAllTools(server: McpServer) {
    registerProductosTools(server);
    registerVentasTools(server);
}