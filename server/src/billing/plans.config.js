export const PLANS = {
  FREE: "free",
  PRO: "pro",
};

export const PLAN_LIMITS = {
  free: {
    id: "free",
    name: "Free",
    maxRepositories: 3,
    maxMessagesPerRepo: 20,
    dataRetentionHours: 24,
  },
  pro: {
    id: "pro",
    name: "RepoAI Pro",
    maxRepositories: 10,
    maxMessagesPerRepo: null,
    dataRetentionHours: null,
  },
};

export const PLAN_BENEFITS = {
  free: [
    "Up to 3 repositories",
    "20 messages per repository",
    "All data removed after 24 hours",
    "Basic AI code understanding",
  ],
  pro: [
    "Up to 10 repositories",
    "Unlimited messages per repository",
    "Persistent chat history",
    "Priority support",
  ],
};

export function getProAmountPaise() {
  const amount = Number(process.env.RAZORPAY_PRO_AMOUNT);
  if (!Number.isInteger(amount) || amount < 100) {
    throw new Error("RAZORPAY_PRO_AMOUNT must be an integer >= 100 (paise)");
  }
  return amount;
}
