import { User, UserStore } from '../models/user';
import supertest from 'supertest';
import jwt, { Secret } from 'jsonwebtoken';

import app from '../server';

const request = supertest(app);
const SECRET = process.env.TOKEN_SECRET as Secret;

const store = new UserStore();

describe('User Model and Handlers', () => {
  const user: User = {
    username: 'omarabdelaziz',
    password: '123456',
    first_name: 'omar',
    last_name: 'omar'
  };
  let newUser: User;
  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('should have a authenticate method', () => {
    expect(store.authenticate).toBeDefined();
  });

  it('create method should add a user', async () => {
    newUser = await store.create(user);
    if (newUser) {
      const { username, first_name, last_name } = newUser;

      expect(username).toBe(user.username);
      expect(first_name).toBe(user.first_name);
      expect(last_name).toBe(user.last_name);
    }
  });

  it('index method should return a list of users', async () => {
    const result = await store.index();
    expect(result).toEqual([newUser]);
  });

  it('show method should return the correct user', async () => {
    const result = await store.show(1);
    expect(result).toEqual(newUser);
  });
  it('authenticates the user with a password', async () => {
    const result = await store.authenticate(
      newUser.username,
      newUser.password as string
    );

    if (result) {
      const { username, first_name, last_name } = result;

      expect(username).toBe(user.username);
      expect(first_name).toBe(user.first_name);
      expect(last_name).toBe(user.last_name);
    }
  });

  let token: string,
    userId = 1;

  it('Post the create endpoint', (done) => {
    request
      .post('/users')
      .send(user)
      .then((res) => {
        const { body, status } = res;
        token = body;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { user } = jwt.verify(token, SECRET);
        userId = user.id;

        expect(status).toBe(201);
        done();
      });
  });

  it('get the index endpoint', (done) => {
    request
      .get('/users')
      .set('Authorization', 'bearer ' + token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });

  it('get the show endpoint', (done) => {
    request
      .get(`/users/${userId}`)
      .set('Authorization', 'bearer ' + token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });

  it('authenticate on the auth endpoint', (done) => {
    request
      .post('/users/auth')
      .send({
        username: user.username,
        password: user.password
      })
      .set('Authorization', 'bearer ' + token)
      .then((res) => {
        expect(res.status).toBe(201);
        done();
      });
  });
});
