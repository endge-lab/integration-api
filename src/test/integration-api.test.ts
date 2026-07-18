import { describe, expect, expectTypeOf, it } from "vitest"
import { defineIntegration } from "../index"
import type { IntegrationDomainApi, IntegrationModule } from "../index"
import type { VueIntegrationVisual } from "../vue"

describe("integration API", () => {
  it("keeps an integration definition unchanged", () => {
    const integration = defineIntegration({
      manifest: {
        identity: "example.operations",
        name: "Operations",
        version: "1.0.0",
        apiVersion: "1",
        permissions: ["domain:read", "computation:function"],
      },
      build({ build }) {
        return build.computations.registerFunction("operations.delay", (value) => Number(value) > 20)
      },
    })

    expect(integration.manifest.identity).toBe("example.operations")
    expect(defineIntegration(integration)).toBe(integration)
    expectTypeOf(integration).toMatchTypeOf<IntegrationModule>()
  })

  it("supports generic domain access without importing Core", () => {
    type Flight = { id?: string; identity: string; delay: number }

    const useDomain = async (domain: IntegrationDomainApi) => {
      const flight = await domain.ensure<Flight>("flights", {
        identity: "SU-100",
        create: { identity: "SU-100", delay: 0 },
        update: { delay: 25 },
        managedBy: "user",
      })
      return flight.delay
    }

    expectTypeOf(useDomain).returns.resolves.toBeNumber()
  })

  it("exports Vue visual types from the Vue subpath", () => {
    expectTypeOf<VueIntegrationVisual>().not.toBeNever()
  })
})
