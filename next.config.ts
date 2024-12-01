import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // Static HTML出力を有効化
  basePath: '/van-toilet-smash', // GitHubリポジトリ名を指定
  images: {
    unoptimized: true, // GitHub Pages用に画像最適化を無効化
  },
  assetPrefix: '/van-toilet-smash/', // アセットのプレフィックスを設定
};

export default nextConfig;