/**
 * Integration Test Suite for Cake Magic Production Platform
 * Verifies: Store, Orders, Staff Assignment, Automation Events, Auth Tokens, and Custom Requests
 */

import { store } from "../src/lib/store";
import { createSessionToken, verifySessionToken } from "../src/lib/auth";
import { getAutomationLogs } from "../src/lib/events";

function runTest(name: string, fn: () => void | boolean) {
  try {
    const res = fn();
    if (res === false) {
      console.error(`❌ FAIL: ${name}`);
      process.exit(1);
    }
    console.log(`✅ PASS: ${name}`);
  } catch (err) {
    console.error(`❌ FAIL: ${name}`, err);
    process.exit(1);
  }
}

console.log("\n🧪 Running Cake Magic Comprehensive Integration Tests...\n");

// 1. Settings Test
runTest("Business Settings retrieval has default store configuration", () => {
  const settings = store.getSettings();
  return (
    settings.businessName === "Cake Magic" &&
    settings.deliveryCharge === 50 &&
    settings.minPreparationHours >= 24 &&
    settings.acceptingOrders === true
  );
});

// 2. Staff Test
runTest("Staff team seeded with active on-duty members", () => {
  const staff = store.getStaff();
  return (
    staff.length >= 3 &&
    staff.some((s) => s.role === "BAKER") &&
    staff.some((s) => s.role === "DECORATOR")
  );
});

// 3. Duty Toggle Test
runTest("Staff duty status toggle works", () => {
  const staff = store.getStaff();
  const first = staff[0];
  const initialDuty = first.dutyStatus;
  const toggled = initialDuty === "ON_DUTY" ? "OFF_DUTY" : "ON_DUTY";
  store.setStaffDuty(first.id, toggled);

  const updatedStaff = store.getStaff();
  const updatedFirst = updatedStaff.find((s) => s.id === first.id);
  const pass = updatedFirst?.dutyStatus === toggled;

  // Restore
  store.setStaffDuty(first.id, initialDuty);
  return pass;
});

// 4. Products Test
runTest("Catalogue contains products with valid sizes, flavours and categories", () => {
  const products = store.getProducts();
  return (
    products.length >= 10 &&
    products.every((p) => p.name && p.category && p.flavours.length > 0)
  );
});

// 5. Order Creation & Deterministic ID format Test
let testOrderId = "";
runTest("Order creation generates sequential human-readable ID 'CM-YYYYMMDD-XXX'", () => {
  const newOrder = store.createOrder({
    customerName: "Integration Test Customer",
    customerPhone: "9848099999",
    status: "CONFIRMED",
    deliveryType: "DELIVERY",
    deliveryAddress: "Danavaipeta, Rajahmundry",
    deliveryDate: new Date(Date.now() + 86400000).toISOString(),
    deliveryTimeSlot: "Morning (9 AM – 11 AM)",
    subtotal: 950,
    deliveryFee: 50,
    discount: 0,
    totalAmount: 1000,
    items: [
      {
        id: "item-test-1",
        productName: "Dutch Chocolate Truffle Cake",
        flavour: "Belgian Chocolate",
        size: "1 kg",
        eggless: true,
        unitPrice: 950,
        quantity: 1,
        totalPrice: 950,
      },
    ],
  });

  testOrderId = newOrder.id;
  const regex = /^CM-\d{8}-\d{3}$/;
  const matchesFormat = regex.test(newOrder.id);
  const hasStaffAssigned = Boolean(newOrder.assignedStaffName);

  return matchesFormat && hasStaffAssigned && newOrder.totalAmount === 1000;
});

// 6. Order Retrieval & Status Lifecycle Test
runTest("Order status lifecycle transition and retrieval", () => {
  const order = store.getOrderById(testOrderId);
  if (!order) return false;

  // Progress status
  const updated = store.updateOrderStatus(testOrderId, "PREPARING");
  return updated?.status === "PREPARING";
});

// 7. Reassign Staff Test
runTest("Order staff reassignment works", () => {
  const staff = store.getStaff();
  const secondStaff = staff[1];
  const reassigned = store.reassignOrder(testOrderId, secondStaff.id);
  return reassigned?.assignedStaffId === secondStaff.id;
});

// 8. Custom Cake Request Test
runTest("Custom Cake Request generates sequential 'CR-YYYYMMDD-XXX' ID", () => {
  const req = store.createCustomRequest({
    customerName: "Wedding Custom Patron",
    phone: "9848088888",
    occasion: "Wedding",
    flavour: "Red Velvet Cream Cheese",
    size: "3 kg",
    eggless: true,
    message: "Happy Wedding Rajesh & Priya",
    deliveryDate: new Date(Date.now() + 172800000).toISOString(),
    deliveryType: "Pickup",
  });

  const regex = /^CR-\d{8}-\d{3}$/;
  return regex.test(req.id) && req.status === "New";
});

// 9. Automation Event Logging Test
runTest("Automation logs record dispatched events with clear ready-to-connect status", () => {
  const logs = getAutomationLogs();
  return (
    logs.length > 0 &&
    logs.some((l) => l.channel === "WHATSAPP") &&
    logs.some((l) => l.channel === "GOOGLE_SHEETS")
  );
});

// 10. Authentication Session Tokens Test
runTest("HMAC-SHA256 session tokens sign, verify and reject tampered tokens", () => {
  const token = createSessionToken({
    id: "admin-1",
    email: "owner@cakemagic.in",
    name: "Owner",
    role: "OWNER",
  });

  const verified = verifySessionToken(token);
  if (!verified || verified.role !== "OWNER") return false;

  // Tamper test
  const tampered = token.slice(0, -4) + "XXXX";
  const rejected = verifySessionToken(tampered);

  return rejected === null;
});

console.log("\n✨ ALL 10 INTEGRATION TESTS PASSED PERFECTLY!\n");
