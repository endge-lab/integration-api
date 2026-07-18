export * from "./contracts"

import type { IntegrationModule } from "./contracts"

export function defineIntegration<TVisual = unknown>(definition: IntegrationModule<TVisual>): IntegrationModule<TVisual> {
  return definition
}

