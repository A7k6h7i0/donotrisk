CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  parent_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_categories_name_parent
ON categories (LOWER(name), COALESCE(parent_id, 0));

CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  brand VARCHAR(120) NOT NULL,
  model_number VARCHAR(120) NOT NULL UNIQUE,
  category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  description TEXT NOT NULL,
  release_date DATE NOT NULL,
  servicing_frequency_per_year INT NOT NULL DEFAULT 0,
  warranty_complexity INT NOT NULL DEFAULT 5,
  failure_rate INT NOT NULL DEFAULT 5,
  claim_success_probability INT NOT NULL DEFAULT 50,
  risk_score INT NOT NULL DEFAULT 0,
  risk_band VARCHAR(20) NOT NULL DEFAULT 'Low',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS warranty_details (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL UNIQUE REFERENCES products(id) ON DELETE CASCADE,
  duration_months INT NOT NULL,
  coverage_type VARCHAR(80) NOT NULL,
  start_conditions TEXT NOT NULL,
  registration_requirements TEXT NOT NULL,
  claim_process TEXT NOT NULL,
  validity_conditions TEXT NOT NULL,
  void_conditions TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pros_cons (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL UNIQUE REFERENCES products(id) ON DELETE CASCADE,
  pros TEXT NOT NULL,
  cons TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS service_centers (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name VARCHAR(160) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(80) NOT NULL,
  state VARCHAR(80) NOT NULL,
  phone VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS scanned_warranty (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE SET NULL,
  serial_number VARCHAR(120),
  purchase_date DATE,
  expiry_date DATE,
  raw_extracted_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_scanned_user_id ON scanned_warranty(user_id);
