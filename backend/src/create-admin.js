import { randomBytes, scryptSync } from "node:crypto";
import { existsSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const envPath = path.join(root, ".env");
const loginPath = path.join(root, "admin-login.txt");
if (existsSync(envPath) && !process.argv.includes("--force")) {
  console.error(".env already exists. Pass --force to replace the local admin credentials.");
  process.exit(1);
}
const email = "admin@servicehub.local";
const password = randomBytes(18).toString("base64url");
const salt = randomBytes(16).toString("hex");
const hash = scryptSync(password, salt, 64).toString("hex");
writeFileSync(envPath, `ADMIN_EMAIL=${email}\nADMIN_PASSWORD_HASH=${salt}:${hash}\n`, { mode: 0o600 });
writeFileSync(loginPath, `Admin URL: http://localhost:3000/admin/login\nEmail: ${email}\nPassword: ${password}\n`, { mode: 0o600 });
console.log(`Local admin credentials saved to ${loginPath}`);
