import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerAllTools } from "./mcp/register-tools.js";

const server = new McpServer({
  name: "mcp-postgres",
  version: "1.0.0",
});

registerAllTools(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Error iniciando el servidor MCP:", error);
  process.exit(1);
});