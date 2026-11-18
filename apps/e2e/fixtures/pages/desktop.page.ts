import { expect, type Locator, type Page } from '@playwright/test';

/** 桌面外壳及其应用图标 */
export class DesktopPage {
  readonly page: Page;
  readonly root: Locator;
  readonly icons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.root = page.locator('.desktop');
    this.icons = this.root.locator('.app-icon');
  }

  /** 打开首页并等待图标渲染完成（图标由路由注册表异步加载） */
  async goto(): Promise<void> {
    await this.page.goto('/');
    await expect(this.icons.first()).toBeVisible();
  }
}
