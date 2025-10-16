"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  ChartBarIcon,
  FolderIcon,
  UsersIcon,
  Cog6ToothIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  { name: "Analytics", href: "/analytics", icon: ChartBarIcon },
  { name: "Projects", href: "/projects", icon: FolderIcon },
  { name: "Team", href: "/team", icon: UsersIcon },
  { name: "Settings", href: "/settings", icon: Cog6ToothIcon },
];

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-neutral-900/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white dark:bg-neutral-900 
          border-r border-neutral-200 dark:border-neutral-700
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700 lg:hidden">
            <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Menu</span>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${
                      isActive
                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
                        : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    }
                  `}
                  onClick={onClose}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
            <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800">
              <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                Need help?
              </p>
              <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                Check our documentation
              </p>
              <button className="mt-2 w-full px-3 py-1.5 text-xs font-medium text-primary-700 dark:text-primary-400 bg-white dark:bg-neutral-900 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                Learn more
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
