"use client";

import { useEffect, useState } from "react";
import { gearItems } from "@/lib/data";

const GEAR_STORAGE_KEY = "mistlands-gear-v1";

// This checklist is per-browser, not shared — the handoff spec explicitly
// allows it to stay local rather than adding another synced table.
export function GearChecklist() {
  const [gearDone, setGearDone] = useState<Record<number, boolean>>({});

  useEffect(() => {
    // One-time hydration from localStorage on mount (can't read it during
    // SSR, so this can't be a lazy useState initializer instead).
    try {
      const raw = localStorage.getItem(GEAR_STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setGearDone(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  function toggle(i: number) {
    setGearDone((prev) => {
      const next = { ...prev, [i]: !prev[i] };
      try {
        localStorage.setItem(GEAR_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }

  return (
    <div className="steps">
      {gearItems.map((item, i) => {
        const isDone = !!gearDone[i];
        return (
          <div key={item.tool} className={`gear-item${isDone ? " done" : ""}`}>
            <div className="step-check" onClick={() => toggle(i)}>
              <span>{isDone ? "✓" : ""}</span>
            </div>
            <div>
              <p className="step-title">{item.tool}</p>
              <span className="gear-need">{item.need}</span>
              <p className="step-detail" style={{ marginTop: 8 }}>{item.detail}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
