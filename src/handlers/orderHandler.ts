import { Application, Request, Response } from 'express';
import { Order, OrderDetails, OrderStore } from '../models/order';
import { verifyToken } from '../middleware/jwtAuth';

const store = new OrderStore();

const index = async (_req: Request, res: Response) => {
  try {
    const orders: Order[] = await store.index();
    res.status(200).json(orders);
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

    const order: Order = await store.show(id);
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).send(`order with id ${id} is not Found`);
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
    const status = req.body.status as unknown as 'active' | 'completed';
    const user_id = req.body.user_id as unknown as number;

    if (status === undefined || user_id === undefined) {
      res.status(400).send('Some required data are missing! status, user_id');
      return;
    }

    const order: Order = {
      status,
      user_id
    };
    const orderRes: Order = await store.create(order);
    res.status(201).json(orderRes);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(error.message);
    }
    res.status(400).json(error);
  }
};

const ordersByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as unknown as number;

    if (userId === undefined) {
      res.status(400).send('Missing required parameter :userId.');
      return;
    }

    const orders: Order[] = await store.getCurrentOrders(userId);
    res.status(200).json(orders);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(error.message);
    }
    res.status(400).json(error);
  }
};

const addProductToOrder = async (req: Request, res: Response) => {
  try {
    const order_id = req.params.orderId as unknown as number;
    const product_id = req.body.product_id as unknown as number;
    const quantity = req.body.quantity as unknown as number;

    if (
      order_id === undefined ||
      product_id === undefined ||
      quantity === undefined
    ) {
      res
        .status(400)
        .send('Some required data are missing! :orderId, product_id, quantity');
      return;
    }

    const orderDetails: OrderDetails = {
      order_id,
      product_id,
      quantity
    };
    const orderRes: OrderDetails = await store.addProduct(orderDetails);
    res.status(201).json(orderRes);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(error.message);
    }
    res.status(400).json(error);
  }
};

const orderHandler = (app: Application) => {
  app.get('/orders', verifyToken, index);
  app.get('/orders/:id', verifyToken, show);
  app.post('/orders', verifyToken, create);
  app.get('/orders/user-orders/:userId', verifyToken, ordersByUser);
  app.post('/orders/:orderId/product', verifyToken, addProductToOrder);
};

export default orderHandler;
