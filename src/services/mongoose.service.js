import mongoose from 'mongoose';
import { logger } from './logger.service';

// print mongoose logs in dev env
if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

const connectDb = () => mongoose.connect(process.env.MONGO_HOST,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (!err) {
      logger.info(`BLANK_API - Connected to mongoDB ${process.env.MONGO_HOST}.`);
    } else {
      logger.error(`MongoDB connection error: ${err}`);
      setTimeout(connectDb, 5000);
    }
  });

// eslint-disable-next-line import/prefer-default-export
export { connectDb };
