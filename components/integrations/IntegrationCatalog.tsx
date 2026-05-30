"use client";

import { IntegrationCard } from "@/components/integrations/IntegrationCard";
import type { Integration, IntegrationCatalogItem, IntegrationCategory, IntegrationType } from "@/types/integrations";

const categoryByTab: Record<string, IntegrationCategory | "all"> = {
  all: "all",
  content: "content",
  live: "live",
  data: "data",
  remote: "remote",
  marketing: "marketing",
  security: "security",
};

export function IntegrationCatalog({
  catalog,
  integrations,
  activeTab,
  onConnect,
  onConfigure,
  onTest,
  onGuide,
}: {
  catalog: IntegrationCatalogItem[];
  integrations: Integration[];
  activeTab: string;
  onConnect: (item: IntegrationCatalogItem) => void;
  onConfigure: (item: IntegrationCatalogItem, integration?: Integration) => void;
  onTest: (integration: Integration | undefined, item: IntegrationCatalogItem) => void;
  onGuide: (item: IntegrationCatalogItem) => void;
}) {
  const category = categoryByTab[activeTab] || "all";
  const filtered = category === "all" ? catalog : catalog.filter((item) => item.category === category);
  const byType = new Map<IntegrationType, Integration>(integrations.map((item) => [item.type, item]));
  return (
    <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
      {filtered.map((item) => {
        const integration = byType.get(item.type);
        return (
          <IntegrationCard
            key={item.type}
            item={item}
            integration={integration}
            onConnect={() => onConnect(item)}
            onConfigure={() => onConfigure(item, integration)}
            onTest={() => onTest(integration, item)}
            onGuide={() => onGuide(item)}
          />
        );
      })}
    </section>
  );
}
