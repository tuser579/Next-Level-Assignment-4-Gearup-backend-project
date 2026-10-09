import { Request, Response } from "express";
import httpStatus from "http-status";

export const notFound = (req: Request, res: Response) => {
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "Route Not Found",
        error: {
            code: httpStatus.NOT_FOUND,
            description: `The requested endpoint ${req.originalUrl} does not exist.`,
        },
    });
};