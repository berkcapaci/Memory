import type { ThemeAssetRecord, ThemeId } from "./model";

const codingCards = [
  new URL("../assets/backside_photos/Code-1.png", import.meta.url).href,
  new URL("../assets/backside_photos/Code-2.png", import.meta.url).href,
  new URL("../assets/backside_photos/Code-3.png", import.meta.url).href,
  new URL("../assets/backside_photos/Code-4.png", import.meta.url).href,
  new URL("../assets/backside_photos/Code-5.png", import.meta.url).href,
  new URL("../assets/backside_photos/Code-6.png", import.meta.url).href,
  new URL("../assets/backside_photos/Code-7.png", import.meta.url).href,
  new URL("../assets/backside_photos/Code-8.png", import.meta.url).href,
  new URL("../assets/backside_photos/Code-9.png", import.meta.url).href,
  new URL("../assets/backside_photos/Code-10.png", import.meta.url).href,
  new URL("../assets/backside_photos/Code-11.png", import.meta.url).href,
  new URL("../assets/backside_photos/Code-12.png", import.meta.url).href,
  new URL("../assets/backside_photos/Code-13.png", import.meta.url).href,
  new URL("../assets/backside_photos/Code-14.png", import.meta.url).href,
  new URL("../assets/backside_photos/Code-15.png", import.meta.url).href,
  new URL("../assets/backside_photos/Code-16.png", import.meta.url).href,
  new URL("../assets/backside_photos/Code-17.png", import.meta.url).href,
  new URL("../assets/backside_photos/Code-18.png", import.meta.url).href,
];

const projectsCards = [
  new URL("../assets/backside_photos/DAP-1.png", import.meta.url).href,
  new URL("../assets/backside_photos/DAP-2.png", import.meta.url).href,
  new URL("../assets/backside_photos/DAP-3.png", import.meta.url).href,
  new URL("../assets/backside_photos/DAP-4.png", import.meta.url).href,
  new URL("../assets/backside_photos/DAP-5.png", import.meta.url).href,
  new URL("../assets/backside_photos/DAP-6.png", import.meta.url).href,
  new URL("../assets/backside_photos/DAP-7.png", import.meta.url).href,
  new URL("../assets/backside_photos/DAP-8.png", import.meta.url).href,
  new URL("../assets/backside_photos/DAP-9.png", import.meta.url).href,
  new URL("../assets/backside_photos/DAP-10.png", import.meta.url).href,
  new URL("../assets/backside_photos/DAP-11.png", import.meta.url).href,
  new URL("../assets/backside_photos/DAP-12.png", import.meta.url).href,
  new URL("../assets/backside_photos/DAP-13.png", import.meta.url).href,
  new URL("../assets/backside_photos/DAP-14.png", import.meta.url).href,
  new URL("../assets/backside_photos/DAP-15.png", import.meta.url).href,
  new URL("../assets/backside_photos/DAP-16.png", import.meta.url).href,
  new URL("../assets/backside_photos/DAP-17.png", import.meta.url).href,
  new URL("../assets/backside_photos/DAP-18.png", import.meta.url).href,
];

const foodsCards = [
  new URL("../assets/backside_photos/food-1.png", import.meta.url).href,
  new URL("../assets/backside_photos/food-2.png", import.meta.url).href,
  new URL("../assets/backside_photos/food-3.png", import.meta.url).href,
  new URL("../assets/backside_photos/food-4.png", import.meta.url).href,
  new URL("../assets/backside_photos/food-5.png", import.meta.url).href,
  new URL("../assets/backside_photos/food-6.png", import.meta.url).href,
  new URL("../assets/backside_photos/food-7.png", import.meta.url).href,
  new URL("../assets/backside_photos/food-8.png", import.meta.url).href,
  new URL("../assets/backside_photos/food-9.png", import.meta.url).href,
  new URL("../assets/backside_photos/food-10.png", import.meta.url).href,
  new URL("../assets/backside_photos/food-11.png", import.meta.url).href,
  new URL("../assets/backside_photos/food-12.png", import.meta.url).href,
  new URL("../assets/backside_photos/food-13.png", import.meta.url).href,
  new URL("../assets/backside_photos/food-14.png", import.meta.url).href,
  new URL("../assets/backside_photos/food-15.png", import.meta.url).href,
  new URL("../assets/backside_photos/food-16.png", import.meta.url).href,
  new URL("../assets/backside_photos/food-17.png", import.meta.url).href,
  new URL("../assets/backside_photos/food-18.png", import.meta.url).href,
];

export const themeAssets: ThemeAssetRecord = {
  coding: { id: "coding", label: "Code Vibes", cards: codingCards },
  projects: { id: "projects", label: "DA Projects", cards: projectsCards },
  foods: { id: "foods", label: "Foods", cards: foodsCards },
};

export const cardBackAsset = new URL(
  "../assets/components/Match card_border.png",
  import.meta.url,
).href;

/** Returns the card face assets for a theme. */
export function getThemeCards(theme: ThemeId): readonly string[] {
  return themeAssets[theme].cards;
}

/** Returns the visible label for a theme. */
export function getThemeLabel(theme: ThemeId): string {
  return themeAssets[theme].label;
}
