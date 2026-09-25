"use client";

import { goals, iconFor } from "@/lib/data";
import { MatLine, combineTotals } from "./MatLine";

export function GoalsBrowser({
  stash,
  forgedGoals,
  selectedIdxs,
  onToggleSelect,
  onToggleForge,
  onHaveChange,
}: {
  stash: Record<string, number>;
  forgedGoals: Set<number>;
  selectedIdxs: Set<number>;
  onToggleSelect: (idx: number) => void;
  onToggleForge: (idx: number) => void;
  onHaveChange: (name: string, qty: number) => void;
}) {
  const idxs = Array.from(selectedIdxs);

  return (
    <>
      <h2 className="col-heading" style={{ marginTop: 44 }}>Choose Your Goal</h2>
      <p className="col-sub">
        Pick one or more weapons or staves to craft — tap to select, tap again to deselect.
        Selecting more than one shows a combined shopping list below.
      </p>

      <div className="goal-grid">
        {goals.map((g, i) => {
          const forged = forgedGoals.has(i);
          return (
            <div
              key={g.name}
              className={`goal-card${selectedIdxs.has(i) ? " active" : ""}${forged ? " forged" : ""}`}
              onClick={() => onToggleSelect(i)}
            >
              <div
                className="goal-card-icon"
                dangerouslySetInnerHTML={{ __html: iconFor(g.type) }}
              />
              <p className="goal-card-name">
                {g.name}
                {forged && <span className="forged-badge">Forged</span>}
              </p>
              <p className="goal-card-type">{g.type}</p>
              <a
                href={g.wiki}
                target="_blank"
                rel="noopener noreferrer"
                className="onboard-goal-preview goal-card-preview"
                onClick={(e) => e.stopPropagation()}
              >
                view
              </a>
            </div>
          );
        })}
      </div>

      <div className="goal-detail-list">
        {idxs.map((idx) => {
          const g = goals[idx];
          const forged = forgedGoals.has(idx);
          return (
            <div key={g.name} className={`goal-detail${forged ? " forged" : ""}`}>
              <div className="goal-detail-header">
                <div className="goal-detail-titlewrap">
                  <div
                    className="goal-detail-icon"
                    dangerouslySetInnerHTML={{ __html: iconFor(g.type) }}
                  />
                  <h3 className="goal-detail-title">{g.name}</h3>
                </div>
                <span className="goal-detail-station">{g.station}</span>
              </div>
              <p className="goal-detail-blurb">{g.blurb}</p>
              <div className="goal-mats">
                {g.mats.map(([name, qty]) => (
                  <MatLine
                    key={name}
                    name={name}
                    qty={Number(qty)}
                    have={stash[name] || 0}
                    onHaveChange={onHaveChange}
                  />
                ))}
              </div>
              <button className="forge-toggle" onClick={() => onToggleForge(idx)}>
                {forged ? "Unmark Forged" : "Mark as Forged"}
              </button>
              <a href={g.wiki} target="_blank" rel="noopener noreferrer" className="wiki-link">
                View on the Wiki ↗
              </a>
            </div>
          );
        })}
      </div>

      {idxs.length > 1 && (
        <div className="combined-mats" style={{ display: "block" }}>
          <p className="combined-mats-title">Combined Shopping List</p>
          <p className="combined-mats-sub">
            Totals across {idxs.length} selected items — same materials are added together.
          </p>
          <div className="goal-mats">
            {Object.entries(combineTotals(idxs.map((i) => goals[i].mats))).map(
              ([name, qty]) => (
                <MatLine
                  key={name}
                  name={name}
                  qty={qty}
                  have={stash[name] || 0}
                  onHaveChange={onHaveChange}
                />
              )
            )}
          </div>
        </div>
      )}
    </>
  );
}
