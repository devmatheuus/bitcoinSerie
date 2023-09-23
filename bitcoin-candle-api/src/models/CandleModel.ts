import { model, Document, Schema } from 'mongoose';

export interface ICandle extends Document {
  currency: string;
  finalDateTime: Date | null;
  openPrice: number;
  closePrice: number;
  highPrice: number;
  lowPrice: number;
  candleColor: string;
}

const schema = new Schema<ICandle>({
  currency: { type: String, required: true },
  finalDateTime: { type: Date, required: true },
  openPrice: { type: Number, required: true },
  closePrice: { type: Number, required: true },
  highPrice: { type: Number, required: true },
  lowPrice: { type: Number, required: true },
  candleColor: { type: String, required: true },
});

export const CandleModel = model<ICandle>('Candle', schema);
