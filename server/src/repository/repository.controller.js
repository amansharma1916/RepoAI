import pool from "../database/db.js";
import workerClient from "../workerClient/workerClient.js";
import buildTree from "./helper/buildTree.js";

export const analyzeRepository = async (req, res) => {
  try {
    const { githubUrl } = req.body;

    if (!githubUrl) {
      return res.status(400).json({
        success: false,
        message: "GitHub URL is required",
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

    const workerResponse = await workerClient.post("/repository/analyze-repository", {
      githubUrl: repo.github_url,
      repositoryId: repo.id
    });

    await pool.query(
      `
  UPDATE repositories
  SET status = 'completed'
  WHERE id = $1
  `,
      [repo.id]
    );

    res.status(201).json({
      success: true,
      repository: repo,
      worker: workerResponse.data,
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

    const paths = result.rows.map(
      (row) => row.file_path
    );

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
