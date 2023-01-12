CREATE TYPE order_status AS ENUM ('active', 'completed');
CREATE TABLE orders
(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    status order_status NOT NULL
);
