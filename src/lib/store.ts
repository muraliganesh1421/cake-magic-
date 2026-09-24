import fs from "fs";
import path from "path";
import { Product, CustomCakeRequest, Enquiry, GalleryItem, CustomerReview } from "@/types";
import { initialProducts, initialGallery, initialReviews } from "@/data/initialData";

const DATA_DIR = path.join(process.cwd(), "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const CUSTOM_REQUESTS_FILE = path.join(DATA_DIR, "custom_requests.json");
const ENQUIRIES_FILE = path.join(DATA_DIR, "enquiries.json");
const GALLERY_FILE = path.join(DATA_DIR, "gallery.json");
const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json");

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

// Initialise default custom requests for realistic admin dashboard visibility
const initialCustomRequests: CustomCakeRequest[] = [
  {
    id: "REQ-2026-001",
    customerName: "Sita R.",
    phone: "98480XXXXX",
    whatsapp: "98480XXXXX",
    occasion: "1st Birthday",
    flavour: "Belgian Chocolate Truffle",
    size: "2 kg",
    eggless: true,
    message: "Happy 1st Birthday Ayaan",
    referenceImage: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=600&auto=format&fit=crop",
    deliveryDate: "2026-09-26",
    deliveryTime: "05:00 PM",
    deliveryType: "Delivery",
    address: "Near Kambala Cheruvu, Rajahmundry",
    notes: "Please keep pastel blue accents and minimal sugar pearls.",
    status: "Reviewing",
    createdAt: new Date().toISOString(),
  },
  {
    id: "REQ-2026-002",
    customerName: "Venkatesh K.",
    phone: "94401XXXXX",
    whatsapp: "94401XXXXX",
    occasion: "25th Anniversary",
    flavour: "Red Velvet Cream Cheese",
    size: "1.5 kg",
    eggless: true,
    message: "Happy 25th Silver Jubilee Mom & Dad",
    deliveryDate: "2026-09-25",
    deliveryTime: "07:30 PM",
    deliveryType: "Pickup",
    notes: "Gold leaf foil touch required on top tier.",
    status: "Confirmed",
    createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
  }
];

const initialEnquiries: Enquiry[] = [
  {
    id: "ENQ-101",
    customer: "Priya V.",
    phone: "99890XXXXX",
    product: "Belgian Chocolate Truffle Cake",
    productId: "cm-cake-1",
    size: "1 kg",
    quantity: 1,
    date: "2026-09-25",
    deliveryType: "Delivery",
    address: "Danavaipeta, Rajahmundry",
    message: "Enquiring if this can be delivered by 4 PM tomorrow.",
    status: "New",
    createdAt: new Date().toISOString(),
  }
];

// In-memory caching with persistent file sync
export const store = {
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

  // --- Custom Requests ---
  getCustomRequests(): CustomCakeRequest[] {
    return readJsonFile<CustomCakeRequest[]>(CUSTOM_REQUESTS_FILE, initialCustomRequests);
  },
  createCustomRequest(data: Omit<CustomCakeRequest, "id" | "createdAt" | "status">): CustomCakeRequest {
    const requests = this.getCustomRequests();
    const newRequest: CustomCakeRequest = {
      ...data,
      id: `REQ-${Date.now().toString().slice(-6)}`,
      status: "New",
      createdAt: new Date().toISOString(),
    };
    requests.unshift(newRequest);
    writeJsonFile(CUSTOM_REQUESTS_FILE, requests);
    return newRequest;
  },
  updateCustomRequestStatus(id: string, status: CustomCakeRequest["status"]): CustomCakeRequest | null {
    const requests = this.getCustomRequests();
    const target = requests.find((r) => r.id === id);
    if (!target) return null;
    target.status = status;
    writeJsonFile(CUSTOM_REQUESTS_FILE, requests);
    return target;
  },

  // --- Enquiries ---
  getEnquiries(): Enquiry[] {
    return readJsonFile<Enquiry[]>(ENQUIRIES_FILE, initialEnquiries);
  },
  createEnquiry(data: Omit<Enquiry, "id" | "createdAt" | "status">): Enquiry {
    const enquiries = this.getEnquiries();
    const newEnquiry: Enquiry = {
      ...data,
      id: `ENQ-${Date.now().toString().slice(-5)}`,
      status: "New",
      createdAt: new Date().toISOString(),
    };
    enquiries.unshift(newEnquiry);
    writeJsonFile(ENQUIRIES_FILE, enquiries);
    return newEnquiry;
  },
  updateEnquiryStatus(id: string, status: Enquiry["status"]): Enquiry | null {
    const enquiries = this.getEnquiries();
    const target = enquiries.find((e) => e.id === id);
    if (!target) return null;
    target.status = status;
    writeJsonFile(ENQUIRIES_FILE, enquiries);
    return target;
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
