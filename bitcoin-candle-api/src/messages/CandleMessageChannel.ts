import 'dotenv/config';
import { Channel, connect } from 'amqplib';
import { Server } from 'socket.io';
import { CandleController } from '../controllers/CandelController';
import * as http from 'http';
import { ICandle } from '../models/CandleModel';

export class CandleMessageChannel {
  private _channel: Channel | null;
  private _candleController: CandleController;
  private _socketIoServer: Server;

  constructor(server: http.Server) {
    this._channel = null;
    this._candleController = new CandleController();
    this._socketIoServer = new Server(server, {
      cors: {
        origin: process.env.SOCKET_CLIENT_SERVER,
        methods: ['GET', 'POST'],
      },
    });

    this._socketIoServer.on('connection', () => {
      console.log('Web socket connection created');
    });
  }

  private async _createMessageChannel() {
    try {
      const connection = await connect(process.env.AMQP_SERVER as string);

      this._channel = await connection.createChannel();
      this._channel.assertQueue(process.env.QUEUE_NAME as string);
    } catch (error) {
      console.error('Connection to RabbitMQ failed', error);
    }
  }

  async consumeRabbitQueueMessages() {
    await this._createMessageChannel();

    if (!this._channel) {
      throw new Error('Channel not found');
    }

    this._channel.consume(process.env.QUEUE_NAME as string, async (message) => {
      if (!message) {
        console.log('No messages');
        return;
      }

      const candleObject: ICandle = JSON.parse(message.content.toString());

      console.log('--------------------');
      console.log('Message received');
      console.log('--------------------');
      console.log(candleObject);

      this._channel?.ack(message);

      const candle: ICandle = candleObject;
      await this._candleController.createNewCandle(candle);

      console.log('--------------------');
      console.log('Candle saved to database');
      console.log('--------------------');

      this._socketIoServer.emit(
        process.env.SOCKET_EVENT_NAME as string,
        candle
      );

      console.log('--------------------');
      console.log('New candle sended by Web Socket');
      console.log('--------------------');
    });

    console.log('--------------------');
    console.log('Message consumer started');
    console.log('--------------------');
  }
}
