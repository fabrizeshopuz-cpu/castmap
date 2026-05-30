"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Button } from "@/components/ui/Button";
import { IntegrationGuide } from "@/components/integrations/IntegrationGuide";
import { IntegrationLogs } from "@/components/integrations/IntegrationLogs";
import { IntegrationWidgetBuilder } from "@/components/integrations/IntegrationWidgetBuilder";
import { useCastmapStore } from "@/lib/store";

export default function IntegrationDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const store = useCastmapStore();
  const integration = store.integrations.find((item) => item.id === params.id);

  return (
    <main className="gradient-background flex min-h-screen text-castText max-lg:flex-col">
      <Sidebar activeLabel="Integratsiyalar" />
      <section className="min-w-0 flex-1">
        <Topbar />
        <div className="grid gap-5 p-7 max-sm:p-4">
          <Button className="w-fit" onClick={() => router.push("/integrations")}><ArrowLeft className="h-4 w-4" />Orqaga</Button>
          {!integration ? (
            <section className="glass-panel rounded-2xl p-8 text-castMuted">Integration topilmadi.</section>
          ) : (
            <>
              <section className="glass-panel rounded-2xl p-6">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-castGold">{integration.type}</p>
                <h1 className="mt-2 text-3xl font-black text-white">{integration.name}</h1>
                <p className="mt-2 text-castMuted">{integration.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button variant="gold" onClick={() => store.syncIntegration(integration.id)}>Sync now</Button>
                  <Button onClick={() => store.testIntegration(integration.id)}>Test qilish</Button>
                  <Button variant="danger" onClick={() => store.disconnectIntegration(integration.id)}>Disconnect</Button>
                </div>
              </section>
              <IntegrationWidgetBuilder
                integrations={[integration]}
                widgets={store.integrationWidgets.filter((widget) => widget.integrationId === integration.id)}
                onCreate={(integrationId) => store.createIntegrationWidget({ integrationId })}
                onAddToPlaylist={(widget) => store.playlists[0] && store.addIntegrationWidgetToPlaylist(widget.id, store.playlists[0].id)}
              />
              <section className="grid gap-5 xl:grid-cols-2">
                <div className="glass-panel rounded-2xl p-5">
                  <h2 className="mb-3 text-lg font-black text-white">Qo'llanma</h2>
                  <IntegrationGuide type={integration.type} />
                </div>
                <div className="glass-panel rounded-2xl p-5">
                  <h2 className="mb-3 text-lg font-black text-white">Logs</h2>
                  <IntegrationLogs logs={store.integrationLogs.filter((log) => log.integrationId === integration.id)} />
                </div>
              </section>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
