import Pusher from 'pusher-js';

// Create client instance (simplified version from your working example)
export const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'mt1',
  authEndpoint: '/api/pusher/auth', // This works!
  forceTLS: true,
});

// Disconnect function
export const disconnectPusher = () => {
  pusherClient.disconnect();
};