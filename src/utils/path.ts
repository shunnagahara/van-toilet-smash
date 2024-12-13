export const getAssetPath = (path: string): string => {
  return `${process.env.NODE_ENV === 'production' ? '/van-toilet-smash' : ''}${path}`;
}; 