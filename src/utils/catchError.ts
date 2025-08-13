import { NextFunction, Request, Response } from 'express';
import logger from '../lib/logger';

type AsyncController = (
    req: Request,
    res: Response,
    next: NextFunction,
) => Promise<any>;

const catchErrors =
    (controller: AsyncController): AsyncController =>
    async (req, res, next) => {
        logger.info(`Handling request for ${req.method} ${req.originalUrl}`);
        try {
            await controller(req, res, next);
        } catch (error) {
            next(error);
        }
    };

export default catchErrors;
