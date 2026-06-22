import pool from "../database/db.js";
import {
  getOrCreateChatSession,
  requireRepositoryAccess,
} from "../repository/repository.access.js";
import { cleanupExpiredFreeUserData } from "../billing/subscription.service.js";

function mapMessage(row) {
  return {
    id: String(row.id),
    role: row.role,
    content: row.content,
    timestamp: row.created_at,
  };
}

export const getChatMessages = async (req, res) => {
  try {
    const { repository_id } = req.params;
    const userId = req.user.userId;

    await cleanupExpiredFreeUserData(userId);

    const session = await getOrCreateChatSession(userId, repository_id);

    const result = await pool.query(
      `
      SELECT id, role, content, created_at
      FROM chat_messages
      WHERE session_id = $1
      ORDER BY created_at ASC
      `,
      [session.id]
    );

    return res.status(200).json({
      success: true,
      sessionId: session.id,
      messages: result.rows.map(mapMessage),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch chat messages",
    });
  }
};

export { requireRepositoryAccess as requireChatAccess };
