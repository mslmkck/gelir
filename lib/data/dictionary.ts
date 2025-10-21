export interface DictionaryEntry {
  term: string;
  definition: string;
  category: "web" | "performance" | "pwa" | "accessibility";
  related?: string[];
}

export const dictionaryEntries: DictionaryEntry[] = [
  {
    term: "accessibility",
    definition:
      "Practices that make experiences usable by as many people as possible, including those relying on assistive technologies.",
    category: "accessibility",
    related: ["aria", "keyboard"],
  },
  {
    term: "aria",
    definition:
      "Accessible Rich Internet Applications, a specification that supplements HTML semantics with attributes that describe interactive UI elements.",
    category: "accessibility",
    related: ["accessibility", "semantics"],
  },
  {
    term: "prefetch",
    definition:
      "A performance technique that downloads resources the user is likely to need soon, reducing perceived latency.",
    category: "performance",
    related: ["performance", "preload"],
  },
  {
    term: "progressive web app",
    definition:
      "A web experience enhanced with capabilities such as offline support, installability, and background sync, bridging the gap between web and native apps.",
    category: "pwa",
    related: ["service worker", "manifest"],
  },
  {
    term: "service worker",
    definition:
      "A background script that intercepts network requests, enabling offline caching, background sync, and push notifications for PWAs.",
    category: "pwa",
    related: ["progressive web app", "offline"],
  },
  {
    term: "offline shell",
    definition:
      "A cached version of the critical UI that loads instantly even when the network is unavailable, allowing core interactions to continue.",
    category: "pwa",
    related: ["service worker", "cache"],
  },
  {
    term: "code splitting",
    definition:
      "Breaking an application bundle into smaller chunks that are loaded on demand to improve initial load performance.",
    category: "performance",
    related: ["lazy loading", "dynamic import"],
  },
  {
    term: "keyboard trap",
    definition:
      "A condition where a keyboard user cannot move focus away from an element using the keyboard, often caused by missing focus management.",
    category: "accessibility",
    related: ["focus", "accessibility"],
  },
  {
    term: "manifest",
    definition:
      "A JSON file that provides metadata about a PWA, including its icons, theme colors, and how it should behave when installed.",
    category: "pwa",
    related: ["progressive web app", "install"],
  },
  {
    term: "stale while revalidate",
    definition:
      "A caching strategy that responds with cached content immediately while it fetches an updated version in the background.",
    category: "performance",
    related: ["caching", "service worker"],
  },
];

export function searchDictionary(query: string): DictionaryEntry[] {
  if (!query.trim()) {
    return dictionaryEntries;
  }

  const normalized = query.trim().toLowerCase();

  return dictionaryEntries.filter((entry) => {
    return (
      entry.term.toLowerCase().includes(normalized) ||
      entry.definition.toLowerCase().includes(normalized) ||
      entry.related?.some((item) => item.toLowerCase().includes(normalized))
    );
  });
}
