export interface TableData {
  id: string;
  description: string;
  price: string;
  availability: string;
  image: string;
}

export interface CartItem extends TableData {
  quantity: number;
}

export interface PaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
}
export type JewelryCategory = 'All Jewellery' | 'Gold' | 'Diamond' | 'Silver' | 'Platinum';

export interface VirtualTryOnState {
  isActive: boolean;
  userImage: string | null;
  selectedProduct: TableData | null;
  position: { x: number; y: number };
  scale: number;
  rotation: number;
}