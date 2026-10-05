import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // `next dev` only: let phones and other machines on the LAN (or Tailscale)
  // load dev resources such as the lazily loaded 3D scene chunk.
  allowedDevOrigins: ['192.168.1.148', '100.80.139.29'],
};

export default withMDX(config);
