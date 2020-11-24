import isValidDate from "lib/isValidDate";
import { TUser } from "lib/types";

export default function UserFactory(args: { [k: string]: any }): TUser {
  return {
    id: args._id || "",
    username: args.username || "",
    email: args.email || "",
    firstName: args.firstName || "Removed",
    lastName: args.lastName || "User",
    profileImage: args.profileImage || "",
    organizations: args.organizations || [],
    comments: args.comments || [],
    hasOnboarded: args.hasOnboarded || false,
    emailVerified: args.emailVerified || false,
    createdAt: isValidDate(new Date(args.createdAt))
      ? new Date(args.createdAt)
      : undefined,
    updatedAt: isValidDate(new Date(args.updatedAt))
      ? new Date(args.updatedat)
      : undefined,
  };
}
