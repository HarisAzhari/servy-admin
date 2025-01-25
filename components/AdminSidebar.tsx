import React from 'react';
import { 
  LayoutDashboard, 
  CheckCircle,
  FileBarChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from 'next/navigation';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
}

const SidebarItem = ({ icon, label, href }: SidebarItemProps) => {
  const router = useRouter();
  
  const handleClick = () => {
    if (href) {
      router.push(href);
    }
  };
  
  return (
    <Button 
      variant="ghost" 
      className="w-full justify-start gap-3 font-normal h-11 px-4 hover:bg-slate-100"
      onClick={handleClick}
    >
      <span className="text-slate-500">{icon}</span>
      <span className="text-slate-600">{label}</span>
    </Button>
  );
};

const SidebarSection = ({ title }: { title: string }) => (
  <div className="text-xs font-medium text-blue-600 px-4 py-2">{title}</div>
);

interface AdminSidebarProps {
  children: React.ReactNode;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex w-64 flex-col fixed left-0 top-0 h-full bg-white border-r">
        {/* Logo */}
        <div className="p-4 flex items-center gap-2">
          <div className="text-blue-600 font-semibold text-lg">Servy Admin</div>
        </div>

        {/* Dashboard */}
        <div className="px-2">
          <SidebarItem 
            icon={<LayoutDashboard className="h-4 w-4" />} 
            label="Dashboard"
            href="/"
          />
        </div>

        <ScrollArea className="flex-1">
          {/* Content Management Section */}
          <SidebarSection title="MANAGEMENT" />
          <div className="space-y-1 px-2">
            <SidebarItem 
              icon={<CheckCircle className="h-4 w-4" />} 
              label="Verify"
              href="/verify"
            />
          </div>

          {/* Analytics Section */}
          <SidebarSection title="ANALYTICS" />
          <div className="space-y-1 px-2">
            <SidebarItem 
              icon={<FileBarChart className="h-4 w-4" />} 
              label="Reports"
              href="/reports" 
            />
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        {children}
      </main>
    </div>
  );
};

export default AdminSidebar;