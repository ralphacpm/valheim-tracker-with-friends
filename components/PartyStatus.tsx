"use client";

import useSWR from "swr";

interface PartyMember {
  id: string;
  name: string;
  goalCount: number;
  stepsDone: number;
  stepsTotal: number;
  forgedCount: number;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function PartyStatus({ myId }: { myId: string | null }) {
  const { data } = useSWR<{ members: PartyMember[] }>("/api/party", fetcher, {
    refreshInterval: 4000,
    revalidateOnFocus: true,
  });

  const members = data?.members ?? [];
  if (members.length === 0) return null;

  return (
    <div className="my-goals-shell" style={{ display: "block" }}>
      <h2 className="col-heading" style={{ marginTop: 0 }}>Party Status</h2>
      <p className="col-sub">Live progress from everyone in your crew who&apos;s opened this page.</p>
      <div className="party-list">
        {members.map((m) => {
          const pct = m.stepsTotal ? Math.round((m.stepsDone / m.stepsTotal) * 100) : 0;
          const isMe = m.id === myId;
          return (
            <div key={m.id} className={`party-member${isMe ? " party-member-you" : ""}`}>
              <div className="party-member-top">
                <span className="party-member-name">
                  {m.name || "A Viking"}
                  {isMe ? " (you)" : ""}
                </span>
                <span className="party-member-pct">{pct}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="party-member-sub">
                {m.forgedCount} forged{m.goalCount ? ` of ${m.goalCount} goals chosen` : ""}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
