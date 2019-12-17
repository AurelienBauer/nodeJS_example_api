import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import { connectDb } from  './service/mongoose.service'
import { logger } from  './service/logger.service';

const app = express();

app.use(helmet());

app.use(cors());

app.use(bodyParser.json({
    limit: '300kb',
}));

const runServer = () => app.listen(process.env.PORT, () => {
    logger.info(`HELPDESK_CLIENT_API - Server started on port ${process.env.PORT} (${process.env.NODE_ENV}).`);
}).on('error', (err) => {
    logger.error(`Launch server error: ${err}`);
    setTimeout(runServer, 5000)
});

connectDb();
runServer();