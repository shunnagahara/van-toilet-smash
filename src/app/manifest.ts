import { MetadataRoute } from 'next';

// 静的生成の設定を追加
export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Toilet Smash',
    short_name: 'ToiletSmash',
    description: 'Battle with toilets in Vancouver',
    start_url: './sp',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3B82F6',
    icons: [
      {
        src: 'icons/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      }
    ],
  };
}