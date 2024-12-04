import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  const basePath = process.env.NODE_ENV === 'production' ? '/van-toilet-smash' : '';
  
  return {
    name: "Toilet Smash",
    short_name: "ToiletSmash",
    description: "Battle with toilets in Vancouver",
    start_url: `${basePath}/`,
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#3B82F6",
    icons: [
      {
        src: `${basePath}/icons/icon-192x192.png`,
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: `${basePath}/icons/icon-512x512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      }
    ]
  } as MetadataRoute.Manifest;
}