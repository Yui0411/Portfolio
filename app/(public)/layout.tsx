import Header from "@/components/layout/Header";
import NavBar from "@/components/layout/NavBar";

// Layout for the public-facing site (home, experience, projects, certificates).
export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <NavBar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
        {children}
      </main>
    </div>
  );
}
