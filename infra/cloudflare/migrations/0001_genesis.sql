CREATE TABLE IF NOT EXISTS genesis_registrations (
  id TEXT PRIMARY KEY,
  program TEXT NOT NULL CHECK (program IN ('community', 'agent')),
  wallet_address TEXT,
  normalized_wallet TEXT,
  x_handle TEXT,
  normalized_handle TEXT,
  identity_status TEXT NOT NULL CHECK (identity_status IN ('not_applicable', 'verified_at_registration', 'not_verified_at_registration', 'unknown')),
  identity_block INTEGER,
  review_status TEXT NOT NULL CHECK (review_status IN ('pending_review', 'registered', 'identity_not_verified')),
  created_at TEXT NOT NULL,
  UNIQUE(program, normalized_wallet),
  UNIQUE(program, normalized_handle)
);

CREATE TABLE IF NOT EXISTS genesis_rate_limits (
  key TEXT NOT NULL,
  window_start INTEGER NOT NULL,
  request_count INTEGER NOT NULL,
  PRIMARY KEY(key, window_start)
);

CREATE INDEX IF NOT EXISTS genesis_created_at_idx ON genesis_registrations(created_at);
