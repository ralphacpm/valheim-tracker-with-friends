"use client";

import { useState } from "react";
import { goals } from "@/lib/data";

export function Onboarding({
  initialName,
  initialGoalIdxs,
  onSubmit,
  onSkip,
}: {
  initialName: string;
  initialGoalIdxs: number[];
  onSubmit: (name: string, goalIdxs: number[]) => void;
  onSkip: () => void;
}) {
  const [name, setName] = useState(initialName);
  const [selected, setSelected] = useState<Set<number>>(new Set(initialGoalIdxs));

  function toggle(i: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <div className="onboard-overlay">
      <div className="onboard-card">
        <div className="rune-divider">ᚹᛖᛚᚲᛟᛗᛖ</div>
        <h2 className="onboard-title">Before You Sail In</h2>
        <p className="onboard-sub">
          Tell us who you are and what you&apos;re forging — the crew will see it too.
        </p>

        <label className="onboard-label" htmlFor="onboard-name">Your name</label>
        <input
          id="onboard-name"
          type="text"
          className="onboard-input"
          placeholder="e.g. Ralph"
          maxLength={30}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="onboard-label" style={{ marginTop: 16 }}>
          What are you aiming to craft? (pick any)
        </label>
        <div className="onboard-goal-list">
          {goals.map((g, i) => {
            const isSel = selected.has(i);
            return (
              <label
                key={g.name}
                className={`onboard-goal-item${isSel ? " selected" : ""}`}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest(".onboard-goal-preview")) return;
                }}
              >
                <input type="checkbox" checked={isSel} onChange={() => toggle(i)} />
                <span className="onboard-goal-name">{g.name}</span>
                <a
                  href={g.wiki}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="onboard-goal-preview"
                  onClick={(e) => e.stopPropagation()}
                >
                  view
                </a>
              </label>
            );
          })}
        </div>

        <button
          className="onboard-submit"
          onClick={() => onSubmit(name.trim(), Array.from(selected))}
        >
          Begin the Journey
        </button>
        <button className="onboard-skip" onClick={onSkip}>
          Skip for now
        </button>
      </div>
    </div>
  );
}
