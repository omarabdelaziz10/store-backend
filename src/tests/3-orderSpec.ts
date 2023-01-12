import { Order, OrderDetails, OrderStore } from '../models/order';
import supertest from 'supertest';
import jwt, { Secret } from 'jsonwebtoken';

import app from '../server';
import { User } from '../models/user';
import { Product } from '../models/product';

const request = supertest(app);
const SECRET = process.env.TOKEN_SECRET as Secret;
const store = new OrderStore();

describe('Order Model and Handlers', () => {
  const order: Order = {
    user_id: 1,
    status: 'active'
  };
  const orderDetails: OrderDetails = {
    order_id: 1,
    product_id: 1,
    quantity: 3
  };
  let newOrder: Order;
  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('should have a getCurrentOrders method', () => {
    expect(store.getCurrentOrders).toBeDefined();
  });

  it('should have a addProduct method', () => {
    expect(store.addProduct).toBeDefined();
  });

  it('create method should add a order', async () => {
    newOrder = await store.create(order);
    if (newOrder) {
      const { user_id, status } = newOrder;

      expect(user_id).toBe(order.user_id);
      expect(status).toBe(order.status);
    }
  });

  it('index method should return a list of orders', async () => {
    const result = await store.index();
    expect(result).toEqual([newOrder]);
  });

  it('show method should return the correct order', async () => {
    const result = await store.show(1);
    expect(result).toEqual(newOrder);
  });

  it('getCurrentOrders method should return the correct orders for the userId', async () => {
    const result = await store.getCurrentOrders(1);
    expect(result).toEqual([newOrder]);
  });

  it('addProduct method should add product to the order', async () => {
    const result = await store.addProduct(orderDetails);
    if (result) {
      const { product_id, order_id, quantity } = orderDetails;

      expect(product_id).toBe(result.product_id);
      expect(order_id).toBe(result.order_id);
      expect(quantity).toBe(result.quantity);
    }
  });

  let token: string,
    reqOrder: Order,
    user_id: number,
    product_id: number,
    order_id: number;

  beforeAll(async () => {
    const userData: User = {
      first_name: 'Omar',
      last_name: 'Abdelaziz',
      username: 'omarabdelaziz',
      password: '123456'
    };
    const productData: Product = {
      name: 'watch',
      price: 50
    };

    const { body: userBody } = await request.post('/users').send(userData);

    token = userBody;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { user } = jwt.verify(token, SECRET);
    user_id = user.id;

    const { body: productBody } = await request
      .post('/products')
      .set('Authorization', 'bearer ' + token)
      .send(productData);
    product_id = productBody.id;

    reqOrder = {
      user_id,
      status: 'active'
    };
  });

  it('post the create endpoint', (done) => {
    request
      .post('/orders')
      .send(reqOrder)
      .set('Authorization', 'bearer ' + token)
      .then((res) => {
        const { body, status } = res;

        expect(status).toBe(201);

        order_id = body.id;

        done();
      });
  });

  it('get the index endpoint', (done) => {
    request
      .get('/orders')
      .set('Authorization', 'bearer ' + token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });

  it('get the show endpoint', (done) => {
    request
      .get(`/orders/${order_id}`)
      .set('Authorization', 'bearer ' + token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });

  it('post the addProduct endpoint', (done) => {
    request
      .post(`/orders/${order_id}/product`)
      .send({ product_id, quantity: 2 })
      .set('Authorization', 'bearer ' + token)
      .then((res) => {
        expect(res.status).toBe(201);
        done();
      });
  });

  it('get the ordersByUser endpoint', (done) => {
    request
      .get(`/orders/user-orders/${user_id}`)
      .set('Authorization', 'bearer ' + token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });
});
