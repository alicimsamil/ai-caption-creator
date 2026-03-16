import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#0a0a0f" },
          headerTintColor: "#fff",
          contentStyle: { backgroundColor: "#0a0a0f" },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="generate/result"
          options={{ title: "Results", presentation: "modal" }}
        />
      </Stack>
    </>
  );
}
