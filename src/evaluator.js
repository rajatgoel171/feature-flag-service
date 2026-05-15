import crypto from "node:crypto";

export function evaluateFlag(flag, context) {
  if (!flag.enabled) return { enabled: false, reason: "flag_disabled" };
  if (flag.users?.includes(context.userId)) return { enabled: true, reason: "user_targeted" };

  for (const rule of flag.rules ?? []) {
    if (context.attributes?.[rule.attribute] === rule.equals) {
      return { enabled: true, reason: `matched_${rule.attribute}` };
    }
  }

  const rollout = flag.rolloutPercentage ?? 0;
  if (rollout <= 0) return { enabled: false, reason: "not_in_rollout" };
  if (rollout >= 100) return { enabled: true, reason: "full_rollout" };

  const bucket = bucketUser(flag.key, context.userId);
  return bucket < rollout
    ? { enabled: true, reason: "percentage_rollout", bucket }
    : { enabled: false, reason: "outside_rollout", bucket };
}

export function bucketUser(flagKey, userId) {
  const hash = crypto.createHash("sha256").update(`${flagKey}:${userId}`).digest("hex");
  return Number.parseInt(hash.slice(0, 8), 16) % 100;
}
