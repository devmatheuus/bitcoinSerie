import { Router, Request, Response } from 'express';
import { CandleController } from '../../src/controllers/CandelController';

export const candleRouter = Router();
const candleController = new CandleController();

candleRouter.get('/:quantity', async (req: Request, res: Response) => {
  const quantity = parseInt(req.params.quantity);

  const candles = await candleController.findLastCandles(quantity);

  return res.json(candles);
});
