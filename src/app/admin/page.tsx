import { Metadata } from "next";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard | Cake Magic Rajahmundry",
  description: "Secure management hub for Cake Magic orders, custom enquiries, and catalogue.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return (
    <div className="w-full bg-[var(--background)] min-h-[calc(100vh-80px)]">
      <AdminDashboard />
    </div>
  );
}
