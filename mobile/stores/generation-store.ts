import { create } from "zustand";
import type { Platform, Tone, Language } from "@/types/platform";
import type {
  GenerationRequest,
  GenerationResult,
  GeneratedCaption,
  GeneratedHashtag,
  Template,
  HistoryItem,
  FavoriteItem,
} from "@/types/caption";
import * as api from "@/lib/api-client";

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
  imageDescription: string;
  templateId: string | null;

  // Results
  result: GenerationResult | null;
  captions: GeneratedCaption[];
  hashtags: GeneratedHashtag[];

  // Lists
  templates: Template[];
  history: HistoryItem[];
  favorites: FavoriteItem[];

  // UI state
  isGenerating: boolean;
  isLoadingTemplates: boolean;
  isLoadingHistory: boolean;
  isLoadingFavorites: boolean;
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
  setImageDescription: (desc: string) => void;
  setTemplateId: (id: string | null) => void;
  setError: (error: string | null) => void;

  generate: () => Promise<void>;
  loadTemplates: () => Promise<void>;
  loadHistory: () => Promise<void>;
  loadFavorites: () => Promise<void>;
  toggleFavorite: (captionId: string) => Promise<void>;
  applyTemplate: (template: Template) => void;
  reset: () => void;
}

const initialFormState = {
  topic: "",
  platform: "instagram" as Platform,
  tone: "casual" as Tone,
  language: "en" as Language,
  count: 3,
  includeEmojis: true,
  includeCta: true,
  includeHashtags: true,
  persona: "",
  imageDescription: "",
  templateId: null as string | null,
};

export const useGenerationStore = create<GenerationState>((set, get) => ({
  ...initialFormState,

  result: null,
  captions: [],
  hashtags: [],
  templates: [],
  history: [],
  favorites: [],

  isGenerating: false,
  isLoadingTemplates: false,
  isLoadingHistory: false,
  isLoadingFavorites: false,
  error: null,

  setTopic: (topic) => set({ topic }),
  setPlatform: (platform) => set({ platform }),
  setTone: (tone) => set({ tone }),
  setLanguage: (language) => set({ language }),
  setCount: (count) => set({ count }),
  setIncludeEmojis: (includeEmojis) => set({ includeEmojis }),
  setIncludeCta: (includeCta) => set({ includeCta }),
  setIncludeHashtags: (includeHashtags) => set({ includeHashtags }),
  setPersona: (persona) => set({ persona }),
  setImageDescription: (imageDescription) => set({ imageDescription }),
  setTemplateId: (templateId) => set({ templateId }),
  setError: (error) => set({ error }),

  generate: async () => {
    const state = get();
    if (!state.topic.trim()) {
      set({ error: "Please enter a topic" });
      return;
    }

    set({ isGenerating: true, error: null });

    try {
      const request: GenerationRequest = {
        topic: state.topic,
        platform: state.platform,
        tone: state.tone,
        language: state.language,
        count: state.count,
        includeEmojis: state.includeEmojis,
        includeCta: state.includeCta,
        includeHashtags: state.includeHashtags,
        ...(state.persona && { persona: state.persona }),
        ...(state.imageDescription && { imageDescription: state.imageDescription }),
        ...(state.templateId && { templateId: state.templateId }),
      };

      const result = await api.generateCaption(request);
      set({
        result,
        captions: result.captions,
        hashtags: result.hashtags,
        isGenerating: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Generation failed",
        isGenerating: false,
      });
    }
  },

  loadTemplates: async () => {
    set({ isLoadingTemplates: true });
    try {
      const templates = await api.getTemplates();
      set({ templates, isLoadingTemplates: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to load templates",
        isLoadingTemplates: false,
      });
    }
  },

  loadHistory: async () => {
    set({ isLoadingHistory: true });
    try {
      const data = await api.getHistory();
      set({ history: data.generations, isLoadingHistory: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to load history",
        isLoadingHistory: false,
      });
    }
  },

  loadFavorites: async () => {
    set({ isLoadingFavorites: true });
    try {
      const favorites = await api.getFavorites();
      set({ favorites, isLoadingFavorites: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to load favorites",
        isLoadingFavorites: false,
      });
    }
  },

  toggleFavorite: async (captionId: string) => {
    try {
      await api.toggleFavorite(captionId);
      // Refresh favorites list
      const favorites = await api.getFavorites();
      set({ favorites });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to toggle favorite",
      });
    }
  },

  applyTemplate: (template: Template) => {
    set({
      templateId: template.id,
      tone: template.tone,
      ...(template.platform !== "all" && { platform: template.platform }),
    });
  },

  reset: () => {
    set({
      ...initialFormState,
      result: null,
      captions: [],
      hashtags: [],
      error: null,
    });
  },
}));
