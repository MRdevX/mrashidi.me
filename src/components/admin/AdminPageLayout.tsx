"use client";

import { AdminPageHeader } from "./AdminPageHeader";

interface AdminPageLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function AdminPageLayout({ title, description, children }: AdminPageLayoutProps) {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageHeader title={title} description={description} />

      {/* Page Content */}
      {children}
    </div>
  );
}
