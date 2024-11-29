import { Location } from "@/types/location";

const API_BASE_URL = '/api';

interface LocationsResponse {
  locations: Location[];
}

export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

export const fetchLocations = async (): Promise<Location[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/locations`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new APIError(
        response.status,
        `Failed to fetch locations: ${response.statusText}`
      );
    }

    const data = await response.json() as LocationsResponse;
    
    // locations プロパティが存在し、配列であることを確認
    if (!data.locations || !Array.isArray(data.locations)) {
      throw new APIError(400, 'Invalid response format: Expected locations array');
    }

    return data.locations;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(
      500, 
      `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export const fetchLocationById = async (id: number): Promise<Location> => {
  try {
    const response = await fetch(`${API_BASE_URL}/locations/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new APIError(
        response.status,
        `Failed to fetch location: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data as Location;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(
      500, 
      `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}