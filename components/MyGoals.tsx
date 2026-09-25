"use client";

import { goals, iconFor } from "@/lib/data";
import { MatLine, combineTotals } from "./MatLine";

export function MyGoals({
  goalIdxs,
  forgedGoals,
  stash,
  onHaveChange,
  onJumpTo,
}: {
  goalIdxs: number[];
  forgedGoals: Set<number>;
  stash: Record<string, number>;
  onHaveChange: (name: string, qty: number) => void;
  onJumpTo: (idx: number) => void;
}) {
  if (goalIdxs.length === 0) return null;

  const remainingIdxs = goalIdxs.filter((i) => goals[i] && !forgedGoals.has(i));

  return (
    <div className="my-goals-shell">
      <h2 className="col-heading" style={{ marginTop: 0 }}>Your Forge Targets</h2>
      <div className="my-goals-grid">
        {goalIdxs.map((i) => {
          const g = goals[i];
          if (!g) return null;
          const forged = forgedGoals.has(i);
          return (
            <div
              key={g.name}
              className={`my-goal-card${forged ? " forged" : ""}`}
              onClick={() => onJumpTo(i)}
            >
              <div
                className="my-goal-icon"
                dangerouslySetInnerHTML={{ __html: iconFor(g.type) }}
              />
              <div>
                <div className="my-goal-name">
                  {g.name}
                  {forged && <span className="forged-badge">Forged</span>}
                </div>
                <div className="my-goal-type">{g.type}</div>
              </div>
            </div>
          );
        })}
      </div>

      {remainingIdxs.length > 0 ? (
        <div className="combined-mats" style={{ display: "block" }}>
          <p className="combined-mats-title">Total Materials Needed</p>
          <p className="combined-mats-sub">
            Combined across your {remainingIdxs.length} unforged goal
            {remainingIdxs.length > 1 ? "s" : ""} — same materials added together.
          </p>
          <div className="goal-mats">
            {Object.entries(combineTotals(remainingIdxs.map((i) => goals[i].mats))).map(
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
      ) : (
        <div className="combined-mats" style={{ display: "block" }}>
          <p className="combined-mats-title">All goals forged! 🔨</p>
        </div>
      )}
    </div>
  );
}
