"use client";

import { materialSources } from "@/lib/data";

export function MatLine({
  name,
  qty,
  have,
  onHaveChange,
}: {
  name: string;
  qty: number;
  have: number;
  onHaveChange: (name: string, qty: number) => void;
}) {
  const source = materialSources[name] || "";
  const remaining = Math.max(0, qty - have);
  const complete = remaining === 0;

  return (
    <div className={`goal-mat${complete ? " mat-complete" : ""}`}>
      <div className="goal-mat-toprow">
        <span className="goal-mat-name">{name}</span>
        <span className="goal-mat-qty">{qty}</span>
      </div>
      {source && <span className="goal-mat-source">{source}</span>}
      <div className="goal-mat-progress">
        <label className="goal-mat-have-label">
          Have
          <input
            type="number"
            min={0}
            className="mat-have-input"
            value={have || 0}
            onChange={(e) => onHaveChange(name, Math.max(0, Number(e.target.value) || 0))}
          />
        </label>
        <span className="goal-mat-remaining">
          {complete ? "Ready ✓" : `${remaining} more`}
        </span>
      </div>
    </div>
  );
}

export function combineTotals(matsList: [string, string][][]): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const mats of matsList) {
    for (const [name, qty] of mats) {
      totals[name] = (totals[name] || 0) + Number(qty);
    }
  }
  return totals;
}
