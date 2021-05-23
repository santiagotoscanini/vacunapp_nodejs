import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';

import LoginRoutes from './routes/login.routes';

export class App {
	private app: Application;

	constructor(private port?: number | string) {
		this.app = express();
		this.settings();
		this.middlewares();
		this.routes();
	}

	settings() {
		this.app.set('port', this.port || process.env.PORT || 3000);
	}

	middlewares() {
		const morganLogStream = fs.createWriteStream(path.join(__dirname, '/../morgan.log'), { flags: 'a' });

		if (process.env.NODE_ENV == 'production') {
			this.app.use(morgan('common', {
				skip: (req: Request, res: Response) => {
					return res.statusCode < 400;
				}, stream: morganLogStream
			}));
		} else {
			this.app.use(morgan('dev'));
		}

		this.app.use(express.json());
	}

	routes() {
		this.app.use('/login', LoginRoutes);
	}

	async listen() {
		await this.app.listen(this.app.get('port'));
	}
}