import type { Platform, PlatformConfig, Tone, ToneConfig } from "@/types/platform";

export const PLATFORM_CONFIGS: Record<Platform, PlatformConfig> = {
  instagram: {
    id: "instagram",
    name: "Instagram",
    icon: "instagram",
    charLimit: 2200,
    hashtagLimit: 30,
    description: "Visual-first platform for photos, reels, and stories",
    tips: [
      "First 125 characters appear in feed — make them count",
      "Use line breaks to improve readability",
      "Place hashtags at the end or in a comment",
      "Include a clear call-to-action (save, share, comment)",
      "Emojis boost engagement by up to 48%",
      "Use 5-10 highly relevant hashtags instead of 30 generic ones",
      "Start with a strong hook to stop the scroll",
      "Ask questions to drive comments",
    ],
  },
  tiktok: {
    id: "tiktok",
    name: "TikTok",
    icon: "tiktok",
    charLimit: 4000,
    hashtagLimit: 10,
    description: "Short-form video platform with viral potential",
    tips: [
      "Hook viewers in the first 1-2 seconds with the caption",
      "Keep captions short and punchy — 150 chars ideal",
      "Use trending hashtags mixed with niche ones",
      "Write in a conversational, relatable tone",
      "Capitalize on trends and challenges",
      "Use humor and relatability to drive shares",
      "Add a CTA like 'Follow for more' or 'Try this!'",
      "Controversy and hot takes drive engagement",
    ],
  },
  twitter: {
    id: "twitter",
    name: "X (Twitter)",
    icon: "twitter",
    charLimit: 280,
    hashtagLimit: 3,
    description: "Microblogging platform for real-time conversations",
    tips: [
      "Stay under 280 characters — brevity is king",
      "Use 1-2 hashtags maximum for best engagement",
      "Thread long-form content for deeper storytelling",
      "Wit, humor, and hot takes perform best",
      "Ask questions or create polls for engagement",
      "Avoid excessive punctuation and emojis",
      "Timing matters — post during peak hours",
      "Quote-tweet with commentary to add value",
    ],
  },
  linkedin: {
    id: "linkedin",
    name: "LinkedIn",
    icon: "linkedin",
    charLimit: 3000,
    hashtagLimit: 5,
    description: "Professional networking and thought leadership platform",
    tips: [
      "Open with a bold statement or surprising statistic",
      "Use short paragraphs (1-2 sentences each)",
      "Share personal stories tied to professional lessons",
      "End with a thought-provoking question",
      "Use 3-5 relevant hashtags",
      "Format with line breaks for mobile readability",
      "Share actionable insights and frameworks",
      "Tag relevant people and companies for reach",
    ],
  },
  facebook: {
    id: "facebook",
    name: "Facebook",
    icon: "facebook",
    charLimit: 63206,
    hashtagLimit: 5,
    description: "Community-driven platform for sharing and discussion",
    tips: [
      "Keep posts between 40-80 characters for highest engagement",
      "Use questions to spark conversation",
      "Share stories that evoke emotion",
      "Longer posts work for community engagement",
      "Use 1-3 hashtags at most",
      "Include clear CTAs for clicks and shares",
      "Native video and photo posts get more reach",
      "Respond to comments to boost algorithm ranking",
    ],
  },
  youtube: {
    id: "youtube",
    name: "YouTube",
    icon: "youtube",
    charLimit: 5000,
    hashtagLimit: 15,
    description: "Long-form and short-form video platform",
    tips: [
      "Front-load keywords in the first 100 characters",
      "Use timestamps for longer descriptions",
      "Include relevant links and CTAs",
      "Add 3-5 hashtags above the title line",
      "Write descriptions of 200+ words for SEO",
      "Include related keywords naturally",
      "Add social media links in every description",
      "Use chapters to improve watch time and SEO",
    ],
  },
  pinterest: {
    id: "pinterest",
    name: "Pinterest",
    icon: "pinterest",
    charLimit: 500,
    hashtagLimit: 20,
    description: "Visual discovery and bookmarking platform",
    tips: [
      "Use keyword-rich descriptions for search",
      "Write 100-200 character descriptions for best results",
      "Include actionable language (try, make, create, discover)",
      "Use relevant hashtags for discoverability",
      "Focus on evergreen, searchable content",
      "Describe what users will learn or gain",
      "Add a clear benefit statement",
      "Avoid hashtag-stuffing — quality over quantity",
    ],
  },
};

export const TONE_CONFIGS: ToneConfig[] = [
  {
    id: "professional",
    name: "Professional",
    nametr: "Profesyonel",
    description: "Polished, authoritative, and business-appropriate",
    emoji: "💼",
  },
  {
    id: "casual",
    name: "Casual",
    nametr: "Günlük",
    description: "Relaxed, friendly, and conversational",
    emoji: "😊",
  },
  {
    id: "funny",
    name: "Funny",
    nametr: "Eğlenceli",
    description: "Humorous, witty, and entertaining",
    emoji: "😂",
  },
  {
    id: "inspirational",
    name: "Inspirational",
    nametr: "İlham Verici",
    description: "Uplifting, empowering, and motivating",
    emoji: "✨",
  },
  {
    id: "educational",
    name: "Educational",
    nametr: "Eğitici",
    description: "Informative, clear, and teaching-focused",
    emoji: "📚",
  },
  {
    id: "motivational",
    name: "Motivational",
    nametr: "Motive Edici",
    description: "Action-driven, energetic, and encouraging",
    emoji: "🔥",
  },
  {
    id: "storytelling",
    name: "Storytelling",
    nametr: "Hikaye Anlatıcı",
    description: "Narrative, immersive, and emotionally engaging",
    emoji: "📖",
  },
  {
    id: "provocative",
    name: "Provocative",
    nametr: "Kışkırtıcı",
    description: "Bold, thought-provoking, and debate-sparking",
    emoji: "⚡",
  },
];

export function getPlatformConfig(platform: Platform): PlatformConfig {
  return PLATFORM_CONFIGS[platform];
}

export function getToneConfig(tone: Tone): ToneConfig {
  const config = TONE_CONFIGS.find((t) => t.id === tone);
  if (!config) {
    throw new Error(`Unknown tone: ${tone}`);
  }
  return config;
}

export const PLATFORMS: PlatformConfig[] = Object.values(PLATFORM_CONFIGS);

export function getAllPlatforms(): PlatformConfig[] {
  return PLATFORMS;
}

export function getAllTones(): ToneConfig[] {
  return TONE_CONFIGS;
}
