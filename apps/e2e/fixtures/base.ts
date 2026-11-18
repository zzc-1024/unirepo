import { test as base } from '@playwright/test';

import { DesktopPage } from './pages/desktop.page';

interface AppFixtures {
  desktop: DesktopPage;
}

export const test = base.extend<AppFixtures>({
  desktop: async ({ page }, use) => {
    const desktop = new DesktopPage(page);
    await desktop.goto();
    await use(desktop);
  },
});

export { expect } from '@playwright/test';
