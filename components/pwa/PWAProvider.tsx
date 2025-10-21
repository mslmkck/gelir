"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import Button from "@/components/ui/Button";
import { registerServiceWorker } from "@/lib/pwa/serviceWorkerRegistration";
import type { BeforeInstallPromptEvent } from "@/lib/pwa/types";

export default function PWAProvider() {
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallBannerVisible, setIsInstallBannerVisible] = useState(false);
  const [updateReady, setUpdateReady] = useState(false);
  const waitingWorkerRef = useRef<ServiceWorker | null>(null);

  const requestInstall = useCallback(async () => {
    if (!installPromptEvent) {
      return;
    }

    setIsInstallBannerVisible(false);
    await installPromptEvent.prompt();
    await installPromptEvent.userChoice;
    setInstallPromptEvent(null);
  }, [installPromptEvent]);

  const dismissInstallBanner = useCallback(() => {
    setIsInstallBannerVisible(false);
  }, []);

  const applyUpdate = useCallback(() => {
    const waiting = waitingWorkerRef.current;
    if (waiting) {
      waiting.postMessage({ type: "SKIP_WAITING" });
      setUpdateReady(false);
    }
  }, []);

  useEffect(() => {
    const cleanup = registerServiceWorker({
      onUpdate: (registration) => {
        waitingWorkerRef.current = registration.waiting ?? null;
        setUpdateReady(true);
      },
      onError: (error) => {
        if (process.env.NODE_ENV !== "production") {
          console.error("[PWA] Failed to register service worker", error);
        }
      },
    });

    return () => {
      Promise.resolve(cleanup).catch(() => undefined);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const handleBeforeInstall = (event: Event) => {
      const promptEvent = event as BeforeInstallPromptEvent;
      event.preventDefault?.();
      setInstallPromptEvent(promptEvent);
      setIsInstallBannerVisible(true);
    };

    const handleAppInstalled = () => {
      setInstallPromptEvent(null);
      setIsInstallBannerVisible(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    const controllerChangeHandler = () => {
      window.location.reload();
    };

    navigator.serviceWorker?.addEventListener("controllerchange", controllerChangeHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
      navigator.serviceWorker?.removeEventListener("controllerchange", controllerChangeHandler);
    };
  }, []);

  return (
    <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col gap-3 sm:max-w-sm">
      {isInstallBannerVisible && (
        <section
          role="dialog"
          aria-label="Install application"
          className="pointer-events-auto rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl shadow-neutral-900/10 dark:border-neutral-700 dark:bg-neutral-900"
        >
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Install Modern App</h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
            Get the app experience with offline support, faster launches, and native install.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="primary" size="sm" onClick={requestInstall}>
              Install
            </Button>
            <Button variant="ghost" size="sm" onClick={dismissInstallBanner}>
              Maybe later
            </Button>
          </div>
        </section>
      )}

      {updateReady && (
        <section
          role="status"
          aria-live="assertive"
          className="pointer-events-auto rounded-2xl border border-primary-200 bg-white p-4 shadow-xl shadow-primary-500/20 dark:border-primary-900 dark:bg-neutral-900"
        >
          <h2 className="text-base font-semibold text-primary-600 dark:text-primary-300">
            Update available
          </h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
            A new version has been downloaded. Reload to switch to the latest experience.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="primary" size="sm" onClick={applyUpdate}>
              Reload now
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
