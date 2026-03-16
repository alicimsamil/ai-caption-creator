import { getServerUrl } from "./storage";
import type {
  GenerationRequest,
  GenerationResult,
  GeneratedHashtag,
  RefineRequest,
  Template,
} from "@/types/caption";

async function getBaseUrl(): Promise<string> {
  return await getServerUrl();
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = await getBaseUrl();
  const url = `${baseUrl}/api${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(
      `API Error ${response.status}: ${errorBody || response.statusText}`
    );
  }

  return response.json();
}

export async function generateCaption(
  req: GenerationRequest
): Promise<GenerationResult> {
  return request<GenerationResult>("/generate/caption", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

export async function generateHashtags(
  topic: string,
  platform: string,
  language: string,
  count?: number
): Promise<{ hashtags: GeneratedHashtag[] }> {
  return request<{ hashtags: GeneratedHashtag[] }>("/generate/hashtags", {
    method: "POST",
    body: JSON.stringify({ topic, platform, language, count }),
  });
}

export async function analyzeImage(
  imageBase64: string,
  mimeType: string
): Promise<{ description: string }> {
  return request<{ description: string }>("/generate/image-analyze", {
    method: "POST",
    body: JSON.stringify({ image: imageBase64, mimeType }),
  });
}

export async function refineCaption(
  req: RefineRequest
): Promise<{ text: string }> {
  return request<{ text: string }>("/generate/refine", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

export async function getTemplates(): Promise<Template[]> {
  return request<Template[]>("/templates");
}

export async function getHistory(): Promise<GenerationResult[]> {
  return request<GenerationResult[]>("/history");
}

export async function getFavorites(): Promise<GenerationResult[]> {
  return request<GenerationResult[]>("/favorites");
}

export async function toggleFavorite(
  captionId: string
): Promise<{ isFavorite: boolean }> {
  return request<{ isFavorite: boolean }>("/favorites", {
    method: "POST",
    body: JSON.stringify({ captionId }),
  });
}

export async function getTrending(
  platform?: string
): Promise<{ hashtags: GeneratedHashtag[] }> {
  const query = platform ? `?platform=${platform}` : "";
  return request<{ hashtags: GeneratedHashtag[] }>(`/trending${query}`);
}

export async function getModels(): Promise<{ models: string[] }> {
  return request<{ models: string[] }>("/models");
}

export async function checkHealth(): Promise<{
  status: string;
  model?: string;
}> {
  return request<{ status: string; model?: string }>("/health");
}
