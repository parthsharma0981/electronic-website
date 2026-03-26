export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'buyer' | 'admin' | 'seller';
  isEmailVerified: boolean;
  avatar?: string;
  token?: string;
}

export interface Image {
  url: string;
  alt?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: Image[];
  stock: number;
  rating: number;
  numReviews: number;
  badge?: string;
  specs?: Record<string, string>;
  createdAt: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Cart {
  items: { product: Product; quantity: number }[];
  totalPrice: number;
  totalItems: number;
}

export interface TrackingStep {
  label: string;
  date: string;
  done: boolean;
}

export interface Order {
  _id: string;
  createdAt: string;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  status: 'processing' | 'shipped' | 'out-for-delivery' | 'delivered';
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    zip: string;
    phone: string;
  };
  paymentMethod: string;
  trackingSteps: TrackingStep[];
  orderItems: {
    _id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
}

export interface Category {
  id: string;
  name: string;
  label: string;
  icon: string;
}
