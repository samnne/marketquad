
import { createContext, useContext, useEffect, ReactNode } from "react";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { registerPushToken } from "@/utils/notifications";
import { useMessage, useUser } from "@/store/zustand";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowList: true,
  }),
});

const NotificationContext = createContext({});

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const router = useRouter();
  const {setMessage, setSuccess} = useMessage()

  // Register push token when user logs in

  useEffect(() => {
    if (user?.id) {
     
      registerPushToken(user?.id);
    }
  }, [user]);

  // Handle notification tap → deep link
  useEffect(() => {
    const tapSub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data=
          response.notification.request.content.data;
        if (data && data.screen === "convos" && data.conversationId) {
          router.push(`/convos/${data.conversationId}`);
        }
        if (data && data.screen === "listing" && data.lid){
          router.push(`/listings/${data.lid}`)
        }
      },
    );

    // Optional: handle notification arriving while app is foregrounded
    const foregroundSub = Notifications.addNotificationReceivedListener(
      (notification) => {
        setMessage(notification.request.content.title)
        setSuccess(true)
        console.log("Notification received in foreground:", notification);
        // You could trigger an in-app toast/banner here instead
      },
    );

    return () => {
      tapSub.remove();
      foregroundSub.remove();
    };
  }, []);

  return (
    <NotificationContext.Provider value={{}}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
