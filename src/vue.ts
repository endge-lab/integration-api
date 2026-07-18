import type { Component, DefineComponent } from "vue"

export type VueIntegrationComponent = Component | DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
export type VueIntegrationComponentLoader = () => Promise<{ default: VueIntegrationComponent }>
export type VueIntegrationVisual = VueIntegrationComponent | VueIntegrationComponentLoader

export type {
  ConfiguratorWidget,
  ConfiguratorWorkspaceView,
  IntegrationConfiguratorApi,
  IntegrationModule,
  IntegrationVisualDefinition,
} from "./contracts"

