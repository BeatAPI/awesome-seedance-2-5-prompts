import {
  mkdir,
  readFile,
  readdir,
  unlink,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';

import { normalizeSourceCategory } from './source-category.mjs';

const sourceRepo = process.env.SEEDANCE_2_5_SOURCE_REPO;
if (!sourceRepo) {
  throw new Error('SEEDANCE_2_5_SOURCE_REPO is required');
}
const sourceFile = path.join(
  sourceRepo,
  'prompts/seedance-2-5-prompts.json'
);
const promptsDir = new URL('../prompts/', import.meta.url);
const catalogFile = new URL('../prompts/catalog.json', import.meta.url);

const repositoryUrl =
  'https://github.com/BeatAPI/awesome-seedance-2-5-prompts';
const galleryUrl = 'https://beatapi.io/seedance-2-5-prompts';
const galleryZhUrl = 'https://beatapi.io/zh/seedance-2-5-prompts';

const zhTitles = {
  'filter-double-comes-alive-comedy': '美颜滤镜分身成真喜剧',
  'tokyo-samurai-versus-stone-titan': '东京武士大战石巨人',
  'japanese-street-lip-sync-comparison': '日本街头对话口型测试',
  'morning-coffee-mini-dv-vlog': '晨间咖啡 Mini-DV Vlog',
  'cloud-world-first-person-freefall': '云端世界第一人称坠落',
  '1977-boston-zombie-outbreak': '1977 波士顿丧尸爆发',
  'pink-haired-wasteland-zombie-chase': '粉发少女废土丧尸追逐',
  'victorian-greenhouse-mechanical-hummingbird': '维多利亚温室机械蜂鸟',
  'white-dragon-camp-rampage': '白龙突袭营地',
  'eryan-griffin-canyon-flight': 'Eryan 与狮鹫峡谷飞行',
  'samurai-and-horse-trailer': '武士与战马预告片',
  'summer-resort-waterslide-vlog': '夏日度假村滑水道 Vlog',
  'live-action-duo-dance-practice': '真人双人高速舞蹈练习',
  'japanese-horror-root-vegetable-village': '日式恐怖根茎蔬菜村',
  'vietnamese-mythic-sea-battle': '越南神话海战',
  'tractor-dance-motion-transfer': '拖拉机舞动作迁移',
  'cbd-rooftop-power-ensemble': 'CBD 天台权谋群像',
  'quiet-city-bicycle-ride': '静谧城市骑行',
  'japanese-concert-pianist': '日本音乐会钢琴家',
  'multilingual-beach-hip-hop-band': '多语种海滩 Hip-Hop 乐队',
  'six-rooms-style-journey': '六个房间风格旅程',
  'youth-motorcycle-racing-memory': '青春机车竞速回忆',
  'nine-language-flower-relay': '九种语言鲜花接力',
  'peking-opera-craft-inheritance': '京剧手艺传承',
  'celestia-floating-magic-city': '塞莱斯蒂亚浮空魔法城',
  'thousand-year-static-landscape': '千年静止机位风景变迁',
  'japanese-game-show-foam-roller': '日本综艺泡沫滚筒',
  'lunar-cafe-dialogue': '月球咖啡馆对话',
  'robots-text-hold-studio-comedy': '机器人举字牌摄影棚喜剧',
  'flooded-botanical-archive-climb': '水淹植物档案馆攀爬',
  'alpine-roller-coaster-ride': '阿尔卑斯山过山车',
  'bazaar-chase-cinematic': '巴扎追逐电影镜头',
  'handcrafted-illustrated-animation': '手工绘本动画',
  'blonde-warrior-battlefield': '金发女战士战场',
  'rapper-reference-performance': '说唱歌手参考图表演',
  'desert-hoverboard-ruin-run': '沙漠悬浮板遗迹穿越',
  'giant-and-dragon-lake-battle': '巨人与巨龙湖畔大战',
  'flooded-village-survival-thriller': '洪水村庄生存惊悚',
  'casual-apartment-tour': '休闲公寓参观',
  'corridor-video-continuation': '走廊视频续写',
  'underground-london-techno-club': '伦敦地下 Techno 俱乐部',
  'blue-disc-anime-hero-battle': '蓝色圆盘动漫英雄大战',
  'trojan-war-selfie-vlog': '特洛伊战争自拍 Vlog',
  'tactical-one-take-action-demo': '战术一镜到底动作演示',
  'kung-fu-battle-long-take': '功夫大战长镜头',
  'ten-member-idol-concert': '十人偶像演唱会',
  'grand-bazaar-stunt-chase': '大巴扎特技追逐',
  'mecha-motorcycle-high-speed-dash': '机甲摩托高速冲刺',
  'protein-shake-ugc-ad': '蛋白奶昔 UGC 广告',
  'hyperspeed-fpv-portal-journey': '超高速 FPV 传送门之旅',
  'wizard-of-oz-scarecrow-plan': '绿野仙踪稻草人计划',
  'rainy-neon-thriller': '雨夜霓虹惊悚片',
  'stylized-family-animation': '风格化家庭动画',
  'painterly-underwater-wreck-chase': '绘画风水下沉船追逐',
  'japanese-mobile-carrier-family-ad': '日本运营商家庭广告',
  'parisian-city-girl-vlog': '巴黎都市女孩 Vlog',
  'mechanical-war-bull-battle': '机械战牛大战',
  'fictional-stadium-sports-commercial': '虚构体育场商业广告',
  'randomized-graffiti-dance-mv': '随机涂鸦舞蹈 MV',
  'occult-solo-anime-short': '神秘学独角动画短片',
  'korean-mini-dv-street-vlog': '韩国街头 Mini-DV Vlog',
  'retro-y2k-pop-duo-music-video': '复古 Y2K 流行双人 MV',
  'live-action-dance-comparison': '真人舞蹈对比',
  'amazonian-warrior-animal-transformation': '亚马逊战士动物变形',
  'the-suit-was-still-listening': '西装仍在聆听',
  'fantasy-palace-romance-drama': '奇幻宫殿爱情剧',
  'faceless-riders-highway-chase': '无面骑手公路追逐',
  'rainy-temple-martial-arts-epic': '雨中寺庙武术史诗',
  'aquatic-brand-concept-journey': '水世界品牌概念之旅',
  'korean-city-day-vlog-993075': '韩国城市一日 Vlog',
  'underground-rap-performance-studio-129750': '地下说唱摄影棚表演',
  'italian-coast-wakeboarding-splash-433442': '意大利海岸尾波滑水',
  'jan-thirty-second-delivery-run-271585': 'Jan 的三十二秒送货行动',
  'fighter-jet-battleship-strike-814869': '战斗机突袭战列舰',
  'cartoon-bulldog-versus-live-boxer-029228': '卡通斗牛犬大战真人拳手',
  '1970s-mediterranean-woman-documentary-685471': '1970 年代地中海女性纪录片',
  'ancient-dance-character-biography-209987': '古风舞者人物传记',
  'devastated-city-continuous-escape-880148': '废墟城市连续逃亡',
  'handmade-doll-boxer-swarm-594949': '手工玩偶拳手围攻',
  'planetarium-gravity-distortion-288542': '天文馆重力扭曲',
  'cybernetic-freefall-armor-624470': '赛博装甲自由落体',
  'trainee-days-camcorder-montage-251247': '练习生岁月录像机蒙太奇',
  'painterly-tsunami-destruction-sequence-047131': '绘画风海啸毁灭场景',
  'obsidian-giant-transformation-531249': '黑曜石巨人变形',
  'children-and-dragons-picnic-chaos-175096': '孩子与巨龙的野餐混战',
  'turkish-eggs-mini-dv-recipe-vlog-107610': '土耳其鸡蛋 Mini-DV 食谱 Vlog',
  'world-war-i-air-combat-film-449091': '第一次世界大战空战电影',
  'vietnam-city-scooter-long-take-216517': '越南城市踏板车长镜头',
  'continuous-body-control-dance-test-900903': '连续身体控制舞蹈测试',
  'dark-fantasy-anime-flythrough-opening-591666': '暗黑奇幻动画穿越片头',
  'three-a-m-french-nightlife-pov-399523': '凌晨三点法国夜生活 POV',
  'watercolor-aquarium-octopus-journey-962531': '水彩水族馆章鱼之旅',
  'vertical-smartphone-lifestyle-vlog-333367': '竖屏手机生活方式 Vlog',
  'wuxia-inn-dumpling-duel-209926': '武侠客栈饺子对决',
  'steampunk-momotaro-thirty-second-story-896854': '蒸汽朋克桃太郎三十秒故事',
  'k-pop-idol-day-camcorder-montage-345309': 'K-Pop 偶像一日录像机蒙太奇',
  'thirty-character-family-dinner-307528': '三十人家庭晚餐',
  'cyber-wuxia-ensemble-trailer-800985': '赛博武侠群像预告片',
  'illustrated-creature-flood-escape-172377': '绘本生物洪水逃亡',
  'rainy-night-market-family-animation-775828': '雨夜市集家庭动画',
};

const ingredientLabels = {
  text: 'Text prompt',
  image: 'Image reference',
  video: 'Video or motion reference',
  audio: 'Audio or sound direction',
};

const categoryLabels = {
  animation: 'animation',
  'brand-film': 'brand film',
  'cinematic-action': 'cinematic action',
  'cinematic-story': 'cinematic story',
  comedy: 'comedy',
  dance: 'dance',
  dialogue: 'dialogue',
  documentary: 'documentary',
  fantasy: 'fantasy',
  horror: 'horror',
  'music-video': 'music video',
  performance: 'performance',
  vlog: 'vlog',
};

function titleCase(value) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function buildEntry(record) {
  const category = normalizeSourceCategory(record.category);
  const categoryName = categoryLabels[category] ?? category;
  const statusLabel =
    record.output_status === 'official-example'
      ? 'an attributed official showcase'
      : 'a source-verified creator example';
  return {
    slug: record.slug,
    title: {
      en: record.title,
      zh: zhTitles[record.slug] ?? record.title,
    },
    description: {
      en: `${record.duration_seconds.toFixed(0)}-second ${categoryName} prompt paired with ${statusLabel} and its output video.`,
      zh: `${record.duration_seconds.toFixed(0)} 秒${zhTitles[record.slug] ?? categoryName}提示词，保留来源、完整 Prompt 与对应输出视频。`,
    },
    category,
    workflowMode: record.workflow_mode,
    mode: record.generation_mode,
    duration: `${Math.round(record.duration_seconds)}s`,
    aspectRatio: record.aspect_ratio,
    ingredients: record.reference_mix.map(
      (item) => ingredientLabels[item] ?? titleCase(item)
    ),
    source: {
      kind: 'x',
      class: record.source_class,
      name: `@${record.author_handle}`,
      url: record.post_url,
    },
    outputStatus: record.output_status,
    promptVisibility: record.prompt_visibility,
    promptSourceUrls: record.prompt_source_urls,
    modelEvidenceUrls: record.model_evidence_urls,
    prompt: record.prompt,
    media: {
      video: record.public_video_url,
      thumbnail: record.public_thumbnail_url,
      format: 'video/webm',
      videoBytes: record.video_bytes,
      videoSha256: record.video_sha256,
      thumbnailBytes: record.thumbnail_bytes,
      thumbnailSha256: record.thumbnail_sha256,
    },
    rightsStatus: record.rights_status,
  };
}

function escapeCell(value) {
  return String(value).replaceAll('|', '\\|').replaceAll('\n', ' ');
}

function englishReadme(entries) {
  const creators = entries.filter(
    (entry) => entry.outputStatus === 'source-verified'
  );
  const official = entries.filter(
    (entry) => entry.outputStatus === 'official-example'
  );
  const samePost = entries.filter(
    (entry) => entry.promptVisibility === 'same-post'
  ).length;
  const rows = entries
    .map(
      (entry) =>
        `| [${escapeCell(entry.title.en)}](./prompts/${entry.slug}.json) | [${escapeCell(entry.source.name)}](${entry.source.url}) | ${escapeCell(entry.category)} | ${escapeCell(entry.duration)} | ${entry.outputStatus} |`
    )
    .join('\n');
  return `# Awesome Seedance 2.5 Prompts

An open, source-transparent collection of Seedance 2.5 Prompt–Video pairs,
curated by [BeatAPI](https://beatapi.io).

**[Open the Seedance 2.5 Prompt Gallery](${galleryUrl})** ·
**[中文说明](./README.zh-CN.md)** ·
**[Submit a prompt](${repositoryUrl}/issues/new?template=prompt.yml)**

## What is included

- ${entries.length} complete prompts with corresponding WebM output videos;
- ${creators.length} source-verified creator examples;
- ${official.length} attributed official showcase examples;
- ${samePost} prompts in the video post and ${entries.length - samePost} recovered from same-author threads;
- source URL, prompt URL, model-evidence URL, reference mix, duration,
  aspect ratio, verification state, and rights status for every entry.

Seedance 2.5 is a multimodal video workflow, so the catalog organizes prompts
by workflow first and content genre second. The current launch set focuses on
reference generation. Video editing and video extension entries will be added
only when an exact prompt, source clip, and output can all be verified.

## Catalog

| Prompt | Source | Category | Duration | Evidence |
| --- | --- | --- | --- | --- |
${rows}

The complete machine-readable collection is in
[\`prompts/catalog.json\`](./prompts/catalog.json).

## Verification states

- \`source-verified\` — a creator post names Seedance 2.5, contains the output
  video, and exposes the prompt in that post or a same-author thread.
- \`official-example\` — the source identifies the video and prompt as an
  official published showcase.
- \`template-unverified\` — reserved for editorial templates without a
  publishable output; none are mixed into this launch catalog.

## Media format and storage

Every output is normalized to VP9 WebM with an Opus audio track when source
audio exists. Posters are JPEG. The public Git repository keeps metadata and
prompts lightweight; media is stored under BeatAPI's CDN at
\`prompt-gallery/seedance-2-5/\`.

The original X post and author remain the canonical attribution source.
Public availability does not transfer copyright. The WebM derivatives and
third-party prompt text are not covered by this repository's documentation
license. See [CONTRIBUTING.md](./CONTRIBUTING.md) for corrections and takedowns.

## Availability boundary

Seedance 2.5 availability, product limits, upload controls, and API access can
vary by region and account. Verify the current official Dreamina, CapCut,
Volcano Engine, or BytePlus product surface before building production
controls. This repository does not claim that Seedance 2.5 is currently
routed through the BeatAPI workflow API.

## Validate locally

\`\`\`bash
npm test
\`\`\`

## License

BeatAPI-authored documentation is licensed under CC BY 4.0 and validation code
under MIT. Third-party prompts, videos, screenshots, names, and source posts
retain their original rights.
`;
}

function chineseReadme(entries) {
  const creators = entries.filter(
    (entry) => entry.outputStatus === 'source-verified'
  );
  const official = entries.filter(
    (entry) => entry.outputStatus === 'official-example'
  );
  const rows = entries
    .map(
      (entry) =>
        `| [${escapeCell(entry.title.zh)}](./prompts/${entry.slug}.json) | [${escapeCell(entry.source.name)}](${entry.source.url}) | ${escapeCell(entry.duration)} | ${entry.outputStatus} |`
    )
    .join('\n');
  return `# Awesome Seedance 2.5 Prompts

这是由 [BeatAPI](https://beatapi.io) 维护的 Seedance 2.5 Prompt–Video
开源目录。

**[打开 Seedance 2.5 提示词画廊](${galleryZhUrl})** ·
**[提交 Prompt](${repositoryUrl}/issues/new?template=prompt.yml)**

## 首批内容

- ${entries.length} 条完整 Prompt 与对应 WebM 视频；
- ${creators.length} 条创作者来源核验案例；
- ${official.length} 条明确标注的官方展示案例；
- 每条都保留视频原帖、Prompt 来源、模型证据、参考素材组合、时长、
  画幅、验证状态和权利状态。

当前首发内容主要属于「参考生成」。后续的「视频编辑」和「视频延长」
只有在原视频、操作 Prompt 与输出结果可以一一核验时才会加入。

## 完整目录

| Prompt | 来源 | 时长 | 证据状态 |
| --- | --- | --- | --- |
${rows}

机器可读目录见 [\`prompts/catalog.json\`](./prompts/catalog.json)。

## 验证标签

- \`source-verified\`：创作者原帖明确提到 Seedance 2.5、带有输出视频，
  完整 Prompt 位于同帖或同一作者线程。
- \`official-example\`：来源明确说明这是官方发布或官方使用案例。
- \`template-unverified\`：没有公开输出证据的编辑模板；首批目录没有把
  这种模板混入真实案例。

## 视频格式与存储

所有视频统一转为 VP9 WebM；有源音频时使用 Opus。封面使用 JPEG。
GitHub 只保存轻量 Prompt 与元数据，视频放在 BeatAPI 自有 CDN 的
\`prompt-gallery/seedance-2-5/\` 路径。

原始 X 帖子和作者是署名依据。公开发布不等于版权转移；第三方 Prompt
与视频不包含在本仓库文档许可中。纠错、下架和投稿规则见
[CONTRIBUTING.md](./CONTRIBUTING.md)。

## 上线边界

Seedance 2.5 的地区、账号、上传限制和 API 开放状态可能变化，生产接入前
必须重新核对 Dreamina、CapCut、火山引擎或 BytePlus 当前页面。本仓库不
表示 BeatAPI workflow API 已经提供 Seedance 2.5 路由。

## 本地验证

\`\`\`bash
npm test
\`\`\`

## 许可

BeatAPI 原创文档使用 CC BY 4.0，验证代码使用 MIT。第三方 Prompt、视频、
截图、署名和来源帖子仍归原权利人所有。
`;
}

const sourceRecords = JSON.parse(await readFile(sourceFile, 'utf8'));
const entries = sourceRecords.map(buildEntry);

await mkdir(promptsDir, { recursive: true });
for (const filename of await readdir(promptsDir)) {
  if (filename.endsWith('.json')) {
    await unlink(new URL(filename, promptsDir));
  }
}

for (const entry of entries) {
  await writeFile(
    new URL(`${entry.slug}.json`, promptsDir),
    `${JSON.stringify(entry, null, 2)}\n`
  );
}

const catalog = {
  version: 1,
  model: 'Seedance-2.5',
  updatedAt: new Date().toISOString().slice(0, 10),
  repository: repositoryUrl,
  prompts: entries,
};
await writeFile(catalogFile, `${JSON.stringify(catalog, null, 2)}\n`);
await writeFile(
  new URL('../README.zh-CN.md', import.meta.url),
  chineseReadme(entries)
);

console.log(
  `Imported ${entries.length} Seedance 2.5 prompts with CDN WebM media.`
);
