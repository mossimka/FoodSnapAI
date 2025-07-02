import AdminProtection from '@/components/Admin/AdminProtection';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProtection>
      {children}
    </AdminProtection>
  );
} 