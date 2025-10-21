"use client";

import { useEffect, useMemo, useState } from "react";

import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from "@/components/ui";
import type { DictionaryEntry } from "@/lib/data/dictionary";

type FetchState = "idle" | "loading" | "ready" | "error";

export default function DictionarySection() {
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [status, setStatus] = useState<FetchState>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadDictionary = async () => {
      try {
        setStatus("loading");
        const response = await fetch("/api/dictionary");
        if (!response.ok) {
          throw new Error(`Dictionary request failed with ${response.status}`);
        }
        const payload: { data: DictionaryEntry[] } = await response.json();
        if (isMounted) {
          setEntries(payload.data);
          setStatus("ready");
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Unknown error");
          setStatus("error");
        }
      }
    };

    loadDictionary();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredEntries = useMemo(() => {
    if (!query.trim()) {
      return entries;
    }

    const normalized = query.trim().toLowerCase();
    return entries.filter((entry) => {
      return (
        entry.term.toLowerCase().includes(normalized) ||
        entry.definition.toLowerCase().includes(normalized) ||
        entry.related?.some((item) => item.toLowerCase().includes(normalized))
      );
    });
  }, [entries, query]);

  return (
    <Card variant="bordered" aria-labelledby="dictionary-heading">
      <CardHeader>
        <CardTitle id="dictionary-heading">PWA Dictionary</CardTitle>
        <CardDescription>
          Key terms cached for offline use so you can keep learning even without a connection.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          <Input
            label="Search glossary"
            placeholder="Search for progressive web app terminology"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            fullWidth
          />

          <div role="status" aria-live="polite" className="space-y-4">
            {status === "loading" && <p className="text-sm text-neutral-500">Loading glossary…</p>}
            {status === "error" && (
              <p className="text-sm text-error-600 dark:text-error-400">
                Failed to load dictionary. {error}
              </p>
            )}
            {status === "ready" && filteredEntries.length === 0 && (
              <p className="text-sm text-neutral-500">No entries match your search yet.</p>
            )}
          </div>

          {filteredEntries.length > 0 && (
            <ul className="space-y-3" aria-live="polite">
              {filteredEntries.map((entry) => (
                <li
                  key={entry.term}
                  className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:border-primary-200 dark:border-neutral-700 dark:bg-neutral-900"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                        {entry.term}
                      </h3>
                      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{entry.definition}</p>
                    </div>
                    <Badge variant="secondary">{entry.category}</Badge>
                  </div>
                  {entry.related && entry.related.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2" aria-label="Related terms">
                      {entry.related.map((item) => (
                        <Badge key={item} variant="neutral" className="uppercase tracking-wide text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
