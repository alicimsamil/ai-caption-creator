import { getServerUrl } from "./storage";
import type {
  GenerationRequest,
  GenerationResult,
  Template,
  HistoryItem,
  FavoriteItem,
  TrendingHashtag,
  ModelInfo,
} from "@/types/caption";

async function getBaseUrl(): Promise<string> {
  return await getServerUrl();
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = await getBaseUrl();
  const url = `${baseUrl}${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `Request failed: ${response.status}`);
  }

  return response.json();
}

export async function generateCaption(
  req: GenerationRequest
): Promise<GenerationResult> {
  const data = await request<{ generation: GenerationResult }>(
    "/api/generate/caption",
    {
      method: "POST",
      body: JSON.stringify(req),
    }
  );
  return data.generation;
}

export async function generateHashtags(
  topic: string,
  platform: string,
  count?: number
): Promise<{ hashtags: Array<{ tag: string; category: string; relevancy: number }> }> {
  return request("/api/generate/hashtags", {
    method: "POST",
    body: JSON.stringify({ topic, platform, count }),
  });
}

export async function analyzeImage(
  imageUri: string,
  mimeType: string
): Promise<{ description: string; confidence: number; tags: string[] }> {
  const baseUrl = await getBaseUrl();
  const formData = new FormData();

  const filename = imageUri.split("/").pop() || "image.jpg";
  formData.append("image", {
    uri: imageUri,
    name: filename,
    type: mimeType,
  } as unknown as Blob);

  const response = await fetch(`${baseUrl}/api/generate/image-analyze`, {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || "Image analysis failed");
  }

  return response.json();
}

export async function getTemplates(
  platform?: string,
  category?: string
): Promise<Template[]> {
  const params = new URLSearchParams();
  if (platform) params.set("platform", platform);
  if (category) params.set("category", category);
  const query = params.toString();
  const data = await request<{ templates: Template[] }>(
    `/api/templates${query ? `?${query}` : ""}`
  );
  return data.templates;
}

export async function getHistory(
  page = 1,
  limit = 20,
  platform?: string
): Promise<{ generations: HistoryItem[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (platform) params.set("platform", platform);
  return request(`/api/history?${params.toString()}`);
}

export async function getFavorites(): Promise<FavoriteItem[]> {
  const data = await request<{ favorites: FavoriteItem[] }>("/api/favorites");
  return data.favorites;
}

export async function toggleFavorite(
  captionId: string
): Promise<{ isFavorite: boolean }> {
  return request("/api/favorites", {
    method: "POST",
    body: JSON.stringify({ captionId }),
  });
}

export async function getTrending(): Promise<TrendingHashtag[]> {
  const data = await request<{ hashtags: TrendingHashtag[] }>("/api/trending");
  return data.hashtags;
}

export async function getModels(): Promise<ModelInfo[]> {
  const data = await request<{ models: ModelInfo[] }>("/api/models");
  return data.models;
}

export async function checkHealth(): Promise<{
  status: string;
  services: {
    ollama: { status: string; models?: string[] };
    aiService: { status: string };
  };
}> {
  return request("/api/health");
}
