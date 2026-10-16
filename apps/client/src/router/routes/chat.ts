import { defineRoute } from '../routeTypes';

export default defineRoute({
  path: '/',
  component: () => import('@/pages/ChatPage.vue'),
  meta: {
    name: 'navigation.chat',
    rank: 10,
    icon: {
      type: 'svg',
      draw: (addPath) => {
        addPath(
          'M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z',
        );
      },
    },
  },
});
