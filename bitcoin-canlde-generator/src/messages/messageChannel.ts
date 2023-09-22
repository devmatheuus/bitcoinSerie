import 'dotenv/config';
import { Channel, connect } from 'amqplib';

export const createMessageChannel = async (): Promise<Channel | null> => {
  try {
    const connection = await connect(process.env.AMQP_SERVER as string);
    const channel = await connection.createChannel();

    await channel.assertQueue(process.env.QUEUE_NAME as string);

    console.log('Connected to RabbitMQ');

    return channel;
  } catch (error) {
    console.error('Error while trying to connect to RabbitMQ', error);

    return null;
  }
};
