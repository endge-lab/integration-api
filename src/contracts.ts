export type MaybePromise<T> = T | Promise<T>
export type IntegrationDisposer = () => MaybePromise<void>

export type IntegrationPermission =
  | "domain:read"
  | "domain:write"
  | "domain:delete"
  | "build:transform"
  | "computation:function"
  | "configurator:extend"
  | (string & {})

export interface IntegrationEntrypoints {
  main?: string
  configurator?: string
  backend?: string
}

export interface DeclaredDomainResource {
  key: string
  entity: string
  identity: string
  managedBy?: "integration" | "user"
  source?: unknown
}

export interface IntegrationManifest {
  identity: string
  name: string
  version: string
  apiVersion: string
  description?: string
  entrypoints?: IntegrationEntrypoints
  permissions?: IntegrationPermission[]
  domainResources?: DeclaredDomainResource[]
}

export interface IntegrationContext {
  integrationId: string | number
  integrationIdentity: string
  version: string
  workspaceId: string | number
  installationId?: string | number
}

export interface DomainDocument {
  id?: string | number
  identity?: string
  [key: string]: unknown
}

export interface DomainListQuery<TDocument extends DomainDocument = DomainDocument> {
  where?: Partial<TDocument>
  limit?: number
  page?: number
}

export interface DomainCreateOptions {
  managedBy?: "integration" | "user"
}

export interface DomainEnsureOptions<TDocument extends DomainDocument> extends DomainCreateOptions {
  identity: string
  create: Omit<TDocument, "id">
  update?: Partial<TDocument>
}

export interface IntegrationDomainApi {
  get<TDocument extends DomainDocument>(entity: string, id: string | number): Promise<TDocument | null>
  list<TDocument extends DomainDocument>(entity: string, query?: DomainListQuery<TDocument>): Promise<TDocument[]>
  create<TDocument extends DomainDocument>(entity: string, document: Omit<TDocument, "id">, options?: DomainCreateOptions): Promise<TDocument>
  update<TDocument extends DomainDocument>(entity: string, id: string | number, patch: Partial<TDocument>): Promise<TDocument>
  delete(entity: string, id: string | number): Promise<void>
  ensure<TDocument extends DomainDocument>(entity: string, options: DomainEnsureOptions<TDocument>): Promise<TDocument>
}

export interface BuildTransformContext {
  integration: IntegrationContext
  documentType: string
  document: unknown
}

export type BuildTransform = (context: BuildTransformContext) => MaybePromise<unknown>
export type ComputationFunction = (...args: unknown[]) => unknown

export interface IntegrationBuildApi {
  transforms: {
    register(name: string, transform: BuildTransform): IntegrationDisposer
  }
  computations: {
    registerFunction(name: string, fn: ComputationFunction): IntegrationDisposer
  }
}

export interface IntegrationVisualDefinition<TVisual = unknown> {
  id: string
  title: string
  icon?: string
  visual: TVisual
}

export interface ConfiguratorWidget<TVisual = unknown> extends IntegrationVisualDefinition<TVisual> {
  placement: "toolbar" | "sidebar"
  order?: number
}

export interface ConfiguratorWorkspaceView<TVisual = unknown> extends IntegrationVisualDefinition<TVisual> {
  route?: string
}

export interface ConfiguratorMenuItem {
  id: string
  title: string
  icon?: string
  order?: number
  parentId?: string
  action?: () => MaybePromise<void>
  children?: ConfiguratorMenuItem[]
}

export interface IntegrationConfiguratorApi<TVisual = unknown> {
  widgets: {
    register(widget: ConfiguratorWidget<TVisual>): IntegrationDisposer
  }
  workspaceViews: {
    register(view: ConfiguratorWorkspaceView<TVisual>): IntegrationDisposer
    open(id: string): Promise<void>
  }
  menu: {
    add(item: ConfiguratorMenuItem): IntegrationDisposer
  }
}

export interface IntegrationConfigureApi {
  context: IntegrationContext
  domain: IntegrationDomainApi
}

export interface IntegrationBuildLifecycleApi extends IntegrationConfigureApi {
  build: IntegrationBuildApi
}

export interface IntegrationConfiguratorLifecycleApi<TVisual = unknown> extends IntegrationConfigureApi {
  configurator: IntegrationConfiguratorApi<TVisual>
}

export interface IntegrationModule<TVisual = unknown> {
  manifest: IntegrationManifest
  configure?(api: IntegrationConfigureApi): MaybePromise<void | IntegrationDisposer>
  build?(api: IntegrationBuildLifecycleApi): MaybePromise<void | IntegrationDisposer>
  configurator?(api: IntegrationConfiguratorLifecycleApi<TVisual>): MaybePromise<void | IntegrationDisposer>
}

