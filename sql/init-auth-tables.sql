CREATE TABLE IF NOT EXISTS user (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  emailVerified INTEGER DEFAULT 0,
  phone TEXT,
  name TEXT NOT NULL,
  image TEXT,
  role TEXT DEFAULT 'user',
  createdAt INTEGER DEFAULT (strftime('%s', 'now')),
  updatedAt INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS session (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expiresAt INTEGER NOT NULL,
  userAgent TEXT,
  ipAddress TEXT,
  createdAt INTEGER DEFAULT (strftime('%s', 'now')),
  updatedAt INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS account (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  accountId TEXT NOT NULL,
  providerId TEXT NOT NULL,
  accessToken TEXT,
  refreshToken TEXT,
  idToken TEXT,
  accessTokenExpiresAt INTEGER,
  refreshTokenExpiresAt INTEGER,
  scope TEXT,
  password TEXT,
  createdAt INTEGER DEFAULT (strftime('%s', 'now')),
  updatedAt INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS verification (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  expiresAt INTEGER NOT NULL,
  createdAt INTEGER DEFAULT (strftime('%s', 'now'))
);

-- Insert admin user
INSERT OR IGNORE INTO user (id, email, emailVerified, name, role, createdAt, updatedAt)
VALUES ('admintest001', 'admin@timorup.com', 1, 'Admin User', 'admin', strftime('%s', 'now'), strftime('%s', 'now'));

-- Insert admin account with password hash for 'admin12345'
INSERT OR IGNORE INTO account (id, userId, accountId, providerId, password, createdAt, updatedAt)
VALUES ('acc-admin-001', 'admintest001', 'admintest001', 'email', '$2b$10$6XYcPLyQMOc6EE8dGFioPe61lZMA/mGO3eB5b7YfRPFbCoZjztN8y', strftime('%s', 'now'), strftime('%s', 'now'));
