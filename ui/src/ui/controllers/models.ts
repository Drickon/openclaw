import type { GatewayBrowserClient } from "../gateway.ts";

export type ModelCatalogEntry = {
  id: string;
  name: string;
  provider: string;
};

export type ModelCatalogState = {
  client: GatewayBrowserClient | null;
  connected: boolean;
  chatModelCatalog: ModelCatalogEntry[];
  chatModelCatalogLoading: boolean;
};

export async function loadModelCatalog(state: ModelCatalogState) {
  if (!state.client || !state.connected) {
    return;
  }
  if (state.chatModelCatalogLoading) {
    return;
  }
  state.chatModelCatalogLoading = true;
  try {
    const res = await state.client.request<{ models?: ModelCatalogEntry[] }>("models.list", {});
    if (res?.models && Array.isArray(res.models)) {
      state.chatModelCatalog = res.models;
    }
  } catch {
    // Silently ignore — model switcher just won't show options
  } finally {
    state.chatModelCatalogLoading = false;
  }
}
