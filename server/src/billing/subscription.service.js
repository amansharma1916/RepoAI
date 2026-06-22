import pool from "../database/db.js";
import {
  PLAN_BENEFITS,
  PLAN_LIMITS,
  PLANS,
  getProAmountPaise,
} from "./plans.config.js";

export async function getUserPlanRow(userId) {
  const result = await pool.query(
    `
    SELECT id, plan, free_plan_started_at, pro_upgraded_at
    FROM users
    WHERE id = $1
    `,
    [userId]
  );

  return result.rows[0] || null;
}

export async function cleanupExpiredFreeUserData(userId) {
  const user = await getUserPlanRow(userId);

  if (!user || user.plan !== PLANS.FREE || !user.free_plan_started_at) {
    return { cleaned: false };
  }

  const expiry = new Date(user.free_plan_started_at);
  expiry.setHours(expiry.getHours() + PLAN_LIMITS.free.dataRetentionHours);

  if (Date.now() < expiry.getTime()) {
    return { cleaned: false };
  }

  await pool.query(
    `
    DELETE FROM chat_messages
    WHERE session_id IN (
      SELECT id FROM chat_sessions WHERE user_id = $1
    )
    `,
    [userId]
  );

  await pool.query(`DELETE FROM chat_sessions WHERE user_id = $1`, [userId]);
  await pool.query(`DELETE FROM user_repositories WHERE user_id = $1`, [userId]);

  await pool.query(
    `
    UPDATE users
    SET free_plan_started_at = NOW()
    WHERE id = $1
    `,
    [userId]
  );

  return { cleaned: true };
}

export async function countUserRepositories(userId) {
  const result = await pool.query(
    `SELECT COUNT(*)::int AS count FROM user_repositories WHERE user_id = $1`,
    [userId]
  );

  return result.rows[0]?.count ?? 0;
}

export async function userAlreadyLinkedToRepository(userId, githubUrl) {
  const result = await pool.query(
    `
    SELECT 1
    FROM user_repositories ur
    JOIN repositories r ON r.id = ur.repository_id
    WHERE ur.user_id = $1 AND r.github_url = $2
    LIMIT 1
    `,
    [userId, githubUrl]
  );

  return result.rowCount > 0;
}

export async function countUserMessagesForRepository(userId, repositoryId) {
  const result = await pool.query(
    `
    SELECT COUNT(*)::int AS count
    FROM chat_messages cm
    JOIN chat_sessions cs ON cs.id = cm.session_id
    WHERE cs.user_id = $1
      AND cs.repository_id = $2
      AND cm.role = 'user'
    `,
    [userId, repositoryId]
  );

  return result.rows[0]?.count ?? 0;
}

export async function checkRepositoryLimit(userId) {
  const user = await getUserPlanRow(userId);
  const plan = user?.plan === PLANS.PRO ? PLANS.PRO : PLANS.FREE;
  const limits = PLAN_LIMITS[plan];
  const used = await countUserRepositories(userId);

  if (used >= limits.maxRepositories) {
    return {
      allowed: false,
      plan,
      used,
      limit: limits.maxRepositories,
      message:
        plan === PLANS.PRO
          ? `You have reached the maximum of ${limits.maxRepositories} repositories on RepoAI Pro.`
          : `Free plan allows up to ${limits.maxRepositories} repositories. Upgrade to RepoAI Pro for up to 10 repositories.`,
    };
  }

  return { allowed: true, plan, used, limit: limits.maxRepositories };
}

export async function checkMessageLimit(userId, repositoryId) {
  const user = await getUserPlanRow(userId);
  const plan = user?.plan === PLANS.PRO ? PLANS.PRO : PLANS.FREE;
  const limits = PLAN_LIMITS[plan];

  if (limits.maxMessagesPerRepo === null) {
    return { allowed: true, plan, used: 0, limit: null };
  }

  const used = await countUserMessagesForRepository(userId, repositoryId);

  if (used >= limits.maxMessagesPerRepo) {
    return {
      allowed: false,
      plan,
      used,
      limit: limits.maxMessagesPerRepo,
      message: `Free plan allows ${limits.maxMessagesPerRepo} messages per repository. Upgrade to RepoAI Pro for unlimited messages.`,
    };
  }

  return { allowed: true, plan, used, limit: limits.maxMessagesPerRepo };
}

export async function upgradeUserToPro(userId) {
  await pool.query(
    `
    UPDATE users
    SET plan = $2, pro_upgraded_at = NOW()
    WHERE id = $1
    `,
    [userId, PLANS.PRO]
  );
}

function getFreePlanExpiry(freePlanStartedAt) {
  if (!freePlanStartedAt) return null;

  const expiry = new Date(freePlanStartedAt);
  expiry.setHours(expiry.getHours() + PLAN_LIMITS.free.dataRetentionHours);
  return expiry.toISOString();
}

export async function getPlanStatus(userId) {
  await cleanupExpiredFreeUserData(userId);

  const user = await getUserPlanRow(userId);
  const plan = user?.plan === PLANS.PRO ? PLANS.PRO : PLANS.FREE;
  const limits = PLAN_LIMITS[plan];
  const repositoryCount = await countUserRepositories(userId);

  let proAmountPaise = null;
  try {
    proAmountPaise = getProAmountPaise();
  } catch {
    proAmountPaise = null;
  }

  return {
    plan,
    planName: limits.name,
    limits: {
      maxRepositories: limits.maxRepositories,
      maxMessagesPerRepo: limits.maxMessagesPerRepo,
      dataRetentionHours: limits.dataRetentionHours,
    },
    usage: {
      repositories: repositoryCount,
    },
    benefits: PLAN_BENEFITS,
    proAmountPaise,
    proAmountDisplay: proAmountPaise ? `₹${(proAmountPaise / 100).toFixed(0)}` : null,
    freePlanExpiresAt:
      plan === PLANS.FREE ? getFreePlanExpiry(user.free_plan_started_at) : null,
    proUpgradedAt: user?.pro_upgraded_at ?? null,
  };
}
