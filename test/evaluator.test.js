import assert from "node:assert/strict";
import { test } from "node:test";
import { bucketUser, evaluateFlag } from "../src/evaluator.js";

test("enables explicitly targeted users", () => {
  const result = evaluateFlag({ key: "checkout", enabled: true, users: ["u_1"] }, { userId: "u_1" });
  assert.deepEqual(result, { enabled: true, reason: "user_targeted" });
});

test("matches attribute rules", () => {
  const result = evaluateFlag(
    { key: "dashboard", enabled: true, rules: [{ attribute: "plan", equals: "pro" }] },
    { userId: "u_2", attributes: { plan: "pro" } },
  );
  assert.equal(result.enabled, true);
  assert.equal(result.reason, "matched_plan");
});

test("buckets users deterministically", () => {
  assert.equal(bucketUser("flag-a", "user-a"), bucketUser("flag-a", "user-a"));
});
