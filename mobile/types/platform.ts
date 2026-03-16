export type Platform =
  | "instagram"
  | "tiktok"
  | "twitter"
  | "linkedin"
  | "facebook"
  | "youtube"
  | "pinterest";

export type Tone =
  | "professional"
  | "casual"
  | "funny"
  | "inspirational"
  | "educational"
  | "motivational"
  | "storytelling"
  | "provocative";

export type HashtagCategory = "niche" | "broad" | "trending" | "branded";

export type Language = "tr" | "en" | "de" | "fr" | "es" | "ar" | "ja" | "ko" | "zh" | "pt";

export interface PlatformConfig {
  id: Platform;
  name: string;
  icon: string;
  charLimit: number;
  hashtagLimit: number;
  description: string;
  tips: string[];
}

export interface ToneConfig {
  id: Tone;
  name: string;
  nametr: string;
  description: string;
  emoji: string;
}
