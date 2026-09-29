import fs from "fs";
import path from "path";
import {
  Product,
  CustomCakeRequest,
  Enquiry,
  GalleryItem,
  CustomerReview,
  OrderRecord,
  OrderStatusType,
  BusinessSettingsData,
  StaffMember,
} from "@/types";
export type { StaffMember };
import { initialProducts, initialGallery, initialReviews } from "@/data/initialData";
import { dispatchAutomationEvent } from "./events";

const DATA_DIR = path.join(process.cwd(), "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const CUSTOM_REQUESTS_FILE = path.join(DATA_DIR, "custom_requests.json");
const ENQUIRIES_FILE = path.join(DATA_DIR, "enquiries.json");
const GALLERY_FILE = path.join(DATA_DIR, "gallery.json");
const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");
const STAFF_FILE = path.join(DATA_DIR, "staff.json");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    ensureDir();
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), "utf-8");
      return fallback;
    }
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return fallback;
  }
}

function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    ensureDir();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
}


const defaultStaff: StaffMember[] = [
  {
    id: "staff-1",
    name: "Master Baker Ramesh",
    phone: "9848011111",
    role: "BAKER",
    dutyStatus: "ON_DUTY",
    activeOrderCount: 0,
    active: true,
  },
  {
    id: "staff-2",
    name: "Suresh (Cake Stylist)",
    phone: "9848022222",
    role: "DECORATOR",
    dutyStatus: "ON_DUTY",
    activeOrderCount: 0,
    active: true,
  },
  {
    id: "staff-3",
    name: "Lakshmi (Quality & Dispatch)",
    phone: "9848033333",
    role: "DISPATCHER",
    dutyStatus: "OFF_DUTY",
    activeOrderCount: 0,
    active: true,
  },
];

const defaultSettings: BusinessSettingsData = {
  businessName: "Cake Magic",
  tagline: "Bespoke cakes & bakery creations in Rajahmundry",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "919848000000",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919848000000",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@cakemagic.in",
  address: process.env.NEXT_PUBLIC_STORE_ADDRESS || "Danavaipeta, Rajahmundry, Andhra Pradesh 533103",
  googleMapsUrl: "https://maps.google.com/?q=Cake+Magic+Rajahmundry",
  openingHours: "Monday to Sunday: 09:00 AM - 10:00 PM",
  deliveryAreas: "Rajahmundry, Danavaipeta, Kambala Cheruvu, Morampudi, Innespeta, Diwancheruvu, Katheru",
  deliveryCharge: 50,
  freeDeliveryThreshold: 1500,
  minPreparationHours: 24,
  acceptingOrders: true,
  customOrdersEnabled: true,
  logoUrl: "/icon.jpg",
  currency: "₹",
};

export const store = {
  // --- Business Settings ---
  getSettings(): BusinessSettingsData {
    return readJsonFile<BusinessSettingsData>(SETTINGS_FILE, defaultSettings);
  },
  updateSettings(data: Partial<BusinessSettingsData>): BusinessSettingsData {
    const current = this.getSettings();
    const updated = { ...current, ...data };
    writeJsonFile(SETTINGS_FILE, updated);
    return updated;
  },

  // --- Staff System & Duty Status ---
  getStaff(): StaffMember[] {
    const staffList = readJsonFile<StaffMember[]>(STAFF_FILE, defaultStaff);
    const activeOrders = this.getOrders().filter(
      (o) => !["DELIVERED", "CANCELLED", "REFUNDED"].includes(o.status)
    );
    return staffList.map((s) => ({
      ...s,
      activeOrderCount: activeOrders.filter((o) => o.assignedStaffId === s.id).length,
    }));
  },
  saveStaffMember(member: StaffMember): StaffMember {
    const staffList = this.getStaff();
    const index = staffList.findIndex((s) => s.id === member.id);
    if (index >= 0) {
      staffList[index] = member;
    } else {
      staffList.push(member);
    }
    writeJsonFile(STAFF_FILE, staffList);
    return member;
  },
  setStaffDuty(staffId: string, dutyStatus: "ON_DUTY" | "OFF_DUTY"): StaffMember | null {
    const staffList = this.getStaff();
    const member = staffList.find((s) => s.id === staffId);
    if (!member) return null;
    member.dutyStatus = dutyStatus;
    writeJsonFile(STAFF_FILE, staffList);
    return member;
  },

  // --- Products ---
  getProducts(): Product[] {
    return readJsonFile<Product[]>(PRODUCTS_FILE, initialProducts);
  },
  getProductBySlug(slug: string): Product | undefined {
    const products = this.getProducts();
    return products.find((p) => p.slug === slug && p.active);
  },
  saveProduct(product: Product): Product {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.unshift(product);
    }
    writeJsonFile(PRODUCTS_FILE, products);
    return product;
  },
  deleteProduct(id: string): boolean {
    const products = this.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    writeJsonFile(PRODUCTS_FILE, filtered);
    return true;
  },

  // --- Orders ---
  getOrders(): OrderRecord[] {
    return readJsonFile<OrderRecord[]>(ORDERS_FILE, []);
  },
  getOrderById(id: string): OrderRecord | undefined {
    return this.getOrders().find((o) => o.id === id || o.orderNumber === id);
  },
  createOrder(data: Omit<OrderRecord, "id" | "orderNumber" | "createdAt" | "updatedAt">): OrderRecord {
    const orders = this.getOrders();
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const todayOrdersCount = orders.filter((o) => o.orderNumber?.includes(`CM-${dateStr}`)).length;
    const sequence = String(todayOrdersCount + 1).padStart(3, "0");
    const orderNumber = `CM-${dateStr}-${sequence}`;

    // Deterministic Assignment to ON_DUTY staff with lowest workload
    const staffMembers = this.getStaff();
    const onDutyStaff = staffMembers.filter((s) => s.active && s.dutyStatus === "ON_DUTY");
    let assignedStaff: StaffMember | undefined;
    if (onDutyStaff.length > 0) {
      onDutyStaff.sort((a, b) => a.activeOrderCount - b.activeOrderCount);
      assignedStaff = onDutyStaff[0];
    }

    const newOrder: OrderRecord = {
      ...data,
      id: orderNumber,
      orderNumber,
      assignedStaffId: assignedStaff?.id || null,
      assignedStaffName: assignedStaff?.name || "Unassigned Queue",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.unshift(newOrder);
    writeJsonFile(ORDERS_FILE, orders);

    // Automation Event Dispatch
    dispatchAutomationEvent("ORDER_CREATED", {
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      customerName: newOrder.customerName,
      customerPhone: newOrder.customerPhone,
      totalAmount: newOrder.totalAmount,
      status: newOrder.status,
      staffName: newOrder.assignedStaffName || undefined,
      deliveryDate: newOrder.deliveryDate,
      itemsSummary: newOrder.items.map((i) => `${i.quantity}x ${i.productName}`).join(", "),
    });

    return newOrder;
  },
  updateOrderStatus(orderId: string, status: OrderStatusType): OrderRecord | null {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!order) return null;

    order.status = status;
    order.updatedAt = new Date().toISOString();
    writeJsonFile(ORDERS_FILE, orders);

    dispatchAutomationEvent("STATUS_CHANGED", {
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      totalAmount: order.totalAmount,
      status: order.status,
      staffName: order.assignedStaffName || undefined,
    });

    return order;
  },
  reassignOrder(orderId: string, staffId: string): OrderRecord | null {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!order) return null;

    const staffList = this.getStaff();
    const staff = staffList.find((s) => s.id === staffId);
    order.assignedStaffId = staff ? staff.id : null;
    order.assignedStaffName = staff ? staff.name : "Unassigned Queue";
    order.updatedAt = new Date().toISOString();
    writeJsonFile(ORDERS_FILE, orders);

    dispatchAutomationEvent("STAFF_ASSIGNED", {
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      staffName: order.assignedStaffName || undefined,
    });

    return order;
  },

  // --- Custom Requests ---
  getCustomRequests(): CustomCakeRequest[] {
    return readJsonFile<CustomCakeRequest[]>(CUSTOM_REQUESTS_FILE, []);
  },
  createCustomRequest(data: Omit<CustomCakeRequest, "id" | "createdAt" | "status">): CustomCakeRequest {
    const requests = this.getCustomRequests();
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const todayCount = requests.filter((r) => r.id?.includes(`CR-${dateStr}`)).length;
    const sequence = String(todayCount + 1).padStart(3, "0");
    const requestId = `CR-${dateStr}-${sequence}`;

    const newRequest: CustomCakeRequest = {
      ...data,
      id: requestId,
      status: "New",
      createdAt: new Date().toISOString(),
    };
    requests.unshift(newRequest);
    writeJsonFile(CUSTOM_REQUESTS_FILE, requests);

    dispatchAutomationEvent("CUSTOM_REQUEST_CREATED", {
      customRequestId: newRequest.id,
      customerName: newRequest.customerName,
      customerPhone: newRequest.phone,
      deliveryDate: newRequest.deliveryDate,
      itemsSummary: `${newRequest.occasion} Cake (${newRequest.flavour}, ${newRequest.size})`,
    });

    return newRequest;
  },
  updateCustomRequest(id: string, updates: Partial<CustomCakeRequest>): CustomCakeRequest | null {
    const requests = this.getCustomRequests();
    const target = requests.find((r) => r.id === id);
    if (!target) return null;
    Object.assign(target, updates);
    writeJsonFile(CUSTOM_REQUESTS_FILE, requests);

    if (updates.status === "Confirmed" || updates.status === "Payment Pending") {
      dispatchAutomationEvent("CUSTOM_QUOTE_CREATED", {
        customRequestId: target.id,
        customerName: target.customerName,
        customerPhone: target.phone,
        status: target.status,
      });
    }

    return target;
  },

  // --- Enquiries ---
  getEnquiries(): Enquiry[] {
    return readJsonFile<Enquiry[]>(ENQUIRIES_FILE, []);
  },
  createEnquiry(data: Omit<Enquiry, "id" | "createdAt" | "status">): Enquiry {
    const enquiries = this.getEnquiries();
    const newEnquiry: Enquiry = {
      ...data,
      id: `ENQ-${Date.now()}`,
      status: "New",
      createdAt: new Date().toISOString(),
    };
    enquiries.unshift(newEnquiry);
    writeJsonFile(ENQUIRIES_FILE, enquiries);
    return newEnquiry;
  },
  updateEnquiryStatus(id: string, status: Enquiry["status"]): Enquiry | null {
    const enquiries = this.getEnquiries();
    const idx = enquiries.findIndex((e) => e.id === id);
    if (idx < 0) return null;
    enquiries[idx] = { ...enquiries[idx], status };
    writeJsonFile(ENQUIRIES_FILE, enquiries);
    return enquiries[idx];
  },

  // --- Gallery ---
  getGallery(): GalleryItem[] {
    return readJsonFile<GalleryItem[]>(GALLERY_FILE, initialGallery);
  },
  addGalleryItem(item: Omit<GalleryItem, "id" | "createdAt">): GalleryItem {
    const gallery = this.getGallery();
    const newItem: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    gallery.unshift(newItem);
    writeJsonFile(GALLERY_FILE, gallery);
    return newItem;
  },
  deleteGalleryItem(id: string): boolean {
    const gallery = this.getGallery();
    const filtered = gallery.filter((g) => g.id !== id);
    writeJsonFile(GALLERY_FILE, filtered);
    return true;
  },

  // --- Reviews ---
  getReviews(): CustomerReview[] {
    return readJsonFile<CustomerReview[]>(REVIEWS_FILE, initialReviews);
  },
};
