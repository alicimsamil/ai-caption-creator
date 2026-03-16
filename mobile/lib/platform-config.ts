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
      "First 125 characters appear in feed",
      "Use 5-10 highly relevant hashtags",
      "Include a clear call-to-action",
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
      "Hook viewers in first 1-2 seconds",
      "Keep captions short and punchy",
      "Use trending hashtags",
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
      "Stay under 280 characters",
      "Use 1-2 hashtags maximum",
      "Wit and hot takes perform best",
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
      "Open with a bold statement",
      "Use short paragraphs",
      "Share personal stories tied to professional lessons",
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
      "Use 1-3 hashtags at most",
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
      "Front-load keywords in first 100 characters",
      "Add 3-5 hashtags above the title line",
      "Write descriptions of 200+ words for SEO",
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
      "Use keyword-rich descriptions",
      "Write 100-200 character descriptions",
      "Include actionable language",
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
