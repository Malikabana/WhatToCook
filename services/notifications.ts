import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForNotifications(): Promise<boolean> {
  if (!Device.isDevice) return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  let final = existing;
  if (existing !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    final = status;
  }
  if (final !== "granted") return false;
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }
  return true;
}

export async function scheduleGroceryReminder(hour: number, minute: number): Promise<string | null> {
  await cancelGroceryReminder();
  try {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: "🛒 Don't forget to shop!",
        body: "You have items on your grocery list waiting.",
        sound: true,
      },
      trigger: { hour, minute, repeats: true },
    });
  } catch {
    return null;
  }
}

export async function cancelGroceryReminder(): Promise<void> {
  const all = await Notifications.getAllScheduledNotificationsAsync();
  for (const n of all) {
    if (n.content.title?.includes("Don't forget to shop")) {
      await Notifications.cancelScheduledNotificationAsync(n.identifier);
    }
  }
}

export async function sendTestNotification(): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🛒 Don't forget to shop!",
      body: "You have items on your grocery list waiting.",
    },
    trigger: null,
  });
}