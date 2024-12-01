import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 開発時は static export を無効化
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  // 環境に応じてbasePathを設定
  basePath: process.env.NODE_ENV === 'production' ? '/van-toilet-smash' : '',
  images: {
    unoptimized: true,
  },
  // assetPrefixも環境に応じて設定
  assetPrefix: process.env.NODE_ENV === 'production' ? '/van-toilet-smash/' : '',
};

export default nextConfig;