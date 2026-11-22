import type { Component } from 'vue';

export interface PlaygroundExample {
  title: string;
  description: string;
  filePath: string;
  component: Component;
  source: string;
}

export interface ReferenceItem {
  name: string;
  type: string;
  description: string;
  defaultValue?: string;
}

export interface DocsPage {
  id: string;
  title: string;
  summary: string;
  component: Component;
  badge?: string;
}

export interface DocsPageGroup {
  title: string;
  pages: DocsPage[];
}
