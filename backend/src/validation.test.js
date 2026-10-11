import test from "node:test";
import assert from "node:assert/strict";
import { validate } from "./validation.js";

const company = {
  id: "comp-example", categoryId: "painters", name: "Example Co",
  shortDesc: "Example service", address: "Berlin", phone: "+49 1234567",
  email: "test@example.com", prices: [{ service: "Painting", price: "10 EUR" }],
};

test("accepts existing company data and fills optional fields", () => {
  const result = validate("company", company);
  assert.equal(result.error, undefined);
  assert.equal(result.data.logo, "");
  assert.equal(result.data.prices[0].service, "Painting");
});

test("rejects invalid category references and price objects", () => {
  assert.match(validate("company", { ...company, categoryId: "../bad" }).error, /categoryId/);
  assert.match(validate("company", { ...company, prices: [{ service: "Paint" }] }).error, /prices/);
});

test("prevents changing an id on PUT", () => {
  assert.match(validate("service", { id: "other", title: "Other" }, { existingId: "painters" }).error, /cannot be changed/);
});
