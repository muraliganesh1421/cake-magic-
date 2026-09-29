/**
 * Comprehensive Order Pipeline and Business Info Verification Script
 */

import { store } from "../src/lib/store";
import { siteConfig } from "../src/config/site";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

console.log("\n=======================================================");
console.log("🍰 CAKE MAGIC RAJAHMUNDRY — ORDER PIPELINE TEST SUITE");
console.log("=======================================================\n");

// 1. Verify Real Business Details
console.log("1. Verifying Real Business Details...");
const settings = store.getSettings();
assert(settings.businessName === "Cake Magic", "Business name is Cake Magic");
assert(
  settings.address.includes("Jawaharlal Nehru Road") && settings.address.includes("Prakasam Nagar"),
  `Address contains verified location: ${settings.address}`
);
assert(
  settings.phone.includes("73580 84648"),
  `Primary phone matches verified number: ${settings.phone}`
);
assert(
  siteConfig.instagramHandle === "@cakemagic_rjy_official",
  `Instagram handle is ${siteConfig.instagramHandle}`
);

// 2. Test Order Creation
console.log("\n2. Testing Order Creation Pipeline...");
const orderPayload = {
  customerName: "Ramesh Babu",
  customerPhone: "9848181144",
  status: "CONFIRMED" as const,
  deliveryType: "DELIVERY" as const,
  deliveryAddress: "Near Abhaya Clinic, Srinivas Nagar, Rajahmundry",
  deliveryDate: new Date(Date.now() + 86400000).toISOString(),
  deliveryTimeSlot: "Evening (5 PM – 7 PM)",
  specialInstructions: "Please write 'Happy 50th Birthday Dad'",
  subtotal: 1250,
  deliveryFee: 50,
  discount: 0,
  totalAmount: 1300,
  items: [
    {
      id: "item-e2e-1",
      productName: "Belgian Chocolate Truffle Cake",
      flavour: "Belgian Dark Chocolate",
      size: "1.5 kg",
      eggless: true,
      cakeMessage: "Happy 50th Birthday Dad",
      unitPrice: 1250,
      quantity: 1,
      totalPrice: 1250,
    },
  ],
};

const createdOrder = store.createOrder(orderPayload);
assert(Boolean(createdOrder.id), `Order created with ID: ${createdOrder.id}`);
assert(
  createdOrder.orderNumber.startsWith("CM-"),
  `Order number matches format: ${createdOrder.orderNumber}`
);

// 3. Test Retrieval in Orders List (Admin View)
console.log("\n3. Testing Admin Orders Listing...");
const allOrders = store.getOrders();
const foundInList = allOrders.find((o) => o.orderNumber === createdOrder.orderNumber);
assert(Boolean(foundInList), `Created order ${createdOrder.orderNumber} appears in Admin Orders list`);
assert(
  foundInList?.customerName === "Ramesh Babu",
  `Customer name matches: ${foundInList?.customerName}`
);

// 4. Test Lookup by Order Number / ID (Customer Track View)
console.log("\n4. Testing Order Tracking Lookup...");
const trackedOrder = store.getOrderById(createdOrder.orderNumber);
assert(Boolean(trackedOrder), `Order retrieved by orderNumber: ${trackedOrder?.orderNumber}`);
assert(
  trackedOrder?.items[0].productName === "Belgian Chocolate Truffle Cake",
  `Items preserved in order record: ${trackedOrder?.items[0].productName}`
);

// 5. Test Status Update Progression (Kitchen / Admin Flow)
console.log("\n5. Testing Kitchen / Admin Status Transitions...");
const updatedPreparing = store.updateOrderStatus(createdOrder.id, "PREPARING");
assert(updatedPreparing?.status === "PREPARING", "Status transitioned to PREPARING");

const updatedReady = store.updateOrderStatus(createdOrder.id, "READY");
assert(updatedReady?.status === "READY", "Status transitioned to READY");

const updatedOut = store.updateOrderStatus(createdOrder.id, "OUT_FOR_DELIVERY");
assert(updatedOut?.status === "OUT_FOR_DELIVERY", "Status transitioned to OUT_FOR_DELIVERY");

const updatedDelivered = store.updateOrderStatus(createdOrder.id, "DELIVERED");
assert(updatedDelivered?.status === "DELIVERED", "Status transitioned to DELIVERED");

// Final verification
const finalCheck = store.getOrderById(createdOrder.id);
assert(finalCheck?.status === "DELIVERED", "Final status persists as DELIVERED");

console.log("\n=======================================================");
console.log("🎉 ALL ORDER PIPELINE & BUSINESS INFO TESTS PASSED!");
console.log("=======================================================\n");
