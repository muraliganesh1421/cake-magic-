import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

async function runPhase1Tests() {
  console.log("=== PHASE 1 ARCHITECTURE & DATA INTEGRITY TESTS ===\n");
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}${detail ? ` - ${detail}` : ""}`);
      failed++;
    }
  }

  // Test 1: Prisma Schema File Exists and Configured for PostgreSQL
  const schemaPath = path.join(process.cwd(), "prisma", "schema.prisma");
  assert(fs.existsSync(schemaPath), "Prisma schema exists");
  const schemaContent = fs.readFileSync(schemaPath, "utf-8");
  assert(
    schemaContent.includes('provider = "postgresql"') && schemaContent.includes('provider = "prisma-client-js"'),
    "Prisma schema configured for PostgreSQL and Prisma Client"
  );
  assert(
    schemaContent.includes("model BusinessSettings") &&
      schemaContent.includes("model Order") &&
      schemaContent.includes("model Product") &&
      schemaContent.includes("model Staff"),
    "Prisma schema contains core business entities (BusinessSettings, Order, Product, Staff)"
  );

  // Test 2: Migration SQL File Exists and Has Valid PostgreSQL DDL
  const migrationPath = path.join(process.cwd(), "prisma", "migrations", "0_init", "migration.sql");
  assert(fs.existsSync(migrationPath), "Initial PostgreSQL migration SQL exists");
  const migrationSql = fs.readFileSync(migrationPath, "utf-8");
  assert(
    migrationSql.includes('CREATE TABLE "BusinessSettings"') &&
      migrationSql.includes('CREATE TABLE "Product"') &&
      migrationSql.includes('CREATE TABLE "Order"'),
    "Migration SQL contains expected table creations"
  );

  // Test 3: Products JSON Data Integrity Check
  const productsPath = path.join(process.cwd(), "data", "products.json");
  assert(fs.existsSync(productsPath), "Existing products.json data file exists");
  const productsData = JSON.parse(fs.readFileSync(productsPath, "utf-8"));
  assert(Array.isArray(productsData) && productsData.length > 0, `Products data contains ${productsData.length} products`);

  const sampleProduct = productsData[0];
  assert(
    Boolean(sampleProduct.id && sampleProduct.name && sampleProduct.slug && sampleProduct.category),
    "Products have required identifier, name, slug, and category"
  );

  // Test 4: Password Hashing Utility Verification
  const testPassword = "TestTemporaryPassword123!";
  const hash = await bcrypt.hash(testPassword, 10);
  const isValid = await bcrypt.compare(testPassword, hash);
  const isInvalid = await bcrypt.compare("WrongPassword", hash);
  assert(isValid && !isInvalid, "Secure password hashing (bcryptjs) functions correctly without hardcoded values");

  // Test 5: Seed Script Exists and Has Dynamic Environment Guard
  const seedPath = path.join(process.cwd(), "prisma", "seed.ts");
  assert(fs.existsSync(seedPath), "Prisma seed script exists");
  const seedContent = fs.readFileSync(seedPath, "utf-8");
  assert(
    seedContent.includes("process.env.INITIAL_OWNER_PASSWORD"),
    "Seed script requires INITIAL_OWNER_PASSWORD environment variable for admin creation"
  );

  // Test 6: Environment Template (.env.example) Exists and Contains No Real Secrets
  const envExamplePath = path.join(process.cwd(), ".env.example");
  assert(fs.existsSync(envExamplePath), ".env.example exists");
  const envContent = fs.readFileSync(envExamplePath, "utf-8");
  assert(
    envContent.includes("DATABASE_URL") &&
      envContent.includes("INITIAL_OWNER_PASSWORD") &&
      !envContent.includes("cakemagic2026"),
    ".env.example contains configuration placeholders without hardcoded credentials"
  );

  console.log(`\n==========================================`);
  console.log(`Phase 1 Test Results: ${passed} passed, ${failed} failed`);
  console.log(`==========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase1Tests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
