export async function fetchCustomApiData(config: Record<string, unknown>) {
  const endpoint = String(config.endpoint || config.url || "");
  if (!endpoint.startsWith("https://")) return mockCustomApiData();
  try {
    const response = await fetch(endpoint, {
      method: String(config.method || "GET"),
      headers: typeof config.headers === "object" && config.headers ? config.headers as Record<string, string> : undefined,
    });
    if (!response.ok) throw new Error("Custom API failed");
    return await response.json();
  } catch {
    return mockCustomApiData();
  }
}

export function mapJsonToWidget(data: unknown, mapping: Record<string, unknown> = {}) {
  return {
    type: "custom_api",
    displayStyle: mapping.displayStyle || "table",
    data,
  };
}

function mockCustomApiData() {
  return {
    columns: ["Metric", "Value"],
    rows: [["Active campaign", "24"], ["Uptime", "98.7%"], ["Screens", "1248"]],
  };
}
