import fs from "fs";
import path from "path";
import os from "os";
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

// Global in-memory cache to ensure state is immediately shared across requests in the Node process
declare global {
  var __cakeMagicMemoryStore: Record<string, unknown> | undefined;
}
if (!globalThis.__cakeMagicMemoryStore) {
  globalThis.__cakeMagicMemoryStore = {};
}
const memoryStore = globalThis.__cakeMagicMemoryStore;

// Resolve safe writable directory (handles Vercel read-only filesystem by falling back to os.tmpdir())
let cachedWritableDir: string | null = null;
function getWritableDir(): string {
  if (cachedWritableDir) return cachedWritableDir;
  const localDir = path.join(process.cwd(), "data");
  try {
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    const testFile = path.join(localDir, `.write_test_${Date.now()}`);
    fs.writeFileSync(testFile, "ok");
    fs.unlinkSync(testFile);
    cachedWritableDir = localDir;
    return localDir;
  } catch {
    const tmpDir = path.join(os.tmpdir(), "cake-magic-data");
    try {
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
    } catch (e) {
      console.warn("Could not create tmpDir:", e);
    }
    cachedWritableDir = tmpDir;
    return tmpDir;
  }
}

function getFilePath(filename: string): { writablePath: string; sourcePath: string } {
  const isLocal = getWritableDir() === path.join(process.cwd(), "data");
  const targetDir = isLocal ? path.join(process.cwd(), "data") : path.join(os.tmpdir(), "cake-magic-data");

  switch (filename) {
    case "products.json":
      return {
        sourcePath: path.join(process.cwd(), "data", "products.json"),
        writablePath: path.join(targetDir, "products.json"),
      };
    case "orders.json":
      return {
        sourcePath: path.join(process.cwd(), "data", "orders.json"),
        writablePath: path.join(targetDir, "orders.json"),
      };
    case "settings.json":
      return {
        sourcePath: path.join(process.cwd(), "data", "settings.json"),
        writablePath: path.join(targetDir, "settings.json"),
      };
    case "staff.json":
      return {
        sourcePath: path.join(process.cwd(), "data", "staff.json"),
        writablePath: path.join(targetDir, "staff.json"),
      };
    case "custom_requests.json":
      return {
        sourcePath: path.join(process.cwd(), "data", "custom_requests.json"),
        writablePath: path.join(targetDir, "custom_requests.json"),
      };
    case "enquiries.json":
      return {
        sourcePath: path.join(process.cwd(), "data", "enquiries.json"),
        writablePath: path.join(targetDir, "enquiries.json"),
      };
    case "gallery.json":
      return {
        sourcePath: path.join(process.cwd(), "data", "gallery.json"),
        writablePath: path.join(targetDir, "gallery.json"),
      };
    case "reviews.json":
      return {
        sourcePath: path.join(process.cwd(), "data", "reviews.json"),
        writablePath: path.join(targetDir, "reviews.json"),
      };
    default:
      return {
        sourcePath: path.join(process.cwd(), "data", filename),
        writablePath: path.join(targetDir, filename),
      };
  }
}

function readJsonFile<T>(filename: string, fallback: T): T {
  // 1. Check memory cache first
  if (memoryStore[filename] !== undefined) {
    return memoryStore[filename] as T;
  }

  const { writablePath, sourcePath } = getFilePath(filename);

  // 2. Try reading from writable path (contains latest updates)
  try {
    if (fs.existsSync(writablePath)) {
      const data = fs.readFileSync(writablePath, "utf-8");
      const parsed = JSON.parse(data) as T;
      memoryStore[filename] = parsed;
      return parsed;
    }
  } catch (err) {
    console.warn(`Could not read ${writablePath}:`, err);
  }

  // 3. Try reading from source repository path
  try {
    if (fs.existsSync(sourcePath)) {
      const data = fs.readFileSync(sourcePath, "utf-8");
      const parsed = JSON.parse(data) as T;
      memoryStore[filename] = parsed;
      // Copy to writable path
      try {
        fs.writeFileSync(writablePath, JSON.stringify(parsed, null, 2), "utf-8");
      } catch {}
      return parsed;
    }
  } catch (err) {
    console.warn(`Could not read ${sourcePath}:`, err);
  }

  // 4. Return fallback
  memoryStore[filename] = fallback;
  try {
    fs.writeFileSync(writablePath, JSON.stringify(fallback, null, 2), "utf-8");
  } catch {}
  return fallback;
}

function writeJsonFile<T>(filename: string, data: T): void {
  // Always update memory store immediately
  memoryStore[filename] = data;

  const { writablePath, sourcePath } = getFilePath(filename);

  // Write to writable path
  try {
    fs.writeFileSync(writablePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error(`Error writing to ${writablePath}:`, err);
  }

  // Also try writing to local source path if possible
  if (writablePath !== sourcePath) {
    try {
      fs.writeFileSync(sourcePath, JSON.stringify(data, null, 2), "utf-8");
    } catch {}
  }
}

const defaultStaff: StaffMember[] = [
  {
    id: "staff-1",
    name: "Master Baker Ramesh",
    phone: "+91 98480 11111",
    role: "BAKER",
    dutyStatus: "ON_DUTY",
    activeOrderCount: 0,
    active: true,
  },
  {
    id: "staff-2",
    name: "Suresh (Cake Stylist)",
    phone: "+91 98480 22222",
    role: "DECORATOR",
    dutyStatus: "ON_DUTY",
    activeOrderCount: 0,
    active: true,
  },
  {
    id: "staff-3",
    name: "Lakshmi (Quality & Dispatch)",
    phone: "+91 98480 33333",
    role: "DISPATCHER",
    dutyStatus: "OFF_DUTY",
    activeOrderCount: 0,
    active: true,
  },
];

const defaultSettings: BusinessSettingsData = {
  businessName: "Cake Magic",
  tagline: "Fresh cakes, custom cakes & desserts in Rajahmundry (Est. 2015)",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+91 73580 84648",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917358084648",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@cakemagic.in",
  address:
    process.env.NEXT_PUBLIC_STORE_ADDRESS ||
    "Jawaharlal Nehru Road, beside Abhaya Clinic, Srinivas Nagar, Prakasam Nagar, Rajamahendravaram, AP 533103",
  googleMapsUrl: "https://maps.google.com/?q=Cake+Magic+Jawaharlal+Nehru+Road+Rajahmundry",
  openingHours: "Monday to Sunday: 09:00 AM - 10:00 PM",
  deliveryAreas:
    "Prakasam Nagar, Danavaipeta, Srinivas Nagar, Kambala Cheruvu, Morampudi, Innespeta, Diwancheruvu, Katheru, Rajamahendravaram",
  deliveryCharge: 50,
  freeDeliveryThreshold: 1500,
  minPreparationHours: 24,
  acceptingOrders: true,
  customOrdersEnabled: true,
  logoUrl: "/icon.jpg",
  currency: "₹",
};

const defaultOrders: OrderRecord[] = [
  {
    id: "CM-20260929-001",
    orderNumber: "CM-20260929-001",
    customerName: "Priya Sharma",
    customerPhone: "9848099999",
    status: "PREPARING",
    deliveryType: "DELIVERY",
    deliveryAddress: "Near Kambala Cheruvu, Danavaipeta, Rajahmundry",
    deliveryDate: new Date(Date.now() + 86400000).toISOString(),
    deliveryTimeSlot: "Evening (5 PM – 7 PM)",
    specialInstructions: "Please write 'Happy Birthday Ayaan' in golden piping.",
    subtotal: 850,
    deliveryFee: 50,
    discount: 0,
    totalAmount: 900,
    assignedStaffId: "staff-1",
    assignedStaffName: "Master Baker Ramesh",
    items: [
      {
        id: "item-default-1",
        productName: "Belgian Chocolate Truffle Cake",
        flavour: "Belgian Chocolate",
        size: "1 kg",
        eggless: true,
        cakeMessage: "Happy Birthday Ayaan",
        unitPrice: 850,
        quantity: 1,
        totalPrice: 850,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const store = {
  // --- Business Settings ---
  getSettings(): BusinessSettingsData {
    return readJsonFile<BusinessSettingsData>("settings.json", defaultSettings);
  },
  updateSettings(data: Partial<BusinessSettingsData>): BusinessSettingsData {
    const current = this.getSettings();
    const updated = { ...current, ...data };
    writeJsonFile("settings.json", updated);
    return updated;
  },

  // --- Staff System & Duty Status ---
  getStaff(): StaffMember[] {
    const staffList = readJsonFile<StaffMember[]>("staff.json", defaultStaff);
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
    writeJsonFile("staff.json", staffList);
    return member;
  },
  setStaffDuty(staffId: string, dutyStatus: "ON_DUTY" | "OFF_DUTY"): StaffMember | null {
    const staffList = this.getStaff();
    const member = staffList.find((s) => s.id === staffId);
    if (!member) return null;
    member.dutyStatus = dutyStatus;
    writeJsonFile("staff.json", staffList);
    return member;
  },

  // --- Products ---
  getProducts(): Product[] {
    return readJsonFile<Product[]>("products.json", initialProducts);
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
    writeJsonFile("products.json", products);
    return product;
  },
  deleteProduct(id: string): boolean {
    const products = this.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    writeJsonFile("products.json", filtered);
    return true;
  },

  // --- Orders ---
  getOrders(): OrderRecord[] {
    const orders = readJsonFile<OrderRecord[]>("orders.json", defaultOrders);
    if (!orders || orders.length === 0) {
      return defaultOrders;
    }
    return orders;
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
    writeJsonFile("orders.json", orders);

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
    writeJsonFile("orders.json", orders);

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
    writeJsonFile("orders.json", orders);

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
    return readJsonFile<CustomCakeRequest[]>("custom_requests.json", []);
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
    writeJsonFile("custom_requests.json", requests);

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
    writeJsonFile("custom_requests.json", requests);

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
    return readJsonFile<Enquiry[]>("enquiries.json", []);
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
    writeJsonFile("enquiries.json", enquiries);
    return newEnquiry;
  },
  updateEnquiryStatus(id: string, status: Enquiry["status"]): Enquiry | null {
    const enquiries = this.getEnquiries();
    const idx = enquiries.findIndex((e) => e.id === id);
    if (idx < 0) return null;
    enquiries[idx] = { ...enquiries[idx], status };
    writeJsonFile("enquiries.json", enquiries);
    return enquiries[idx];
  },

  // --- Gallery ---
  getGallery(): GalleryItem[] {
    return readJsonFile<GalleryItem[]>("gallery.json", initialGallery);
  },
  addGalleryItem(item: Omit<GalleryItem, "id" | "createdAt">): GalleryItem {
    const gallery = this.getGallery();
    const newItem: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    gallery.unshift(newItem);
    writeJsonFile("gallery.json", gallery);
    return newItem;
  },
  deleteGalleryItem(id: string): boolean {
    const gallery = this.getGallery();
    const filtered = gallery.filter((g) => g.id !== id);
    writeJsonFile("gallery.json", filtered);
    return true;
  },

  // --- Reviews ---
  getReviews(): CustomerReview[] {
    return readJsonFile<CustomerReview[]>("reviews.json", initialReviews);
  },
};
