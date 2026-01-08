import Pusher from 'pusher-js';

// Get the base URL
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
};

export const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'mt1',
  authEndpoint: `${getBaseUrl()}/api/pusher/auth`, // ← Use absolute URL
  forceTLS: true,
});

export const disconnectPusher = () => {
  pusherClient.disconnect();
};