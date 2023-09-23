import { CandleColor } from '../enums/CandleColor';

export class Candle {
  lowPrice: number;
  highPrice: number;
  openPrice: number;
  closePrice: number;
  candleColor: CandleColor;
  finalDateTime: Date | null;
  candleValues: number[];
  currency: string;

  constructor(currency: string) {
    this.lowPrice = Infinity;
    this.highPrice = 0;
    this.openPrice = 0;
    this.closePrice = 0;
    this.candleColor = CandleColor.UNDETERMINED;
    this.finalDateTime = null;
    this.candleValues = [];
    this.currency = currency;
  }

  addToCandleValuesArray(candleValue: number): void {
    this.candleValues.push(candleValue);

    if (this.candleValues.length === 1) {
      this.openPrice = candleValue;
    }

    if (this.lowPrice > candleValue) {
      this.lowPrice = candleValue;
    }

    if (this.highPrice < candleValue) {
      this.highPrice = candleValue;
    }
  }

  closeCandle(): void {
    if (this.candleValues.length > 0) {
      this.closePrice = this.candleValues[this.candleValues.length - 1];
      this.finalDateTime = new Date();

      if (this.openPrice > this.closePrice) {
        this.candleColor = CandleColor.RED;
      } else if (this.closePrice > this.openPrice) {
        this.candleColor = CandleColor.GREEN;
      }
    }
  }

  toSimpleObject(): Omit<
    this,
    'candleValues' | 'addToCandleValuesArray' | 'closeCandle' | 'toSimpleObject'
  > {
    const { candleValues, ...rest } = this;

    return rest;
  }
}
