import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig: NextConfig = {images: {
    domains: ["images.unsplash.com",'img.freepik.com'], // whitelist external host
  },};
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);