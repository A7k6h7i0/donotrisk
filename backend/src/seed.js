import bcrypt from "bcryptjs";
import { connectMongo } from "./db/mongoose.js";
import { User } from "./models/User.js";
import { Category } from "./models/Category.js";
import { Product } from "./models/Product.js";
import { WarrantyDetail } from "./models/WarrantyDetail.js";
import { ProsCons } from "./models/ProsCons.js";

async function upsertCategory(name, parentName = null) {
  const parent = parentName ? await Category.findOne({ name: parentName }) : null;
  return Category.findOneAndUpdate(
    { name, parent_id: parent ? parent._id : null },
    { name, parent_id: parent ? parent._id : null },
    { upsert: true, new: true }
  );
}

async function runSeed() {
  await connectMongo();

  const adminHash = await bcrypt.hash("Admin@12345", 12);
  const userHash = await bcrypt.hash("User@12345", 12);
  await User.findOneAndUpdate(
    { email: "admin@donotrisk.com" },
    { name: "Admin", email: "admin@donotrisk.com", password_hash: adminHash, role: "admin" },
    { upsert: true, new: true }
  );
  await User.findOneAndUpdate(
    { email: "user@donotrisk.com" },
    { name: "Demo User", email: "user@donotrisk.com", password_hash: userHash, role: "user" },
    { upsert: true, new: true }
  );

  const top = ["Electronics", "Vehicles", "Home Appliances", "Gadgets", "Furniture", "Industrial Equipment", "Personal Care", "Outdoor and Tools"];
  for (const name of top) await upsertCategory(name);

  await upsertCategory("WiFi Routers", "Electronics");
  await upsertCategory("Smartphones", "Electronics");
  await upsertCategory("Cars", "Vehicles");
  await upsertCategory("Air Conditioners", "Home Appliances");
  await upsertCategory("Smartwatches", "Gadgets");
  await upsertCategory("Office Chairs", "Furniture");
  await upsertCategory("Power Tools", "Industrial Equipment");
  await upsertCategory("Trimmers", "Personal Care");
  await upsertCategory("Pressure Washers", "Outdoor and Tools");

  const routerCat = await Category.findOne({ name: "WiFi Routers" });
  const phoneCat = await Category.findOne({ name: "Smartphones" });
  const carCat = await Category.findOne({ name: "Cars" });
  const acCat = await Category.findOne({ name: "Air Conditioners" });
  const watchCat = await Category.findOne({ name: "Smartwatches" });
  const chairCat = await Category.findOne({ name: "Office Chairs" });
  const toolCat = await Category.findOne({ name: "Power Tools" });
  const trimCat = await Category.findOne({ name: "Trimmers" });
  const washCat = await Category.findOne({ name: "Pressure Washers" });

  const products = [
    ["Airtel Xstream Router", "Airtel", "AXR-2025", routerCat],
    ["Samsung Galaxy A56", "Samsung", "SMA56-5G", phoneCat],
    ["Hyundai Venue SX", "Hyundai", "HY-VENUE-SX", carCat],
    ["EcoCool AC 1.5T", "CoolHome", "ECA-15-INV", acCat],
    ["Amazfit Balance 2", "Amazfit", "AMZ-BAL2", watchCat],
    ["ErgoChair Flex", "WoodForm", "WF-ERGO-FLX", chairCat],
    ["Makita DrillPro X", "Makita", "MKT-DPX", toolCat],
    ["Philips BeardMaster Pro", "Philips", "PH-BMPRO", trimCat],
    ["Karcher K5 Pro", "Karcher", "KAR-K5P", washCat]
  ];

  for (const [name, brand, model, category] of products) {
    if (!category) continue;
    const p = await Product.findOneAndUpdate(
      { model_number: model },
      {
        name,
        brand,
        model_number: model,
        category_id: category._id,
        description: `${name} with warranty insights, claim conditions, and risk evaluation.`,
        release_date: new Date("2025-01-01"),
        servicing_frequency_per_year: 2,
        warranty_complexity: 6,
        failure_rate: 15,
        claim_success_probability: 80,
        risk_score: 35,
        risk_band: "Low"
      },
      { upsert: true, new: true }
    );

    await WarrantyDetail.findOneAndUpdate(
      { product_id: p._id },
      {
        product_id: p._id,
        duration_months: 24,
        coverage_type: "manufacturer warranty",
        start_conditions: "Starts from invoice purchase date.",
        registration_requirements: "Register within 30 days with invoice.",
        claim_process: "Raise ticket with serial number and invoice.",
        validity_conditions: "No unauthorized repairs; valid invoice required.",
        void_conditions: "Physical damage, liquid damage, third-party modification."
      },
      { upsert: true, new: true }
    );

    await ProsCons.findOneAndUpdate(
      { product_id: p._id },
      { product_id: p._id, pros: "Good coverage and service support.", cons: "Strict documentation required for some claims." },
      { upsert: true, new: true }
    );
  }

  console.log("Mongo seed completed.");
  process.exit(0);
}

runSeed().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
