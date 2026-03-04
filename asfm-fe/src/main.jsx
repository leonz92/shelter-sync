import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen'; // Auto-generated
// Create the router instance
import './index.css';
import { useBoundStore } from './store';
import AuthProvider from './components/AuthProvider';
import Layout from './components/Layout';

const router = createRouter({
  routeTree,
  context: { user: undefined, loading: true, userRole: undefined },
});

// wrapper component to inject auth context
function ContextWrapper() {
  const user = useBoundStore((state) => state.user);
  const loading = useBoundStore((state) => state.loading);
  const userRole = useBoundStore((state) => state.userRole);

  return (
    <AuthProvider>
      {loading ? (
        <Layout>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          </div>
        </Layout>
      ) : (
        <RouterProvider router={router} context={{ user, loading, userRole }} />
      )}
    </AuthProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContextWrapper />
  </StrictMode>,
);
