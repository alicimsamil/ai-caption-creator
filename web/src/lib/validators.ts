import { z } from "zod";

// ---------------------------------------------------------------------------
// Shared enums
// ---------------------------------------------------------------------------

const platformEnum = z.enum([
  "instagram",
  "tiktok",
  "twitter",
  "linkedin",
  "facebook",
  "youtube",
  "pinterest",
]);

const toneEnum = z.enum([
  "professional",
  "casual",
  "funny",
  "inspirational",
  "educational",
  "motivational",
  "storytelling",
  "provocative",
]);

const languageEnum = z.enum([
  "tr",
  "en",
  "de",
  "fr",
  "es",
  "ar",
  "ja",
  "ko",
  "zh",
  "pt",
]);

const hashtagCategoryEnum = z.enum(["niche", "broad", "trending", "branded"]);

const templateCategoryEnum = z.enum([
  "product-launch",
  "behind-the-scenes",
  "quote",
  "tutorial",
  "announcement",
  "engagement",
  "storytelling",
  "promotion",
  "seasonal",
  "user-generated",
  "collaboration",
  "milestone",
  "tips-tricks",
  "before-after",
  "question",
  "contest",
]);

// ---------------------------------------------------------------------------
// Caption generation request
// ---------------------------------------------------------------------------

export const generateCaptionSchema = z.object({
  topic: z
    .string()
    .min(2, "Topic must be at least 2 characters")
    .max(500, "Topic must be under 500 characters"),
  platform: platformEnum,
  tone: toneEnum,
  language: languageEnum,
  count: z
    .number()
    .int()
    .min(1, "Must generate at least 1 caption")
    .max(10, "Cannot generate more than 10 captions at once"),
  includeEmojis: z.boolean().default(true),
  includeCta: z.boolean().default(true),
  includeHashtags: z.boolean().default(true),
  templateId: z.string().uuid().optional(),
  imageDescription: z.string().max(1000).optional(),
  persona: z.string().max(500).optional(),
  brandVoiceSamples: z
    .array(z.string().min(10).max(2000))
    .max(5, "Maximum 5 brand voice samples")
    .optional(),
});

export type GenerateCaptionInput = z.infer<typeof generateCaptionSchema>;

// ---------------------------------------------------------------------------
// Hashtag generation request
// ---------------------------------------------------------------------------

export const generateHashtagSchema = z.object({
  topic: z
    .string()
    .min(2, "Topic must be at least 2 characters")
    .max(500, "Topic must be under 500 characters"),
  platform: platformEnum,
  language: languageEnum,
  count: z
    .number()
    .int()
    .min(1, "Must generate at least 1 hashtag")
    .max(30, "Cannot generate more than 30 hashtags at once"),
});

export type GenerateHashtagInput = z.infer<typeof generateHashtagSchema>;

// ---------------------------------------------------------------------------
// Caption refinement request
// ---------------------------------------------------------------------------

export const refineSchema = z.object({
  captionText: z
    .string()
    .min(1, "Caption text is required")
    .max(10000, "Caption text is too long"),
  instruction: z
    .string()
    .min(2, "Refinement instruction must be at least 2 characters")
    .max(500, "Refinement instruction must be under 500 characters"),
  platform: platformEnum,
  tone: toneEnum,
  language: languageEnum,
});

export type RefineInput = z.infer<typeof refineSchema>;

// ---------------------------------------------------------------------------
// Template creation / update
// ---------------------------------------------------------------------------

export const templateSchema = z.object({
  name: z
    .string()
    .min(2, "Template name must be at least 2 characters")
    .max(100, "Template name must be under 100 characters"),
  nameTr: z.string().max(100).optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be under 500 characters"),
  descriptionTr: z.string().max(500).optional(),
  platform: platformEnum.or(z.literal("all")),
  tone: toneEnum,
  category: templateCategoryEnum,
  promptTemplate: z
    .string()
    .min(20, "Prompt template must be at least 20 characters")
    .max(2000, "Prompt template must be under 2000 characters"),
  exampleOutput: z.string().max(5000).optional(),
});

export type TemplateInput = z.infer<typeof templateSchema>;

// ---------------------------------------------------------------------------
// AI model response schemas (for runtime validation of LLM output)
// ---------------------------------------------------------------------------

export const generatedCaptionResponseSchema = z.object({
  captions: z.array(
    z.object({
      text: z.string(),
      hook: z.string().optional().default(""),
      body: z.string().optional().default(""),
      cta: z.string().optional().default(""),
      charCount: z.number().optional(),
    })
  ),
});

export type GeneratedCaptionResponse = z.infer<typeof generatedCaptionResponseSchema>;

export const generatedHashtagResponseSchema = z.object({
  hashtags: z.array(
    z.object({
      tag: z.string(),
      category: hashtagCategoryEnum,
      relevancy: z.number().min(0).max(1),
    })
  ),
});

export type GeneratedHashtagResponse = z.infer<typeof generatedHashtagResponseSchema>;

export const refinedCaptionResponseSchema = z.object({
  caption: z.object({
    text: z.string(),
    hook: z.string().optional().default(""),
    body: z.string().optional().default(""),
    cta: z.string().optional().default(""),
    charCount: z.number().optional(),
  }),
});

export type RefinedCaptionResponse = z.infer<typeof refinedCaptionResponseSchema>;

export const brandVoiceAnalysisResponseSchema = z.object({
  voiceAttributes: z.array(z.string()),
  vocabularyPatterns: z.array(z.string()),
  sentenceStructure: z.string(),
  toneMarkers: z.string(),
  uniqueQuirks: z.array(z.string()),
  communicationStyle: z.string(),
  summary: z.string(),
});

export type BrandVoiceAnalysisResponse = z.infer<typeof brandVoiceAnalysisResponseSchema>;
