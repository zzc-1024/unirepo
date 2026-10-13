import type { Component } from 'vue';

export type RouteComponentLoader = () => Promise<{ default: Component }>;

export interface RouteDefinition {
  path: string;
  component: RouteComponentLoader;
}

type ExtraRouteKeys<T> = Exclude<keyof T, keyof RouteDefinition>;

export function defineRoute<const T extends RouteDefinition>(
  route: T & Record<ExtraRouteKeys<T>, never>,
): T {
  return route;
}
