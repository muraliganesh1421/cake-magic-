export type ProductCategory = "cakes" | "desserts" | "bakery" | "celebrations";

export type CustomRequestStatus =
  | "New"
  | "Reviewing"
  | "Confirmed"
  | "Payment Pending"
  | "Completed"
  | "Cancelled";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: ProductCategory;
  subcategory: string;
  images: string[];
  flavours: string[];
  sizes: string[];
  startingPrice: number | null; // null represents "Price on enquiry"
  eggless: boolean;
  customizable: boolean;
  availableToday: boolean;
  advanceOrderRequired: boolean;
  featured: boolean;
  active: boolean;
  occasions?: string[];
  tasteProfile?: string; // for Cake Finder matcher
}

export interface CustomCakeRequest {
  id: string;
  customerName: string;
  phone: string;
  whatsapp?: string;
  occasion: string;
  flavour: string;
  size: string;
  eggless: boolean;
  message?: string;
  referenceImage?: string; // base64 or storage url
  deliveryDate: string;
  deliveryTime?: string;
  deliveryType: "Pickup" | "Delivery";
  address?: string;
  notes?: string;
  status: CustomRequestStatus;
  createdAt: string;
}

export interface Enquiry {
  id: string;
  customer: string;
  phone: string;
  product: string;
  productId?: string;
  size?: string;
  quantity: number;
  date?: string;
  time?: string;
  deliveryType: "Pickup" | "Delivery";
  address?: string;
  message?: string;
  status: "New" | "Contacted" | "Confirmed" | "Cancelled";
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  image: string;
  title: string;
  category:
    | "Birthday"
    | "Kids"
    | "Wedding"
    | "Anniversary"
    | "Designer"
    | "Bento"
    | "Photo Cakes"
    | "Celebrations";
  flavour?: string;
  occasion?: string;
  featured?: boolean;
  createdAt: string;
}

export interface CustomerReview {
  id: string;
  source: "Google" | "Zomato" | "Verified Customer";
  name: string;
  text: string;
  rating: number;
  date?: string;
  verified: boolean;
  active: boolean;
}
