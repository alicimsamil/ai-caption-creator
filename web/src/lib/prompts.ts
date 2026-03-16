import type { Platform, Tone, Language } from "@/types/platform";
import { getPlatformConfig, getToneConfig } from "./platform-config";

// ---------------------------------------------------------------------------
// Platform-specific writing instructions
// ---------------------------------------------------------------------------

const PLATFORM_INSTRUCTIONS: Record<Platform, string> = {
  instagram: `## Instagram Caption Rules
- **Hook (first 125 chars):** The feed preview cuts off at ~125 characters. Your opening line MUST stop the scroll. Use a bold statement, surprising fact, hot take, or direct question.
- **Body:** Break text into short paragraphs (1-3 sentences each). Use line breaks generously for mobile readability. Weave in 3-6 relevant emojis throughout the body to add visual rhythm and personality.
- **CTA:** End with a clear call-to-action. Best performers: "Save this for later", "Tag someone who needs this", "Double tap if you agree", "Drop a [emoji] in the comments".
- **Hashtag zone:** Place hashtags in a separate block after the main caption, separated by a line break. Mix 3-5 broad hashtags with 3-5 niche hashtags.
- **Formatting tips:** Use "." on separate lines to create visual spacing. Capitalize key phrases for emphasis. Emojis at the START of lines act as bullet points.
- **Engagement patterns:** Questions perform 2x better than statements. Carousel posts benefit from "Swipe to see..." hooks. Stories benefit from "DM me..." CTAs.
- **Length sweet spot:** 150-300 characters for feed posts, 500-1000 for educational carousels, 50-100 for Reels.`,

  tiktok: `## TikTok Caption Rules
- **Hook-first formula:** The FIRST line must create instant curiosity. Use patterns like "POV:", "Wait for it...", "Nobody talks about this but...", "The secret to...", "I can't believe...".
- **Keep it SHORT:** Ideal length is 50-150 characters. TikTok users scroll fast. Every word must earn its place.
- **Conversational tone:** Write like you're texting a friend. Use lowercase, abbreviations, and slang when appropriate. Gen-Z and millennial language performs best.
- **Trend hooks:** Reference trending sounds, challenges, or formats when possible. Use "This sound though", "Using this trend to show...", "Jumping on this trend".
- **CTA patterns:** "Follow for part 2", "Like if you relate", "Comment your...", "Stitch this with your...", "Duet this!".
- **Hashtag strategy:** 3-5 hashtags max. Mix 1 trending (#fyp, #foryou) with 2-3 niche hashtags.
- **Controversy drives engagement:** Bold opinions, unpopular takes, and "Am I the only one who..." formats perform extremely well.`,

  twitter: `## X (Twitter) Caption Rules
- **Hard limit: 280 characters.** Every character counts. Be ruthlessly concise.
- **Wit wins:** The platform rewards clever wordplay, sharp observations, and punchy one-liners. Think "tweet-worthy" — something people want to retweet.
- **Thread format:** For longer content, use "1/" numbering. Make the first tweet standalone — it must work even if nobody clicks "Show this thread".
- **Hot takes:** Strong opinions stated concisely drive the most engagement. "Unpopular opinion:" and "Hot take:" are proven formats.
- **No hashtag-stuffing:** 1-2 hashtags maximum. Many top tweets use zero hashtags.
- **Quote-tweet bait:** Write tweets that people want to quote-tweet with their own commentary.
- **Patterns that work:** Lists ("3 things I learned..."), contrasts ("People think X. Reality: Y."), relatable observations ("Why does every... ").
- **Avoid:** Excessive emojis, corporate-speak, obvious marketing language.`,

  linkedin: `## LinkedIn Caption Rules
- **Professional hook:** Open with a bold first line that creates a "pattern interrupt" in the feed. Popular formats: surprising statistic, counterintuitive claim, personal vulnerability, or a strong opinion.
- **Story structure:** LinkedIn rewards personal storytelling tied to professional insights. Use the framework: Hook -> Context -> Challenge -> Insight -> Takeaway -> CTA.
- **Formatting:** Use VERY short paragraphs (1-2 sentences max). Each paragraph should be separated by a blank line. This creates white space that improves mobile readability. Use "." on empty lines for spacing.
- **Value-driven content:** Every post should teach something, share a framework, or provide actionable advice. End with key takeaways in a numbered or bulleted list.
- **Tone:** Conversational-professional. Avoid corporate jargon. Write like a smart colleague sharing insights over coffee, not a press release.
- **CTA patterns:** "What's your experience with this? Share below.", "Agree or disagree?", "Repost if this resonates.", "Follow me for more insights on [topic]."
- **Hashtag placement:** 3-5 hashtags at the very end. Use industry-specific hashtags.
- **Length sweet spot:** 800-1300 characters for optimal engagement.`,

  facebook: `## Facebook Caption Rules
- **Community-first:** Facebook is built on community and conversation. Write as if posting to a group of friends or a tight-knit community.
- **Emotional resonance:** Posts that evoke nostalgia, humor, inspiration, or shared experience perform best. "Remember when..." and "Who else..." formats work great.
- **Question-driven:** Questions in posts get 2x more comments. Ask genuine, easy-to-answer questions: "What's your go-to...?", "Has this ever happened to you?".
- **Length flexibility:** Short posts (40-80 chars) get highest engagement for link shares. Longer posts (300-500 chars) work for stories and community engagement.
- **Conversational warmth:** Use a warm, inclusive tone. Words like "we", "our", "together" build community feeling.
- **CTA patterns:** "Share if you agree", "Tag someone who...", "Tell us in the comments", "Like if this made your day".
- **Minimal hashtags:** 1-3 hashtags max. Facebook's algorithm doesn't prioritize hashtags like Instagram.
- **Visual context:** When accompanying images/videos, the caption should add context, not just repeat what's visible.`,

  youtube: `## YouTube Description Rules
- **SEO-first approach:** Front-load the first 100-150 characters with primary keywords — this is what appears in search results and above the "Show more" fold.
- **Structured description:** Use this format:
  1. Hook/summary (2-3 sentences, keyword-rich)
  2. Timestamps/chapters (if applicable)
  3. Detailed description with secondary keywords
  4. Links (social media, resources, products mentioned)
  5. Hashtags (3-5, placed at the end)
- **Keyword integration:** Naturally weave target keywords throughout the description. Include variations and long-tail keywords.
- **CTA in description:** "Subscribe for [specific content promise]", "Turn on notifications", "Check out the links below".
- **Length:** Aim for 200-500 words for optimal SEO value.
- **Hashtags:** Place 3-5 relevant hashtags. The first 3 appear above the video title.
- **Social proof:** Mention subscriber milestones, community size, or notable achievements.`,

  pinterest: `## Pinterest Description Rules
- **Search-optimized:** Pinterest is a SEARCH ENGINE first. Write descriptions like SEO-optimized product descriptions, not social media posts.
- **Keyword density:** Include 3-5 relevant keywords naturally in 100-200 characters. Think about what users would search for.
- **Actionable language:** Use verbs that inspire action: "discover", "try", "create", "learn", "make", "get", "find", "shop".
- **Benefit-first:** Lead with what the user will gain: "Learn how to...", "Get inspired by...", "Discover the best...".
- **Seasonal relevance:** Include seasonal keywords when applicable (summer, holiday, back-to-school, etc.).
- **Format:** Clean, descriptive sentences. No heavy emoji usage. Professional but approachable.
- **Hashtag strategy:** 2-5 descriptive hashtags that match search behavior.
- **Avoid:** Clickbait, excessive punctuation, hashtag spam, vague descriptions.`,
};

// ---------------------------------------------------------------------------
// Tone-specific writing instructions
// ---------------------------------------------------------------------------

const TONE_INSTRUCTIONS: Record<Tone, string> = {
  professional: `**Tone: Professional**
Write with authority and expertise. Use precise language, industry terminology (where appropriate), and well-structured arguments. Maintain a polished, credible voice that builds trust. Avoid slang, excessive emojis, or overly casual language. Think "respected thought leader sharing insights."`,

  casual: `**Tone: Casual**
Write like you're talking to a friend. Use everyday language, contractions, and a relaxed structure. Feel free to use popular expressions, light humor, and relatable observations. Keep it warm, approachable, and genuine. Think "your cool friend who happens to be knowledgeable."`,

  funny: `**Tone: Funny / Humorous**
Lead with humor — use wit, wordplay, unexpected twists, and relatable comedy. The humor should feel natural, not forced. Use pop culture references, self-deprecating humor, and absurd observations. The goal is to make people smile or laugh while delivering the message. Think "stand-up comedian on social media."`,

  inspirational: `**Tone: Inspirational**
Write with warmth and emotional depth. Use uplifting language, vivid imagery, and messages that make people feel capable and hopeful. Share universal truths, poetic phrasing, and empowering perspectives. Build emotional momentum from start to finish. Think "your favorite motivational speaker at their most genuine."`,

  educational: `**Tone: Educational**
Write with clarity and depth. Break complex ideas into digestible pieces. Use numbered lists, step-by-step structures, and clear explanations. Provide actionable takeaways and practical knowledge. The goal is to make the audience feel smarter after reading. Think "the best teacher you ever had — clear, engaging, and memorable."`,

  motivational: `**Tone: Motivational**
Write with high energy and urgency. Use powerful action verbs, short punchy sentences, and direct challenges to the reader. Create a sense of momentum and possibility. Include calls to action that push the reader toward their goals. Think "personal trainer meets life coach — energetic, direct, no excuses."`,

  storytelling: `**Tone: Storytelling**
Write in narrative form with a clear arc: setup, tension, resolution/insight. Draw the reader in with vivid sensory details, emotional hooks, and relatable characters or situations. Make the audience feel like they're part of the story. End with a meaningful insight or lesson. Think "campfire storyteller who always has a point."`,

  provocative: `**Tone: Provocative**
Write with boldness and conviction. Challenge conventional wisdom, state unpopular opinions confidently, and make the reader think twice. Use rhetorical questions, contrarian viewpoints, and debate-sparking statements. The goal is to stop the scroll and spark conversation. Think "the smartest person in the room who isn't afraid to disagree."`,
};

// ---------------------------------------------------------------------------
// Language instruction map
// ---------------------------------------------------------------------------

const LANGUAGE_NAMES: Record<Language, string> = {
  tr: "Turkish (Turkce)",
  en: "English",
  de: "German (Deutsch)",
  fr: "French (Francais)",
  es: "Spanish (Espanol)",
  ar: "Arabic",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese (Simplified)",
  pt: "Portuguese (Portugues)",
};

// ---------------------------------------------------------------------------
// System prompt options
// ---------------------------------------------------------------------------

export interface CaptionSystemPromptOptions {
  includeEmojis: boolean;
  includeCta: boolean;
  includeHashtags: boolean;
}

// ---------------------------------------------------------------------------
// buildCaptionSystemPrompt
// ---------------------------------------------------------------------------

export function buildCaptionSystemPrompt(
  platform: Platform,
  tone: Tone,
  language: Language,
  options: CaptionSystemPromptOptions
): string {
  const platformCfg = getPlatformConfig(platform);
  const toneCfg = getToneConfig(tone);
  const langName = LANGUAGE_NAMES[language] ?? language;

  const emojiDirective = options.includeEmojis
    ? "Include relevant emojis throughout the text to boost engagement and visual appeal."
    : "Do NOT include any emojis in the output. Keep the text clean and emoji-free.";

  const ctaDirective = options.includeCta
    ? "Include a compelling call-to-action (CTA) at the end of each caption that encourages the audience to take a specific action (comment, share, save, follow, click link, etc.)."
    : "Do NOT include any explicit call-to-action. Let the content stand on its own.";

  const hashtagDirective = options.includeHashtags
    ? `Include relevant hashtags with each caption. Use up to ${platformCfg.hashtagLimit} hashtags. Mix broad-reach and niche hashtags.`
    : "Do NOT include any hashtags in the captions.";

  return `You are an elite social media content strategist and copywriter with 15+ years of experience growing brands across all major platforms. You have worked with Fortune 500 companies, viral creators, and emerging brands. Your captions consistently achieve above-average engagement rates.

## Your Task
Generate high-quality social media captions for the **${platformCfg.name}** platform.

## Output Language
ALL content MUST be written in **${langName}**. Every word of the caption text, hashtags, and CTAs must be in ${langName}.

${PLATFORM_INSTRUCTIONS[platform]}

${TONE_INSTRUCTIONS[tone]}

## Content Requirements
- ${emojiDirective}
- ${ctaDirective}
- ${hashtagDirective}

## Platform Constraints
- Platform: ${platformCfg.name}
- Character limit: ${platformCfg.charLimit} characters
- Hashtag limit: ${platformCfg.hashtagLimit} hashtags
- CRITICAL: Each caption MUST stay within the ${platformCfg.charLimit} character limit. Count carefully.

## Quality Standards
- Every caption must be UNIQUE — no repetitive structures or filler.
- Vary sentence length and rhythm. Mix short punchy lines with longer flowing ones.
- Use power words that trigger emotion: exclusive, secret, proven, ultimate, essential, shocking, unexpected.
- Avoid generic phrases like "Check this out" or "Link in bio" unless they fit naturally.
- Each caption should work as a STANDALONE piece of content.

## Output Format
You MUST respond with a valid JSON object. No markdown, no code blocks, no extra text. Just raw JSON.

The JSON must follow this exact structure:
{
  "captions": [
    {
      "text": "The full caption text including emojis and hashtags if requested",
      "hook": "The opening line / scroll-stopping hook",
      "body": "The main body of the caption",
      "cta": "The call-to-action (empty string if not requested)",
      "charCount": 234
    }
  ]
}`;
}

// ---------------------------------------------------------------------------
// buildCaptionUserPrompt
// ---------------------------------------------------------------------------

export function buildCaptionUserPrompt(
  topic: string,
  count: number,
  imageDescription?: string,
  persona?: string
): string {
  const parts: string[] = [];

  parts.push(`Generate exactly ${count} unique, high-quality caption(s) about the following topic:`);
  parts.push(`**Topic:** ${topic}`);

  if (imageDescription) {
    parts.push(`\n**Image Context:** The post includes an image described as: "${imageDescription}". Incorporate visual references from this image naturally into the captions. Reference what viewers can see.`);
  }

  if (persona) {
    parts.push(`\n**Brand Persona:** Write in the voice of: "${persona}". Maintain this persona's unique vocabulary, catchphrases, and communication style consistently across all captions.`);
  }

  parts.push(`\nRemember:
- Return ONLY valid JSON.
- Each caption must be completely unique in structure and approach.
- Vary the hooks, angles, and writing patterns across captions.
- Count characters accurately and report in charCount.`);

  // Few-shot example for reliable output
  parts.push(`\n**Example output format:**
{
  "captions": [
    {
      "text": "Your morning routine is lying to you. \\n\\nHere's what actually moves the needle...",
      "hook": "Your morning routine is lying to you.",
      "body": "Here's what actually moves the needle...",
      "cta": "",
      "charCount": 82
    }
  ]
}`);

  return parts.join("\n");
}

// ---------------------------------------------------------------------------
// buildHashtagSystemPrompt
// ---------------------------------------------------------------------------

export function buildHashtagSystemPrompt(
  platform: Platform,
  language: Language
): string {
  const platformCfg = getPlatformConfig(platform);
  const langName = LANGUAGE_NAMES[language] ?? language;

  return `You are a social media hashtag strategist specializing in ${platformCfg.name}. You understand hashtag algorithms, discoverability, and the balance between reach and relevancy.

## Your Task
Generate a curated set of hashtags for ${platformCfg.name} content.

## Language
Generate hashtags in **${langName}** where appropriate. For widely-recognized English hashtags that have better reach, keep them in English. Use your judgment on which language will maximize discoverability.

## Hashtag Strategy for ${platformCfg.name}
- Maximum hashtags: ${platformCfg.hashtagLimit}
- Categorize each hashtag by type: "niche" (specific to the topic, <100K posts), "broad" (popular general tags, 100K-10M posts), "trending" (currently trending or seasonal), or "branded" (brand-specific, campaign tags).
- Rate relevancy from 0.0 to 1.0 based on how closely the hashtag matches the content.

## Quality Rules
- No banned or shadowbanned hashtags.
- No overly generic hashtags like #love #instagood unless specifically relevant.
- Each hashtag must start with #.
- Mix different categories for optimal reach: ~40% niche, ~30% broad, ~20% trending, ~10% branded.

## Output Format
Return ONLY valid JSON:
{
  "hashtags": [
    { "tag": "#exampleHashtag", "category": "niche", "relevancy": 0.92 }
  ]
}`;
}

// ---------------------------------------------------------------------------
// buildHashtagUserPrompt
// ---------------------------------------------------------------------------

export function buildHashtagUserPrompt(topic: string, count: number): string {
  return `Generate exactly ${count} highly relevant hashtags for the following topic:

**Topic:** ${topic}

Requirements:
- Return exactly ${count} hashtags.
- Include a balanced mix of niche, broad, trending, and branded categories.
- Sort by relevancy (highest first).
- Return ONLY valid JSON, no markdown.

**Example output:**
{
  "hashtags": [
    { "tag": "#DigitalMarketing", "category": "broad", "relevancy": 0.95 },
    { "tag": "#ContentStrategy2024", "category": "niche", "relevancy": 0.88 },
    { "tag": "#MarketingTips", "category": "trending", "relevancy": 0.82 }
  ]
}`;
}

// ---------------------------------------------------------------------------
// buildRefinePrompt
// ---------------------------------------------------------------------------

export function buildRefinePrompt(
  caption: string,
  instruction: string,
  platform: Platform,
  language: Language
): string {
  const platformCfg = getPlatformConfig(platform);
  const langName = LANGUAGE_NAMES[language] ?? language;

  return `You are an expert social media copywriter. You will refine an existing caption based on specific instructions.

## Platform
${platformCfg.name} (character limit: ${platformCfg.charLimit})

## Language
Write in **${langName}**.

## Original Caption
"""
${caption}
"""

## Refinement Instruction
${instruction}

## Rules
- Apply the refinement instruction precisely.
- Maintain the original voice and intent unless the instruction says otherwise.
- Stay within the ${platformCfg.charLimit} character limit.
- Preserve hashtags unless the instruction specifically asks to change them.
- Maintain the same language as the original unless instructed otherwise.

## Output Format
Return ONLY valid JSON:
{
  "caption": {
    "text": "The refined caption text",
    "hook": "The opening hook",
    "body": "The main body",
    "cta": "The CTA if present, empty string otherwise",
    "charCount": 150
  }
}`;
}

// ---------------------------------------------------------------------------
// buildBrandVoiceAnalysisPrompt
// ---------------------------------------------------------------------------

export function buildBrandVoiceAnalysisPrompt(samples: string[]): string {
  const numberedSamples = samples
    .map((s, i) => `Sample ${i + 1}:\n"""${s}"""`)
    .join("\n\n");

  return `You are a brand voice analyst and linguistics expert. Analyze the following writing samples to extract the unique brand voice characteristics.

## Writing Samples
${numberedSamples}

## Your Analysis Must Cover

1. **Voice Attributes** — 3-5 adjectives that define this brand's voice (e.g., "bold", "playful", "authoritative").
2. **Vocabulary Patterns** — Recurring words, phrases, or expressions unique to this brand.
3. **Sentence Structure** — Typical sentence length, complexity, and rhythm patterns.
4. **Tone Markers** — How the brand conveys emotion (exclamation usage, question patterns, emoji habits).
5. **Unique Quirks** — Any distinctive writing habits, catchphrases, formatting preferences, or signature elements.
6. **Communication Style** — How the brand addresses its audience (formal/informal, first/second/third person, inclusive language patterns).

## Output Format
Return ONLY valid JSON:
{
  "voiceAttributes": ["bold", "playful", "authoritative"],
  "vocabularyPatterns": ["frequently uses 'game-changer'", "prefers 'we' over 'I'"],
  "sentenceStructure": "Short punchy sentences mixed with longer explanatory ones. Average 8-12 words per sentence.",
  "toneMarkers": "Heavy exclamation usage, rhetorical questions, minimal emoji",
  "uniqueQuirks": ["Always starts with a one-word sentence", "Uses dashes extensively"],
  "communicationStyle": "Direct second-person address, inclusive 'we' language, casual but knowledgeable",
  "summary": "A concise 2-3 sentence summary of the brand voice that can be used as a persona instruction."
}`;
}
