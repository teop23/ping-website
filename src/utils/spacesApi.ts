// Twitter Spaces API utility
const SPACES_API_ENDPOINT = 'https://api.example.com/spaces/status'; // Update this with your actual endpoint

export interface SpacesStatus {
  live: boolean;
  link: string;
  name: string;
}

export const fetchSpacesStatus = async (): Promise<SpacesStatus | null> => {
  try {
    const response = await fetch(SPACES_API_ENDPOINT);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: SpacesStatus = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching spaces status:', error);
    return null;
  }
};