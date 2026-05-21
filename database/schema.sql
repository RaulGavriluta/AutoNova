-- ============================================================================
-- Database Schema for AutoNova
-- ============================================================================

-- Clean up existing tables to ensure clean execution environment
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS product_car_compatibilities CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS car_vehicles CASCADE;

-- 1. Vehicle Reference Table (Data normalized from external APIs)
CREATE TABLE car_vehicles (
    id BIGSERIAL PRIMARY KEY,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    generation VARCHAR(30),
    year_start INT NOT NULL,
    year_end INT,
    CONSTRAINT chk_vehicle_years CHECK (year_end IS NULL OR year_end >= year_start),
    CONSTRAINT chk_start_year_valid CHECK (year_start >= 1900)
);

-- 2. Products Catalog Table
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    sku VARCHAR(50) NOT NULL UNIQUE,
    part_brand VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    image_url VARCHAR(255),
    CONSTRAINT chk_positive_price CHECK (price >= 0.00),
    CONSTRAINT chk_positive_stock CHECK (stock_quantity >= 0)
);

-- 3. Many-to-Many Join Table for Part-Vehicle Compatibility
CREATE TABLE product_car_compatibilities (
    product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
    car_id BIGINT REFERENCES car_vehicles(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, car_id)
);

-- 4. Identity & User Management Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'CLIENT',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_user_role CHECK (role IN ('CLIENT', 'ADMIN')),
    CONSTRAINT chk_email_format CHECK (email LIKE '%@%.%')
);

-- 5. Order Management Header Table
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_price NUMERIC(10, 2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    shipping_address TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_order_price CHECK (total_price >= 0.00),
    CONSTRAINT chk_order_status CHECK (status IN ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'))
);

-- 6. Order Line Items Table (Saves point-in-time pricing context)
CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES products(id) ON DELETE SET NULL,
    quantity INT NOT NULL,
    price_at_purchase NUMERIC(10, 2) NOT NULL,
    CONSTRAINT chk_item_quantity CHECK (quantity > 0),
    CONSTRAINT chk_item_price CHECK (price_at_purchase >= 0.00)
);