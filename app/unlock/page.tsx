"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function UnlockForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/passcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      if (!res.ok) {
        setError("Wrong passcode. Ask whoever set up the party for it.");
        setBusy(false);
        return;
      }
      router.replace(params.get("next") || "/");
      router.refresh();
    } catch {
      setError("Something went wrong — try again.");
      setBusy(false);
    }
  }

  return (
    <div className="onboard-overlay" style={{ position: "fixed" }}>
      <div className="onboard-card">
        <div className="rune-divider">ᚹᛖᛚᚲᛟᛗᛖ</div>
        <h2 className="onboard-title">Party Passcode</h2>
        <p className="onboard-sub">
          This crew&apos;s tracker is locked. Enter the passcode to get in.
        </p>
        <form onSubmit={submit}>
          <label className="onboard-label" htmlFor="passcode">
            Passcode
          </label>
          <input
            id="passcode"
            type="password"
            className="onboard-input"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            autoFocus
          />
          {error && (
            <p style={{ color: "var(--gold-bright)", fontSize: 14, marginTop: 10 }}>
              {error}
            </p>
          )}
          <button className="onboard-submit" type="submit" disabled={busy}>
            {busy ? "Checking…" : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function UnlockPage() {
  return (
    <Suspense fallback={null}>
      <UnlockForm />
    </Suspense>
  );
}
