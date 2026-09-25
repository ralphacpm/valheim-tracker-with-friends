// A general "where do I get X" reference, spanning every biome up through
// Mistlands (the furthest this crew has reached). Not exhaustive — covers
// the materials people actually go looking for. Extend the array below as
// you run into things it's missing.

export type Biome =
  | "Meadows"
  | "Black Forest"
  | "Swamp"
  | "Mountains"
  | "Plains"
  | "Mistlands"
  | "Any";

export interface ResourceEntry {
  name: string;
  biome: Biome;
  source: string;
}

export const resources: ResourceEntry[] = [
  // --- Meadows ---
  { name: "Wood", biome: "Meadows", source: "Chop Birch or Pine trees with any Axe." },
  { name: "Stone", biome: "Meadows", source: "Pick up loose rocks, or mine larger rocks with an Antler Pickaxe or better." },
  { name: "Flint", biome: "Meadows", source: "Scattered along riverbanks and beaches — pick up by hand." },
  { name: "Resin", biome: "Meadows", source: "Dropped by Greylings, or found on the ground near Greydwarf spawners." },
  { name: "Leather Scraps", biome: "Meadows", source: "Dropped by Boars and Deer." },
  { name: "Deer Hide", biome: "Meadows", source: "Dropped by Deer." },
  { name: "Honey", biome: "Meadows", source: "Harvested from wild Beehives found in the world." },
  { name: "Raspberry", biome: "Meadows", source: "Foraged from raspberry bushes." },
  { name: "Dandelion", biome: "Meadows", source: "Foraged from the ground — used in early Stamina Mead." },

  // --- Black Forest ---
  { name: "Copper", biome: "Black Forest", source: "Mine surface Copper deposits (large rock clusters, often near Burial Chambers) with an Antler Pickaxe." },
  { name: "Tin", biome: "Black Forest", source: "Mine small Tin deposits along riverbanks and coastlines with an Antler Pickaxe." },
  { name: "Antler", biome: "Black Forest", source: "Dropped by Stags." },
  { name: "Core Wood", biome: "Black Forest", source: "Chop Pine trees with a Bronze Axe or better." },
  { name: "Ancient Bark", biome: "Black Forest", source: "Chop Ancient Trees, found growing near Burial Chambers." },
  { name: "Troll Hide", biome: "Black Forest", source: "Dropped by Trolls." },
  { name: "Greydwarf Eye", biome: "Black Forest", source: "Dropped by Greydwarves." },
  { name: "Surtling Core (early)", biome: "Black Forest", source: "Found in Burial Chambers, guarded by skeletons." },
  { name: "Thistle", biome: "Black Forest", source: "Foraged low purple plant — used in Stamina Mead." },
  { name: "Blueberries", biome: "Black Forest", source: "Foraged from blueberry bushes." },
  { name: "Mushroom", biome: "Black Forest", source: "Foraged from the forest floor." },

  // --- Swamp ---
  { name: "Iron (as Scrap Iron)", biome: "Swamp", source: "Loot Muddy Scrap Piles inside Sunken Crypts (need a Swamp Key, dropped by Draugr Elite/Crypt bosses), then smelt in a Smelter." },
  { name: "Ancient Seed", biome: "Swamp", source: "Loot from Sunken Crypts — needed to summon Bonemass at his altar." },
  { name: "Guck", biome: "Swamp", source: "Dropped by Blobs and Oozers." },
  { name: "Entrails", biome: "Swamp", source: "Dropped by Draugr." },
  { name: "Withered Bone", biome: "Swamp", source: "Found scattered inside Sunken Crypts." },
  { name: "Coal", biome: "Any", source: "Burn Wood or Core Wood in a Charcoal Kiln, or find as loot in Crypts/Burial Chambers." },
  { name: "Fine Wood", biome: "Swamp", source: "Chop Birch/Oak trees near the Swamp/Meadows border with a Bronze Axe or better." },

  // --- Mountains ---
  { name: "Silver", biome: "Mountains", source: "Mine Silver veins — only visible while wearing a Wishbone — with an Iron Pickaxe or better." },
  { name: "Obsidian", biome: "Mountains", source: "Mine dark stone deposits scattered on the surface with an Iron Pickaxe or better." },
  { name: "Crystal", biome: "Mountains", source: "Mined alongside Silver veins, or dropped by Stone Golems." },
  { name: "Freeze Gland", biome: "Mountains", source: "Dropped by Fenring." },
  { name: "Wolf Pelt", biome: "Mountains", source: "Dropped by Wolves." },
  { name: "Wolf Fang", biome: "Mountains", source: "Dropped by Wolves." },
  { name: "Wolf Meat", biome: "Mountains", source: "Dropped by Wolves." },
  { name: "Dragon Tear", biome: "Mountains", source: "Dropped by Stone Golems — used to summon Moder." },

  // --- Plains ---
  { name: "Black Metal (as Scrap)", biome: "Plains", source: "Dropped by Fulings, then smelted in a Blast Furnace." },
  { name: "Flax", biome: "Plains", source: "Farmed — plant Flax seeds, looted from Fuling villages, in tilled soil." },
  { name: "Barley", biome: "Plains", source: "Farmed — plant Barley seeds, looted from Fuling villages, in tilled soil." },
  { name: "Linen Thread", biome: "Plains", source: "Spin harvested Flax at a Loom." },
  { name: "Tar", biome: "Plains", source: "Harvested from Tar Pits — guarded by Growths and Tar Ghosts, so clear the area first." },
  { name: "Thunderstone", biome: "Plains", source: "Looted from Fuling villages and camps — needed to summon Yagluth." },

  // --- Mistlands ---
  { name: "Black Marble", biome: "Mistlands", source: "Mine skeletal rib cages in Giant Remains with a Black Metal Pickaxe." },
  { name: "Soft Tissue", biome: "Mistlands", source: "Mine skulls in Giant Remains with a Black Metal Pickaxe — best mined bottom-up so it collapses at once." },
  { name: "Yggdrasil Wood", biome: "Mistlands", source: "Chop Yggdrasil Shoots with a Black Metal Axe or better." },
  { name: "Wisp", biome: "Mistlands", source: "Collected from a Wisp Fountain at night." },
  { name: "Sap", biome: "Mistlands", source: "Collected via a Sap Extractor placed on a large glowing Ancient Root." },
  { name: "Refined Eitr", biome: "Mistlands", source: "Combine Sap + Soft Tissue at an Eitr Refinery." },
  { name: "Dvergr Extractor", biome: "Mistlands", source: "Looted from glowing-rune crates in Dvergr settlements — clear the area first, it aggros them." },
  { name: "Carapace", biome: "Mistlands", source: "Dropped by Seekers." },
  { name: "Mandible", biome: "Mistlands", source: "Dropped by Seeker Soldiers." },
  { name: "Bilebag", biome: "Mistlands", source: "Dropped by Gjall." },
  { name: "Blood Clot", biome: "Mistlands", source: "Dropped by Ticks." },
  { name: "Scale Hide", biome: "Mistlands", source: "Dropped by Hares." },
  { name: "Iron (alt. source)", biome: "Mistlands", source: "Mine discarded armor and swords scattered around ruins for Scrap Iron, then smelt normally." },
  { name: "Sealbreaker Fragment", biome: "Mistlands", source: "Found scattered through the Infested Mines beneath Black Marble ruins — need 9 to craft a Sealbreaker." },
];
