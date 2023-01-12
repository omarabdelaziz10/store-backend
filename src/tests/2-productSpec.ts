import { Product, ProductStore } from '../models/product';
import supertest from 'supertest';

import app from '../server';
import { User } from '../models/user';

const request = supertest(app);

const store = new ProductStore();

describe('Product Model and Handlers', () => {
  const product: Product = {
    name: 'watch',
    price: 50
  };
  let newProduct: Product;
  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('create method should add a product', async () => {
    newProduct = await store.create(product);
    if (newProduct) {
      const { name, price } = newProduct;

      expect(name).toBe(product.name);
      expect(price).toBe(product.price);
    }
  });

  it('index method should return a list of products', async () => {
    const result = await store.index();
    expect(result).toEqual([newProduct]);
  });

  it('show method should return the correct product', async () => {
    const result = await store.show(1);
    expect(result).toEqual(newProduct);
  });

  let token: string, productId: number;

  beforeAll(async () => {
    const userData: User = {
      first_name: 'Omar',
      last_name: 'Abdelaziz',
      username: 'omarabdelaziz',
      password: '123456'
    };

    const { body } = await request.post('/users').send(userData);

    token = body;
  });

  it('post the create endpoint', (done) => {
    request
      .post('/products')
      .send(product)
      .set('Authorization', 'bearer ' + token)
      .then((res) => {
        const { body, status } = res;
        expect(status).toBe(201);
        productId = body.id;

        done();
      });
  });

  it('get the index endpoint', (done) => {
    request.get('/products').then((res) => {
      expect(res.status).toBe(200);
      done();
    });
  });

  it('get the show endpoint', (done) => {
    request.get(`/products/${productId}`).then((res) => {
      expect(res.status).toBe(200);
      done();
    });
  });
});
