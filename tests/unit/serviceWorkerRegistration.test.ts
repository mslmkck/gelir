import { describe, expect, it, vi } from "vitest";

import { registerServiceWorker } from "@/lib/pwa/serviceWorkerRegistration";

class MockServiceWorker extends EventTarget {
  public state: ServiceWorkerState;
  public postMessage = vi.fn();

  constructor(initialState: ServiceWorkerState) {
    super();
    this.state = initialState;
  }

  setState(nextState: ServiceWorkerState) {
    this.state = nextState;
    this.dispatchEvent(new Event("statechange"));
  }
}

class MockServiceWorkerRegistration extends EventTarget {
  public waiting: ServiceWorker | null = null;
  public installing: ServiceWorker | null = null;
  public update = vi.fn().mockResolvedValue(undefined);
}

describe("registerServiceWorker", () => {
  const createEnvironment = () => {
    const registration = new MockServiceWorkerRegistration();
    const typedRegistration = registration as unknown as ServiceWorkerRegistration;

    const controller = {} as ServiceWorker;
    const register = vi.fn().mockResolvedValue(typedRegistration);
    const navigatorRef = {
      serviceWorker: {
        controller,
        register,
      },
    } as unknown as Navigator;

    const windowRef = {
      location: { protocol: "https:", hostname: "example.test" },
      navigator: navigatorRef,
      addEventListener: vi.fn(),
    } as unknown as Window;

    return { registration, typedRegistration, navigatorRef, windowRef, register };
  };

  it("does not register on insecure origins", async () => {
    const navigatorRef = {
      serviceWorker: {
        register: vi.fn(),
      },
    } as unknown as Navigator;

    const windowRef = {
      location: { protocol: "http:", hostname: "example.com" },
      navigator: navigatorRef,
    } as unknown as Window;

    const result = await registerServiceWorker({ navigatorRef, windowRef });

    expect(result).toBeUndefined();
    expect(navigatorRef.serviceWorker.register).not.toHaveBeenCalled();
  });

  it("registers the service worker and invokes callbacks", async () => {
    const { navigatorRef, windowRef, typedRegistration, register } = createEnvironment();
    const onRegistered = vi.fn();

    const result = await registerServiceWorker({ navigatorRef, windowRef, onRegistered });

    expect(result).toBe(typedRegistration);
    expect(register).toHaveBeenCalledWith("/service-worker.js", { scope: "/" });
    expect(onRegistered).toHaveBeenCalledWith(typedRegistration);
  });

  it("notifies updates when a waiting worker already exists", async () => {
    const { navigatorRef, windowRef, registration, typedRegistration } = createEnvironment();
    const waitingWorker = new MockServiceWorker("installed") as unknown as ServiceWorker;
    registration.waiting = waitingWorker;

    const onUpdate = vi.fn();

    await registerServiceWorker({ navigatorRef, windowRef, onUpdate });

    expect(onUpdate).toHaveBeenCalledWith(typedRegistration);
  });

  it("notifies updates when a new worker finishes installing", async () => {
    const { navigatorRef, windowRef, registration, typedRegistration } = createEnvironment();

    const onUpdate = vi.fn();

    await registerServiceWorker({ navigatorRef, windowRef, onUpdate });

    const installingWorker = new MockServiceWorker("installing");
    registration.installing = installingWorker as unknown as ServiceWorker;
    registration.waiting = installingWorker as unknown as ServiceWorker;

    registration.dispatchEvent(new Event("updatefound"));
    installingWorker.setState("installed");

    expect(onUpdate).toHaveBeenCalledWith(typedRegistration);
  });

  it("invokes onError when registration fails", async () => {
    const error = new Error("registration failed");

    const register = vi.fn().mockRejectedValue(error);
    const navigatorRef = {
      serviceWorker: {
        controller: {} as ServiceWorker,
        register,
      },
    } as unknown as Navigator;

    const onError = vi.fn();

    const windowRef = {
      location: { protocol: "https:", hostname: "example.test" },
      navigator: navigatorRef,
    } as unknown as Window;

    const result = await registerServiceWorker({ navigatorRef, windowRef, onError });

    expect(result).toBeUndefined();
    expect(onError).toHaveBeenCalledWith(error);
  });
});
