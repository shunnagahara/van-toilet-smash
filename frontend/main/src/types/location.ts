export interface LocationImage {
  id: string;
  url: string;
  createdAt: string;
}

export interface Location {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  description?: string;
  rating?: number;
  isOpen?: boolean;
  images?: LocationImage[];
}