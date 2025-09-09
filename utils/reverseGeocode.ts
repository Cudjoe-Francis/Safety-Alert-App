export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<string> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
    const res = await fetch(url);
    
    // Check if response is ok and content-type is JSON
    if (!res.ok) {
      console.warn(`Reverse geocoding failed with status: ${res.status}`);
      return "Unknown address";
    }
    
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.warn('Reverse geocoding response is not JSON:', contentType);
      return "Unknown address";
    }
    
    const data = await res.json();
    return data.display_name || "Unknown address";
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    return "Unknown address";
  }
}
