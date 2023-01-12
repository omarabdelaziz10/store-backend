# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index (GET /products ) 
- Show (GET /products/:id)
- Create [token required] (POST /products)

#### Users
- Index [token required] (GET /users )
- Show [token required] (GET /users/:id)
- Create (POST /users)
- Authenticate (POST /users/auth)

#### Orders
- Index [token required] (GET /orders)
- Show [token required] (GET /orders/:id)
- Create [token required] (POST /orders) 
- Current Order by user (args: user id)[token required] (GET /orders/user-orders/:userId)
- Add Product [token required] (POST /orders/:orderId)

## Data Shapes
#### Product
-  id
- name
- price

#### User
- id
- firstName
- lastName
- userName
- password

#### Orders
- id
- user_id
- status of order (active or complete)

#### Order Detalis
- id
- product_id
- order_id
- quantity of product

## API Endpoints
#### User
                                        Table "public.users"
     Column      |         Type          | Collation | Nullable |              Default
-----------------+-----------------------+-----------+----------+-----------------------------------
 id              | integer               |           | not null | nextval('users_id_seq'::regclass)
 username        | character varying(64) |           | not null |
 first_name      | character varying(64) |           | not null |
 last_name       | character varying(64) |           | not null |
 password_digest | character varying     |           | not null |

Indexes: "users_pkey" PRIMARY KEY, btree (id)
Referenced by: TABLE "orders" CONSTRAINT "orders_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)

#### Product
                                    Table "public.products"
 Column |          Type          | Collation | Nullable |               Default
--------+------------------------+-----------+----------+--------------------------------------
 id     | integer                |           | not null | nextval('products_id_seq'::regclass)
 name   | character varying(250) |           | not null |
 price  | integer                |           | not null |

Indexes: "products_pkey" PRIMARY KEY, btree (id)
Referenced by: TABLE "order_details" CONSTRAINT "order_details_product_id_fkey" FOREIGN KEY (product_id) REFERENCES products(id)

#### Orders
                               Table "public.orders"
 Column  |     Type     | Collation | Nullable |              Default
---------+--------------+-----------+----------+------------------------------------
 id      | integer      |           | not null | nextval('orders_id_seq'::regclass)
 user_id | integer      |           | not null |
 status  | order_status |           | not null |
 
Indexes: "orders_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints: "orders_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)
Referenced by: TABLE "order_details" CONSTRAINT "order_details_order_id_fkey" FOREIGN KEY (order_id) REFERENCES orders(id)

 Schema |     Name     | Internal name | Size | Elements  |
--------+--------------+---------------+------+-----------+
 public | order_status | order_status  | 4    | active   +|
        |              |               |      | completed |

#### Order Detalis
 Column   |  Type   | Collation | Nullable |
------------+---------+-----------+----------+
 id         | integer |           | not null |
 quantity   | integer |           | not null |
 order_id   | integer |           | not null |
 product_id | integer |           | not null |
Indexes: "order_details_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:"order_details_order_id_fkey" FOREIGN KEY (order_id) REFERENCES orders(id),
"order_details_product_id_fkey" FOREIGN KEY (product_id) REFERENCES products(id)

