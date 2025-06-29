import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle Node.js modules on the client side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        buffer: false,
        util: false,
      };
      
      // Ignore Node.js modules on client side
      const { IgnorePlugin } = require('webpack');
      config.plugins.push(
        new IgnorePlugin({
          resourceRegExp: /^(node:fs|node:https|node:http|node:path|node:os|node:crypto|node:stream|node:util|node:buffer|node:url|node:zlib|node:net|node:tls|node:assert)$/,
        })
      );
    }
    return config;
  },
};

export default nextConfig;
