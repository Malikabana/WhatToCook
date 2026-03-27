import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { AppProvider, useApp } from "../context/AppContext";
import { ThemeProvider } from "../context/ThemeContext";

function RouteGuard() {
  const { user, authReady } = useApp(); // auth state
  const segments = useSegments(); // current route
  const router = useRouter(); // navigation

  useEffect(() => {
    if (!authReady) return; // wait until auth is loaded

    const inAuth = segments[0] === "auth"; // check if user is on login/register

    if (!user && !inAuth) {
      // if not logged in, send to login
      router.replace("/auth/login" as any);
    } else if (user && inAuth) {
      // if already logged in, send to main app
      router.replace("/(tabs)" as any);
    }
  }, [user, authReady, segments]);

  return null; // this component only handles redirects
}

function Layout() {
  return (
    <>
      {/* protects routes depending on auth */}
      <RouteGuard />

      {/* app screens stack */}
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppProvider>
        <Layout />
      </AppProvider>
    </ThemeProvider>
  );
}