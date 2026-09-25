"use client";

import { useState } from "react";
import useSWR from "swr";
import { steps, goals } from "@/lib/data";

interface PartyMember {
  id: string;
  name: string;
  goalCount: number;
  readinessDone: number;
  readinessTotal: number;
  forgedCount: number;
}

interface MemberDetail {
  player: { id: string; name: string; goalIdxs: number[] } | null;
  doneSteps: number[];
  forgedGoals: number[];
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function MemberChecklist({ playerId }: { playerId: string }) {
  const { data, error } = useSWR<MemberDetail>(`/api/me?playerId=${playerId}`, fetcher, {
    refreshInterval: 4000,
  });

  if (error) return <p className="error-note">Couldn&apos;t load their checklist.</p>;
  if (!data) return <p className="loading-note" style={{ padding: "12px 0" }}>Loading…</p>;

  const done = new Set(data.doneSteps);
  const forged = new Set(data.forgedGoals);
  const goalIdxs = data.player?.goalIdxs ?? [];

  return (
    <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--card-border)" }}>
      <p
        className="onboard-label"
        style={{ marginBottom: 6 }}
      >
        Before You Sail
      </p>
      <ul style={{ margin: "0 0 10px", padding: 0, listStyle: "none" }}>
        {steps
          .map((s, i) => ({ s, i }))
          .filter(({ s }) => s.phase === "prep")
          .map(({ s, i }) => (
            <li key={i} style={{ fontSize: 14, color: "var(--text-dim)", padding: "2px 0" }}>
              {done.has(i) ? "✓" : "○"} {s.title}
            </li>
          ))}
      </ul>

      <p className="onboard-label" style={{ marginBottom: 6 }}>
        In the Mistlands
      </p>
      <ul style={{ margin: "0 0 10px", padding: 0, listStyle: "none" }}>
        {steps
          .map((s, i) => ({ s, i }))
          .filter(({ s }) => s.phase !== "prep")
          .map(({ s, i }) => (
            <li key={i} style={{ fontSize: 14, color: "var(--text-dim)", padding: "2px 0" }}>
              {done.has(i) ? "✓" : "○"} {s.title}
            </li>
          ))}
      </ul>

      {goalIdxs.length > 0 && (
        <>
          <p className="onboard-label" style={{ marginBottom: 6 }}>
            Goals
          </p>
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {goalIdxs.map((i) => {
              const g = goals[i];
              if (!g) return null;
              return (
                <li key={i} style={{ fontSize: 14, color: "var(--text-dim)", padding: "2px 0" }}>
                  {forged.has(i) ? "✓" : "○"} {g.name}
                  {forged.has(i) && <span className="forged-badge" style={{ marginLeft: 8 }}>Forged</span>}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

export function PartyStatus({ myId }: { myId: string | null }) {
  const { data } = useSWR<{ members: PartyMember[] }>("/api/party", fetcher, {
    refreshInterval: 4000,
    revalidateOnFocus: true,
  });
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const members = data?.members ?? [];
  if (members.length === 0) return null;

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="my-goals-shell" style={{ display: "block" }}>
      <h2 className="col-heading" style={{ marginTop: 0 }}>Party Status</h2>
      <p className="col-sub">
        Live readiness from everyone in your crew who&apos;s opened this page — % of
        &ldquo;Before You Sail&rdquo; steps done, independent of which weapons they&apos;re
        forging. Tap anyone to see their actual checklist.
      </p>
      <div className="party-list">
        {members.map((m) => {
          const pct = m.readinessTotal
            ? Math.round((m.readinessDone / m.readinessTotal) * 100)
            : 0;
          const isMe = m.id === myId;
          const isOpen = expanded.has(m.id);
          return (
            <div
              key={m.id}
              className={`party-member${isMe ? " party-member-you" : ""}`}
              style={{ cursor: "pointer" }}
              onClick={() => toggle(m.id)}
            >
              <div className="party-member-top">
                <span className="party-member-name">
                  {m.name || "A Viking"}
                  {isMe ? " (you)" : ""}
                </span>
                <span className="party-member-pct">{pct}% ready</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="party-member-sub">
                Separately: {m.forgedCount} forged{m.goalCount ? ` of ${m.goalCount} goals chosen` : ""}
                {" · "}
                <span style={{ textDecoration: "underline" }}>
                  {isOpen ? "hide checklist" : "view checklist"}
                </span>
              </div>
              {isOpen && <MemberChecklist playerId={m.id} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
