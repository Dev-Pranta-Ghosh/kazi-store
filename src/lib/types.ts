export interface Category {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string; // category slug
  subcategory: string;
  price: number; // current price in BDT
  originalPrice: number; // in BDT (same as price when no discount)
  rating: number; // 0-5
  reviewCount: number;
  images: string[];
  description: string;
  benefits: string[];
  ingredients: string;
  howToUse: string;
  stock: number;
  tags: string[];
  concerns: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  createdAt: string; // ISO date
}

export interface CartItem {
  productId: string;
  qty: number;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  area: string;
  address: string;
  city: string;
  isDefault?: boolean;
}

export interface User {
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  addresses: Address[];
}

export type PaymentMethod = "cod" | "bkash" | "nagad" | "card";
export type DeliveryMethod = "chattogram" | "dhaka" | "nationwide";

export type OrderStatus =
  | "Processing"
  | "Confirmed"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface OrderLine {
  productId: string;
  slug: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderLine[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  deliveryCharge: number;
  total: number;
  customer: { name: string; email: string; phone: string };
  shipping: { address: string; area: string; city: string; note?: string };
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
}

export interface Coupon {
  code: string;
  type: "percent";
  value: number; // percent off
  minSpend: number;
  label: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  quote: string;
  rating: number;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqCategory {
  slug: string;
  title: string;
  items: FaqItem[];
}
