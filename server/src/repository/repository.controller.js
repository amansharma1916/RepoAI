import pool from "../database/db.js";
import workerClient from "../workerClient/workerClient.js";
import buildTree from "./helper/buildTree.js";
import {
  linkUserToRepository,
  getOrCreateChatSession,
  requireRepositoryAccess,
} from "./repository.access.js";
import {
  checkRepositoryLimit,
  cleanupExpiredFreeUserData,
  userAlreadyLinkedToRepository,
} from "../billing/subscription.service.js";

export const getUserRepositories = async (req, res) => {
  try {
    const userId = req.user.userId;

    await cleanupExpiredFreeUserData(userId);

    const result = await pool.query(
      `
      SELECT
        r.id,
        r.github_url,
        r.status,
        ur.created_at AS added_at,
        cs.updated_at AS last_active_at,
        (
          SELECT cm.content
          FROM chat_messages cm
          WHERE cm.session_id = cs.id
          ORDER BY cm.created_at DESC
          LIMIT 1
        ) AS last_message,
        (
          SELECT cm.created_at
          FROM chat_messages cm
          WHERE cm.session_id = cs.id
          ORDER BY cm.created_at DESC
          LIMIT 1
        ) AS last_message_at
      FROM user_repositories ur
      JOIN repositories r ON r.id = ur.repository_id
      LEFT JOIN chat_sessions cs
        ON cs.user_id = ur.user_id AND cs.repository_id = r.id
      WHERE ur.user_id = $1
      ORDER BY COALESCE(
        (
          SELECT MAX(cm.created_at)
          FROM chat_messages cm
          WHERE cm.session_id = cs.id
        ),
        ur.created_at
      ) DESC
      `,
      [userId]
    );

    return res.status(200).json({
      success: true,
      repositories: result.rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch repositories",
    });
  }
};

export const analyzeRepository = async (req, res) => {
  try {
    const { githubUrl } = req.body;
    const userId = req.user.userId;

    if (!githubUrl) {
      return res.status(400).json({
        success: false,
        message: "GitHub URL is required",
      });
    }

    if (!/^https?:\/\/github\.com\/.+\/.+/.test(githubUrl)) {
      return res.status(400).json({
        success: false,
        message: "Invalid GitHub URL format",
      });
    }

    await cleanupExpiredFreeUserData(userId);

    const alreadyLinked = await userAlreadyLinkedToRepository(userId, githubUrl);
    if (!alreadyLinked) {
      const limitCheck = await checkRepositoryLimit(userId);
      if (!limitCheck.allowed) {
        return res.status(403).json({
          success: false,
          message: limitCheck.message,
          code: "REPOSITORY_LIMIT_REACHED",
          plan: limitCheck.plan,
          used: limitCheck.used,
          limit: limitCheck.limit,
        });
      }
    }

    const existingResult = await pool.query(
      `SELECT * FROM repositories WHERE github_url = $1`,
      [githubUrl]
    );

    if (existingResult.rows[0]) {
      const repo = existingResult.rows[0];
      await linkUserToRepository(userId, repo.id);
      await getOrCreateChatSession(userId, repo.id);

      return res.status(200).json({
        success: true,
        repository: repo,
        existing: true,
      });
    }

    const result = await pool.query(
      `
      INSERT INTO repositories (github_url)
      VALUES ($1)
      RETURNING *
      `,
      [githubUrl]
    );

    const repo = result.rows[0];

    const workerResponse = await workerClient.post("/repository/clone", {
      githubUrl: repo.github_url,
      repositoryId: repo.id,
    });

    await workerClient.post(`/repo-analysis/analyze/${repo.id}`);

    await pool.query(
      `
      UPDATE repositories
      SET status = 'completed'
      WHERE id = $1
      `,
      [repo.id]
    );

    await linkUserToRepository(userId, repo.id);
    await getOrCreateChatSession(userId, repo.id);

    res.status(201).json({
      success: true,
      repository: { ...repo, status: "completed" },
      worker: workerResponse.data,
      existing: false,
    });
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Repository already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getRepositoryOverview = async (req, res) => {
  try {
    const { id } = req.params;

    const repositoryQuery = `
    SELECT *
      FROM repositories
  WHERE id = $1
      `;

    const statsQuery = `
    SELECT *
      FROM repository_stats
  WHERE repository_id = $1
      `;

    const technologiesQuery = `
  SELECT technology_name
  FROM repository_technologies
  WHERE repository_id = $1
      `;

    const [repositoryResult, statsResult, technologiesResult] =
      await Promise.all([
        pool.query(repositoryQuery, [id]),
        pool.query(statsQuery, [id]),
        pool.query(technologiesQuery, [id]),
      ]);

    return res.status(200).json({
      repository: repositoryResult.rows[0],
      stats: statsResult.rows[0],
      technologies: technologiesResult.rows.map(
        (tech) => tech.technology_name
      ),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch repository overview",
    });
  }
};

export const getRepositoryTree = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT file_path
      FROM repository_files
      WHERE repository_id = $1
      ORDER BY file_path
      `,
      [id]
    );

    const paths = result.rows.map((row) => row.file_path);

    const tree = buildTree(paths);

    return res.status(200).json(tree);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate tree",
    });
  }
};

export const getRepositoryFiles = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
  SELECT
    id,
    file_name,
    file_path,
    extension,
    size
  FROM repository_files
  WHERE repository_id = $1
  ORDER BY file_path
  `,
      [id]
    );

    return res.status(200).json({
      success: true,
      count: result.rowCount,
      files: result.rows,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch files",
    });
  }
};

export const getArchitecture = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await workerClient.get(`/repo-analysis/architecture/${id}`);
    return res.status(200).json(result.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch architecture",
    });
  }
};

export { requireRepositoryAccess };
