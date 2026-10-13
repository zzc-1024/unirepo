import { defineRoute } from '../routeTypes';

export default defineRoute({
  path: '/settings',
  component: () => import('@/pages/SettingsPage.vue'),
});
