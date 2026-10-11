import { MongoClient } from "mongodb";
import { mockData } from "../../mockData.js";
import { validate } from "./validation.js";

const client = new MongoClient(process.env.MONGO_URL || "mongodb://localhost:27017");

try {
  await client.connect();
  const db = client.db(process.env.MONGO_DB || "servicehub");
  for (const [collectionName, kind, items] of [
    ["services", "service", mockData.categories],
    ["companies", "company", mockData.companies],
  ]) {
    const collection = db.collection(collectionName);
    let inserted = 0;
    for (const item of items) {
      const result = validate(kind, item);
      if (result.error) throw new Error(`Invalid seed ${kind} ${item.id}: ${result.error}`);
      const record = kind === "company" ? { ...result.data, status: "approved", submittedAt: null, reviewedAt: null, reviewedBy: null, rejectionReason: "" } : result.data;
      const write = await collection.updateOne({ id: item.id }, { $setOnInsert: record }, { upsert: true });
      inserted += write.upsertedCount;
    }
    console.log(`${collectionName}: inserted ${inserted}, kept ${items.length - inserted} existing records`);
    if (kind === "company") {
      const migrated = await collection.updateMany({ status: { $exists: false } }, { $set: { status: "approved", submittedAt: null, reviewedAt: null, reviewedBy: null, rejectionReason: "" } });
      console.log(`companies: marked ${migrated.modifiedCount} existing records as approved`);
    }
  }
} catch (error) {
  console.error("Seeding failed:", error);
  process.exitCode = 1;
} finally {
  await client.close();
}
