"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { resources, type Biome } from "@/lib/resources";

const BIOMES: Biome[] = ["Meadows", "Black Forest", "Swamp", "Mountains", "Plains", "Mistlands", "Any"];

export function MaterialsGuide() {
  const [query, setQuery] = useState("");
  const [activeBiomes, setActiveBiomes] = useState<Set<Biome>>(new Set());

  function toggleBiome(b: Biome) {
    setActiveBiomes((prev) => {
      const next = new Set(prev);
      if (next.has(b)) next.delete(b);
      else next.add(b);
      return next;
    });
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return resources.filter((r) => {
      const matchesBiome = activeBiomes.size === 0 || activeBiomes.has(r.biome);
      const matchesQuery =
        !q || r.name.toLowerCase().includes(q) || r.source.toLowerCase().includes(q);
      return matchesBiome && matchesQuery;
    });
  }, [query, activeBiomes]);

  const grouped = useMemo(() => {
    const order: Biome[] = ["Meadows", "Black Forest", "Swamp", "Mountains", "Plains", "Mistlands", "Any"];
    const map = new Map<Biome, typeof filtered>();
    for (const biome of order) {
      const items = filtered.filter((r) => r.biome === biome);
      if (items.length) map.set(biome, items);
    }
    return map;
  }, [filtered]);

  return (
    <div className="wrap">
      <header>
        <div className="rune-divider">ᚱᛖᛋᛟᚢᚱᚲᛖᛋ</div>
        <h1>Where to Get Stuff</h1>
        <p className="subtitle">
          A quick lookup for where every material comes from — search by name, or filter by
          biome.
        </p>
        <div className="badge-row">
          <Link href="/" className="badge" style={{ textDecoration: "none" }}>
            ← Back to the Tracker
          </Link>
        </div>
      </header>

      <div className="progress-shell" style={{ marginBottom: 20 }}>
        <label className="onboard-label" htmlFor="resource-search">
          Search
        </label>
        <input
          id="resource-search"
          type="text"
          className="onboard-input"
          placeholder="e.g. copper, silver, tin…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="badge-row" style={{ justifyContent: "flex-start", marginTop: 14 }}>
          {BIOMES.map((b) => (
            <span
              key={b}
              className="badge"
              style={{
                cursor: "pointer",
                borderColor: activeBiomes.has(b) ? "var(--gold-bright)" : undefined,
                color: activeBiomes.has(b) ? "var(--gold-bright)" : undefined,
              }}
              onClick={() => toggleBiome(b)}
            >
              {b}
            </span>
          ))}
          {activeBiomes.size > 0 && (
            <span className="badge" style={{ cursor: "pointer" }} onClick={() => setActiveBiomes(new Set())}>
              Clear filters
            </span>
          )}
        </div>
      </div>

      {filtered.length === 0 && <p className="loading-note">Nothing matches that search.</p>}

      {Array.from(grouped.entries()).map(([biome, items]) => (
        <div key={biome} style={{ marginBottom: 28 }}>
          <h3 className="sub-heading">{biome}</h3>
          <div className="goal-mats">
            {items.map((r) => (
              <div className="goal-mat" key={r.name}>
                <div className="goal-mat-toprow">
                  <span className="goal-mat-name" style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}>
                    {r.name}
                  </span>
                </div>
                <span className="goal-mat-source">{r.source}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <footer>
        <div className="rune-divider">ᚱᚨᚷᚾᚨᚱᛟᚲ</div>
        Not finding something? It&apos;s probably not added yet — ask whoever&apos;s driving
        the tracker to throw it in.
      </footer>
    </div>
  );
}
