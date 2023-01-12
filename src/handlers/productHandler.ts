import { Application, Request, Response } from 'express';
import { Product, ProductStore } from '../models/product';
import { verifyToken } from '../middleware/jwtAuth';

const store = new ProductStore();

const index = async (_req: Request, res: Response) => {
  try {
    const products: Product[] = await store.index();
    res.json(products);
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

    const product: Product = await store.show(id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).send(`product with id ${id} is not Found`);
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
    const name = req.body.name as unknown as string;
    const price = req.body.price as unknown as number;

    if (name === undefined || price === undefined) {
      res.status(400).send('Some required data are missing! name, price');
      return;
    }

    const product: Product = await store.create({ name, price });
    res.status(201).json(product);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(error.message);
    }
    res.status(400).json(error);
  }
};

const productHandler = (app: Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', verifyToken, create);
};

export default productHandler;
