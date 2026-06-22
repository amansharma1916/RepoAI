import pool from "../database/db.js";
import workerClient from "../workerClient/workerClient.js";
import {
  getOrCreateChatSession,
  requireRepositoryAccess,
} from "../repository/repository.access.js";
import {
  checkMessageLimit,
  cleanupExpiredFreeUserData,
} from "../billing/subscription.service.js";

function mapMessage(row) {
  return {
    id: String(row.id),
    role: row.role,
    content: row.content,
    timestamp: row.created_at,
  };
}

export const askQuestion = async (req, res) => {
  try {
    const { repository_id } = req.params;
    const { question } = req.body;
    const userId = req.user.userId;

    if (!question?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    await cleanupExpiredFreeUserData(userId);

    const limitCheck = await checkMessageLimit(userId, repository_id);
    if (!limitCheck.allowed) {
      return res.status(403).json({
        success: false,
        message: limitCheck.message,
        code: "MESSAGE_LIMIT_REACHED",
        plan: limitCheck.plan,
        used: limitCheck.used,
        limit: limitCheck.limit,
      });
    }

    const session = await getOrCreateChatSession(userId, repository_id);
    const trimmedQuestion = question.trim();

    const userMessageResult = await pool.query(
      `
      INSERT INTO chat_messages (session_id, role, content)
      VALUES ($1, 'user', $2)
      RETURNING id, role, content, created_at
      `,
      [session.id, trimmedQuestion]
    );

    const result = await workerClient.post(`/ai/ask/${repository_id}`, {
      question: trimmedQuestion,
    });

    const answer = String(result.data ?? "");

    const assistantMessageResult = await pool.query(
      `
      INSERT INTO chat_messages (session_id, role, content)
      VALUES ($1, 'assistant', $2)
      RETURNING id, role, content, created_at
      `,
      [session.id, answer]
    );

    await pool.query(
      `UPDATE chat_sessions SET updated_at = NOW() WHERE id = $1`,
      [session.id]
    );

    return res.status(200).json({
      success: true,
      answer,
      userMessage: mapMessage(userMessageResult.rows[0]),
      assistantMessage: mapMessage(assistantMessageResult.rows[0]),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to ask question",
    });
  }
};

export { requireRepositoryAccess as requireAiAccess };
