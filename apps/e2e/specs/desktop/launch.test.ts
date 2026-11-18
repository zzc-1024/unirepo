import { expect, test } from '../../fixtures/base';

test('桌面启动后显示应用图标', async ({ desktop }) => {
  await expect(desktop.icons).toHaveCount(2);
});