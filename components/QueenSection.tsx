export function QueenSection() {
  return (
    <>
      <h2 className="col-heading" style={{ marginTop: 44 }}>The Final Fight: The Queen</h2>
      <p className="col-sub">
        Unlike every other boss, there&apos;s no altar sacrifice — you enter the Infested
        Citadel with a Sealbreaker and she&apos;s simply waiting inside.
      </p>

      <div className="queen-summary">
        <div className="queen-stat">
          <span className="queen-stat-label">Health</span>
          <span className="queen-stat-value">~12,500</span>
        </div>
        <div className="queen-stat">
          <span className="queen-stat-label">Resists</span>
          <span className="queen-stat-value">Pierce (½)</span>
        </div>
        <div className="queen-stat">
          <span className="queen-stat-label">Weakness</span>
          <span className="queen-stat-value">None</span>
        </div>
        <div className="queen-stat">
          <span className="queen-stat-label">Location</span>
          <span className="queen-stat-value">Infested Citadel</span>
        </div>
      </div>

      <div className="queen-warning">
        <strong>Key mechanic:</strong> if she isn&apos;t taking damage, she regenerates
        health. A damage-over-time effect (fire, poison) kept up constantly matters more
        than raw burst — every second spent not hitting her is a second she&apos;s healing
        back up.
      </div>

      <div className="steps queen-attacks" style={{ marginBottom: 22 }}>
        {[
          {
            num: "Entry",
            title: "Craft a Sealbreaker",
            detail:
              "9 Sealbreaker Fragments, found scattered across Infested Mines, combine into one Sealbreaker to unlock the Citadel door. First fight needs no altar or trophies — just walk in.",
          },
          {
            num: "100% – 90% HP",
            title: "Call",
            detail:
              "She roars and spawns Seekers and Seeker broods into the arena. Present from the very start of the fight — expect adds immediately.",
          },
          {
            num: "Below 90% HP",
            title: "Burrow",
            detail:
              "Up to once every 60 seconds, she can burrow into the ground and re-emerge somewhere else within 200m. Don't panic if she vanishes mid-fight — she's not gone.",
          },
          {
            num: "Below 80% HP",
            title: "Spit",
            detail:
              "A ranged spit attack that inflicts the Slimed status effect. Watch for this if you're kiting at range.",
          },
          {
            num: "Below 70% HP",
            title: "Bite",
            detail:
              "A lunging bite dealing Pierce + Poison damage in a narrow forward arc. Poison Resistance Mead becomes essential from this point on.",
          },
          {
            num: "Below 60% HP",
            title: "Rush",
            detail:
              "A charging arm-slash covering 16+ meters in a wide arc. By this point every attack is active and the arena is usually swarming — this is where most groups wipe. Use pillars and walls to break her charge line.",
          },
        ].map((atk) => (
          <div key={atk.title} className="step queen-attack">
            <div className="step-pip" />
            <div>
              <div className="step-num">{atk.num}</div>
              <p className="step-title">{atk.title}</p>
              <p className="step-detail">{atk.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="queen-tips">
        <p className="combined-mats-title" style={{ marginBottom: 10 }}>Group Strategy</p>
        <ul className="queen-tip-list">
          <li>Fight on the Citadel&apos;s upper floor when possible — it has no mist, so you get full visibility.</li>
          <li>Assign roles: one or two tank/kite her attention, others focus burst damage and clear Seeker adds so they don&apos;t overwhelm the group.</li>
          <li>Carapace Armor is the best melee armor available in Mistlands; a Feather Cape lets you safely drop a level if she corners you.</li>
          <li>Bring Poison Resistance Mead, stamina/healing food, and keep a fire-based weapon or Staff of Embers active to stop her regen between hits.</li>
          <li>You can retreat through the entrance mid-fight to repair or restock — her health doesn&apos;t reset, it just slowly regenerates like normal. Not cheese, just a valid pacing strategy for a long fight.</li>
        </ul>
      </div>

      <div className="queen-loot">
        <p className="combined-mats-title" style={{ marginBottom: 6 }}>On Victory</p>
        <p className="col-sub" style={{ marginBottom: 0 }}>
          Drops Queen&apos;s Trophy, 10x Yggdrasil Dew, and 1x Royal Jelly. Hanging her
          trophy grants a Forsaken Power that boosts mining speed and doubles Eitr
          regeneration for its duration — the signal that your group is ready for Ashlands.
        </p>
      </div>
    </>
  );
}
