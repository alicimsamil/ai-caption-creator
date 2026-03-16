import { create } from "zustand";
import type {
  GenerationRequest,
  GeneratedCaption,
  GeneratedHashtag,
  GenerationResult,
} from "@/types/caption";
import type { Platform, Tone, Language } from "@/types/platform";

interface GenerationState {
  // Form state
  topic: string;
  platform: Platform;
  tone: Tone;
  language: Language;
  count: number;
  includeEmojis: boolean;
  includeCta: boolean;
  includeHashtags: boolean;
  persona: string;
  templateId: string | null;
  imageFile: File | null;
  imagePreview: string | null;
  imageDescription: string | null;

  // Generation state
  isGenerating: boolean;
  isAnalyzingImage: boolean;
  results: GenerationResult | null;
  streamingText: string;
  error: string | null;

  // Actions
  setTopic: (topic: string) => void;
  setPlatform: (platform: Platform) => void;
  setTone: (tone: Tone) => void;
  setLanguage: (language: Language) => void;
  setCount: (count: number) => void;
  setIncludeEmojis: (include: boolean) => void;
  setIncludeCta: (include: boolean) => void;
  setIncludeHashtags: (include: boolean) => void;
  setPersona: (persona: string) => void;
  setTemplateId: (id: string | null) => void;
  setImageFile: (file: File | null) => void;
  setImagePreview: (url: string | null) => void;
  setImageDescription: (desc: string | null) => void;
  setIsGenerating: (generating: boolean) => void;
  setIsAnalyzingImage: (analyzing: boolean) => void;
  setResults: (results: GenerationResult | null) => void;
  setStreamingText: (text: string) => void;
  appendStreamingText: (text: string) => void;
  setError: (error: string | null) => void;
  reset: () => void;

  getRequest: () => GenerationRequest;
}

const initialState = {
  topic: "",
  platform: "instagram" as Platform,
  tone: "casual" as Tone,
  language: "tr" as Language,
  count: 3,
  includeEmojis: true,
  includeCta: true,
  includeHashtags: true,
  persona: "",
  templateId: null as string | null,
  imageFile: null as File | null,
  imagePreview: null as string | null,
  imageDescription: null as string | null,
  isGenerating: false,
  isAnalyzingImage: false,
  results: null as GenerationResult | null,
  streamingText: "",
  error: null as string | null,
};

export const useGenerationStore = create<GenerationState>((set, get) => ({
  ...initialState,

  setTopic: (topic) => set({ topic }),
  setPlatform: (platform) => set({ platform }),
  setTone: (tone) => set({ tone }),
  setLanguage: (language) => set({ language }),
  setCount: (count) => set({ count }),
  setIncludeEmojis: (includeEmojis) => set({ includeEmojis }),
  setIncludeCta: (includeCta) => set({ includeCta }),
  setIncludeHashtags: (includeHashtags) => set({ includeHashtags }),
  setPersona: (persona) => set({ persona }),
  setTemplateId: (templateId) => set({ templateId }),
  setImageFile: (imageFile) => set({ imageFile }),
  setImagePreview: (imagePreview) => set({ imagePreview }),
  setImageDescription: (imageDescription) => set({ imageDescription }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setIsAnalyzingImage: (isAnalyzingImage) => set({ isAnalyzingImage }),
  setResults: (results) => set({ results }),
  setStreamingText: (streamingText) => set({ streamingText }),
  appendStreamingText: (text) =>
    set((state) => ({ streamingText: state.streamingText + text })),
  setError: (error) => set({ error }),
  reset: () => set(initialState),

  getRequest: () => {
    const state = get();
    return {
      topic: state.topic,
      platform: state.platform,
      tone: state.tone,
      language: state.language,
      count: state.count,
      includeEmojis: state.includeEmojis,
      includeCta: state.includeCta,
      includeHashtags: state.includeHashtags,
      persona: state.persona || undefined,
      templateId: state.templateId || undefined,
      imageDescription: state.imageDescription || undefined,
    };
  },
}));
