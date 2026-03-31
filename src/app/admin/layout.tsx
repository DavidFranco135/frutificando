'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext, useAuthState } from '@/hooks/useAuth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const authState = useAuthState();
  const router = useRouter();

  React.useEffect(() => {
    if (!authState.isLoading && !authState.user) {
      router.replace('/admin/login');
    }
  }, [authState.isLoading, authState.user, router]);

  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-700" />
      </div>
    );
  }

  if (!authState.user) return null;

  return (
    <AuthContext.Provider value={authState}>
      <AdminSidebar>{children}</AdminSidebar>
    </AuthContext.Provider>
  );
}
