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

// -------------------------------------------------------------
// Production Order Management & Architecture Types (Phase 1+)
// -------------------------------------------------------------

export type OrderStatusType =
  | "PENDING_PAYMENT"
  | "PAID"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUND_PENDING"
  | "REFUNDED";

export type DeliveryMethod = "DELIVERY" | "PICKUP";

export type StaffRole = "BAKER" | "DECORATOR" | "PACKER" | "DISPATCHER";
export type DutyStatusType = "ON_DUTY" | "OFF_DUTY";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  image: string;
  flavour?: string;
  size?: string;
  eggless: boolean;
  cakeMessage?: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface OrderItemRecord {
  id: string;
  productId?: string | null;
  productName: string;
  flavour?: string | null;
  size?: string | null;
  eggless: boolean;
  cakeMessage?: string | null;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  status: OrderStatusType;
  deliveryType: DeliveryMethod;
  deliveryAddress?: string | null;
  landmark?: string | null;
  deliveryDate: string;
  deliveryTimeSlot?: string | null;
  specialInstructions?: string | null;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  assignedStaffId?: string | null;
  assignedStaffName?: string | null;
  items: OrderItemRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface BusinessSettingsData {
  businessName: string;
  tagline: string;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  address?: string | null;
  googleMapsUrl?: string | null;
  openingHours?: string | null;
  deliveryAreas?: string | null;
  deliveryCharge: number;
  freeDeliveryThreshold?: number | null;
  minPreparationHours: number;
  acceptingOrders: boolean;
  customOrdersEnabled: boolean;
  logoUrl?: string | null;
  currency: string;
}

