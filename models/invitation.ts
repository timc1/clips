import { TInvitation } from "lib/types";

export default function InvitationFactory(args: {
  [k: string]: any;
}): TInvitation {
  return {
    id: args._id || "",
    email: args.email || "",
    status: args.status || "",
    creatorId: args.creatorId || "",
    createdAt: args.createdAt || "",
    updatedAt: args.updatedAt || "",
  };
}
