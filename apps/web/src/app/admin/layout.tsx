import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminGuard } from '@/components/admin/AdminGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex flex-col md:flex-row min-h-screen bg-slate-100 font-sans">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto w-full min-w-0">{children}</main>
      </div>
    </AdminGuard>
  );
}
