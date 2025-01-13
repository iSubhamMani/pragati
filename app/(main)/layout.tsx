import Navbar from "@/components/Navbar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="pb-10 flex min-h-screen flex-col overflow-hidden relative bg-background bg-[radial-gradient(ellipse_60%_60%_at_50%_-20%,rgba(125,210,94,0.3),rgba(255,255,255,0))]">
      <Navbar />
      {children}
    </div>
  );
}
