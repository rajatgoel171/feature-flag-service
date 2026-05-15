import { evaluateFlag } from "./evaluator.js";

const flag = {
  key: "new-dashboard",
  enabled: true,
  users: ["u_admin"],
  rules: [{ attribute: "plan", equals: "enterprise" }],
  rolloutPercentage: 25,
};

console.log(evaluateFlag(flag, { userId: "u_123", attributes: { plan: "starter" } }));
console.log(evaluateFlag(flag, { userId: "u_456", attributes: { plan: "enterprise" } }));
