"use client";

import { cn } from "@/lib/utils";
import { Home, Plus, User, ScrollText, BarChart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const routes = [
    {
      icon: Home,
      href: "/",
      label: "Home",
      pro: false,
    },
    {
      icon: Plus,
      href: "/trade/new",
      label: "Add",
      pro: false,
    },
    {
      icon: ScrollText,
      href: "/log",
      label: "Trades",
      pro: false,
    },
    ,
    {
      icon: BarChart,
      href: "/ranking",
      label: "Ranking",
      pro: false,
    },
    {
      icon: User,
      href: "/profile/current",
      label: "Profile",
      pro: false,
    },
  ];

  const onNavigate = (url: string, pro: boolean) => {
    return router.push(url);
  };

  return (
    <div className="space-y-4 flex flex-col h-full text-primary bg-secondary">
      <div className="p-2 flex flex-1 justify-center">
        <div className="space-y-2">
          {routes.map((route: any) => (
            <div
              onClick={() => onNavigate(route.href, route.pro)}
              key={route.href}
              className={cn(
                "text-muted-foreground text-xs group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                pathname === route.href && "bg-primary/10 text-primary"
              )}
            >
              <div className="flex flex-col gap-y-2 items-center flex-1">
                <route.icon className="h-5 w-5" />
                {route.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
