import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export function textResponse(text: string): CallToolResult {
  return {
    content: [
      {
        type: "text",
        text,
      },
    ],
  };
}