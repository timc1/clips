import getApiUrl from "lib/getApiUrl";
import { client } from "../lib/ApiClient";

export const getNotifications = async () => {
  return await client.get(`${getApiUrl()}/api/notifications`);
};

export const markNotificationAsRead = async (notificationId: string) => {
  return await client.put(`${getApiUrl()}/api/notifications`, {
    markAsRead: notificationId,
  });
};
