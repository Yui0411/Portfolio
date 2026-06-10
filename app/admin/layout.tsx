import AdminNav from "@/components/admin/AdminNav";

// Layout for the authenticated admin area. The proxy/middleware already ensures
// only logged-in users reach any /admin route.
export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-col">
      <AdminNav />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
        {children}
      </main>
    </div>
  );
}
