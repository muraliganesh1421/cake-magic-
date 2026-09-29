"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import {
  Product,
  CustomCakeRequest,
  Enquiry,
  GalleryItem,
  CustomRequestStatus,
  ProductCategory,
  OrderRecord,
  StaffMember,
  BusinessSettingsData,
  OrderStatusType,
} from "@/types";
import { AutomationLogEntry } from "@/lib/events";
import {
  LayoutDashboard,
  Package,
  Sparkles,
  Images,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  RefreshCw,
  Search,
  Users,
  Settings,
  Activity,
  Truck,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

type AdminTab =
  | "overview"
  | "orders"
  | "products"
  | "custom-cakes"
  | "customers"
  | "staff"
  | "settings"
  | "automation-logs"
  | "gallery";

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  // Data states
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customRequests, setCustomRequests] = useState<CustomCakeRequest[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [settings, setSettings] = useState<BusinessSettingsData | null>(null);
  const [automationLogs, setAutomationLogs] = useState<AutomationLogEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters & Search
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("ALL");
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>("all");

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

  // Staff Form Modal
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState<Partial<StaffMember>>({
    name: "",
    phone: "",
    role: "BAKER",
    dutyStatus: "ON_DUTY",
    active: true,
  });

  // Settings form saving state
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Check existing session token on mount
  useEffect(() => {
    const token = localStorage.getItem("cakemagic_admin_token");
    if (token) {
      fetch("/api/admin/verify", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.ok) {
            setAuthenticated(true);
          } else {
            localStorage.removeItem("cakemagic_admin_token");
          }
        })
        .catch(() => {
          localStorage.removeItem("cakemagic_admin_token");
        });
    }
  }, []);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        ordersRes,
        prodRes,
        reqRes,
        enqRes,
        galRes,
        staffRes,
        settingsRes,
        logsRes,
      ] = await Promise.all([
        fetch("/api/orders").catch(() => null),
        fetch("/api/products").catch(() => null),
        fetch("/api/custom-requests").catch(() => null),
        fetch("/api/enquiries").catch(() => null),
        fetch("/api/gallery").catch(() => null),
        fetch("/api/staff").catch(() => null),
        fetch("/api/settings").catch(() => null),
        fetch("/api/admin/logs").catch(() => null),
      ]);

      if (ordersRes?.ok) {
        const oData = await ordersRes.json();
        setOrders(Array.isArray(oData) ? oData : []);
      }
      if (prodRes?.ok) setProducts(await prodRes.json());
      if (reqRes?.ok) setCustomRequests(await reqRes.json());
      if (enqRes?.ok) setEnquiries(await enqRes.json());
      if (galRes?.ok) setGallery(await galRes.json());
      if (staffRes?.ok) setStaff(await staffRes.json());
      if (settingsRes?.ok) setSettings(await settingsRes.json());
      if (logsRes?.ok) setAutomationLogs(await logsRes.json());
    } catch (err) {
      console.error("Failed to load admin data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      const timer = setTimeout(() => {
        loadAllData();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [authenticated, loadAllData]);

  // Server-side Authentication
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: authEmail || "owner@cakemagic.in",
          password: passcode,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || "Invalid credentials.");
      } else {
        localStorage.setItem("cakemagic_admin_token", data.token);
        setAuthenticated(true);
      }
    } catch {
      setAuthError("Network error. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("cakemagic_admin_token");
    setAuthenticated(false);
    setPasscode("");
  };

  // Order Actions
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatusType) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
        // Refresh logs too as automation events trigger on status update
        fetch("/api/admin/logs")
          .then((r) => r.json())
          .then(setAutomationLogs)
          .catch(() => null);
      }
    } catch {
      alert("Failed to update order status");
    }
  };

  const handleReassignStaff = async (orderId: string, staffId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffId }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
        fetch("/api/staff")
          .then((r) => r.json())
          .then(setStaff)
          .catch(() => null);
      }
    } catch {
      alert("Failed to reassign staff");
    }
  };

  // Custom Request Actions
  const handleUpdateCustomStatus = async (id: string, status: CustomRequestStatus) => {
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
    } catch {
      alert("Failed to update custom request status");
    }
  };

  // Staff Actions
  const handleToggleDuty = async (staffMember: StaffMember) => {
    const nextStatus = staffMember.dutyStatus === "ON_DUTY" ? "OFF_DUTY" : "ON_DUTY";
    try {
      const res = await fetch("/api/staff", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffId: staffMember.id, dutyStatus: nextStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setStaff((prev) => prev.map((s) => (s.id === staffMember.id ? updated : s)));
      }
    } catch {
      alert("Failed to update staff duty status");
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.phone) return;
    try {
      const res = await fetch("/api/staff", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staffId: `staff-${Date.now()}`,
          updates: {
            ...newStaff,
            id: `staff-${Date.now()}`,
            activeOrderCount: 0,
            active: true,
          },
        }),
      });
      if (res.ok) {
        setStaffModalOpen(false);
        setNewStaff({ name: "", phone: "", role: "BAKER", dutyStatus: "ON_DUTY", active: true });
        loadAllData();
      }
    } catch {
      alert("Failed to add staff member");
    }
  };

  // Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSavingSettings(true);
    setSettingsSuccess(false);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSettings(await res.json());
        setSettingsSuccess(true);
        setTimeout(() => setSettingsSuccess(false), 3000);
      }
    } catch {
      alert("Failed to save settings");
    } finally {
      setSavingSettings(false);
    }
  };

  // Product CRUD
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.category) return;

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editingProduct,
          flavours:
            typeof editingProduct.flavours === "string"
              ? (editingProduct.flavours as string).split(",").map((s) => s.trim())
              : editingProduct.flavours || ["Belgian Chocolate"],
          sizes:
            typeof editingProduct.sizes === "string"
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

  // Gallery CRUD
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

  // Derived Customers List
  const customersList = useMemo(() => {
    const map = new Map<
      string,
      {
        name: string;
        phone: string;
        totalOrders: number;
        totalSpent: number;
        lastOrderDate: string;
      }
    >();

    orders.forEach((o) => {
      const cleanPhone = o.customerPhone.replace(/\D/g, "");
      const existing = map.get(cleanPhone) || {
        name: o.customerName,
        phone: o.customerPhone,
        totalOrders: 0,
        totalSpent: 0,
        lastOrderDate: o.createdAt,
      };
      existing.totalOrders += 1;
      existing.totalSpent += o.totalAmount || 0;
      if (new Date(o.createdAt) > new Date(existing.lastOrderDate)) {
        existing.lastOrderDate = o.createdAt;
      }
      map.set(cleanPhone, existing);
    });

    customRequests.forEach((r) => {
      const cleanPhone = r.phone.replace(/\D/g, "");
      if (!map.has(cleanPhone)) {
        map.set(cleanPhone, {
          name: r.customerName,
          phone: r.phone,
          totalOrders: 1,
          totalSpent: 0,
          lastOrderDate: r.createdAt,
        });
      }
    });

    enquiries.forEach((e) => {
      const cleanPhone = e.phone.replace(/\D/g, "");
      if (!map.has(cleanPhone)) {
        map.set(cleanPhone, {
          name: e.customer,
          phone: e.phone,
          totalOrders: 1,
          totalSpent: 0,
          lastOrderDate: e.createdAt,
        });
      }
    });

    return Array.from(map.values()).sort(
      (a, b) => new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime()
    );
  }, [orders, customRequests, enquiries]);

  // KPIs
  const totalRevenue = useMemo(
    () =>
      orders
        .filter((o) => !["CANCELLED", "REFUNDED"].includes(o.status))
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0),
    [orders]
  );
  const activeOrdersCount = useMemo(
    () => orders.filter((o) => !["DELIVERED", "CANCELLED", "REFUNDED"].includes(o.status)).length,
    [orders]
  );
  const todayOrdersCount = useMemo(() => {
    const today = new Date().toDateString();
    return orders.filter(
      (o) =>
        new Date(o.createdAt).toDateString() === today ||
        new Date(o.deliveryDate).toDateString() === today
    ).length;
  }, [orders]);
  const onDutyStaffCount = useMemo(
    () => staff.filter((s) => s.dutyStatus === "ON_DUTY" && s.active).length,
    [staff]
  );
  const pendingCustomCount = useMemo(
    () => customRequests.filter((c) => c.status === "New" || c.status === "Reviewing").length,
    [customRequests]
  );

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus =
        orderStatusFilter === "ALL" || o.status === orderStatusFilter;
      const q = orderSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (o.id && o.id.toLowerCase().includes(q)) ||
        (o.orderNumber && o.orderNumber.toLowerCase().includes(q)) ||
        (o.customerName && o.customerName.toLowerCase().includes(q)) ||
        (o.customerPhone && o.customerPhone.includes(q));
      return matchesStatus && matchesSearch;
    });
  }, [orders, orderStatusFilter, orderSearch]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      return (
        productCategoryFilter === "all" ||
        p.category.toLowerCase() === productCategoryFilter.toLowerCase()
      );
    });
  }, [products, productCategoryFilter]);

  // --- LOGIN SCREEN ---
  if (!authenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
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
              Rajahmundry &bull; Owner Administration Hub
            </span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-[var(--foreground-muted)] mb-1">
                Admin Email (Optional)
              </label>
              <input
                type="email"
                placeholder="owner@cakemagic.in"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-alt)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--foreground-muted)] mb-1">
                Owner Passcode / Password *
              </label>
              <input
                type="password"
                placeholder="Enter owner password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                autoFocus
                required
                className="w-full text-sm p-3 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-alt)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
              />
            </div>

            {authError && (
              <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] font-bold text-sm shadow-md hover:bg-[var(--primary-hover)] active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{authLoading ? "Verifying…" : "Authenticate & Enter Hub"}</span>
            </button>
          </form>

          <p className="text-[11px] text-[var(--foreground-muted)]">
            Secured with HMAC-SHA256 session encryption.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--surface-border)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs uppercase tracking-widest text-[var(--foreground-muted)] font-semibold">
              Live Production Operations
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[var(--foreground)] mt-1">
            Cake Magic Owner Command Hub
          </h1>
          <p className="text-xs text-[var(--foreground-muted)]">
            Rajahmundry &bull; Store ID: CM-RJY-01
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAllData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface-alt)] transition-colors shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[var(--primary)]" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-red-200 bg-red-50 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[var(--surface-border)] scrollbar-none">
        {[
          { id: "overview", label: "Overview", icon: LayoutDashboard },
          { id: "orders", label: `Orders (${orders.length})`, icon: Package },
          { id: "products", label: `Products (${products.length})`, icon: Sparkles },
          { id: "custom-cakes", label: `Custom Cakes (${customRequests.length})`, icon: Calendar },
          { id: "customers", label: `Customers (${customersList.length})`, icon: Users },
          { id: "staff", label: `Staff (${staff.length})`, icon: UserCheck },
          { id: "settings", label: "Settings", icon: Settings },
          { id: "automation-logs", label: `Automation (${automationLogs.length})`, icon: Activity },
          { id: "gallery", label: `Gallery (${gallery.length})`, icon: Images },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs"
                  : "text-[var(--foreground-muted)] hover:bg-[var(--surface-alt)] hover:text-[var(--foreground)]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* --- TAB: OVERVIEW --- */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--surface-border)] shadow-xs">
              <span className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider block">
                Total Revenue
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-serif text-3xl font-bold text-[var(--primary)]">
                  ₹{totalRevenue.toLocaleString("en-IN")}
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold">Active Orders</span>
              </div>
              <p className="text-[11px] text-[var(--foreground-muted)] mt-1">
                {orders.length} total orders recorded
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--surface-border)] shadow-xs">
              <span className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider block">
                In Kitchen / Delivery
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-serif text-3xl font-bold text-amber-600">
                  {activeOrdersCount}
                </span>
                <span className="text-[11px] text-[var(--foreground-muted)]">Active Orders</span>
              </div>
              <p className="text-[11px] text-[var(--foreground-muted)] mt-1">
                {todayOrdersCount} scheduled for today
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--surface-border)] shadow-xs">
              <span className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider block">
                Custom Enquiries
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-serif text-3xl font-bold text-purple-600">
                  {pendingCustomCount}
                </span>
                <span className="text-[11px] text-[var(--foreground-muted)]">Needs Review</span>
              </div>
              <p className="text-[11px] text-[var(--foreground-muted)] mt-1">
                {customRequests.length} total custom requests
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--surface-border)] shadow-xs">
              <span className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider block">
                Kitchen Team on Duty
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-serif text-3xl font-bold text-emerald-600">
                  {onDutyStaffCount} / {staff.length}
                </span>
              </div>
              <p className="text-[11px] text-[var(--foreground-muted)] mt-1">
                Auto-assigned to active kitchen members
              </p>
            </div>
          </div>

          {/* Recent Orders & Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[var(--surface)] p-6 rounded-2xl border border-[var(--surface-border)] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-lg font-bold text-[var(--foreground)]">
                  Recent Customer Orders
                </h2>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-xs font-semibold text-[var(--primary)] hover:underline"
                >
                  View all ({orders.length}) &rarr;
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-10 text-xs text-[var(--foreground-muted)]">
                  No orders placed yet. Test the checkout flow!
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 5).map((o) => (
                    <div
                      key={o.id}
                      className="p-3.5 rounded-xl border border-[var(--surface-border)] flex items-center justify-between hover:bg-[var(--surface-alt)] transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[var(--primary)]">
                            {o.id}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[var(--surface-alt)] text-[var(--foreground)]">
                            {o.status}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-[var(--foreground)]">
                          {o.customerName} &bull; {o.customerPhone}
                        </p>
                        <p className="text-[11px] text-[var(--foreground-muted)]">
                          {o.items?.length || 0} item(s) &bull; {o.deliveryType} &bull; Assigned:{" "}
                          <span className="font-semibold text-[var(--foreground)]">
                            {o.assignedStaffName || "Unassigned"}
                          </span>
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-sm text-[var(--foreground)]">
                          ₹{o.totalAmount}
                        </span>
                        <p className="text-[10px] text-[var(--foreground-muted)]">
                          {new Date(o.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions & Business Info */}
            <div className="space-y-4">
              <div className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--surface-border)] shadow-xs space-y-3">
                <h3 className="font-serif text-sm font-bold text-[var(--foreground)]">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setEditingProduct({
                        name: "",
                        category: "cakes",
                        startingPrice: 650,
                        eggless: true,
                        featured: false,
                        availableToday: true,
                        flavours: ["Belgian Chocolate", "Vanilla Bean"],
                        sizes: ["500 g", "1 kg"],
                      });
                      setProductModalOpen(true);
                    }}
                    className="w-full text-left p-3 rounded-xl bg-[var(--surface-alt)] hover:bg-[var(--surface-border)]/50 transition-colors text-xs font-semibold text-[var(--foreground)] flex items-center justify-between"
                  >
                    <span>+ Add New Product</span>
                    <Plus className="w-3.5 h-3.5 text-[var(--primary)]" />
                  </button>
                  <button
                    onClick={() => setActiveTab("staff")}
                    className="w-full text-left p-3 rounded-xl bg-[var(--surface-alt)] hover:bg-[var(--surface-border)]/50 transition-colors text-xs font-semibold text-[var(--foreground)] flex items-center justify-between"
                  >
                    <span>Manage Staff & Duty Shifts</span>
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </button>
                  <button
                    onClick={() => setActiveTab("automation-logs")}
                    className="w-full text-left p-3 rounded-xl bg-[var(--surface-alt)] hover:bg-[var(--surface-border)]/50 transition-colors text-xs font-semibold text-[var(--foreground)] flex items-center justify-between"
                  >
                    <span>View Automation Event Logs</span>
                    <Activity className="w-3.5 h-3.5 text-blue-600" />
                  </button>
                </div>
              </div>

              {settings && (
                <div className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--surface-border)] shadow-xs text-xs space-y-2">
                  <h3 className="font-serif text-sm font-bold text-[var(--foreground)]">
                    Current Store Status
                  </h3>
                  <div className="flex justify-between py-1 border-b border-[var(--surface-border)]">
                    <span className="text-[var(--foreground-muted)]">Accepting Orders</span>
                    <span className={`font-bold ${settings.acceptingOrders ? "text-emerald-600" : "text-red-500"}`}>
                      {settings.acceptingOrders ? "Open" : "Closed"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[var(--surface-border)]">
                    <span className="text-[var(--foreground-muted)]">Min Preparation</span>
                    <span className="font-bold text-[var(--foreground)]">
                      {settings.minPreparationHours} hrs
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[var(--foreground-muted)]">Delivery Charge</span>
                    <span className="font-bold text-[var(--foreground)]">
                      ₹{settings.deliveryCharge} (Free above ₹{settings.freeDeliveryThreshold})
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB: ORDERS --- */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[var(--foreground-muted)] absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by order ID, name, phone..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="pl-8 pr-3 py-2 text-xs rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] w-64"
                />
              </div>

              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="py-2 px-3 text-xs rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--foreground)]"
              >
                <option value="ALL">All Statuses</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="PAID">PAID</option>
                <option value="PREPARING">PREPARING</option>
                <option value="READY">READY</option>
                <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  fetch("/api/orders")
                    .then((r) => r.json())
                    .then((data) => setOrders(Array.isArray(data) ? data : []))
                    .catch(() => null);
                }}
                className="tap-target px-3 py-1.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] hover:bg-[var(--surface-alt)] text-xs font-semibold text-[var(--foreground)] flex items-center gap-1.5 transition-colors shadow-xs"
                title="Refresh orders from server"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                <span>Refresh Orders</span>
              </button>
              <div className="text-xs text-[var(--foreground-muted)] font-semibold">
                Showing {filteredOrders.length} of {orders.length} orders
              </div>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-[var(--surface)] rounded-2xl border border-[var(--surface-border)]">
              <Package className="w-10 h-10 text-[var(--foreground-muted)] mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold text-[var(--foreground)]">No orders matched</p>
              <p className="text-xs text-[var(--foreground-muted)] mt-1">
                Try changing your filter or search query.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((o) => (
                <div
                  key={o.id}
                  className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--surface-border)] shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--surface-border)]">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-[var(--primary)]">
                        {o.id}
                      </span>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[var(--surface-alt)] border border-[var(--surface-border)] text-[var(--foreground)]">
                        {o.status}
                      </span>
                      <span className="text-xs text-[var(--foreground-muted)] flex items-center gap-1">
                        <Truck className="w-3 h-3" />
                        {o.deliveryType === "PICKUP" ? "Store Pickup" : "Local Delivery"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--foreground-muted)]">Status:</span>
                      <select
                        value={o.status}
                        onChange={(e) =>
                          handleUpdateOrderStatus(o.id, e.target.value as OrderStatusType)
                        }
                        className="py-1 px-2.5 text-xs font-semibold rounded-lg border border-[var(--surface-border)] bg-[var(--surface-alt)] text-[var(--foreground)]"
                      >
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PAID">PAID</option>
                        <option value="PREPARING">PREPARING</option>
                        <option value="READY">READY</option>
                        <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer, Date & Items Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="font-semibold text-[var(--foreground-muted)] uppercase tracking-wider block text-[10px]">
                        Customer Details
                      </span>
                      <p className="font-bold text-sm text-[var(--foreground)]">{o.customerName}</p>
                      <p className="text-[var(--foreground-muted)]">📞 {o.customerPhone}</p>
                      {o.deliveryAddress && (
                        <p className="text-[var(--foreground-muted)] line-clamp-2">
                          📍 {o.deliveryAddress}
                        </p>
                      )}
                      {o.specialInstructions && (
                        <p className="text-amber-700 bg-amber-50 p-1.5 rounded-md mt-1 border border-amber-200">
                          📝 {o.specialInstructions}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <span className="font-semibold text-[var(--foreground-muted)] uppercase tracking-wider block text-[10px]">
                        Fulfillment Schedule
                      </span>
                      <p className="font-semibold text-[var(--foreground)]">
                        📅 {new Date(o.deliveryDate).toLocaleDateString("en-IN", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-[var(--foreground-muted)]">
                        ⏰ Slot: {o.deliveryTimeSlot || "Not specified"}
                      </p>
                      <div className="pt-2">
                        <label className="block text-[10px] font-semibold text-[var(--foreground-muted)] mb-1">
                          Assign Kitchen Staff:
                        </label>
                        <select
                          value={o.assignedStaffId || ""}
                          onChange={(e) => handleReassignStaff(o.id, e.target.value)}
                          className="w-full py-1.5 px-2 text-xs rounded-lg border border-[var(--surface-border)] bg-[var(--surface-alt)] font-semibold"
                        >
                          <option value="">Unassigned Queue</option>
                          {staff.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name} ({s.role} - {s.dutyStatus === "ON_DUTY" ? "🟢 On Duty" : "⚪ Off Duty"})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2 bg-[var(--surface-alt)] p-3 rounded-xl border border-[var(--surface-border)]">
                      <span className="font-semibold text-[var(--foreground-muted)] uppercase tracking-wider block text-[10px]">
                        Order Items ({o.items?.length || 0})
                      </span>
                      <ul className="space-y-1.5 max-h-32 overflow-y-auto">
                        {o.items?.map((item, idx) => (
                          <li key={idx} className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-[var(--foreground)]">
                                {item.productName} ({item.quantity}x)
                              </p>
                              <p className="text-[10px] text-[var(--foreground-muted)]">
                                {item.size} &bull; {item.flavour}
                                {item.cakeMessage ? ` &bull; "${item.cakeMessage}"` : ""}
                              </p>
                            </div>
                            <span className="font-bold text-[var(--foreground)]">
                              ₹{item.totalPrice}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <div className="border-t border-[var(--surface-border)] pt-2 flex justify-between font-bold text-sm text-[var(--primary)]">
                        <span>Total Paid:</span>
                        <span>₹{o.totalAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- TAB: PRODUCTS --- */}
      {activeTab === "products" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--foreground-muted)] font-semibold">Filter:</span>
              <select
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
                className="py-1.5 px-3 text-xs rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--foreground)]"
              >
                <option value="all">All Categories</option>
                <option value="cakes">Cakes</option>
                <option value="desserts">Desserts</option>
                <option value="bakery">Bakery</option>
                <option value="celebrations">Celebrations</option>
              </select>
            </div>

            <button
              onClick={() => {
                setEditingProduct({
                  name: "",
                  category: "cakes",
                  startingPrice: 650,
                  eggless: true,
                  featured: false,
                  availableToday: true,
                  flavours: ["Belgian Chocolate", "Vanilla Bean"],
                  sizes: ["500 g", "1 kg"],
                });
                setProductModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold shadow-xs hover:bg-[var(--primary-hover)] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-[var(--surface)] rounded-2xl border border-[var(--surface-border)] p-4 space-y-3 shadow-xs"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden bg-[var(--surface-alt)] border border-[var(--surface-border)]">
                  {p.images?.[0] ? (
                    <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-[var(--foreground-muted)]">
                      No Image
                    </div>
                  )}
                  {p.eggless && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                      100% Eggless
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--primary)]">
                      {p.category}
                    </span>
                    <span className="font-bold text-sm text-[var(--foreground)]">
                      {p.startingPrice ? `₹${p.startingPrice}` : "Enquiry"}
                    </span>
                  </div>
                  <h3 className="font-serif text-base font-bold text-[var(--foreground)] line-clamp-1 mt-0.5">
                    {p.name}
                  </h3>
                  <p className="text-xs text-[var(--foreground-muted)] line-clamp-2 mt-1">
                    {p.description}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--surface-border)]">
                  <button
                    onClick={() => {
                      setEditingProduct(p);
                      setProductModalOpen(true);
                    }}
                    className="p-2 rounded-lg text-xs font-semibold text-[var(--foreground-muted)] hover:bg-[var(--surface-alt)] hover:text-[var(--foreground)] transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="p-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB: CUSTOM CAKES --- */}
      {activeTab === "custom-cakes" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-[var(--foreground)]">
              Custom Cake Design Enquiries ({customRequests.length})
            </h2>
            <span className="text-xs text-[var(--foreground-muted)]">
              Direct enquiries with customer reference images
            </span>
          </div>

          {customRequests.length === 0 ? (
            <div className="text-center py-16 bg-[var(--surface)] rounded-2xl border border-[var(--surface-border)]">
              <Calendar className="w-10 h-10 text-[var(--foreground-muted)] mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold text-[var(--foreground)]">No custom cake requests</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {customRequests.map((cr) => (
                <div
                  key={cr.id}
                  className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--surface-border)] shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--surface-border)]">
                    <div>
                      <span className="font-mono text-xs font-bold text-[var(--primary)]">
                        {cr.id}
                      </span>
                      <h3 className="font-serif text-base font-bold text-[var(--foreground)]">
                        {cr.customerName} &bull; {cr.occasion}
                      </h3>
                    </div>
                    <select
                      value={cr.status}
                      onChange={(e) =>
                        handleUpdateCustomStatus(cr.id, e.target.value as CustomRequestStatus)
                      }
                      className="py-1 px-2.5 text-xs font-semibold rounded-lg border border-[var(--surface-border)] bg-[var(--surface-alt)]"
                    >
                      <option value="New">New</option>
                      <option value="Reviewing">Reviewing</option>
                      <option value="Quoted">Quoted</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[var(--foreground-muted)]">Phone:</span>
                      <p className="font-bold">{cr.phone}</p>
                    </div>
                    <div>
                      <span className="text-[var(--foreground-muted)]">Flavour & Size:</span>
                      <p className="font-bold">
                        {cr.flavour} &bull; {cr.size}
                      </p>
                    </div>
                    <div>
                      <span className="text-[var(--foreground-muted)]">Delivery Date:</span>
                      <p className="font-bold">{cr.deliveryDate || "Not chosen"}</p>
                    </div>
                    <div>
                      <span className="text-[var(--foreground-muted)]">Eggless:</span>
                      <p className="font-bold">{cr.eggless ? "Yes (100% Eggless)" : "Regular"}</p>
                    </div>
                  </div>

                  {cr.message && (
                    <div className="text-xs bg-[var(--surface-alt)] p-2.5 rounded-xl border border-[var(--surface-border)]">
                      <span className="text-[var(--foreground-muted)] block text-[10px]">
                        Message on Cake:
                      </span>
                      <span className="font-serif italic text-[var(--foreground)]">
                        &ldquo;{cr.message}&rdquo;
                      </span>
                    </div>
                  )}

                  {cr.referenceImage && (
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-[var(--surface-border)]">
                      <Image
                        src={cr.referenceImage}
                        alt="Customer Reference"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- TAB: CUSTOMERS --- */}
      {activeTab === "customers" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold text-[var(--foreground)]">
                Customer Directory ({customersList.length})
              </h2>
              <p className="text-xs text-[var(--foreground-muted)]">
                Aggregated patron records and repeat order history
              </p>
            </div>
          </div>

          <div className="bg-[var(--surface)] rounded-2xl border border-[var(--surface-border)] overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--surface-alt)] text-[var(--foreground-muted)] border-b border-[var(--surface-border)]">
                <tr>
                  <th className="p-3.5 font-semibold">Customer</th>
                  <th className="p-3.5 font-semibold">Mobile</th>
                  <th className="p-3.5 font-semibold">Orders Placed</th>
                  <th className="p-3.5 font-semibold">Total Lifetime Spend</th>
                  <th className="p-3.5 font-semibold">Last Ordered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--surface-border)]">
                {customersList.map((c, i) => (
                  <tr key={i} className="hover:bg-[var(--surface-alt)] transition-colors">
                    <td className="p-3.5 font-bold text-[var(--foreground)]">{c.name}</td>
                    <td className="p-3.5 font-mono text-[var(--foreground-muted)]">{c.phone}</td>
                    <td className="p-3.5 font-semibold">{c.totalOrders} order(s)</td>
                    <td className="p-3.5 font-bold text-[var(--primary)]">
                      ₹{c.totalSpent.toLocaleString("en-IN")}
                    </td>
                    <td className="p-3.5 text-[var(--foreground-muted)]">
                      {new Date(c.lastOrderDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB: STAFF --- */}
      {activeTab === "staff" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold text-[var(--foreground)]">
                Kitchen & Dispatch Staff ({staff.length})
              </h2>
              <p className="text-xs text-[var(--foreground-muted)]">
                Manage shifts, roles, and automated workload assignment
              </p>
            </div>
            <button
              onClick={() => setStaffModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Staff Member</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {staff.map((s) => (
              <div
                key={s.id}
                className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--surface-border)] shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[var(--surface-alt)] text-[var(--foreground-muted)]">
                    {s.role}
                  </span>
                  <button
                    onClick={() => handleToggleDuty(s)}
                    className={`text-xs font-bold px-3 py-1 rounded-xl transition-colors ${
                      s.dutyStatus === "ON_DUTY"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-gray-100 text-gray-500 border border-gray-200"
                    }`}
                  >
                    {s.dutyStatus === "ON_DUTY" ? "🟢 ON DUTY" : "⚪ OFF DUTY"}
                  </button>
                </div>

                <div>
                  <h3 className="font-serif text-base font-bold text-[var(--foreground)]">
                    {s.name}
                  </h3>
                  <p className="text-xs text-[var(--foreground-muted)]">📞 {s.phone}</p>
                </div>

                <div className="pt-3 border-t border-[var(--surface-border)] flex items-center justify-between text-xs">
                  <span className="text-[var(--foreground-muted)]">Active Orders Assigned:</span>
                  <span className="font-bold text-[var(--primary)]">
                    {s.activeOrderCount || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB: SETTINGS --- */}
      {activeTab === "settings" && settings && (
        <div className="max-w-2xl bg-[var(--surface)] p-6 sm:p-8 rounded-3xl border border-[var(--surface-border)] shadow-xs space-y-6">
          <div>
            <h2 className="font-serif text-xl font-bold text-[var(--foreground)]">
              Store Configuration
            </h2>
            <p className="text-xs text-[var(--foreground-muted)]">
              Configure Rajahmundry bakery operating rules, fees, and order acceptance
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Business Name</label>
                <input
                  type="text"
                  value={settings.businessName}
                  onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-alt)] font-semibold"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Tagline</label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-alt)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Store Contact Phone</label>
                <input
                  type="text"
                  value={settings.phone || ""}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-alt)]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Official WhatsApp Number</label>
                <input
                  type="text"
                  value={settings.whatsapp || ""}
                  onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-alt)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold mb-1">Delivery Charge (₹)</label>
                <input
                  type="number"
                  value={settings.deliveryCharge}
                  onChange={(e) =>
                    setSettings({ ...settings, deliveryCharge: Number(e.target.value) })
                  }
                  className="w-full p-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-alt)]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Free Delivery Above (₹)</label>
                <input
                  type="number"
                  value={settings.freeDeliveryThreshold || 1500}
                  onChange={(e) =>
                    setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })
                  }
                  className="w-full p-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-alt)]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Min Prep Time (Hours)</label>
                <input
                  type="number"
                  value={settings.minPreparationHours}
                  onChange={(e) =>
                    setSettings({ ...settings, minPreparationHours: Number(e.target.value) })
                  }
                  className="w-full p-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-alt)]"
                />
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-[var(--surface-border)]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.acceptingOrders}
                  onChange={(e) =>
                    setSettings({ ...settings, acceptingOrders: e.target.checked })
                  }
                  className="rounded text-[var(--primary)] focus:ring-[var(--primary)]"
                />
                <span className="font-semibold text-[var(--foreground)]">
                  Accept Customer Orders Online (Store Live)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.customOrdersEnabled}
                  onChange={(e) =>
                    setSettings({ ...settings, customOrdersEnabled: e.target.checked })
                  }
                  className="rounded text-[var(--primary)] focus:ring-[var(--primary)]"
                />
                <span className="font-semibold text-[var(--foreground)]">
                  Enable Custom Designer Cake Enquiries
                </span>
              </label>
            </div>

            {settingsSuccess && (
              <p className="text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                ✓ Store settings successfully updated!
              </p>
            )}

            <button
              type="submit"
              disabled={savingSettings}
              className="py-3 px-6 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] font-bold shadow-xs hover:bg-[var(--primary-hover)] transition-colors"
            >
              {savingSettings ? "Saving Settings…" : "Save Store Configuration"}
            </button>
          </form>
        </div>
      )}

      {/* --- TAB: AUTOMATION LOGS --- */}
      {activeTab === "automation-logs" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold text-[var(--foreground)]">
                Automation Event Stream ({automationLogs.length})
              </h2>
              <p className="text-xs text-[var(--foreground-muted)]">
                Audit trail for WhatsApp notices, Google Sheets sync, and order dispatch
              </p>
            </div>
          </div>

          {automationLogs.length === 0 ? (
            <div className="text-center py-16 bg-[var(--surface)] rounded-2xl border border-[var(--surface-border)]">
              <Activity className="w-10 h-10 text-[var(--foreground-muted)] mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold text-[var(--foreground)]">No automation events yet</p>
              <p className="text-xs text-[var(--foreground-muted)] mt-1">
                Events will log here automatically when orders are placed or updated.
              </p>
            </div>
          ) : (
            <div className="bg-[var(--surface)] rounded-2xl border border-[var(--surface-border)] overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--surface-alt)] text-[var(--foreground-muted)] border-b border-[var(--surface-border)]">
                  <tr>
                    <th className="p-3 font-semibold">Timestamp</th>
                    <th className="p-3 font-semibold">Event</th>
                    <th className="p-3 font-semibold">Channel</th>
                    <th className="p-3 font-semibold">Recipient</th>
                    <th className="p-3 font-semibold">Status</th>
                    <th className="p-3 font-semibold">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--surface-border)]">
                  {automationLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[var(--surface-alt)] transition-colors">
                      <td className="p-3 font-mono text-[11px] text-[var(--foreground-muted)]">
                        {new Date(log.timestamp).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                      <td className="p-3 font-bold text-[var(--foreground)]">{log.event}</td>
                      <td className="p-3 font-semibold">
                        <span className="px-2 py-0.5 rounded-md bg-[var(--surface-alt)] border border-[var(--surface-border)] text-[10px]">
                          {log.channel}
                        </span>
                      </td>
                      <td className="p-3 text-[var(--foreground-muted)]">{log.recipient}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            log.status === "SENT"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : log.status === "READY_TO_CONNECT"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-red-50 text-red-600 border border-red-200"
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="p-3 text-[11px] text-[var(--foreground-muted)] max-w-xs truncate">
                        {log.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* --- TAB: GALLERY --- */}
      {activeTab === "gallery" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-[var(--foreground)]">
              Bakery Photo Gallery ({gallery.length})
            </h2>
            <button
              onClick={() => setGalleryModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Gallery</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.map((g) => (
              <div
                key={g.id}
                className="group relative aspect-square rounded-2xl overflow-hidden border border-[var(--surface-border)] bg-[var(--surface-alt)]"
              >
                <Image src={g.image} alt={g.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                  <p className="text-white text-xs font-bold line-clamp-1">{g.title}</p>
                  <p className="text-white/80 text-[10px]">{g.category}</p>
                  <button
                    onClick={() => handleDeleteGallery(g.id)}
                    className="mt-2 self-end p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- MODAL: PRODUCT ADD / EDIT --- */}
      {productModalOpen && editingProduct && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="w-full max-w-lg bg-[var(--surface)] rounded-3xl p-6 sm:p-8 border border-[var(--surface-border)] shadow-2xl space-y-4 my-8">
            <h3 className="font-serif text-xl font-bold text-[var(--foreground)]">
              {editingProduct.id ? "Edit Cake Product" : "Add New Cake Product"}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-alt)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Category *</label>
                  <select
                    value={editingProduct.category || "classic"}
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

                <div>
                  <label className="block font-semibold mb-1">Starting Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.startingPrice || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        startingPrice: Number(e.target.value),
                      })
                    }
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
                      : ""
                  }
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      flavours: e.target.value.split(",").map((s) => s.trim()),
                    })
                  }
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
                      : ""
                  }
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      sizes: e.target.value.split(",").map((s) => s.trim()),
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-alt)]"
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.eggless ?? true}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, eggless: e.target.checked })
                    }
                  />
                  <span>100% Eggless Option</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.featured ?? false}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, featured: e.target.checked })
                    }
                  />
                  <span>Featured Product</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.availableToday ?? true}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, availableToday: e.target.checked })
                    }
                  />
                  <span>Available Today</span>
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
                  className="px-6 py-2 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold shadow-xs"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: GALLERY ADD --- */}
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
                  placeholder="e.g. Elegant Floral Wedding Cake"
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

      {/* --- MODAL: STAFF ADD --- */}
      {staffModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="w-full max-w-md bg-[var(--surface)] rounded-3xl p-6 sm:p-8 border border-[var(--surface-border)] shadow-2xl space-y-4">
            <h3 className="font-serif text-xl font-bold text-[var(--foreground)]">
              Add Kitchen / Dispatch Staff
            </h3>

            <form onSubmit={handleAddStaff} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Baker Ramesh"
                  value={newStaff.name || ""}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-alt)]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Mobile Number *</label>
                <input
                  type="text"
                  required
                  placeholder="9848011111"
                  value={newStaff.phone || ""}
                  onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-alt)]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Role *</label>
                <select
                  value={newStaff.role || "BAKER"}
                  onChange={(e) =>
                    setNewStaff({
                      ...newStaff,
                      role: e.target.value as StaffMember["role"],
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-alt)]"
                >
                  <option value="BAKER">BAKER</option>
                  <option value="DECORATOR">DECORATOR</option>
                  <option value="PACKER">PACKER</option>
                  <option value="DISPATCHER">DISPATCHER</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[var(--surface-border)]">
                <button
                  type="button"
                  onClick={() => setStaffModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--surface-border)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold"
                >
                  Add Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
