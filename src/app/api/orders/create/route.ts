import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { OrderStatusType, DeliveryMethod } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerPhone,
      deliveryType,
      deliveryAddress,
      landmark,
      deliveryDate,
      deliveryTimeSlot,
      specialInstructions,
      items,
      paymentMethod,
    } = body;

    // 1. Validation
    if (!customerName || customerName.trim().length < 2) {
      return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
    }
    const cleanPhone = (customerPhone || "").replace(/[^0-9]/g, "");
    if (cleanPhone.length < 10) {
      return NextResponse.json({ error: "Please enter a valid 10-digit phone number." }, { status: 400 });
    }
    if (!deliveryDate) {
      return NextResponse.json({ error: "Please select a required delivery or pickup date." }, { status: 400 });
    }
    if (deliveryType === "DELIVERY" && (!deliveryAddress || deliveryAddress.trim().length < 5)) {
      return NextResponse.json(
        { error: "Please provide a complete delivery address in Rajahmundry." },
        { status: 400 }
      );
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty. Please add items to order." }, { status: 400 });
    }

    // 2. Server-side Price Verification (never trust client total)
    const settings = store.getSettings();
    const allProducts = store.getProducts();

    let subtotal = 0;
    const validatedItems = items.map((item: {
      productId: string;
      name?: string;
      productName?: string;
      flavour?: string;
      size?: string;
      eggless?: boolean;
      cakeMessage?: string;
      unitPrice?: number;
      quantity?: number;
    }) => {
      const product = allProducts.find((p) => p.id === item.productId || p.slug === item.productId);
      const qty = Math.max(1, Number(item.quantity) || 1);

      // Verify unit price from database or fallback to safe size pricing
      let verifiedUnitPrice = product?.startingPrice || 650;
      if (item.size?.includes("500")) verifiedUnitPrice = 450;
      else if (item.size?.includes("1.5")) verifiedUnitPrice = 1250;
      else if (item.size?.includes("2")) verifiedUnitPrice = 1600;
      else if (product?.startingPrice) verifiedUnitPrice = Number(product.startingPrice);

      const totalPrice = verifiedUnitPrice * qty;
      subtotal += totalPrice;

      return {
        id: `item_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        productId: product?.id || item.productId,
        productName: product?.name || item.productName || item.name || "Celebration Cake",
        flavour: item.flavour || "Classic",
        size: item.size || "1 kg",
        eggless: item.eggless !== undefined ? Boolean(item.eggless) : true,
        cakeMessage: item.cakeMessage ? item.cakeMessage.trim() : null,
        unitPrice: verifiedUnitPrice,
        quantity: qty,
        totalPrice,
      };
    });

    const isPickup = (deliveryType as DeliveryMethod) === "PICKUP";
    const isFree = subtotal >= (settings.freeDeliveryThreshold ?? 1500);
    const deliveryFee = isPickup ? 0 : isFree ? 0 : (settings.deliveryCharge ?? 50);
    const discount = 0;
    const totalAmount = subtotal + deliveryFee - discount;

    // 3. Payment Status Resolution
    // In production without gateway keys, safe mock payment confirms order for demonstration.
    const initialStatus: OrderStatusType = paymentMethod === "DEMO_TEST_PAYMENT" ? "PAID" : "CONFIRMED";

    // 4. Create Order
    const newOrder = store.createOrder({
      customerName: customerName.trim(),
      customerPhone: cleanPhone,
      status: initialStatus,
      deliveryType: isPickup ? "PICKUP" : "DELIVERY",
      deliveryAddress: isPickup ? "In-Store Counter Pickup, Rajahmundry" : `${deliveryAddress}${landmark ? ` (Near ${landmark})` : ""}`,
      landmark: landmark ? landmark.trim() : null,
      deliveryDate: new Date(deliveryDate).toISOString(),
      deliveryTimeSlot: deliveryTimeSlot || "05:00 PM - 07:00 PM",
      specialInstructions: specialInstructions ? specialInstructions.trim() : null,
      subtotal,
      deliveryFee,
      discount,
      totalAmount,
      items: validatedItems,
    });

    return NextResponse.json({
      success: true,
      order: {
        id: newOrder.id,
        orderNumber: newOrder.orderNumber,
        status: newOrder.status,
        totalAmount: newOrder.totalAmount,
        customerName: newOrder.customerName,
        customerPhone: newOrder.customerPhone,
      },
    });
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json(
      { error: "Internal server error occurred while processing order." },
      { status: 500 }
    );
  }
}
