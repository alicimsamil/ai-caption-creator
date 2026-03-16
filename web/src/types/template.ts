import type { Platform, Tone } from "./platform";

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
