import Pusher from "pusher";

const {
  PUSHER_APP_ID,
  PUSHER_KEY,
  PUSHER_SECRET,
  PUSHER_CLUSTER,
} = process.env;

const pusherClient = new Pusher({
  appId: PUSHER_APP_ID,
  key: PUSHER_KEY,
  secret: PUSHER_SECRET,
  cluster: PUSHER_CLUSTER, // if `host` is present, it will override the `cluster` option.
  // useTLS: false, // optional, defaults to false
  // host: "api.pusherapp.com", // optional, defaults to api.pusherapp.com
  // port: "80", // optional, defaults to 80 for non-TLS connections and 443 for TLS connections
  // encryptionMasterKeyBase64: ENCRYPTION_MASTER_KEY, // a base64 string which encodes 32 bytes, used to derive the per-channel encryption keys (see below!)
});

export default pusherClient;
