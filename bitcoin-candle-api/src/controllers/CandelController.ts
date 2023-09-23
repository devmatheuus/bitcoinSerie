import { ICandle, CandleModel } from '../models/CandleModel';

export class CandleController {
  async createNewCandle(candle: ICandle): Promise<ICandle> {
    const newCandle = await CandleModel.create(candle);
    return newCandle;
  }

  async findLastCandles(quantity: number): Promise<ICandle[]> {
    const numberOfCandlesToBeReturned = quantity > 0 ? quantity : 10;

    const lastCandles: ICandle[] = await CandleModel.find()
      .sort({ _id: -1 })
      .limit(numberOfCandlesToBeReturned);

    return lastCandles;
  }
}
