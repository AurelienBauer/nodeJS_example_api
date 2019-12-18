import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import { connectDb } from './services/mongoose.service'
import { logger, logError, logRequest } from './services/logger.service';
import https from 'https';
import fs from 'fs';
import route from './routes'
import {notFound, handler} from "./middlewares/error.middleware";

const app = express();

app.use(helmet());

app.use(cors());

app.use(bodyParser.json({
    limit: '300kb',
}));

app.use(logRequest);

app.use('/', route);

app.use(notFound);

app.use(handler);

if (!fs.existsSync("server.key") || !fs.existsSync("server.cert")) {
    console.warn("API didn't find SSL files.");
    process.exit(1);
}

const options = {
    key: fs.readFileSync("server.key"),
    cert: fs.readFileSync("server.cert")
};

const runServer = () => https.createServer(options, app).listen(process.env.PORT, () => {
    logger.info(`HELPDESK_CLIENT_API - Server started on port ${process.env.PORT} (${process.env.NODE_ENV}).`);
}).on('error', (err) => {
    logger.error(`Launch server error: ${err}`);
    setTimeout(runServer, 5000)
});

connectDb();
runServer();


