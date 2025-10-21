"use client";

import React, { useCallback, useRef, useState } from "react";
import PWAProvider from "@/components/pwa/PWAProvider";
import Navigation from "./Navigation";
import Sidebar from "./Sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);

  const openSidebar = useCallback(() => {
    lastFocusedElementRef.current = document.activeElement as HTMLElement | null;
    setSidebarOpen(true);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
    window.requestAnimationFrame(() => {
      menuButtonRef.current?.focus();
      if (!menuButtonRef.current && lastFocusedElementRef.current) {
        lastFocusedElementRef.current.focus();
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <Navigation onMenuClick={openSidebar} menuButtonRef={menuButtonRef} isSidebarOpen={sidebarOpen} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8" role="main">
          {children}
        </main>
      </div>
      <PWAProvider />
    </div>
  );
}
