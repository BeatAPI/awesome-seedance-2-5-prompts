const SOURCE_CATEGORY_MAP = {
  action: 'cinematic-action',
  advertising: 'brand-film',
  anime: 'animation',
  'cinematic-travel': 'cinematic-story',
  experimental: 'cinematic-story',
  fashion: 'brand-film',
  gameplay: 'cinematic-action',
  historical: 'cinematic-story',
  lifestyle: 'vlog',
  'motion-graphics': 'animation',
  music: 'music-video',
  'product-commercial': 'brand-film',
  sports: 'brand-film',
  thriller: 'cinematic-story',
};

export function normalizeSourceCategory(category) {
  return SOURCE_CATEGORY_MAP[category] ?? category;
}
