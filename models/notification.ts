import { TNotification } from "lib/types";

export default function NotificationFactory(args: {
  [k: string]: any;
}): TNotification {
  return {
    id: args._id || "",
    type: args.type || "",
    sender: args.sender || "",
    receiver: args.receiver || [],
    readAt: args.readAt || undefined,
    payload: args.payload || undefined,
    createdAt: args.createdAt || "",
    updatedAt: args.updatedAt || "",
  };
}
