import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForNotifications(): Promise<boolean> {
  if (!Device.isDevice) return false;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") return false;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      sound: "default",
    });
  }

  return true;
}

export async function scheduleGroceryReminder(
  hour: number,
  minute: number
): Promise<string | null> {
  await cancelGroceryReminder();

  try {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: "🛒 Don't forget to shop!",
        body: "You have items on your grocery list waiting.",
        sound: "default",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
  } catch (e) {
    console.log("Error scheduling notification:", e);
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
      sound: "default",
    },
    trigger: null,
  });
}