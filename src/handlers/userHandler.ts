import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Application, Request, Response } from 'express';
import { User, UserStore } from '../models/user';
import { verifyToken } from '../middleware/jwtAuth';

dotenv.config();
const { TOKEN_SECRET } = process.env;
const store = new UserStore();

const index = async (_req: Request, res: Response) => {
  try {
    const users: User[] = await store.index();
    res.status(200).json(users);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(error.message);
    }
    res.status(400).json(error);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;
    if (id === undefined) {
      res.status(400).send('Missing required parameter :id.');
      return;
    }

    const user: User = await store.show(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send(`User with id ${id} is not Found`);
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(error.message);
    }
    res.status(400).json(error);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const first_name = req.body.first_name as unknown as string;
    const last_name = req.body.last_name as unknown as string;
    const username = req.body.username as unknown as string;
    const password = req.body.password as unknown as string;

    if (
      first_name === undefined ||
      last_name === undefined ||
      username === undefined ||
      password === undefined
    ) {
      res
        .status(400)
        .send(
          'Some required parameters are missing! first_name, last_name, username, password'
        );
      return;
    }

    const user: User = {
      first_name,
      last_name,
      username,
      password
    };

    const userRes: User = await store.create(user);
    const token = jwt.sign({ user: userRes }, TOKEN_SECRET as string);
    res.status(201).json(token);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(error.message);
    }
    res.status(400).json(error);
  }
};

const authenticate = async (req: Request, res: Response) => {
  try {
    const username = req.body.username as unknown as string;
    const password = req.body.password as unknown as string;

    if (username === undefined || password === undefined) {
      res
        .status(400)
        .send('Some required data are missing! username, password');
      return;
    }

    const user: User | null = await store.authenticate(username, password);

    if (user === null) {
      res.status(401).send(`Wrong username or password.`);
      return;
    }

    const token = jwt.sign({ user }, TOKEN_SECRET as string);
    res.status(201).json(token);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(error.message);
    }
    res.status(400).json(error);
  }
};

const userHandler = (app: Application) => {
  app.get('/users', verifyToken, index);
  app.get('/users/:id', verifyToken, show);
  app.post('/users', create);
  app.post('/users/auth', authenticate);
};

export default userHandler;
