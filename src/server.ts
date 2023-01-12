import express, { Request, Response, Application } from 'express';
import userHandler from './handlers/userHandler';
import productHandler from './handlers/productHandler';
import orderHandler from './handlers/orderHandler';

const app: Application = express();
const port = 3000;

app.use(express.json());

app.get('/', function (_req: Request, res: Response) {
  res.send('Welcome to the store!');
});

userHandler(app);
productHandler(app);
orderHandler(app);

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});

export default app;
