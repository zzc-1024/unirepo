import type { RouteDefinition } from './routeTypes';

export type RouteModule = {
  default: RouteDefinition;
};

export type RouteModuleLoader = () => Promise<RouteModule>;

export const routeLoaders: Record<string, RouteModuleLoader> =
  import.meta.glob<RouteModule>('./routes/**/*.ts');
