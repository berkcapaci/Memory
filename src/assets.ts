import type { ThemeAssetRecord, ThemeId } from "./model";

const codingCards = [
  new URL("../assets/components/Code vibes card 1.png", import.meta.url).href,
  new URL("../assets/components/Code vibes card 2.png", import.meta.url).href,
  new URL("../assets/components/Code vibes card 3.png", import.meta.url).href,
  new URL("../assets/components/Code vibes card 4.png", import.meta.url).href,
  new URL("../assets/components/Code vibes card 5.png", import.meta.url).href,
  new URL("../assets/components/Code vibes card 6.png", import.meta.url).href,
  new URL("../assets/components/Code vibes card 7.png", import.meta.url).href,
  new URL("../assets/components/Code vibes card 8.png", import.meta.url).href,
  new URL("../assets/components/Code vibes card 9.png", import.meta.url).href,
  new URL("../assets/components/Code vibes card 10.png", import.meta.url).href,
  new URL("../assets/components/Code vibes card 11.png", import.meta.url).href,
  new URL("../assets/components/Code vibes card 12.png", import.meta.url).href,
  new URL("../assets/components/Code vibes card 13.png", import.meta.url).href,
  new URL("../assets/components/Code vibes card 14.png", import.meta.url).href,
  new URL("../assets/components/Code vibes card 15.png", import.meta.url).href,
  new URL("../assets/components/Code vibes card 16.png", import.meta.url).href,
  new URL("../assets/components/Code vibes card 17.png", import.meta.url).href,
  new URL("../assets/components/Code vibes card 18.png", import.meta.url).href,
];

const gamingCards = [
  new URL("../assets/components/Game card 1.png", import.meta.url).href,
  new URL("../assets/components/Game card 2.png", import.meta.url).href,
  new URL("../assets/components/Game card 3.png", import.meta.url).href,
  new URL("../assets/components/Game card 4.png", import.meta.url).href,
  new URL("../assets/components/Game card 5.png", import.meta.url).href,
  new URL("../assets/components/Game card 6.png", import.meta.url).href,
  new URL("../assets/components/Game card 7.png", import.meta.url).href,
  new URL("../assets/components/Game card 8.png", import.meta.url).href,
  new URL("../assets/components/Game card 9.png", import.meta.url).href,
  new URL("../assets/components/Game card 10.png", import.meta.url).href,
  new URL("../assets/components/Game card 11.png", import.meta.url).href,
  new URL("../assets/components/Game card 12.png", import.meta.url).href,
  new URL("../assets/components/Game card 13.png", import.meta.url).href,
  new URL("../assets/components/Game card 14.png", import.meta.url).href,
  new URL("../assets/components/Game card 15.png", import.meta.url).href,
  new URL("../assets/components/Game card 16.png", import.meta.url).href,
  new URL("../assets/components/Game card 17.png", import.meta.url).href,
  new URL("../assets/components/Game card 18.png", import.meta.url).href,
];

const projectsCards = [
  new URL("../assets/components/DA Projects card 01.png", import.meta.url).href,
  new URL("../assets/components/DA Projects card 2.png", import.meta.url).href,
  new URL("../assets/components/DA Projects card 3.png", import.meta.url).href,
  new URL("../assets/components/DA Projects card 4.png", import.meta.url).href,
  new URL("../assets/components/DA Projects card 5.png", import.meta.url).href,
  new URL("../assets/components/DA Projects card 6.png", import.meta.url).href,
  new URL("../assets/components/DA Projects card 7.png", import.meta.url).href,
  new URL("../assets/components/DA Projects card 8.png", import.meta.url).href,
  new URL("../assets/components/DA Projects card 9.png", import.meta.url).href,
  new URL("../assets/components/DA Projects card 10.png", import.meta.url).href,
  new URL("../assets/components/DA Projects card 11.png", import.meta.url).href,
  new URL("../assets/components/DA Projects card 12.png", import.meta.url).href,
  new URL("../assets/components/DA Projects card 13.png", import.meta.url).href,
  new URL("../assets/components/DA Projects card 14.png", import.meta.url).href,
  new URL("../assets/components/DA Projects card 15.png", import.meta.url).href,
  new URL("../assets/components/DA Projects card 16.png", import.meta.url).href,
  new URL("../assets/components/DA Projects card 17.png", import.meta.url).href,
  new URL("../assets/components/DA Projects card 18.png", import.meta.url).href,
];

const foodsCards = [
  new URL("../assets/components/food card 01.png", import.meta.url).href,
  new URL("../assets/components/food card 02.png", import.meta.url).href,
  new URL("../assets/components/food card 03.png", import.meta.url).href,
  new URL("../assets/components/food card 04.png", import.meta.url).href,
  new URL("../assets/components/food card 05.png", import.meta.url).href,
  new URL("../assets/components/food card 06.png", import.meta.url).href,
  new URL("../assets/components/food card 07.png", import.meta.url).href,
  new URL("../assets/components/food card 08.png", import.meta.url).href,
  new URL("../assets/components/food card 09.png", import.meta.url).href,
  new URL("../assets/components/food card 10.png", import.meta.url).href,
  new URL("../assets/components/food card 11.png", import.meta.url).href,
  new URL("../assets/components/food card 12.png", import.meta.url).href,
  new URL("../assets/components/food card 13.png", import.meta.url).href,
  new URL("../assets/components/food card 14.png", import.meta.url).href,
  new URL("../assets/components/food card 15.png", import.meta.url).href,
  new URL("../assets/components/food card 16.png", import.meta.url).href,
  new URL("../assets/components/food card 17.png", import.meta.url).href,
  new URL("../assets/components/food card 18.png", import.meta.url).href,
];

export const themeAssets: ThemeAssetRecord = {
  coding: { id: "coding", label: "Code Vibes", cards: codingCards },
  gaming: { id: "gaming", label: "Gaming", cards: gamingCards },
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
