// Maps individual city/destination slugs (from the `destinations` admin table) to the
// region slug used by /holidays/[destination] (which groups packages by region, e.g.
// Kashmir). Keep in sync with the destinationMeta map in
// src/app/holidays/[destination]/page.tsx.
export const REGION_SLUG_MAP: Record<string, string> = {
  srinagar: 'kashmir',
  gulmarg: 'kashmir',
  pahalgam: 'kashmir',
  sonamarg: 'kashmir',
  sonmarg: 'kashmir',
  yousmarg: 'kashmir',
  kashmir: 'kashmir',
  leh: 'ladakh',
  ladakh: 'ladakh',
  munnar: 'kerala',
  kerala: 'kerala',
  manali: 'himachal',
  himachal: 'himachal',
  goa: 'goa',
  'goa-city': 'goa',
  dubai: 'dubai',
  delhi: 'delhi',
  rajasthan: 'rajasthan',
  uttarakhand: 'uttarakhand',
  meghalaya: 'meghalaya',
};

export function getRegionSlug(citySlug?: string): string | undefined {
  return citySlug ? REGION_SLUG_MAP[citySlug.toLowerCase()] : undefined;
}
