import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin({
  requestConfig: './i18n/request.ts',
});

/** @type {import('next').NextConfig} */
const nextConfig:NextConfig = { images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allows ALL HTTPS domains
      },
      {
        protocol: 'http',
        hostname: '**', // Allows ALL HTTP domains
      },
    ],
  },allowedDevOrigins:["0.0.0.0"]};

export default withNextIntl(nextConfig);
