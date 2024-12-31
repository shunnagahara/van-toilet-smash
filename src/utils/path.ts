import { PATHS } from '@/constants/common';

export const getAssetPath = (path: string): string => {
  return `${PATHS.BASE_PATH}${path}`;
};