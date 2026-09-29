import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

interface JsonProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  subcategory?: string;
  images: string[];
  flavours: string[];
  sizes: string[];
  startingPrice: number | null;
  eggless: boolean;
  customizable: boolean;
  availableToday: boolean;
  advanceOrderRequired: boolean;
  featured: boolean;
  active: boolean;
}

const CATEGORY_MAP: Record<string, { name: string; description: string; displayOrder: number }> = {
  cakes: {
    name: "Cakes",
    description: "Bespoke celebration and gourmet cakes crafted with premium ingredients.",
    displayOrder: 1,
  },
  desserts: {
    name: "Desserts",
    description: "Artisanal brownies, cheesecakes, cupcakes, and sweet delicacies.",
    displayOrder: 2,
  },
  bakery: {
    name: "Bakery",
    description: "Freshly baked tea cakes, cookies, and patisserie creations.",
    displayOrder: 3,
  },
  celebrations: {
    name: "Celebrations",
    description: "Specialty theme bundles and party celebration cakes.",
    displayOrder: 4,
  },
};

async function main() {
  console.log("🌱 Starting Cake Magic database seed...");

  // 1. Business Settings
  const settings = await prisma.businessSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      businessName: "Cake Magic",
      tagline: "Bespoke cakes & bakery creations in Rajahmundry",
      address: "Rajahmundry, Andhra Pradesh, India",
      deliveryCharge: 50.0,
      freeDeliveryThreshold: 1500.0,
      minPreparationHours: 24,
      acceptingOrders: true,
      customOrdersEnabled: true,
      currency: "₹",
    },
  });
  console.log("✓ Business settings verified:", settings.businessName);

  // 2. Initial Owner / Admin Account (First-run security setup)
  const ownerEmail = process.env.INITIAL_OWNER_EMAIL;
  const ownerPassword = process.env.INITIAL_OWNER_PASSWORD;
  const ownerName = process.env.INITIAL_OWNER_NAME || "Cake Magic Owner";

  if (ownerEmail && ownerPassword && ownerPassword.trim().length >= 8) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(ownerPassword, salt);

    const admin = await prisma.admin.upsert({
      where: { email: ownerEmail.toLowerCase() },
      update: { name: ownerName },
      create: {
        email: ownerEmail.toLowerCase(),
        name: ownerName,
        passwordHash,
        role: Role.OWNER,
        active: true,
      },
    });
    console.log(`✓ Initial owner account registered: ${admin.email}`);
  } else {
    console.log(
      "ℹ No INITIAL_OWNER_PASSWORD provided in environment. Skipping admin creation for now. (Owner can be created via secure first-run setup)"
    );
  }

  // 3. Categories
  const categoryIdMap: Record<string, string> = {};

  for (const [slug, data] of Object.entries(CATEGORY_MAP)) {
    const cat = await prisma.category.upsert({
      where: { slug },
      update: {
        name: data.name,
        description: data.description,
        displayOrder: data.displayOrder,
      },
      create: {
        name: data.name,
        slug,
        description: data.description,
        displayOrder: data.displayOrder,
      },
    });
    categoryIdMap[slug] = cat.id;
  }
  console.log(`✓ Seeded ${Object.keys(categoryIdMap).length} categories.`);

  // 4. Products Migration from data/products.json
  const productsFilePath = path.join(process.cwd(), "data", "products.json");
  if (fs.existsSync(productsFilePath)) {
    const rawData = fs.readFileSync(productsFilePath, "utf-8");
    const jsonProducts: JsonProduct[] = JSON.parse(rawData);

    let productCount = 0;
    for (const p of jsonProducts) {
      const categoryId = categoryIdMap[p.category] || categoryIdMap["cakes"];

      await prisma.product.upsert({
        where: { slug: p.slug },
        update: {
          name: p.name,
          description: p.description,
          categoryId,
          subcategory: p.subcategory || null,
          images: p.images || [],
          flavours: p.flavours || [],
          sizes: p.sizes || [],
          startingPrice: p.startingPrice !== null ? p.startingPrice : null,
          eggless: Boolean(p.eggless),
          customizable: Boolean(p.customizable),
          availableToday: Boolean(p.availableToday),
          advanceOrderRequired: Boolean(p.advanceOrderRequired),
          featured: Boolean(p.featured),
          active: p.active !== undefined ? Boolean(p.active) : true,
        },
        create: {
          id: p.id,
          name: p.name,
          slug: p.slug,
          description: p.description,
          categoryId,
          subcategory: p.subcategory || null,
          images: p.images || [],
          flavours: p.flavours || [],
          sizes: p.sizes || [],
          startingPrice: p.startingPrice !== null ? p.startingPrice : null,
          eggless: Boolean(p.eggless),
          customizable: Boolean(p.customizable),
          availableToday: Boolean(p.availableToday),
          advanceOrderRequired: Boolean(p.advanceOrderRequired),
          featured: Boolean(p.featured),
          active: p.active !== undefined ? Boolean(p.active) : true,
        },
      });
      productCount++;
    }
    console.log(`✓ Successfully migrated ${productCount} products from JSON to database without data loss.`);
  } else {
    console.warn("⚠ data/products.json not found, skipping product seed.");
  }

  console.log("✅ Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
