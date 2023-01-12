import Client from '../database';

export type Order = {
  id?: number;
  user_id?: number;
  status: 'active' | 'completed';
};

export type OrderDetails = {
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
};

export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders';
      const result = await conn.query<Order>(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Can't get the orders. Erorr: ${error}`);
    }
  }
  async show(id: number): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders WHERE id=($1)';
      const result = await conn.query<Order>(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Can't get the orders with the #id ${id}. Erorr: ${error}`
      );
    }
  }
  async create(order: Order): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql =
        'INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *';
      const result = await conn.query<Order>(sql, [
        order.user_id,
        order.status
      ]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Can't create the orders. Erorr: ${error}`);
    }
  }
  async getCurrentOrders(id: number): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders WHERE user_id = ($1)';
      const result = await conn.query<Order>(sql, [id]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get orders for user ${id}. Error: ${err}`);
    }
  }
  async addProduct(orderDetails: OrderDetails): Promise<OrderDetails> {
    // get order to see if it is open
    try {
      const ordersql = 'SELECT * FROM orders WHERE id=($1)';
      const conn = await Client.connect();
      const result = await conn.query<Order>(ordersql, [orderDetails.order_id]);
      const order = result.rows[0];

      if (order.status !== 'active') {
        throw new Error(
          `Could not add product ${orderDetails.product_id} to order ${orderDetails.order_id} because order status is ${order.status}`
        );
      }

      conn.release();
    } catch (err) {
      throw new Error(`${err}`);
    }

    try {
      const sql =
        'INSERT INTO order_details (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *';
      const conn = await Client.connect();
      const result = await conn.query<OrderDetails>(sql, [
        orderDetails.quantity,
        orderDetails.order_id,
        orderDetails.product_id
      ]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Could not add product ${orderDetails.product_id} to order ${orderDetails.order_id}: ${err}`
      );
    }
  }
}
