"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Product,
  CustomCakeRequest,
  Enquiry,
  GalleryItem,
  CustomRequestStatus,
  ProductCategory,
} from "@/types";
import {
  LayoutDashboard,
  Package,
  Sparkles,
  MessageSquare,
  Images,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  Eye,
  RefreshCw,
  Search,
} from "lucide-react";

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");

  const [activeTab, setActiveTab] = useState<
    "overview" | "products" | "custom-requests" | "enquiries" | "gallery"
  >("overview");

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [customRequests, setCustomRequests] = useState<CustomCakeRequest[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Product Form Modal
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  // Gallery Form Modal
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [newGalleryItem, setNewGalleryItem] = useState({
    title: "",
    image: "",
    category: "Birthday" as GalleryItem["category"],
    flavour: "",
    occasion: "",
    featured: false,
  });

  const checkAuth = () => {
    // Default admin code for Cake Magic administration
    if (passcode === "cakemagic2026" || passcode === "admin123") {
      setAuthenticated(true);
      setAuthError("");
      loadAllData();
    } else {
      setAuthError("Incorrect admin credentials.");
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [prodRes, reqRes, enqRes, galRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/custom-requests"),
        fetch("/api/enquiries"),
        fetch("/api/gallery"),
      ]);

      if (prodRes.ok) setProducts(await prodRes.json());
      if (reqRes.ok) setCustomRequests(await reqRes.json());
      if (enqRes.ok) setEnquiries(await enqRes.json());
      if (galRes.ok) setGallery(await galRes.json());
    } catch (err) {
      console.error("Failed to load admin data", err);
    } finally {
      setLoading(false);
    }
  };

  // Status updates
  const handleUpdateStatus = async (id: string, status: CustomRequestStatus) => {
    try {
      const res = await fetch("/api/custom-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setCustomRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: updated.status } : r))
        );
      }
    } catch (e) {
      alert("Failed to update status");
    }
  };

  // Product save
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.category) return;

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editingProduct,
          flavours: typeof editingProduct.flavours === "string"
            ? (editingProduct.flavours as string).split(",").map((s) => s.trim())
            : editingProduct.flavours || ["Belgian Chocolate"],
          sizes: typeof editingProduct.sizes === "string"
            ? (editingProduct.sizes as string).split(",").map((s) => s.trim())
            : editingProduct.sizes || ["500 g", "1 kg"],
          images: editingProduct.images?.length
            ? editingProduct.images
            : ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop"],
        }),
      });

      if (res.ok) {
        setProductModalOpen(false);
        setEditingProduct(null);
        loadAllData();
      }
    } catch {
      alert("Failed to save product");
    }
  };

  // Product delete
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {
      alert("Failed to delete product");
    }
  };

  // Gallery add
  const handleAddGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGalleryItem),
      });
      if (res.ok) {
        setGalleryModalOpen(false);
        setNewGalleryItem({
          title: "",
          image: "",
          category: "Birthday",
          flavour: "",
          occasion: "",
          featured: false,
        });
        loadAllData();
      }
    } catch {
      alert("Failed to add gallery item");
    }
  };

  // Gallery delete
  const handleDeleteGallery = async (id: string) => {
    if (!confirm("Delete this gallery item?")) return;
    try {
      const res = await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setGallery((prev) => prev.filter((g) => g.id !== id));
      }
    } catch {
      alert("Failed to delete gallery item");
    }
  };

  // KPIs
  const todayEnquiriesCount = enquiries.length;
  const customRequestsCount = customRequests.length;
  const pendingConfirmationsCount = customRequests.filter(
    (r) => r.status === "New" || r.status === "Reviewing"
  ).length;
  const confirmedDeliveriesCount = customRequests.filter(
    (r) => r.status === "Confirmed"
  ).length;

  if (!authenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-[var(--surface)] p-8 rounded-3xl border border-[var(--surface-border)] shadow-xl text-center space-y-6">
          <div className="flex flex-col items-center">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[var(--surface-border-strong)]/60 shadow-md mb-3 bg-[#F9F6F0]">
              <Image
                src="/logo.jpg"
                alt="Cake Magic Logo"
                fill
                sizes="80px"
                className="object-contain p-1"
                priority
              />
            </div>
            <span className="font-serif text-2xl font-bold uppercase tracking-wider text-[var(--foreground)]">
              Cake Magic
            </span>
            <span className="block text-xs uppercase tracking-widest text-[var(--foreground-muted)] mt-1">
              Rajahmundry &bull; Store Admin Portal
            </span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              checkAuth();
            }}
            className="space-y-4 text-left"
          >
            <div>
              <label className="block text-xs font-semibold text-[var(--foreground-muted)] mb-1">
                Admin Passcode
              </label>
              <input
                type="password"
                placeholder="Enter passcode (e.g. cakemagic2026)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                autoFocus
                className="w-full text-sm p-3 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-alt)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            {authError && (
              <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-bold uppercase tracking-wider hover:bg-[var(--primary-hover)] transition-all shadow-md"
            >
              Sign In to Dashboard
            </button>
          </form>

          <p className="text-[11px] text-[var(--foreground-subtle)]">
            Owner credentials required to access orders and product configuration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--surface-border)]">
        <div className="flex items-center gap-3.5">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[var(--surface-border-strong)]/60 shadow-xs shrink-0 bg-[#F9F6F0]">
            <Image
              src="/logo.jpg"
              alt="Cake Magic Logo"
              fill
              sizes="48px"
              className="object-contain p-0.5"
            />
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-[var(--foreground-muted)]">
              Store Administration &bull; Rajahmundry
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--foreground)] mt-0.5">
              Cake Magic Management Hub
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAllData}
            disabled={loading}
            className="tap-target px-3.5 py-2 rounded-xl border border-[var(--surface-border)] text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface-alt)] transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Sync</span>
          </button>
          <button
            onClick={() => setAuthenticated(false)}
            className="tap-target px-3.5 py-2 rounded-xl bg-[var(--surface-alt)] text-xs font-semibold text-[var(--foreground-muted)] hover:text-red-600 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-[var(--surface-border)] pb-2">
        {[
          { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
          { id: "custom-requests", label: `Custom Requests (${customRequests.length})`, icon: Sparkles },
          { id: "enquiries", label: `Product Enquiries (${enquiries.length})`, icon: MessageSquare },
          { id: "products", label: `Products (${products.length})`, icon: Package },
          { id: "gallery", label: `Gallery (${gallery.length})`, icon: Images },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`tap-target px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                active
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs"
                  : "bg-[var(--surface)] text-[var(--foreground-muted)] hover:bg-[var(--surface-alt)] border border-[var(--surface-border)]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--surface-border)] shadow-xs space-y-1">
              <span className="text-xs uppercase font-bold text-[var(--foreground-muted)]">
                Today&apos;s Enquiries
              </span>
              <div className="font-serif text-3xl font-bold text-[var(--foreground)]">
                {todayEnquiriesCount}
              </div>
              <span className="text-[11px] text-[var(--foreground-subtle)]">Direct catalogue leads</span>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--surface-border)] shadow-xs space-y-1">
              <span className="text-xs uppercase font-bold text-[var(--accent-blush-dark)]">
                Custom Requests
              </span>
              <div className="font-serif text-3xl font-bold text-[var(--foreground)]">
                {customRequestsCount}
              </div>
              <span className="text-[11px] text-[var(--foreground-subtle)]">Custom designer cakes</span>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--surface-border)] shadow-xs space-y-1">
              <span className="text-xs uppercase font-bold text-amber-600">
                Pending Confirmation
              </span>
              <div className="font-serif text-3xl font-bold text-amber-600">
                {pendingConfirmationsCount}
              </div>
              <span className="text-[11px] text-[var(--foreground-subtle)]">Awaiting quote/review</span>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--surface-border)] shadow-xs space-y-1">
              <span className="text-xs uppercase font-bold text-[var(--badge-eggless-text)]">
                Confirmed Orders
              </span>
              <div className="font-serif text-3xl font-bold text-[var(--badge-eggless-text)]">
                {confirmedDeliveriesCount}
              </div>
              <span className="text-[11px] text-[var(--foreground-subtle)]">Scheduled for kitchen</span>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="p-6 rounded-2xl bg-[var(--surface-alt)] border border-[var(--surface-border)]">
            <h2 className="font-serif text-base font-bold text-[var(--foreground)] mb-3">
              Quick Admin Actions
            </h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setEditingProduct({
                    name: "",
                    category: "cakes",
                    subcategory: "Chocolate",
                    description: "",
                    flavours: ["Belgian Dark Chocolate"],
                    sizes: ["500 g", "1 kg", "2 kg"],
                    startingPrice: null,
                    eggless: true,
                    customizable: true,
                    availableToday: true,
                    advanceOrderRequired: false,
                    featured: false,
                    active: true,
                    images: ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop"],
                  });
                  setProductModalOpen(true);
                }}
                className="tap-target px-4 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:bg-[var(--primary-hover)] flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>

              <button
                onClick={() => setGalleryModalOpen(true)}
                className="tap-target px-4 py-2.5 rounded-xl border border-[var(--surface-border-strong)] bg-[var(--surface)] text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface-alt)] flex items-center gap-1.5"
              >
                <Images className="w-3.5 h-3.5 text-[var(--primary)]" />
                <span>Upload to Gallery</span>
              </button>

              <button
                onClick={() => setActiveTab("custom-requests")}
                className="tap-target px-4 py-2.5 rounded-xl border border-[var(--surface-border-strong)] bg-[var(--surface)] text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface-alt)] flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[var(--accent-blush-dark)]" />
                <span>Review Custom Orders</span>
              </button>
            </div>
          </div>

          {/* Recent Custom Requests Snippet */}
          <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--surface-border)] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg font-bold text-[var(--foreground)]">
                Recent Custom Cake Inquiries
              </h2>
              <button
                onClick={() => setActiveTab("custom-requests")}
                className="text-xs font-semibold text-[var(--primary)] hover:underline"
              >
                View All &rarr;
              </button>
            </div>

            <div className="divide-y divide-[var(--surface-border)]">
              {customRequests.slice(0, 4).map((req) => (
                <div key={req.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase">
                      {req.id} &bull; {req.occasion}
                    </span>
                    <h3 className="font-semibold text-sm text-[var(--foreground)]">
                      {req.customerName} ({req.phone}) &bull; {req.flavour} ({req.size})
                    </h3>
                    <p className="text-xs text-[var(--foreground-muted)] mt-0.5">
                      Date: {req.deliveryDate || "Pending"} &bull; {req.deliveryType}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={req.status}
                      onChange={(e) =>
                        handleUpdateStatus(req.id, e.target.value as CustomRequestStatus)
                      }
                      className="text-xs py-1.5 px-2.5 rounded-lg border border-[var(--surface-border)] bg-[var(--surface-alt)] font-semibold"
                    >
                      <option value="New">New</option>
                      <option value="Reviewing">Reviewing</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Payment Pending">Payment Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM REQUESTS TAB */}
      {activeTab === "custom-requests" && (
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--surface-border)] overflow-hidden shadow-xs">
          <div className="p-5 border-b border-[var(--surface-border)] flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-[var(--foreground)]">
              Custom Cake Requests Pipeline
            </h2>
            <span className="text-xs text-[var(--foreground-muted)]">
              {customRequests.length} total requests
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--surface-alt)] text-[var(--foreground-muted)] uppercase tracking-wider text-[10px] font-bold border-b border-[var(--surface-border)]">
                <tr>
                  <th className="py-3 px-4">Request ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Occasion & Cake</th>
                  <th className="py-3 px-4">Date / Mode</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--surface-border)]">
                {customRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-[var(--surface-alt)]/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[var(--foreground)]">{req.id}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[var(--foreground)]">{req.customerName}</div>
                      <div className="text-[11px] text-[var(--foreground-muted)]">{req.phone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[var(--foreground)]">{req.occasion}</div>
                      <div className="text-[11px] text-[var(--foreground-muted)]">
                        {req.flavour} &bull; {req.size} &bull; {req.eggless ? "Eggless" : "Regular"}
                      </div>
                      {req.message && (
                        <div className="text-[10px] italic text-[var(--primary)] mt-0.5">
                          &ldquo;{req.message}&rdquo;
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div>{req.deliveryDate || "Pending"} {req.deliveryTime ? `@ ${req.deliveryTime}` : ""}</div>
                      <div className="text-[10px] text-[var(--foreground-muted)]">{req.deliveryType}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={req.status}
                        onChange={(e) =>
                          handleUpdateStatus(req.id, e.target.value as CustomRequestStatus)
                        }
                        className="py-1 px-2 rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] text-xs font-semibold"
                      >
                        <option value="New">New</option>
                        <option value="Reviewing">Reviewing</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Payment Pending">Payment Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4">
                      {req.referenceImage ? (
                        <a
                          href={req.referenceImage}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[var(--primary)] underline font-medium"
                        >
                          View Photo
                        </a>
                      ) : (
                        <span className="text-[var(--foreground-subtle)]">&mdash;</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ENQUIRIES TAB */}
      {activeTab === "enquiries" && (
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--surface-border)] overflow-hidden shadow-xs">
          <div className="p-5 border-b border-[var(--surface-border)]">
            <h2 className="font-serif text-lg font-bold text-[var(--foreground)]">
              Product Catalogue Enquiries
            </h2>
          </div>

          <div className="divide-y divide-[var(--surface-border)]">
            {enquiries.map((enq) => (
              <div key={enq.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase">
                    {enq.id} &bull; {enq.createdAt ? new Date(enq.createdAt).toLocaleDateString() : ""}
                  </span>
                  <h3 className="font-bold text-sm text-[var(--foreground)] mt-0.5">
                    {enq.product} {enq.size ? `(${enq.size})` : ""} &bull; Qty: {enq.quantity}
                  </h3>
                  <div className="text-xs text-[var(--foreground-muted)] mt-1">
                    Customer: <span className="font-semibold text-[var(--foreground)]">{enq.customer}</span> ({enq.phone}) &bull; Date: {enq.date || "Immediate"}
                  </div>
                  {enq.message && (
                    <p className="text-xs text-[var(--foreground-muted)] italic mt-1 bg-[var(--surface-alt)] p-2 rounded-lg">
                      {enq.message}
                    </p>
                  )}
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {enq.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRODUCTS TAB */}
      {activeTab === "products" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-[var(--foreground)]">
              Product Catalogue Management
            </h2>
            <button
              onClick={() => {
                setEditingProduct({
                  name: "",
                  category: "cakes",
                  subcategory: "Chocolate",
                  description: "",
                  flavours: ["Belgian Dark Chocolate"],
                  sizes: ["500 g", "1 kg"],
                  startingPrice: null,
                  eggless: true,
                  customizable: true,
                  availableToday: true,
                  advanceOrderRequired: false,
                  featured: false,
                  active: true,
                  images: ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop"],
                });
                setProductModalOpen(true);
              }}
              className="tap-target px-4 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:bg-[var(--primary-hover)] flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="bg-[var(--surface)] rounded-2xl border border-[var(--surface-border)] overflow-hidden p-4 flex flex-col justify-between shadow-xs space-y-3"
              >
                <div className="flex gap-3">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[var(--surface-alt)] shrink-0">
                    <Image
                      src={prod.images[0] || "/placeholder.jpg"}
                      alt={prod.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[var(--foreground-muted)]">
                      {prod.category} &bull; {prod.subcategory}
                    </span>
                    <h3 className="font-serif text-sm font-bold text-[var(--foreground)] line-clamp-1">
                      {prod.name}
                    </h3>
                    <div className="text-xs text-[var(--primary)] font-semibold mt-0.5">
                      {prod.startingPrice ? `₹${prod.startingPrice}` : "Price on enquiry"}
                    </div>
                  </div>
                </div>

                {/* Status Toggles & Badges */}
                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  {prod.eggless && (
                    <span className="px-1.5 py-0.5 rounded bg-[var(--badge-eggless-bg)] text-[var(--badge-eggless-text)]">
                      Eggless
                    </span>
                  )}
                  {prod.availableToday && (
                    <span className="px-1.5 py-0.5 rounded bg-[var(--badge-gold-bg)] text-[var(--badge-gold-text)]">
                      Available Today
                    </span>
                  )}
                  {prod.featured && (
                    <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700">
                      Featured
                    </span>
                  )}
                </div>

                <div className="pt-2 border-t border-[var(--surface-border)] flex items-center justify-between">
                  <button
                    onClick={() => {
                      setEditingProduct(prod);
                      setProductModalOpen(true);
                    }}
                    className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDeleteProduct(prod.id)}
                    className="text-xs font-semibold text-red-600 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GALLERY TAB */}
      {activeTab === "gallery" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-[var(--foreground)]">
              Gallery Management
            </h2>
            <button
              onClick={() => setGalleryModalOpen(true)}
              className="tap-target px-4 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:bg-[var(--primary-hover)] flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Gallery</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.map((item) => (
              <div
                key={item.id}
                className="bg-[var(--surface)] rounded-2xl border border-[var(--surface-border)] overflow-hidden shadow-xs flex flex-col justify-between"
              >
                <div className="relative aspect-square w-full bg-[var(--surface-alt)]">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                  <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-black/60 text-white">
                    {item.category}
                  </span>
                </div>
                <div className="p-3">
                  <h4 className="font-serif text-xs font-bold text-[var(--foreground)] line-clamp-1">
                    {item.title}
                  </h4>
                  <div className="mt-2 pt-2 border-t border-[var(--surface-border)] flex justify-end">
                    <button
                      onClick={() => handleDeleteGallery(item.id)}
                      className="text-[11px] text-red-600 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Edit / Add Modal */}
      {productModalOpen && editingProduct && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="w-full max-w-xl bg-[var(--surface)] rounded-3xl p-6 sm:p-8 border border-[var(--surface-border)] shadow-2xl space-y-4 my-8">
            <h3 className="font-serif text-xl font-bold text-[var(--foreground)]">
              {editingProduct.id ? "Edit Product" : "Create New Product"}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ""}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, name: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-alt)]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Category *</label>
                  <select
                    value={editingProduct.category || "cakes"}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        category: e.target.value as ProductCategory,
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-alt)]"
                  >
                    <option value="cakes">Cakes</option>
                    <option value="desserts">Desserts</option>
                    <option value="bakery">Bakery</option>
                    <option value="celebrations">Celebrations</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Subcategory / Style</label>
                  <input
                    type="text"
                    value={editingProduct.subcategory || ""}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, subcategory: e.target.value })
                    }
                    placeholder="e.g. Chocolate, Bento, Bread"
                    className="w-full p-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-alt)]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Starting Price (₹) or leave empty</label>
                  <input
                    type="number"
                    value={editingProduct.startingPrice ?? ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        startingPrice: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    placeholder="Empty = Price on enquiry"
                    className="w-full p-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-alt)]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.description || ""}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-alt)]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Flavours (comma separated)</label>
                <input
                  type="text"
                  value={
                    Array.isArray(editingProduct.flavours)
                      ? editingProduct.flavours.join(", ")
                      : editingProduct.flavours || ""
                  }
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, flavours: e.target.value as any })
                  }
                  placeholder="e.g. Belgian Truffle, Dark Chocolate"
                  className="w-full p-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-alt)]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Sizes (comma separated)</label>
                <input
                  type="text"
                  value={
                    Array.isArray(editingProduct.sizes)
                      ? editingProduct.sizes.join(", ")
                      : editingProduct.sizes || ""
                  }
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, sizes: e.target.value as any })
                  }
                  placeholder="e.g. 500 g, 1 kg, 2 kg"
                  className="w-full p-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-alt)]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Image URL</label>
                <input
                  type="text"
                  value={editingProduct.images?.[0] || ""}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, images: [e.target.value] })
                  }
                  className="w-full p-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-alt)]"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <label className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={editingProduct.eggless ?? false}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, eggless: e.target.checked })
                    }
                  />
                  <span>Eggless</span>
                </label>
                <label className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={editingProduct.availableToday ?? false}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, availableToday: e.target.checked })
                    }
                  />
                  <span>Available Today</span>
                </label>
                <label className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={editingProduct.featured ?? false}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, featured: e.target.checked })
                    }
                  />
                  <span>Featured</span>
                </label>
                <label className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={editingProduct.customizable ?? true}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, customizable: e.target.checked })
                    }
                  />
                  <span>Customizable</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-[var(--surface-border)]">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--surface-border)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Add Modal */}
      {galleryModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="w-full max-w-md bg-[var(--surface)] rounded-3xl p-6 sm:p-8 border border-[var(--surface-border)] shadow-2xl space-y-4">
            <h3 className="font-serif text-xl font-bold text-[var(--foreground)]">
              Add Photo to Gallery
            </h3>

            <form onSubmit={handleAddGallery} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Two-Tier Pastel Floral Cake"
                  value={newGalleryItem.title}
                  onChange={(e) =>
                    setNewGalleryItem({ ...newGalleryItem, title: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-alt)]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Image URL *</label>
                <input
                  type="text"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={newGalleryItem.image}
                  onChange={(e) =>
                    setNewGalleryItem({ ...newGalleryItem, image: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-alt)]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Category *</label>
                <select
                  value={newGalleryItem.category}
                  onChange={(e) =>
                    setNewGalleryItem({
                      ...newGalleryItem,
                      category: e.target.value as GalleryItem["category"],
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-alt)]"
                >
                  <option value="Birthday">Birthday</option>
                  <option value="Kids">Kids</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Designer">Designer</option>
                  <option value="Bento">Bento</option>
                  <option value="Photo Cakes">Photo Cakes</option>
                  <option value="Celebrations">Celebrations</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Flavour (Optional)</label>
                <input
                  type="text"
                  value={newGalleryItem.flavour}
                  onChange={(e) =>
                    setNewGalleryItem({ ...newGalleryItem, flavour: e.target.value })
                  }
                  placeholder="e.g. Belgian Dark Truffle"
                  className="w-full p-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-alt)]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[var(--surface-border)]">
                <button
                  type="button"
                  onClick={() => setGalleryModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--surface-border)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold"
                >
                  Add to Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
