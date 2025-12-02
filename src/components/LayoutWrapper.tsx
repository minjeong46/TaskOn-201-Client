"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Toaster } from "sonner";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isIndexPage = pathname === "/"

  if (isAuthPage || isIndexPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="w-full overflow-y-auto">
        <Header />
        {children}
        <Toaster richColors position="top-center" />
      </div>
    </div>
  );
}
