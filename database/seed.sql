-- ============================================================================
-- Seed Data for AutoNova
-- ============================================================================

-- A. Insert Vehicle Data
INSERT INTO car_vehicles (brand, model, generation, year_start, year_end) VALUES 
('Audi', 'A4', 'B9', 2015, 2023),
('BMW', 'Seria 3', 'F30', 2011, 2019),
('Volkswagen', 'Golf', 'Golf 7', 2012, 2020);

-- B. Insert Product Catalog Data
INSERT INTO products (sku, part_brand, name, category, price, stock_quantity) VALUES
('ATE-13046072492', 'ATE', 'Front Brake Pad Set', 'Braking System', 245.99, 15),
('BOSCH-0451103316', 'BOSCH', 'Premium Oil Filter', 'Filters', 45.50, 40),
('SACHS-315258', 'SACHS', 'Rear Suspension Shock Absorber', 'Suspension', 320.00, 8);

-- C. Map M2M Relations (Vehicle Compatibility Mapping)
INSERT INTO product_car_compatibilities (product_id, car_id) VALUES
((SELECT id FROM products WHERE sku='ATE-13046072492'), (SELECT id FROM car_vehicles WHERE brand='Audi' AND generation='B9')),
((SELECT id FROM products WHERE sku='ATE-13046072492'), (SELECT id FROM car_vehicles WHERE brand='BMW' AND generation='F30'));

INSERT INTO product_car_compatibilities (product_id, car_id) VALUES
((SELECT id FROM products WHERE sku='BOSCH-0451103316'), (SELECT id FROM car_vehicles WHERE brand='Audi' AND generation='B9')),
((SELECT id FROM products WHERE sku='BOSCH-0451103316'), (SELECT id FROM car_vehicles WHERE brand='Volkswagen' AND generation='Golf 7'));

-- D. Insert Demo Users (BCrypt Hash corresponds to plaintext: "password123")
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
('client.test@email.com', '$2a$10$wR6bE7r.q3.vjP6uK9gGReB8tLRE7iQWvE8ZgH.4bH3Z4e8i3rQ6.', 'John', 'Doe', 'CLIENT'),
('admin.auto@email.com', '$2a$10$wR6bE7r.q3.vjP6uK9gGReB8tLRE7iQWvE8ZgH.4bH3Z4e8i3rQ6.', 'Andrew', 'Manager', 'ADMIN');

-- E. Insert Initial Order Headers
INSERT INTO orders (user_id, total_price, status, shipping_address) VALUES
((SELECT id FROM users WHERE email='client.test@email.com'), 336.99, 'PROCESSING', '10 Main Automotive Street, Brasov');

-- F. Insert Order Details
INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES
(
    (SELECT id FROM orders WHERE user_id = (SELECT id FROM users WHERE email='client.test@email.com') LIMIT 1),
    (SELECT id FROM products WHERE sku='BOSCH-0451103316'),
    2,
    45.50
),
(
    (SELECT id FROM orders WHERE user_id = (SELECT id FROM users WHERE email='client.test@email.com') LIMIT 1),
    (SELECT id FROM products WHERE sku='ATE-13046072492'),
    1,
    245.99
);