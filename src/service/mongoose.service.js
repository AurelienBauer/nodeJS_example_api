import mongoose from 'mongoose';
import { logger } from  './logger.service';

const connectDb = () => {
    return mongoose.connect(process.env.MONGO_HOST,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        (err) => {
            if (!err) {
                logger.info(`HELPDESK_CLIENT_API - Connected to mongoDB ${process.env.MONGO_HOST}.`);
            } else {
                logger.error(`MongoDB connection error: ${err}`);
                setTimeout(connectDb, 5000)
            }
        });
};

module.exports = { connectDb };