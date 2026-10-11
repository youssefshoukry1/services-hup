import express from "express";
import cors from "cors";
import multer from "multer";
import { MongoClient } from "mongodb";
import { createHash, randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { validate, validId } from "./validation.js";

const port = Number(process.env.PORT || 4000);
const client = new MongoClient(process.env.MONGO_URL || "mongodb://localhost:27017");
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000").split(",").map((item) => item.trim());
const uploadDir = process.env.UPLOAD_DIR || path.resolve("uploads");
const sessionCookie = "servicehub_admin";
const sessionAge = 7 * 24 * 60 * 60 * 1000;
const defaultImages = {
  painters: "/images/services/painting-service.webp",
  cleaning: "/images/services/cleaning-service.webp",
  auto_repair: "/images/services/car-repair-service.webp",
};
const wrap = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
const clean = ({ _id, ...record }) => record;
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024, files: 1, fields: 1 }, fileFilter: (_req, file, done) => {
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.mimetype)) return done(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "logo"));
  done(null, true);
} });

function imageType(buffer) {
  if (buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return "png";
  if (buffer.length > 3 && buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255) return "jpg";
  if (buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") return "webp";
  return null;
}

function cookieOptions() {
  return { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: sessionAge };
}

function passwordMatches(password) {
  const [salt, expected] = (process.env.ADMIN_PASSWORD_HASH || "").split(":");
  if (!salt || !expected || !/^[0-9a-f]{128}$/i.test(expected)) return false;
  return timingSafeEqual(scryptSync(password, salt, 64), Buffer.from(expected, "hex"));
}

async function main() {
  await client.connect();
  await mkdir(uploadDir, { recursive: true });
  const db = client.db(process.env.MONGO_DB || "servicehub");
  const services = db.collection("services");
  const companies = db.collection("companies");
  const sessions = db.collection("adminSessions");
  await Promise.all([
    services.createIndex({ id: 1 }, { unique: true }),
    companies.createIndex({ id: 1 }, { unique: true }),
    companies.createIndex({ status: 1, categoryId: 1 }),
    sessions.createIndex({ tokenHash: 1 }, { unique: true }),
    sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
  ]);

  const app = express();
  app.disable("x-powered-by");
  app.use(cors({ origin: allowedOrigins, credentials: true }));
  app.use((req, res, next) => {
    if (!["GET", "HEAD", "OPTIONS"].includes(req.method) && req.headers.origin && !allowedOrigins.includes(req.headers.origin)) {
      return res.status(403).json({ error: "Origin not allowed." });
    }
    next();
  });
  app.use(express.json({ limit: "100kb" }));
  app.use("/uploads", express.static(uploadDir, { immutable: true, maxAge: "1y", fallthrough: false }));

  async function requireAdmin(req, res, next) {
    const token = req.headers.cookie?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${sessionCookie}=`))?.slice(sessionCookie.length + 1);
    if (!token || !/^[0-9a-f]{64}$/.test(token)) return res.status(401).json({ error: "Admin sign-in required." });
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const session = await sessions.findOne({ tokenHash, expiresAt: { $gt: new Date() } });
    if (!session) return res.status(401).json({ error: "Admin session expired." });
    req.adminEmail = session.email;
    req.sessionHash = tokenHash;
    next();
  }

  app.get("/api/health", wrap(async (_req, res) => { await db.command({ ping: 1 }); res.json({ status: "ok" }); }));
  const loginAttempts = new Map();
  app.post("/api/admin/login", wrap(async (req, res) => {
    const key = req.ip;
    const now = Date.now();
    const recent = (loginAttempts.get(key) || []).filter((time) => now - time < 15 * 60 * 1000);
    if (recent.length >= 5) return res.status(429).json({ error: "Too many sign-in attempts. Try again later." });
    if (typeof req.body?.email !== "string" || typeof req.body?.password !== "string") return res.status(400).json({ error: "Email and password are required." });
    const valid = req.body.email.trim().toLowerCase() === (process.env.ADMIN_EMAIL || "").toLowerCase() && passwordMatches(req.body.password);
    if (!valid) {
      loginAttempts.set(key, [...recent, now]);
      return res.status(401).json({ error: "Invalid email or password." });
    }
    loginAttempts.delete(key);
    const token = randomBytes(32).toString("hex");
    await sessions.insertOne({ tokenHash: createHash("sha256").update(token).digest("hex"), email: process.env.ADMIN_EMAIL, expiresAt: new Date(now + sessionAge) });
    res.cookie(sessionCookie, token, cookieOptions()).json({ email: process.env.ADMIN_EMAIL });
  }));
  app.get("/api/admin/me", wrap(requireAdmin), (req, res) => res.json({ email: req.adminEmail }));
  app.post("/api/admin/logout", wrap(requireAdmin), wrap(async (req, res) => {
    await sessions.deleteOne({ tokenHash: req.sessionHash });
    res.clearCookie(sessionCookie, { ...cookieOptions(), maxAge: undefined }).status(204).end();
  }));

  app.get("/api/services", wrap(async (_req, res) => res.json((await services.find().sort({ id: 1 }).toArray()).map(clean))));
  app.get("/api/services/:id", wrap(async (req, res) => {
    if (!validId(req.params.id)) return res.status(400).json({ error: "Invalid id." });
    const item = await services.findOne({ id: req.params.id });
    return item ? res.json(clean(item)) : res.status(404).json({ error: "Not found." });
  }));
  app.post("/api/services", wrap(requireAdmin), wrap(async (req, res) => {
    const result = validate("service", req.body);
    if (result.error) return res.status(400).json({ error: result.error });
    await services.insertOne(result.data);
    res.status(201).json(clean(result.data));
  }));
  app.put("/api/services/:id", wrap(requireAdmin), wrap(async (req, res) => {
    if (!validId(req.params.id)) return res.status(400).json({ error: "Invalid id." });
    const result = validate("service", req.body, { existingId: req.params.id });
    if (result.error) return res.status(400).json({ error: result.error });
    const item = await services.findOneAndReplace({ id: req.params.id }, result.data, { returnDocument: "after" });
    return item ? res.json(clean(item)) : res.status(404).json({ error: "Not found." });
  }));
  app.delete("/api/services/:id", wrap(requireAdmin), wrap(async (req, res) => {
    if (!validId(req.params.id)) return res.status(400).json({ error: "Invalid id." });
    if (await companies.findOne({ categoryId: req.params.id })) return res.status(409).json({ error: "Delete companies in this service first." });
    const result = await services.deleteOne({ id: req.params.id });
    return result.deletedCount ? res.status(204).end() : res.status(404).json({ error: "Not found." });
  }));

  app.get("/api/companies", wrap(async (req, res) => {
    const filter = { status: "approved" };
    if (req.query.categoryId !== undefined) {
      if (!validId(req.query.categoryId)) return res.status(400).json({ error: "Invalid categoryId." });
      filter.categoryId = req.query.categoryId;
    }
    res.json((await companies.find(filter).sort({ id: 1 }).toArray()).map(clean));
  }));
  app.get("/api/companies/:id", wrap(async (req, res) => {
    if (!validId(req.params.id)) return res.status(400).json({ error: "Invalid id." });
    const item = await companies.findOne({ id: req.params.id, status: "approved" });
    return item ? res.json(clean(item)) : res.status(404).json({ error: "Not found." });
  }));

  app.post("/api/company-submissions", upload.single("logo"), wrap(async (req, res) => {
    let body;
    try { body = JSON.parse(req.body.data); } catch { return res.status(400).json({ error: "data must be valid JSON." }); }
    if (!body || typeof body !== "object" || Array.isArray(body)) return res.status(400).json({ error: "data must be a JSON object." });
    if (["id", "logo", "image", "status"].some((key) => key in body)) return res.status(400).json({ error: "id, logo, image and status are set by the server." });
    if (req.file && !imageType(req.file.buffer)) return res.status(400).json({ error: "Logo must be a valid PNG, JPEG or WebP image." });
    const result = validate("company", { ...body, id: `company-${randomUUID()}`, logo: "", image: defaultImages[body.categoryId] || "" });
    if (result.error) return res.status(400).json({ error: result.error });
    if (!result.data.prices.length) return res.status(400).json({ error: "At least one price is required." });
    if (!(await services.findOne({ id: result.data.categoryId }))) return res.status(400).json({ error: "categoryId does not exist." });
    let filePath;
    if (req.file) {
      const name = `${randomUUID()}.${imageType(req.file.buffer)}`;
      filePath = path.join(uploadDir, name);
      await writeFile(filePath, req.file.buffer, { flag: "wx" });
      result.data.logo = `/uploads/${name}`;
    }
    try {
      const company = { ...result.data, status: "pending", submittedAt: new Date(), reviewedAt: null, reviewedBy: null, rejectionReason: "" };
      await companies.insertOne(company);
      res.status(201).json({ id: company.id, status: company.status });
    } catch (error) {
      if (filePath) await unlink(filePath).catch(() => {});
      throw error;
    }
  }));

  app.get("/api/admin/companies", wrap(requireAdmin), wrap(async (req, res) => {
    const status = req.query.status || "pending";
    if (!["pending", "approved", "rejected"].includes(status)) return res.status(400).json({ error: "Invalid status." });
    res.json((await companies.find({ status }).sort({ submittedAt: -1, id: 1 }).toArray()).map(clean));
  }));
  for (const decision of ["approve", "reject"]) {
    app.post(`/api/admin/companies/:id/${decision}`, wrap(requireAdmin), wrap(async (req, res) => {
      if (!validId(req.params.id)) return res.status(400).json({ error: "Invalid id." });
      const reason = decision === "reject" ? req.body?.reason : "";
      if (decision === "reject" && reason !== undefined && (typeof reason !== "string" || reason.length > 500)) return res.status(400).json({ error: "reason must be at most 500 characters." });
      const item = await companies.findOneAndUpdate(
        { id: req.params.id, status: "pending" },
        { $set: { status: decision === "approve" ? "approved" : "rejected", reviewedAt: new Date(), reviewedBy: req.adminEmail, rejectionReason: typeof reason === "string" ? reason.trim() : "" } },
        { returnDocument: "after" },
      );
      return item ? res.json(clean(item)) : res.status(409).json({ error: "This submission is no longer pending." });
    }));
  }

  app.post("/api/companies", wrap(requireAdmin), wrap(async (req, res) => {
    const result = validate("company", { ...req.body, id: req.body?.id || `company-${randomUUID()}` });
    if (result.error) return res.status(400).json({ error: result.error });
    if (!(await services.findOne({ id: result.data.categoryId }))) return res.status(400).json({ error: "categoryId does not exist." });
    const item = { ...result.data, status: "approved", submittedAt: new Date(), reviewedAt: new Date(), reviewedBy: req.adminEmail, rejectionReason: "" };
    await companies.insertOne(item);
    res.status(201).json(clean(item));
  }));
  app.put("/api/companies/:id", wrap(requireAdmin), wrap(async (req, res) => {
    if (!validId(req.params.id)) return res.status(400).json({ error: "Invalid id." });
    const result = validate("company", req.body, { existingId: req.params.id });
    if (result.error) return res.status(400).json({ error: result.error });
    if (!(await services.findOne({ id: result.data.categoryId }))) return res.status(400).json({ error: "categoryId does not exist." });
    const item = await companies.findOneAndUpdate({ id: req.params.id }, { $set: result.data }, { returnDocument: "after" });
    return item ? res.json(clean(item)) : res.status(404).json({ error: "Not found." });
  }));
  app.delete("/api/companies/:id", wrap(requireAdmin), wrap(async (req, res) => {
    if (!validId(req.params.id)) return res.status(400).json({ error: "Invalid id." });
    const item = await companies.findOneAndDelete({ id: req.params.id });
    if (!item) return res.status(404).json({ error: "Not found." });
    if (item.logo?.startsWith("/uploads/")) await unlink(path.join(uploadDir, path.basename(item.logo))).catch(() => {});
    return res.status(204).end();
  }));

  app.use((_req, res) => res.status(404).json({ error: "Route not found." }));
  app.use((error, _req, res, _next) => {
    if (error?.code === 11000) return res.status(409).json({ error: "An item with this id already exists." });
    if (error?.status === 404) return res.status(404).json({ error: "Not found." });
    if (error instanceof multer.MulterError) return res.status(400).json({ error: error.code === "LIMIT_FILE_SIZE" ? "Logo must be smaller than 2 MB." : error.message });
    if (error instanceof SyntaxError && "body" in error) return res.status(400).json({ error: "Invalid JSON." });
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  });
  const server = app.listen(port, "0.0.0.0", () => console.log(`API listening on http://localhost:${port}`));
  const shutdown = async () => { server.close(); await client.close(); };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}

main().catch((error) => { console.error("Could not start API:", error); process.exitCode = 1; client.close(); });
