import pool from "../database/db.js";

export async function linkUserToRepository(userId, repositoryId) {
  await pool.query(
    `
    INSERT INTO user_repositories (user_id, repository_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, repository_id) DO NOTHING
    `,
    [userId, repositoryId]
  );
}

export async function userOwnsRepository(userId, repositoryId) {
  const result = await pool.query(
    `
    SELECT 1
    FROM user_repositories
    WHERE user_id = $1 AND repository_id = $2
    `,
    [userId, repositoryId]
  );

  return result.rowCount > 0;
}

export async function getOrCreateChatSession(userId, repositoryId) {
  const result = await pool.query(
    `
    INSERT INTO chat_sessions (user_id, repository_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, repository_id)
    DO UPDATE SET updated_at = NOW()
    RETURNING *
    `,
    [userId, repositoryId]
  );

  return result.rows[0];
}

export const requireRepositoryAccess = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const repositoryId = req.params.id || req.params.repository_id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!repositoryId) {
      return res.status(400).json({
        success: false,
        message: "Repository ID is required",
      });
    }

    const owns = await userOwnsRepository(userId, repositoryId);

    if (!owns) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this repository",
      });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify repository access",
    });
  }
};
