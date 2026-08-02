import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';

const file = new URL('../prompts/catalog.json', import.meta.url);
const catalog = JSON.parse(await readFile(file, 'utf8'));
const [englishReadme, chineseReadme] = await Promise.all([
  readFile(new URL('../README.md', import.meta.url), 'utf8'),
  readFile(new URL('../README.zh-CN.md', import.meta.url), 'utf8'),
]);

assert.equal(
  englishReadme.includes(
    '[Open the Seedance 2.5 Prompt Gallery](https://beatapi.io/seedance-2-5-prompts)'
  ),
  false,
  'English README should leave the gallery entry to the repository Website link'
);
assert.ok(
  chineseReadme.includes(
    '[打开 Seedance 2.5 提示词画廊](https://beatapi.io/zh/seedance-2-5-prompts)'
  ),
  'Chinese README must link directly to the localized Seedance 2.5 gallery'
);

assert.equal(catalog.version, 1, 'catalog version must be 1');
assert.equal(
  catalog.model,
  'Seedance-2.5',
  'catalog model must be Seedance-2.5'
);
assert.ok(Array.isArray(catalog.prompts), 'prompts must be an array');
assert.ok(catalog.prompts.length >= 100, 'catalog must contain at least 100 prompts');
const featuredCount = 30;
assert.equal(
  (englishReadme.match(/^### \d+\./gm) ?? []).length,
  Math.min(featuredCount, catalog.prompts.length),
  'README should display a bounded featured gallery'
);
assert.ok(
  englishReadme.includes(`Browse all ${catalog.prompts.length} prompts`),
  'README should link to the full generated catalog'
);
const pageSize = 25;
const pageCount = Math.ceil(catalog.prompts.length / pageSize);
for (let page = 1; page <= pageCount; page += 1) {
  const pageSource = await readFile(
    new URL(`../prompts/pages/${page}.md`, import.meta.url),
    'utf8'
  );
  assert.equal(
    (pageSource.match(/^## \d+\./gm) ?? []).length,
    Math.min(pageSize, catalog.prompts.length - (page - 1) * pageSize),
    `page ${page} should contain the expected prompt slice`
  );
}
for (const category of new Set(catalog.prompts.map((entry) => entry.category))) {
  const categorySource = await readFile(
    new URL(`../prompts/categories/${category}.md`, import.meta.url),
    'utf8'
  );
  assert.match(categorySource, /^# Seedance 2\.5 .+ prompts/m);
}
const useCaseSlugs = [
  'stories-films',
  'action-fantasy',
  'ads-products',
  'music-performance',
  'vlog-social',
];
assert.deepEqual(
  (await readdir(new URL('../prompts/use-cases/', import.meta.url)))
    .filter((file) => file.endsWith('.md'))
    .sort(),
  useCaseSlugs.map((slug) => `${slug}.md`).sort(),
  'README should expose exactly five use-case shortcuts'
);
for (const useCase of useCaseSlugs) {
  assert.ok(
    englishReadme.includes(`](./prompts/use-cases/${useCase}.md)`),
    `README should link to the ${useCase} use case`
  );
  const useCaseSource = await readFile(
    new URL(`../prompts/use-cases/${useCase}.md`, import.meta.url),
    'utf8'
  );
  assert.match(useCaseSource, /^# Seedance 2\.5 .+ prompts/m);
  assert.ok(
    (useCaseSource.match(/^## \d+\./gm) ?? []).length > 0,
    `${useCase} use case should contain prompts`
  );
}

const allowedModes = new Set([
  'text-to-video',
  'image-to-video',
  'reference-to-video',
  'multimodal',
  'video-to-video',
]);
const allowedWorkflowModes = new Set([
  'reference-generation',
  'text-generation',
  'video-editing',
  'video-extension',
]);
const allowedStatuses = new Set([
  'source-verified',
  'official-example',
  'template-unverified',
]);
const slugs = new Set();

for (const entry of catalog.prompts) {
  assert.match(entry.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.equal(slugs.has(entry.slug), false, `duplicate slug: ${entry.slug}`);
  slugs.add(entry.slug);
  assert.ok(entry.title?.en && entry.title?.zh, `${entry.slug}: missing title`);
  assert.ok(
    entry.description?.en && entry.description?.zh,
    `${entry.slug}: missing description`
  );
  assert.ok(entry.category, `${entry.slug}: category is required`);
  assert.ok(allowedModes.has(entry.mode), `${entry.slug}: bad mode`);
  assert.ok(
    allowedWorkflowModes.has(entry.workflowMode),
    `${entry.slug}: bad workflow mode`
  );
  assert.match(entry.duration, /^\d+s$/);
  assert.match(entry.aspectRatio, /^\d+:\d+$/);
  assert.ok(entry.prompt.length >= 20, `${entry.slug}: prompt is too thin`);
  assert.ok(
    Array.isArray(entry.ingredients) && entry.ingredients.length > 0,
    `${entry.slug}: ingredients are required`
  );
  assert.match(entry.source?.url ?? '', /^https:\/\/x\.com\//);
  assert.ok(allowedStatuses.has(entry.outputStatus), `${entry.slug}: bad status`);
  assert.ok(
    entry.promptVisibility === 'same-post' ||
      entry.promptVisibility === 'same-author-thread',
    `${entry.slug}: prompt location is required`
  );
  assert.ok(
    Array.isArray(entry.promptSourceUrls) &&
      entry.promptSourceUrls.every((url) => /^https:\/\/x\.com\//.test(url)),
    `${entry.slug}: prompt source URL is required`
  );
  assert.ok(
    Array.isArray(entry.modelEvidenceUrls) &&
      entry.modelEvidenceUrls.every((url) => /^https:\/\/x\.com\//.test(url)),
    `${entry.slug}: model evidence URL is required`
  );
  assert.match(
    entry.media?.video ?? '',
    /^https:\/\/media\.beatapi\.io\/prompt-gallery\/seedance-2-5\/[a-z0-9-]+\/video-[a-f0-9]{16}\.webm$/
  );
  assert.match(
    entry.media?.thumbnail ?? '',
    /^https:\/\/media\.beatapi\.io\/prompt-gallery\/seedance-2-5\/[a-z0-9-]+\/poster-[a-f0-9]{16}\.jpg$/
  );
  assert.equal(entry.media?.format, 'video/webm');
  assert.ok(entry.media?.videoBytes > 0, `${entry.slug}: video size missing`);
  assert.match(entry.media?.videoSha256 ?? '', /^[a-f0-9]{64}$/);
  assert.ok(
    entry.media?.thumbnailBytes > 0,
    `${entry.slug}: thumbnail size missing`
  );
  assert.match(entry.media?.thumbnailSha256 ?? '', /^[a-f0-9]{64}$/);
  assert.ok(entry.rightsStatus, `${entry.slug}: rights status is required`);

  const entryFile = new URL(`../prompts/${entry.slug}.json`, import.meta.url);
  const standalone = JSON.parse(await readFile(entryFile, 'utf8'));
  assert.deepEqual(
    standalone,
    entry,
    `${entry.slug}: standalone file differs from catalog`
  );
}

const creatorVerified = catalog.prompts.filter(
  (entry) => entry.outputStatus === 'source-verified'
).length;
const officialExamples = catalog.prompts.filter(
  (entry) => entry.outputStatus === 'official-example'
).length;
assert.ok(creatorVerified > 0, 'creator examples are required');
assert.ok(officialExamples > 0, 'official examples are required');
assert.equal(
  creatorVerified + officialExamples,
  catalog.prompts.length,
  'every published prompt must have a verified output status'
);

console.log(`Validated ${catalog.prompts.length} Seedance 2.5 prompts.`);
