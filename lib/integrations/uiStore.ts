import { create } from "zustand";

interface IntegrationUiState {
  activeTab: string;
  query: string;
  setActiveTab: (activeTab: string) => void;
  setQuery: (query: string) => void;
}

export const useIntegrationUiStore = create<IntegrationUiState>((set) => ({
  activeTab: "all",
  query: "",
  setActiveTab: (activeTab) => set({ activeTab }),
  setQuery: (query) => set({ query }),
}));
