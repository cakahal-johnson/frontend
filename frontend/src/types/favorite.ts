export interface FavoriteResponse {
  id: number;
  listing_id: number;
  user_id: number;
  created_at: string;
  listing: {
    id: number;
    title: string;
    category: string;
    agent?: {
      id: number;
      name: string;
    };
    [key: string]: any;
  };
}
