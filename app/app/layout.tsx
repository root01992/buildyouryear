import AuthGuard from '@/components/auth/AuthGuard';
import AppHeader from '@/components/layout/AppHeader';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col bg-zinc-50/60">
        <AppHeader />
        <main className="flex-1 px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
          <div className="mx-auto w-full max-w-[min(100%,96rem)]">{children}</div>
        </main>
      </div>
    </AuthGuard>
  );
}
