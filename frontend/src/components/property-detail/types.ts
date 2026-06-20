export interface RoomType {
  id: string;
  name: string;
  description?: string;
  capacity: number;
  total_units: number;
  amenities: string[];
  image_urls: string[];
  price_per_night: number;
  adjusted_price: number;
}

export interface PropertyDetail {
  id: string;
  name: string;
  description?: string;
  image_urls?: string[];
  address: string;
  city: string;
  province: string;
  property_category: { name: string } | null;
  tenant: { id: string; name: string; image_url?: string | null };
  room_type: RoomType[];
  review?: { rating: number; comment?: string; users?: { name: string } }[];
}
