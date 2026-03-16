import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  SERVER_URL: "captionai_server_url",
  THEME: "captionai_theme",
  LANGUAGE: "captionai_language",
  MODEL: "captionai_model",
} as const;

const DEFAULT_SERVER_URL = "http://localhost:3000";

export async function getServerUrl(): Promise<string> {
  try {
    const url = await AsyncStorage.getItem(KEYS.SERVER_URL);
    return url || DEFAULT_SERVER_URL;
  } catch {
    return DEFAULT_SERVER_URL;
  }
}

export async function setServerUrl(url: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.SERVER_URL, url);
}

export async function getTheme(): Promise<"dark" | "light"> {
  try {
    const theme = await AsyncStorage.getItem(KEYS.THEME);
    return (theme as "dark" | "light") || "dark";
  } catch {
    return "dark";
  }
}

export async function setTheme(theme: "dark" | "light"): Promise<void> {
  await AsyncStorage.setItem(KEYS.THEME, theme);
}

export async function getLanguage(): Promise<string> {
  try {
    const lang = await AsyncStorage.getItem(KEYS.LANGUAGE);
    return lang || "en";
  } catch {
    return "en";
  }
}

export async function setLanguage(language: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.LANGUAGE, language);
}

export async function getModel(): Promise<string> {
  try {
    const model = await AsyncStorage.getItem(KEYS.MODEL);
    return model || "";
  } catch {
    return "";
  }
}

export async function setModel(model: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.MODEL, model);
}

export async function clearAll(): Promise<void> {
  const keys = Object.values(KEYS);
  await AsyncStorage.multiRemove(keys);
}
