import AppError from '../utils/appError';
import { ErrorRequestHandler, Response } from 'express';
import {
    BAD_REQUEST,
    INTERNAL_SERVER_ERROR,
    NOT_FOUND,
    UNPROCESSABLE_CONTENT,
} from '../constants/httpCodes.constant';
import {
    PrismaClientValidationError,
    PrismaClientKnownRequestError,
    PrismaClientInitializationError,
} from '@prisma/client/runtime/library';
import { z } from 'zod';
import logger from '../lib/logger';
import { log } from 'console';

const handleZodError = (res: Response, error: z.ZodError) => {
    logger.error(`Zod validation error occurred: ${error.issues.map((issue) => ({
        code: issue.code,
        path: issue.path.join('.'),
        message: issue.message,
    }))}`);

    const errors = error.issues.map((issue) => ({
        code: issue.code,
        path: issue.path.join('.'),
        message: issue.message,
    }));
    return res.status(BAD_REQUEST).json({ errors });
};

const handleAppError = (res: Response, error: AppError) => {
    logger.error(`Application error occurred.  Status Code: ${error.statusCode} - Error: ${error.message}`);
    return res.status(error.statusCode).json({ message: error.message });
};

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    if (error instanceof z.ZodError) {
        handleZodError(res, error);
        return;
    }

    if (error instanceof AppError) {
        handleAppError(res, error);
        return;
    }

    if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
            case 'P2002':
                logger.error(`Unique constraint failed: ${error.meta?.target}`);
                res.status(BAD_REQUEST).json({
                    error: `${error.meta?.target} is already registered`,
                });
                return;
            case 'P2003':
                logger.error(`Foreign key constraint failed: ${error.meta?.target}`);
                res.status(BAD_REQUEST).json({
                    error: 'Foreign key constraint failed',
                });
                return;
            case 'P2025':
                logger.error(`Register not found: ${error.meta?.target}`);
                res.status(NOT_FOUND).json({
                    error: 'Register not found',
                });
                return;
            default:
                logger.error(`Unknown database error occurred: ${error.message}`);
                res.status(400).json({
                    error: 'Error on DB',
                    code: error.code,
                });
                return;
        }
    }

    if (error instanceof PrismaClientValidationError) {
        if (
            error.message.includes('Argument') &&
            error.message.includes('is missing')
        ) {
            res.status(UNPROCESSABLE_CONTENT).json({
                error: 'Validation Error',
                details: (() => {
                    const match = error?.message?.match(/`(\w+)` is missing/);
                    const arg = match && match[1] ? match[1] : 'unknown';
                    return `Argument \`${arg}\` is missing`;
                })(),
            });
            return;
        }
    } else {
        res.status(UNPROCESSABLE_CONTENT).json({
            error: 'Validation Error',
            details: error.message,
        });
        return;
    }

    if (error instanceof PrismaClientInitializationError) {
        const errors = error.message.split('\n');
        res.status(500).json({
            error: 'Error during Prisma initialization',
            details: errors,
        });
        return;
    }

    res.status(INTERNAL_SERVER_ERROR).json({
        error: 'Internal Server Error',
        msg: error.message || error,
    });
    return;
};

export default errorHandler;
