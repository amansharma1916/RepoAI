import pool from "../database/db.js";

export const findUserByEmail = async (email) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  return result.rows[0] || null;
};

export const createGoogleUser = async ({
  email,
  name,
  avatarUrl,
  providerId,
}) => {
  const result = await pool.query(
    `
      INSERT INTO users (
        email,
        name,
        avatar_url,
        provider,
        provider_id
      )
      VALUES (
        $1,
        $2,
        $3,
        'google',
        $4
      )
      RETURNING *
    `,
    [email, name, avatarUrl, providerId]
  );

  return result.rows[0];
};


export const createUser = async ({
  name,
  email,
  passwordHash,
}) => {
  const result = await pool.query(
    `
    INSERT INTO users
    (
      name,
      email,
      password_hash,
      provider
    )
    VALUES
    (
      $1,
      $2,
      $3,
      'local'
    )
    RETURNING *
    `,
    [name, email, passwordHash]
  );

  return result.rows[0];
};

export const findUserById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );

  return result.rows[0] || null;
};