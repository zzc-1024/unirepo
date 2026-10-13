import { defineRoute } from '../routeTypes';

export default defineRoute({
  path: '/settings',
  component: () => import('@/pages/SettingsPage.vue'),
  meta: {
    name: 'Settings',
    rank: 20,
    icon: {
      type: 'svg',
      draw: (addPath) => {
        addPath('M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z');
        addPath('m19.4 15 .1.1a2 2 0 0 1-2.8 2.8l-.1-.1a2 2 0 0 0-3.4 1.4v.3a2 2 0 0 1-4 0v-.2a2 2 0 0 0-3.4-1.4l-.1.1a2 2 0 0 1-2.8-2.8l.1-.1A2 2 0 0 0 1.6 12H1.5a2 2 0 0 1 0-4h.2a2 2 0 0 0 1.4-3.4L3 4.5a2 2 0 0 1 2.8-2.8l.1.1A2 2 0 0 0 9.3.4V.3a2 2 0 0 1 4 0v.2a2 2 0 0 0 3.4 1.4l.1-.1a2 2 0 0 1 2.8 2.8l-.1.1a2 2 0 0 0 1.4 3.4h.2a2 2 0 0 1 0 4h-.2a2 2 0 0 0-1.4 2.9z');
      },
    },
  },
});
