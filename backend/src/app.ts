import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import routes from './routes';
import { PORT, MONGO_URI } from './utils/secrets';

class App {
  private app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.connectToDatabase();
    this.middleware();
    this.routes();
    this.listen();
  }

  private config(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private connectToDatabase(): void {
    mongoose
      .connect(MONGO_URI)
      .then(() => console.log('Connected to MongoDB'))
      .catch((err) => console.error(err));
  }

  private middleware(): void {
    this.app.use(mongoSanitize());
    this.app.use(morgan('combined'));

    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
    });
    this.app.use('/api', limiter);
  }

  private routes(): void {
    this.app.use('/api', routes);
  }

  private listen(): void {
    this.app.listen(PORT, () =>
      console.log(`Server listening on port ${PORT}`)
    );
  }
}

new App();
