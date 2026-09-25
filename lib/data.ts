// Static game content, ported verbatim from mistlands-guide.html.
// Do not regenerate — this is the source of truth for game data.

export type Phase = "prep" | "mistlands";

export interface Step {
  title: string;
  detail: string;
  phase: Phase;
}

export const steps: Step[] = [
  { title: "Craft a Wisplight for everyone", detail: "1 Wisp + 1 Silver at a Workbench, per person. Equip it in the accessory slot.", phase: "prep" },
  { title: "Stock up on Black Metal", detail: "You're on Casual portal settings, so Black Metal (and everything else) can go straight through a portal — no boat run needed, just bring it whenever you head out.", phase: "prep" },
  { title: "Craft a Black Metal Axe", detail: "6 Fine Wood + 20 Black Metal + 5 Linen Thread at a Forge (level 4). Unlike the pickaxe, it needs no Mistlands-exclusive materials, so make it before you sail — you can't harvest a single piece of Yggdrasil Wood without it.", phase: "prep" },
  { title: "Upgrade your Fenris armor to max level (4)", detail: "If your crew is running Fenris gear, take it to a Forge and push it as far as it'll go before you sail — check the wiki for the exact upgrade materials at each level.", phase: "prep" },
  { title: "Buy a Megingjord from Haldor", detail: "950 gold at the Trader — permanently boosts your max carry weight by 150. One of the best gold-for-value buys before a long harvesting trip.", phase: "prep" },
  { title: "Cook up Eyescream", detail: "One of the Mistlands-tier foods — check the wiki for the current recipe and stock enough for the whole crew before you land.", phase: "prep" },
  { title: "Cook up Blood Pudding", detail: "Another Mistlands-tier food option — check the wiki for the recipe and bring a batch along with your Eyescream.", phase: "prep" },
  { title: "Stock up on HP foods", detail: "Round out your food bar with high-HP options like Honey Glazed Chicken and Lox Meat Pie alongside your Mistlands food, so you're not squishy while exploring.", phase: "prep" },
  { title: "Sail in and land", detail: "Take a Longship, find a safe coastal landing spot, and build a small forward outpost (Workbench + bed).", phase: "mistlands" },
  { title: "Secure the outpost with Wisp Torches", detail: "Fuel-free, placeable, and permanently clear fog in a radius — ring your base with them.", phase: "mistlands" },
  { title: "Craft a Black Metal Pickaxe", detail: "25 Black Metal + 3 Yggdrasil Wood. Chop a Yggdrasil Shoot near your landing spot with your new axe to get the wood — you need this pickaxe before you can mine Black Marble or Soft Tissue.", phase: "mistlands" },
  { title: "Explore carefully", detail: "Move slowly, stay grouped, and listen for Seekers and Gjalls. Collect Black Marble and Soft Tissue from <code>Giant Remains</code> — skeletal rib cages and skulls scattered across the biome. Ribs give Black Marble only; skulls hold a Soft Tissue node inside, best mined from the bottom up so it collapses at once. Also gather more Yggdrasil Wood as you go, and mine any discarded armor or swords you spot — they yield Scrap Iron, a handy source beyond Swamp crypts.", phase: "mistlands" },
  { title: "Raid Dvergr settlements", detail: "Loot the glowing-rune crates for a <code>Dvergr Extractor</code> — this aggros nearby Dvergr, so clear the area first. Some towers hide a dungeon entrance in the basement, especially ones occupied by Seekers instead of Dvergr — worth checking for extra loot.", phase: "mistlands" },
  { title: "Build Sap Extractors", detail: "10 Yggdrasil Wood + 5 Black Metal + 1 Dvergr Extractor, placed on Ancient Roots. Spread a few across different roots and empty them regularly.", phase: "mistlands" },
  { title: "Build an Eitr Refinery", detail: "Combines Sap + Soft Tissue into Refined Eitr.", phase: "mistlands" },
  { title: "Build a Black Forge", detail: "Unlocks Black Metal gear and Carapace Armor.", phase: "mistlands" },
  { title: "Grab a Grappling Hook", detail: "Needs some Mistlands progress under your belt first — check the wiki for the exact recipe. Mistlands terrain is steep and vertical, so falls are a common way to lose gear or die mid-harvest run. Not strictly required, but well worth crafting once you can.", phase: "mistlands" },
  { title: "Build a Galdr Table", detail: "Craft the magic staves using Refined Eitr.", phase: "mistlands" },
  { title: "Find the Infested Mines and collect Sealbreaker Fragments", detail: "Located beneath Black Marble ruins. Collect 9 Fragments, then craft the <code>Sealbreaker</code>.", phase: "mistlands" },
  { title: "Gear up and summon The Queen", detail: "Bring Eitr food and your best Mistlands-tier gear, then use the Sealbreaker to open her arena.", phase: "mistlands" },
];

// How many of the leading `steps` entries are "Before You Sail" prep —
// i.e. what "readiness" means. Relies on all prep steps being contiguous
// at the start of the array (enforced by convention above).
export const readinessStepCount = steps.filter((s) => s.phase === "prep").length;

export const materialSources: Record<string, string> = {
  "Fine Wood": "Chop Birch/Oak trees with a Bronze Axe or better (Meadows, Plains)",
  Iron: "Smelt Scrap Iron in a Smelter (Swamp crypts)",
  "Refined Eitr": "Combine Sap + Soft Tissue at an Eitr Refinery",
  Wisp: "Collected from a Wisp Fountain at night (Mistlands)",
  Bronze: "Smelt Copper + Tin at a Forge (2:1 ratio)",
  "Scale Hide": "Dropped by Hares (Mistlands)",
  "Black Metal": "Smelt Black Metal Scrap in a Blast Furnace (Fuling drops, Plains)",
  "Yggdrasil Wood": "Chop Yggdrasil Shoots with a Black Metal Axe or better (Mistlands)",
  Bilebag: "Dropped by Gjall (Mistlands)",
  Silver: "Mine Silver veins with the Wishbone equipped (Mountains)",
  Mandible: "Dropped by Seeker Soldiers (Mistlands)",
  Carapace: "Dropped by Seekers (Mistlands)",
  "Surtling Core": "Burial Chambers (Black Forest), or dropped by Surtlings (Swamp)",
  "Freeze Gland": "Dropped by Fenring (Mountains)",
  "Blood Clot": "Dropped by Ticks (Mistlands)",
};

export type GoalType =
  | "Sword"
  | "Two-Handed Sword"
  | "Two-Handed Knife"
  | "Axe"
  | "Sledge (Blunt)"
  | "Atgeir (Polearm)"
  | "Spear"
  | "Magic Staff";

export interface Goal {
  name: string;
  type: GoalType;
  station: string;
  wiki: string;
  blurb: string;
  mats: [string, string][];
}

export const goals: Goal[] = [
  {
    name: "Mistwalker",
    type: "Sword",
    station: "Black Forge",
    wiki: "https://valheim.weirdgloop.org/w/Mistwalker",
    blurb: "Balanced slash + frost damage, and it dispels mist in a 5m radius as you carry it — a strong all-round pick for a first Mistlands weapon.",
    mats: [
      ["Fine Wood", "3"],
      ["Iron", "15"],
      ["Refined Eitr", "10"],
      ["Wisp", "3"],
    ],
  },
  {
    name: "Skoll and Hati",
    type: "Two-Handed Knife",
    station: "Black Forge",
    wiki: "https://valheim.weirdgloop.org/w/Skoll_and_Hati",
    blurb: "Dual blades built for backstabs — 6x damage against unalerted enemies, plus a leaping secondary attack for 3x damage.",
    mats: [
      ["Fine Wood", "4"],
      ["Iron", "10"],
      ["Black Metal", "10"],
    ],
  },
  {
    name: "Jotun Bane",
    type: "Axe",
    station: "Black Forge",
    wiki: "https://valheim.weirdgloop.org/w/Jotun_Bane",
    blurb: "Chops any tree in the game including Yggdrasil Shoots, and doubles as a strong poison weapon in combat — the best of both worlds for an axe-main.",
    mats: [
      ["Yggdrasil Wood", "5"],
      ["Iron", "15"],
      ["Bilebag", "3"],
      ["Refined Eitr", "10"],
    ],
  },
  {
    name: "Demolisher",
    type: "Sledge (Blunt)",
    station: "Black Forge",
    wiki: "https://valheim.weirdgloop.org/w/Demolisher",
    blurb: "Heavy blunt damage for cracking open Stone Golems and other armored targets — no Mistlands-exclusive drop needed beyond the wood.",
    mats: [
      ["Yggdrasil Wood", "10"],
      ["Iron", "20"],
      ["Refined Eitr", "10"],
    ],
  },
  {
    name: "Krom",
    type: "Two-Handed Sword",
    station: "Black Forge",
    wiki: "https://valheim.weirdgloop.org/w/Krom",
    blurb: "Highest single-hit melee damage at this tier — heavy, slow, and doesn't need Mistlands-exclusive materials, so it's craftable early if you've stocked Iron and Bronze.",
    mats: [
      ["Iron", "30"],
      ["Bronze", "20"],
      ["Scale Hide", "5"],
    ],
  },
  {
    name: "Himminafl",
    type: "Atgeir (Polearm)",
    station: "Black Forge",
    wiki: "https://valheim.weirdgloop.org/w/Himminafl",
    blurb: "Pierce + Lightning damage with a staggering spin attack — the best crowd-control polearm in the biome.",
    mats: [
      ["Yggdrasil Wood", "10"],
      ["Refined Eitr", "15"],
      ["Silver", "5"],
      ["Mandible", "2"],
    ],
  },
  {
    name: "Carapace Spear",
    type: "Spear",
    station: "Black Forge",
    wiki: "https://valheim.weirdgloop.org/w/Carapace_Spear",
    blurb: "Cheapest of the new Mistlands weapons to assemble — a solid early pick while you're still stocking Refined Eitr for the pricier gear.",
    mats: [
      ["Yggdrasil Wood", "10"],
      ["Carapace", "4"],
      ["Mandible", "2"],
    ],
  },
  {
    name: "Staff of Embers",
    type: "Magic Staff",
    station: "Galdr Table",
    wiki: "https://valheim.weirdgloop.org/w/Staff_of_Embers",
    blurb: "Lobs an arcing fireball with AoE burn damage. One of the two staves recommended for the fight against The Queen.",
    mats: [
      ["Yggdrasil Wood", "20"],
      ["Surtling Core", "4"],
      ["Refined Eitr", "16"],
    ],
  },
  {
    name: "Staff of Frost",
    type: "Magic Staff",
    station: "Galdr Table",
    wiki: "https://valheim.weirdgloop.org/w/Staff_of_Frost",
    blurb: "Rapid-fire freezing shards — the strongest crowd-control magic option in Mistlands.",
    mats: [
      ["Yggdrasil Wood", "20"],
      ["Freeze Gland", "4"],
      ["Refined Eitr", "16"],
    ],
  },
  {
    name: "Staff of Protection",
    type: "Magic Staff",
    station: "Galdr Table",
    wiki: "https://valheim.weirdgloop.org/w/Staff_of_Protection",
    blurb: "Casts a protective barrier rather than dealing damage — a support pick for keeping your group alive on tougher pulls.",
    mats: [
      ["Yggdrasil Wood", "20"],
      ["Blood Clot", "4"],
      ["Refined Eitr", "16"],
    ],
  },
];

export const iconMap: Record<string, string> = {
  sword: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 4 L27 30 L24 34 L21 30 Z" fill="var(--gold-bright)"/><rect x="17" y="30" width="14" height="3" rx="1" fill="var(--iron)"/><rect x="22.5" y="33" width="3" height="11" rx="1" fill="var(--gold)"/><circle cx="24" cy="45" r="2.2" fill="var(--gold-bright)"/></svg>`,
  greatsword: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 2 L28 28 L24 33 L20 28 Z" fill="var(--gold-bright)"/><rect x="15" y="28" width="18" height="3.5" rx="1" fill="var(--iron)"/><rect x="22" y="32" width="4" height="14" rx="1.5" fill="var(--gold)"/></svg>`,
  knife: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 34 L30 10 L34 14 L20 38 Z" fill="var(--gold-bright)"/><rect x="12" y="32" width="10" height="3" rx="1" transform="rotate(-35 12 32)" fill="var(--iron)"/><path d="M30 10 L34 14 L37 8 Z" fill="var(--gold)"/></svg>`,
  axe: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M26 6 C36 6 40 14 38 22 C34 20 28 20 25 24 L20 19 C24 15 24 10 26 6 Z" fill="var(--gold-bright)"/><rect x="21" y="18" width="4" height="26" rx="1.5" transform="rotate(15 21 18)" fill="var(--gold)"/></svg>`,
  sledge: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="8" width="20" height="14" rx="2" fill="var(--gold-bright)"/><rect x="18" y="20" width="4" height="24" rx="1.5" fill="var(--gold)"/></svg>`,
  polearm: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 2 L30 16 L24 20 L18 16 Z" fill="var(--gold-bright)"/><path d="M14 10 L24 20 L14 22 Z" fill="var(--gold)" opacity="0.85"/><path d="M34 10 L24 20 L34 22 Z" fill="var(--gold)" opacity="0.85"/><rect x="22.5" y="19" width="3" height="26" rx="1.5" fill="var(--iron)"/></svg>`,
  spear: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 3 L30 18 L24 22 L18 18 Z" fill="var(--gold-bright)"/><rect x="22.5" y="20" width="3" height="25" rx="1.5" fill="var(--gold)"/></svg>`,
  staff: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="21.5" y="10" width="5" height="34" rx="2" fill="var(--gold)"/><circle cx="24" cy="8" r="7" fill="var(--gold-bright)" opacity="0.9"/><circle cx="24" cy="8" r="3" fill="var(--card)"/></svg>`,
};

export const typeToIcon: Record<GoalType, string> = {
  Sword: "sword",
  "Two-Handed Sword": "greatsword",
  "Two-Handed Knife": "knife",
  Axe: "axe",
  "Sledge (Blunt)": "sledge",
  "Atgeir (Polearm)": "polearm",
  Spear: "spear",
  "Magic Staff": "staff",
};

export function iconFor(type: GoalType): string {
  return iconMap[typeToIcon[type]] || iconMap.sword;
}
