export interface ServiceWorkerRegistrationOptions {
  scope?: string;
  serviceWorkerUrl?: string;
  navigatorRef?: Navigator;
  windowRef?: Window;
  onRegistered?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
}

export async function registerServiceWorker(options: ServiceWorkerRegistrationOptions = {}) {
  const hasWindow = typeof window !== "undefined";
  const windowRef = options.windowRef ?? (hasWindow ? window : undefined);

  if (!windowRef) {
    return undefined;
  }

  const scope = options.scope ?? "/";
  const serviceWorkerUrl = options.serviceWorkerUrl ?? "/service-worker.js";
  const navigatorRef = options.navigatorRef ?? windowRef.navigator;
  const { onRegistered, onUpdate, onError } = options;

  if (
    windowRef.location &&
    windowRef.location.protocol !== "https:" &&
    windowRef.location.hostname !== "localhost" &&
    windowRef.location.hostname !== "127.0.0.1"
  ) {
    return undefined;
  }

  if (!navigatorRef?.serviceWorker) {
    return undefined;
  }

  try {
    const registration = await navigatorRef.serviceWorker.register(serviceWorkerUrl, { scope });

    onRegistered?.(registration);

    const maybeNotifyUpdate = () => {
      if (onUpdate && navigatorRef.serviceWorker?.controller) {
        onUpdate(registration);
      }
    };

    if (registration.waiting) {
      maybeNotifyUpdate();
    }

    registration.addEventListener?.("updatefound", () => {
      const installing = registration.installing;
      if (!installing) {
        return;
      }

      const onStateChange = () => {
        if (installing.state === "installed") {
          maybeNotifyUpdate();
        }
      };

      installing.addEventListener("statechange", onStateChange);
    });

    windowRef.addEventListener?.("offline", () => {
      registration.update().catch(() => undefined);
    });

    return registration;
  } catch (error) {
    onError?.(error as Error);
    return undefined;
  }
}
