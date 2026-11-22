import { defineAsyncComponent, type Component } from 'vue';

import type { PlaygroundExample } from './types';

const exampleModules = import.meta.glob<{ default: Component }>('./examples/**/*.vue');
const exampleSources = import.meta.glob<string>('./examples/**/*.vue', {
  eager: true,
  import: 'default',
  query: '?raw',
});

export function createExample(
  filePath: string,
  title: string,
  description: string,
): PlaygroundExample {
  const modulePath = `./examples/${filePath}`;
  const loadExample = exampleModules[modulePath];
  const source = exampleSources[modulePath];

  if (!loadExample || typeof source !== 'string') {
    throw new Error(`Playground example not found: ${modulePath}`);
  }

  return {
    title,
    description,
    filePath,
    component: defineAsyncComponent(loadExample),
    source,
  };
}
