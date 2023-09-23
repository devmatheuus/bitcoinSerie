import 'dotenv/config';
import { app } from './app';
import { connectToMongoDB } from './config/db';
import { connection } from 'mongoose';
import { CandleMessageChannel } from './messages/CandleMessageChannel';

(async () => {
  await connectToMongoDB();

  const PORT = process.env.PORT as string;

  const server = app.listen(PORT, () => {
    console.log(`Application is running on port ${PORT}`);
  });

  const candleMessageChannel = new CandleMessageChannel(server);
  await candleMessageChannel.consumeRabbitQueueMessages();

  process.on('SIGINT', async () => {
    await connection.close();
    server.close();

    console.log('App server and connection to mongoDB closed');
  });
})();
