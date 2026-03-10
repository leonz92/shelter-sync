import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useBoundStore } from '@/store';

export const Route = createFileRoute('/_admin')({
  beforeLoad: async ({ context, location }) => {
    const { initializeAuth, user, userRole } = useBoundStore.getState();

    await initializeAuth(); // force beforeLoad to wait for auth before redirecting

    if (!user) {
      throw redirect({
        to: '/signin',
        search: {
          redirect: location.href,
        },
      });
    }

    if (userRole !== 'STAFF') {
      // TODO: show role guard instead
      throw redirect({
        to: '/',
      });
    }
  },
  component: () => <Outlet />,
});
