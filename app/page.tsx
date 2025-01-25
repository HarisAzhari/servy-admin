// app/(dashboard)/page.tsx
'use client'
import AdminSidebar from "@/components/AdminSidebar";
import Dashboard from "@/components/dashboard";

export default function DashboardPage() {
  return (
    <AdminSidebar>
      <Dashboard />
    </AdminSidebar>
  );
}