import Pusher from 'pusher';

// console.log("🔄 Initializing Pusher server...");
// console.log("🔑 Checking environment variables:");
// console.log("- PUSHER_APP_ID:", process.env.PUSHER_APP_ID ? "✓ Set" : "✗ Missing");
// console.log("- PUSHER_KEY:", process.env.PUSHER_KEY ? "✓ Set" : "✗ Missing");
// console.log("- PUSHER_SECRET:", process.env.PUSHER_SECRET ? "✓ Set" : "✗ Missing");
// console.log("- PUSHER_CLUSTER:", process.env.PUSHER_CLUSTER || "eu");

export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER! || 'eu',
  useTLS: true,
});

// console.log("✅ Pusher server initialized successfully");