"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Package,
  CheckCircle2,
  Clock,
  LogIn,
  LogOut,
  RefreshCw,
  ChevronDown,
  User,
  Cake,
  Lock,
} from "lucide-react";
import { OrderRecord, StaffMember, CustomCakeRequest } from "@/types";

const ORDER_STATUSES = [
  "CONFIRMED",
  "PAID",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
] as const;

const STATUS_LABEL: Record<string, string> = {
  CONFIRMED: "Confirmed",
  PAID: "Paid",
  PREPARING: "Baking",
  READY: "Ready",
  OUT_FOR_DELIVERY: "Dispatched",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  PENDING: "Pending",
};

const STATUS_COLOR: Record<string, string> = {
  CONFIRMED: "bg-blue-100 text-blue-700",
  PAID: "bg-green-100 text-green-700",
  PREPARING: "bg-orange-100 text-orange-700",
  READY: "bg-teal-100 text-teal-700",
  OUT_FOR_DELIVERY: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-gray-100 text-gray-600",
  CANCELLED: "bg-red-100 text-red-600",
  PENDING: "bg-yellow-100 text-yellow-700",
};

function formatDate(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getTodayOrders(orders: OrderRecord[]): OrderRecord[] {
  const today = new Date().toDateString();
  return orders.filter(
    (o) =>
      new Date(o.createdAt).toDateString() === today ||
      new Date(o.deliveryDate).toDateString() === today
  );
}

function getMyOrders(orders: OrderRecord[], staffId: string): OrderRecord[] {
  return orders
    .filter((o) => o.assignedStaffId === staffId)
    .filter((o) => !["DELIVERED", "CANCELLED"].includes(o.status));
}

export default function StaffDashboard() {
  const [pin, setPin] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [staffId, setStaffId] = useState("");

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [customRequests, setCustomRequests] = useState<CustomCakeRequest[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [activeTab, setActiveTab] = useState<"my" | "today" | "custom">("my");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [ordersRes, customRes, staffRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/custom-requests"),
        fetch("/api/staff"),
      ]);

      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setOrders(Array.isArray(data) ? data : []);
      }
      if (customRes.ok) setCustomRequests(await customRes.json());
      if (staffRes.ok) setStaffList(await staffRes.json());
    } catch (err) {
      console.error("Failed to load staff data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) {
      const timer = setTimeout(() => {
        loadData();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [authed, loadData]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const expectedPin = process.env.NEXT_PUBLIC_STAFF_PIN || "1234";
    if (pin === expectedPin) {
      setAuthed(true);
      setAuthError("");
      const saved = localStorage.getItem("staff_id");
      if (saved) setStaffId(saved);
    } else {
      setAuthError("Incorrect PIN. Contact the manager.");
    }
  }

  async function toggleDuty() {
    const me = staffList.find((s) => s.id === staffId);
    if (!me) return;
    const newDuty = me.dutyStatus === "ON_DUTY" ? "OFF_DUTY" : "ON_DUTY";
    await fetch("/api/staff", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ staffId, dutyStatus: newDuty }),
    });
    loadData();
  }

  async function selectStaff(id: string) {
    setStaffId(id);
    localStorage.setItem("staff_id", id);
  }

  async function updateOrderStatus(orderId: string, status: string) {
    setUpdatingId(orderId);
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      await loadData();
    } finally {
      setUpdatingId(null);
    }
  }

  async function updateCustomStatus(id: string, status: string) {
    setUpdatingId(id);
    try {
      await fetch("/api/custom-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      await loadData();
    } finally {
      setUpdatingId(null);
    }
  }

  // --- Login Screen ---
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[var(--primary)] flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-[var(--foreground)]">
              Staff Dashboard
            </h1>
            <p className="text-xs text-[var(--foreground-muted)] mt-1">
              Cake Magic — Rajahmundry
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="bg-[var(--surface)] rounded-2xl border border-[var(--surface-border)] p-6 space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold text-[var(--foreground-muted)] mb-1.5">
                Staff PIN
              </label>
              <input
                type="password"
                inputMode="numeric"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter your PIN"
                className="w-full text-sm p-3 rounded-xl border border-[var(--surface-border)] bg-[var(--background)] text-[var(--foreground)] text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
            {authError && (
              <p className="text-xs text-red-600 text-center">{authError}</p>
            )}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] font-bold text-sm hover:bg-[var(--primary-hover)] transition-colors"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- Staff Selector (if staffId not set) ---
  if (!staffId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
        <div className="w-full max-w-sm space-y-4">
          <h2 className="font-serif text-xl font-bold text-[var(--foreground)] text-center">
            Who are you?
          </h2>
          <p className="text-xs text-[var(--foreground-muted)] text-center">
            Select your name to view your assigned orders
          </p>
          <div className="space-y-2">
            {staffList.map((s) => (
              <button
                key={s.id}
                onClick={() => selectStaff(s.id)}
                className="w-full flex items-center gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--surface-border)] hover:border-[var(--primary)] transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-[var(--accent-blush-light)] flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-[var(--primary)]" />
                </div>
                <div>
                  <p className="font-bold text-sm text-[var(--foreground)]">{s.name}</p>
                  <p className="text-xs text-[var(--foreground-muted)]">{s.role}</p>
                </div>
                <span
                  className={`ml-auto text-[10px] font-bold px-2 py-1 rounded-lg ${
                    s.dutyStatus === "ON_DUTY"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {s.dutyStatus === "ON_DUTY" ? "ON DUTY" : "OFF DUTY"}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const me = staffList.find((s) => s.id === staffId);
  const myOrders = getMyOrders(orders, staffId);
  const todayOrders = getTodayOrders(orders);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="bg-[var(--surface)] border-b border-[var(--surface-border)] sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--foreground-muted)]">Staff Dashboard</p>
            <h1 className="font-bold text-[var(--foreground)] text-sm">{me?.name || "Staff"}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 rounded-xl hover:bg-[var(--surface-alt)] text-[var(--foreground-muted)] transition-colors"
              aria-label="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={toggleDuty}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                me?.dutyStatus === "ON_DUTY"
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {me?.dutyStatus === "ON_DUTY" ? (
                <>
                  <LogOut className="w-3.5 h-3.5" /> Go Off Duty
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5" /> Go On Duty
                </>
              )}
            </button>
            <button
              onClick={() => {
                setStaffId("");
                setAuthed(false);
              }}
              className="p-2 rounded-xl hover:bg-[var(--surface-alt)] text-[var(--foreground-muted)] text-xs transition-colors"
              aria-label="Sign out"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex gap-1 pb-2 overflow-x-auto">
          {(
            [
              { key: "my", label: `My Orders (${myOrders.length})`, icon: Package },
              { key: "today", label: `Today (${todayOrders.length})`, icon: Clock },
              { key: "custom", label: `Custom (${customRequests.filter((c) => c.status !== "Completed" && c.status !== "Cancelled").length})`, icon: Cake },
            ] as const
          ).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                activeTab === key
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "text-[var(--foreground-muted)] hover:bg-[var(--surface-alt)]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        {loading && (
          <div className="text-center py-12 text-[var(--foreground-muted)] text-sm">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
            Loading orders…
          </div>
        )}

        {/* My Orders / Today's Orders */}
        {(activeTab === "my" || activeTab === "today") && !loading && (
          <div className="space-y-3">
            {(activeTab === "my" ? myOrders : todayOrders).length === 0 ? (
              <div className="text-center py-16">
                <CheckCircle2 className="w-12 h-12 text-[var(--foreground-muted)] mx-auto mb-3" />
                <p className="text-[var(--foreground-muted)] text-sm">
                  {activeTab === "my" ? "No active orders assigned to you." : "No orders for today."}
                </p>
              </div>
            ) : (
              (activeTab === "my" ? myOrders : todayOrders).map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onStatusChange={updateOrderStatus}
                  updating={updatingId === order.id}
                />
              ))
            )}
          </div>
        )}

        {/* Custom Requests */}
        {activeTab === "custom" && !loading && (
          <div className="space-y-3">
            {customRequests.length === 0 ? (
              <div className="text-center py-16">
                <Cake className="w-12 h-12 text-[var(--foreground-muted)] mx-auto mb-3" />
                <p className="text-[var(--foreground-muted)] text-sm">No custom cake requests yet.</p>
              </div>
            ) : (
              customRequests.map((cr) => (
                <CustomRequestCard
                  key={cr.id}
                  request={cr}
                  onStatusChange={updateCustomStatus}
                  updating={updatingId === cr.id}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function OrderCard({
  order,
  onStatusChange,
  updating,
}: {
  order: OrderRecord;
  onStatusChange: (id: string, status: string) => void;
  updating: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[var(--surface)] rounded-2xl border border-[var(--surface-border)] overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-[var(--surface-alt)] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[var(--primary)]">
                {order.id}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${STATUS_COLOR[order.status] || "bg-gray-100 text-gray-600"}`}
              >
                {STATUS_LABEL[order.status] || order.status}
              </span>
            </div>
            <p className="text-sm font-bold text-[var(--foreground)] mt-0.5">
              {order.customerName}
            </p>
            <p className="text-xs text-[var(--foreground-muted)]">
              {order.items.length} item{order.items.length > 1 ? "s" : ""} · ₹{order.totalAmount} ·{" "}
              {order.deliveryType === "PICKUP" ? "Pickup" : "Delivery"} ·{" "}
              {formatDate(order.deliveryDate)}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-[var(--foreground-muted)] transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="border-t border-[var(--surface-border)] p-4 space-y-3">
          {/* Items */}
          <div className="space-y-1.5">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-xs">
                <span className="text-[var(--foreground)]">
                  {item.productName} — {item.size}, {item.flavour}
                  {item.eggless ? " · Eggless" : ""}
                  {item.quantity > 1 ? ` ×${item.quantity}` : ""}
                </span>
                <span className="font-semibold text-[var(--foreground)] ml-2">
                  ₹{item.totalPrice}
                </span>
              </div>
            ))}
          </div>

          {/* Customer & Delivery */}
          <div className="text-xs text-[var(--foreground-muted)] space-y-1 border-t border-[var(--surface-border)] pt-3">
            <p>📞 {order.customerPhone}</p>
            {order.deliveryAddress && <p>📍 {order.deliveryAddress}</p>}
            {order.deliveryTimeSlot && <p>🕐 {order.deliveryTimeSlot}</p>}
            {order.specialInstructions && <p>📝 {order.specialInstructions}</p>}
            <p className="text-[10px] opacity-60">
              Ordered at {formatTime(order.createdAt)} on {formatDate(order.createdAt)}
            </p>
          </div>

          {/* Status Update */}
          <div className="flex flex-wrap gap-2 border-t border-[var(--surface-border)] pt-3">
            {ORDER_STATUSES.filter((s) => s !== order.status).map((status) => (
              <button
                key={status}
                onClick={() => onStatusChange(order.id, status)}
                disabled={updating}
                className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${STATUS_COLOR[status] || "bg-gray-100 text-gray-600 border-gray-200"} border-current/30`}
              >
                {updating ? "…" : `→ ${STATUS_LABEL[status]}`}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CustomRequestCard({
  request,
  onStatusChange,
  updating,
}: {
  request: CustomCakeRequest;
  onStatusChange: (id: string, status: string) => void;
  updating: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[var(--surface)] rounded-2xl border border-[var(--surface-border)] overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-[var(--surface-alt)] transition-colors"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[var(--accent)]">
              {request.id}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-orange-100 text-orange-700">
              {request.status}
            </span>
          </div>
          <p className="text-sm font-bold text-[var(--foreground)] mt-0.5">
            {request.customerName} — {request.occasion}
          </p>
          <p className="text-xs text-[var(--foreground-muted)]">
            {request.size} · {request.flavour} · {formatDate(request.deliveryDate)}
          </p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-[var(--foreground-muted)] transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="border-t border-[var(--surface-border)] p-4 space-y-3">
          <div className="text-xs text-[var(--foreground-muted)] space-y-1">
            <p>📞 {request.phone}</p>
            <p>🎂 {request.occasion} · {request.eggless ? "Eggless" : "Egg"}</p>
            {request.message && <p>✍️ Message: &ldquo;{request.message}&rdquo;</p>}
            {request.notes && <p>📝 {request.notes}</p>}
            {request.deliveryType && <p>🚚 {request.deliveryType}</p>}
            {request.address && <p>📍 {request.address}</p>}
          </div>

          <div className="flex flex-wrap gap-2 border-t border-[var(--surface-border)] pt-3">
            {["Pending", "Confirmed", "In Progress", "Completed", "Cancelled"].filter(
              (s) => s !== request.status
            ).map((status) => (
              <button
                key={status}
                onClick={() => onStatusChange(request.id, status)}
                disabled={updating}
                className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-[var(--surface-alt)] border border-[var(--surface-border)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] hover:border-[var(--primary)] transition-colors disabled:opacity-50"
              >
                {updating ? "…" : `→ ${status}`}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
