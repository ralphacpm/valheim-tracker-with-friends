"use client";

import { Step } from "@/lib/data";

export function StepsList({
  steps,
  offset,
  doneSteps,
  onToggle,
}: {
  steps: Step[];
  offset: number;
  doneSteps: Set<number>;
  onToggle: (idx: number) => void;
}) {
  return (
    <div className="steps">
      {steps.map((step, i) => {
        const idx = offset + i;
        const isDone = doneSteps.has(idx);
        return (
          <div key={idx} className={`step${isDone ? " done" : ""}`}>
            <div className="step-check" onClick={() => onToggle(idx)}>
              <span>{isDone ? "✓" : ""}</span>
            </div>
            <div>
              <div className="step-num">Stage {idx + 1}</div>
              <p className="step-title">{step.title}</p>
              <p
                className="step-detail"
                dangerouslySetInnerHTML={{ __html: step.detail }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
