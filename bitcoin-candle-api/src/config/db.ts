import 'dotenv/config';
import { connect } from 'mongoose';

export const connectToMongoDB = async (): Promise<void> => {
  await connect(process.env.MONGODB_CONNECTION_URL as string);
};
