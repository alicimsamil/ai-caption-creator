import type { Platform, Tone, HashtagCategory, Language } from "./platform";

export interface GenerationRequest {
  topic: string;
  platform: Platform;
  tone: Tone;
  language: Language;
  count: number;
  includeEmojis: boolean;
  includeCta: boolean;
  includeHashtags: boolean;
  templateId?: string;
  imageDescription?: string;
  persona?: string;
  brandVoiceSamples?: string[];
}

export interface GeneratedCaption {
  id?: string;
  text: string;
  platform: Platform;
  charCount: number;
  hasEmojis: boolean;
  hasCta: boolean;
  isFavorite?: boolean;
  hook?: string;
  body?: string;
  cta?: string;
}

export interface GeneratedHashtag {
  id?: string;
  tag: string;
  category: HashtagCategory;
  relevancy: number;
}

export interface GenerationResult {
  id?: string;
  captions: GeneratedCaption[];
  hashtags: GeneratedHashtag[];
  platform: Platform;
  tone: Tone;
  language: Language;
  model: string;
  createdAt?: string;
}

export interface RefineRequest {
  captionText: string;
  instruction: string;
  platform: Platform;
  tone: Tone;
  language: Language;
}

export interface Template {
  id: string;
  name: string;
  nameTr?: string;
  description: string;
  descriptionTr?: string;
  platform: Platform | "all";
  tone: Tone;
  category: TemplateCategory;
  promptTemplate: string;
  exampleOutput?: string;
  isBuiltIn: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TemplateCategory =
  | "product-launch"
  | "behind-the-scenes"
  | "quote"
  | "tutorial"
  | "announcement"
  | "engagement"
  | "storytelling"
  | "promotion"
  | "seasonal"
  | "user-generated"
  | "collaboration"
  | "milestone"
  | "tips-tricks"
  | "before-after"
  | "question"
  | "contest";
