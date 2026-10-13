import { defineRoute } from '../routeTypes';

export default defineRoute({
  path: '/',
  component: () => import('@/pages/ChatPage.vue'),
});
