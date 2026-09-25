"use client";

import { useEffect, useState, useCallback } from "react";
import { steps, goals } from "@/lib/data";
import { newPlayerId, PLAYER_ID_STORAGE_KEY } from "@/lib/identity";
import { Onboarding } from "./Onboarding";
import { StepsList } from "./StepsSection";
import { GearChecklist } from "./GearChecklist";
import { GoalsBrowser } from "./GoalsBrowser";
import { MyGoals } from "./MyGoals";
import { PartyStatus } from "./PartyStatus";
import { QueenSection } from "./QueenSection";

interface Profile {
  name: string;
  goalIdxs: number[];
}

const GEAR_STORAGE_KEY = "mistlands-gear-v1";

export function TrackerApp() {
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [doneSteps, setDoneSteps] = useState<Set<number>>(new Set());
  const [forgedGoals, setForgedGoals] = useState<Set<number>>(new Set());
  const [stash, setStash] = useState<Record<string, number>>({});
  const [browseSelected, setBrowseSelected] = useState<Set<number>>(new Set());
  const [gearResetToken, setGearResetToken] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let id = "";
    try {
      id = localStorage.getItem(PLAYER_ID_STORAGE_KEY) || "";
    } catch {
      // ignore
    }
    if (!id) {
      id = newPlayerId();
      try {
        localStorage.setItem(PLAYER_ID_STORAGE_KEY, id);
      } catch {
        // ignore
      }
    }
    // One-time hydration on mount: resolve/create this browser's player id
    // and load its saved state. Can't be a lazy useState initializer since
    // localStorage isn't available during SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlayerId(id);

    fetch(`/api/me?playerId=${id}`)
      .then(async (r) => {
        if (!r.ok) {
          // Surface the server's error message when it sent JSON (our API
          // routes do); fall back to the status code otherwise (e.g. an
          // unhandled exception renders an HTML error page instead).
          const message = await r
            .json()
            .then((body) => body?.error)
            .catch(() => null);
          throw new Error(message || `Server returned ${r.status}`);
        }
        return r.json();
      })
      .then((data) => {
        if (data.player) {
          setProfile({ name: data.player.name, goalIdxs: data.player.goalIdxs });
          setBrowseSelected(new Set<number>(data.player.goalIdxs));
          setShowOnboarding(false);
        } else {
          setProfile(null);
          setShowOnboarding(true);
        }
        setDoneSteps(new Set<number>(data.doneSteps));
        setForgedGoals(new Set<number>(data.forgedGoals));
        setStash(data.stash || {});
        setLoaded(true);
      })
      .catch((err) => {
        // Couldn't reach the database — still let them onboard rather than
        // rendering a blank page. Submitting will fail too until the DB is
        // reachable, but at least the problem is visible and diagnosable.
        setLoadError(err?.message || "Couldn't load your saved progress.");
        setShowOnboarding(true);
        setLoaded(true);
      });
  }, []);

  const toggleStep = useCallback(
    (idx: number) => {
      if (!playerId) return;
      setDoneSteps((prev) => {
        const next = new Set(prev);
        const nowDone = !next.has(idx);
        if (nowDone) next.add(idx);
        else next.delete(idx);
        fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerId, stepIndex: idx, done: nowDone }),
        }).catch(() => {});
        return next;
      });
    },
    [playerId]
  );

  const toggleForge = useCallback(
    (idx: number) => {
      if (!playerId) return;
      setForgedGoals((prev) => {
        const next = new Set(prev);
        const nowForged = !next.has(idx);
        if (nowForged) next.add(idx);
        else next.delete(idx);
        fetch("/api/goals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerId, goalIndex: idx, forged: nowForged }),
        }).catch(() => {});
        return next;
      });
    },
    [playerId]
  );

  const setHave = useCallback(
    (material: string, qty: number) => {
      if (!playerId) return;
      setStash((prev) => ({ ...prev, [material]: qty }));
      fetch("/api/stash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId, material, qty }),
      }).catch(() => {});
    },
    [playerId]
  );

  const toggleBrowseSelect = useCallback((idx: number) => {
    setBrowseSelected((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }, []);

  const jumpToGoal = useCallback((idx: number) => {
    setBrowseSelected((prev) => new Set(prev).add(idx));
    requestAnimationFrame(() => {
      document.getElementById("goal-detail-anchor")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  }, []);

  async function submitOnboarding(name: string, goalIdxs: number[]) {
    if (!playerId) return;
    setProfile({ name, goalIdxs });
    setBrowseSelected(new Set(goalIdxs));
    setShowOnboarding(false);
    try {
      const res = await fetch("/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId, name, goalIdxs }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      setLoadError(null);
    } catch (err) {
      // Saved locally in the UI, but the crew won't see it until this
      // succeeds — surface that rather than pretending it's shared.
      setLoadError(
        (err as Error)?.message || "Couldn't save your profile to the shared database."
      );
    }
  }

  function skipOnboarding() {
    setShowOnboarding(false);
  }

  function resetChecklist() {
    if (!playerId) return;
    const toClear = Array.from(doneSteps);
    setDoneSteps(new Set());
    toClear.forEach((idx) => {
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId, stepIndex: idx, done: false }),
      }).catch(() => {});
    });
    try {
      localStorage.removeItem(GEAR_STORAGE_KEY);
    } catch {
      // ignore
    }
    setGearResetToken((t) => t + 1);
  }

  const total = steps.length;
  const completed = doneSteps.size;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  const hasProfile = !!(profile && (profile.name || profile.goalIdxs.length > 0));
  const pageTitle = hasProfile && profile!.name
    ? `${profile!.name}'s Path Into the Mistlands`
    : "Into the Mistlands";
  const goalNames = hasProfile
    ? profile!.goalIdxs.map((i) => goals[i]?.name).filter(Boolean)
    : [];
  const pageSubtitle = goalNames.length
    ? `Forging toward: ${goalNames.join(", ")}. Tap a rune to mark a step complete.`
    : "A group progression plan — from Yagluth's death to The Queen. Tap a rune to mark a step complete; each Viking tracks their own progress.";

  if (!loaded) {
    return (
      <div className="wrap">
        <p className="loading-note">Loading the mist…</p>
      </div>
    );
  }

  return (
    <div className="wrap">
      {showOnboarding && (
        <Onboarding
          initialName={profile?.name || ""}
          initialGoalIdxs={profile?.goalIdxs || []}
          onSubmit={submitOnboarding}
          onSkip={skipOnboarding}
        />
      )}

      {loadError && (
        <p className="error-note">
          Couldn&apos;t reach the shared database ({loadError}) — progress won&apos;t save
          or sync with your crew until this is fixed. Reload once it&apos;s working.
        </p>
      )}

      <header>
        <div className="rune-divider">ᛗᛁᛊᛏᛚᚨᚾᛞᛊ</div>
        <h1>{pageTitle}</h1>
        <p className="subtitle">{pageSubtitle}</p>
        <div className="badge-row">
          <span className="badge">6-Player Crew</span>
          <span className="badge">Requires: Yagluth Slain</span>
          <span className="badge">Casual Portals (metals allowed)</span>
          <span
            className="badge"
            style={{ cursor: "pointer" }}
            onClick={() => setShowOnboarding(true)}
          >
            Edit My Goal ✎
          </span>
        </div>
      </header>

      {hasProfile && (
        <MyGoals
          goalIdxs={profile!.goalIdxs}
          forgedGoals={forgedGoals}
          stash={stash}
          onHaveChange={setHave}
          onJumpTo={jumpToGoal}
        />
      )}

      <div className="progress-shell">
        <div className="progress-label">
          <span>{completed} / {total} steps done</span>
          <span>{pct}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <PartyStatus myId={playerId} />

      <div className="layout">
        <div className="col-main">
          <h2 className="col-heading">The Path</h2>
          <p className="col-sub">Follow in order — each stage sets up the next.</p>

          <h3 className="sub-heading">Before You Sail</h3>
          <p className="sub-heading-note">Prep work done back at your regular base, ahead of the trip.</p>
          <StepsList
            steps={steps.filter((s) => s.phase === "prep")}
            offset={0}
            doneSteps={doneSteps}
            onToggle={toggleStep}
          />

          <h3 className="sub-heading">In the Mistlands</h3>
          <p className="sub-heading-note">Everything from here on happens once you&apos;ve actually landed.</p>
          <StepsList
            steps={steps.filter((s) => s.phase !== "prep")}
            offset={steps.findIndex((s) => s.phase !== "prep")}
            doneSteps={doneSteps}
            onToggle={toggleStep}
          />
        </div>

        <div className="col-side">
          <h2 className="col-heading">Gear to Forge</h2>
          <p className="col-sub">Some materials won&apos;t yield without the right tool in hand.</p>
          <GearChecklist key={gearResetToken} />
        </div>
      </div>

      <button className="reset-btn" onClick={resetChecklist}>
        Reset Checklist
      </button>

      <div id="goal-detail-anchor" />
      <GoalsBrowser
        stash={stash}
        forgedGoals={forgedGoals}
        selectedIdxs={browseSelected}
        onToggleSelect={toggleBrowseSelect}
        onToggleForge={toggleForge}
        onHaveChange={setHave}
      />

      <QueenSection />

      <footer>
        <div className="rune-divider">ᚱᚨᚷᚾᚨᚱᛟᚲ</div>
        The mist clears with patience, not speed. Good luck out there.
      </footer>
    </div>
  );
}
