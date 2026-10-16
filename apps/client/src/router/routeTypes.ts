import type { NavigationTranslationKey } from '@repo/composables';
import type { Component } from 'vue';

export type RouteComponentLoader = () => Promise<{ default: Component }>;
export type SvgIconDraw = (addPath: (pathData: string) => void) => void;

export type RouteIcon = { type: 'svg'; draw: SvgIconDraw } | { type: 'asset'; value: string };

export interface RouteMetadata {
  name: NavigationTranslationKey;
  rank: number;
  icon: RouteIcon;
}

export interface RouteDefinition {
  path: string;
  component: RouteComponentLoader;
  meta: RouteMetadata;
}

type ExtraRouteKeys<T> = Exclude<keyof T, keyof RouteDefinition>;

export function defineRoute<const T extends RouteDefinition>(
  route: T & Record<ExtraRouteKeys<T>, never>,
): T {
  return route;
}
