import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { AppProvider, useApp } from "../context/AppContext";

function RouteGuard() {
  const { user, authReady } = useApp();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!authReady) return;
    const inAuth = segments[0] === "auth";
    if (!user && !inAuth) router.replace("/auth/login" as any);
    else if (user && inAuth) router.replace("/");
  }, [user, authReady, segments]);

  return null;
}

function Layout() {
  return (
    <>
      <RouteGuard />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  );
}