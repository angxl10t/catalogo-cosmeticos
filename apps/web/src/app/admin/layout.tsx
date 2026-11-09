import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminGuard } from '@/components/admin/AdminGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-slate-100 font-sans">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </AdminGuard>
  );
}
