import 'dotenv/config';
import axios from 'axios';
import { PriceApiResponse } from './interfaces/PriceApiResponse';
import { Period } from './enums/Period';
import { Candle } from './models/Candle';
import { createMessageChannel } from './messages/messageChannel';

const readMarketPrice = async (): Promise<number> => {
  const result: PriceApiResponse = (
    await axios.get(process.env.PRICES_API as string)
  ).data;

  const bitcoinCurrentPrice = result.bitcoin.usd;

  return bitcoinCurrentPrice;
};

const generateCandles = async (): Promise<void> => {
  const messageChannel = await createMessageChannel();

  if (!messageChannel) {
    return;
  }

  while (true) {
    const loopTimes = Period.FIVE_MINUTES / Period.TEN_SECONDS;
    const candle = new Candle('BTC');

    console.log('--------------');
    console.log('Generating new candle!');
    console.log('--------------');

    for (let i = 0; i < loopTimes; i++) {
      const bitcoinPrice = await readMarketPrice();
      candle.addToCandleValuesArray(bitcoinPrice);
      console.log(`Market price # ${i + 1} of ${loopTimes}`);

      await new Promise((r) => setTimeout(r, Period.TEN_SECONDS));
    }

    candle.closeCandle();
    console.log('--------------');
    console.log('Candle closed!');
    console.log('--------------');

    const candleObject = candle.toSimpleObject();
    const candleJson = JSON.stringify(candleObject);

    messageChannel.sendToQueue(
      process.env.QUEUE_NAME as string,
      Buffer.from(candleJson)
    );

    console.log('--------------');
    console.log('Candle sent to queue!');
    console.log('--------------');
  }
};

generateCandles();
