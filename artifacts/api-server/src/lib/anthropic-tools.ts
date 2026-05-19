import type { Tool } from "@anthropic-ai/sdk/resources/messages/messages";

type WebSearchToolConfig = {
  type: "web_search_20250305";
  name: "web_search";
  max_uses?: number;
};

/**
 * Returns a typed Anthropic web_search tool config.
 *
 * The SDK's Tool union predates the web_search_20250305 type, so a single
 * narrowed cast is required. This helper isolates that cast in one place so
 * callers can use it without escaping the type system themselves.
 */
export function webSearchTool(max_uses: number): Tool {
  const config: WebSearchToolConfig = {
    type: "web_search_20250305",
    name: "web_search",
    max_uses,
  };
  return config as unknown as Tool;
}
