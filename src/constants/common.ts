export const PATHS = {
  BASE_PATH: process.env.NODE_ENV === 'production' ? '/van-toilet-smash' : '',
} as const;

export const BATTLE = {
  POWER_FACTORS: {
    ATTACK: 2.0,
    DEFENSE: 1.5,
    CLEANLINESS: 1.2,
    LOCATION: 1.0,
    CROWDING: 0.8,
    TOILET_COUNT: 0.7,
    UNIQUENESS: 1.3
  },

  MECHANICS: {
    RANDOM_FACTOR: 0.2,
  },

  RESULTS: {
    WIN: 'win' as const,
    LOSE: 'lose' as const
  }
} as const;


export const MAP = {
  INITIAL_VIEW_STATE: {
    longitude: -123.1207,
    latitude: 49.2827,
    zoom: 13
  },

  MAP_STYLE: {
    ja: 'mapbox://styles/mapbox/streets-v11?language=ja',
    en: 'mapbox://styles/mapbox/streets-v11?language=en'
  },

  TOILET_IMAGE: {
    rare: '/rare-toilet.png',
    normal: '/toilet.png'
  }
} as const;
