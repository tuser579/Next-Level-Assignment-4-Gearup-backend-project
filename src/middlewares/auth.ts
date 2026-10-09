import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Role } from "../../generated/prisma/enums";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";
import { config } from "../config";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role: Role;
            };
        }
    }
}

export const auth = (...requiredRoles: Role[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies?.accessToken 
            || (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : req.headers.authorization);

        if (!token) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                success: false,
                message: "You are not logged in. Please log in to access this resource.",
            });
        }

        const verified = jwtUtils.verifyToken(token, config.jwt_access_secret);
        if (!verified.success) {
            throw verified.originalError;
        }

        const decodedUser = verified.data as { id: string; email: string; role: Role };

        if (requiredRoles.length > 0 && !requiredRoles.includes(decodedUser.role)) {
            return res.status(httpStatus.FORBIDDEN).json({
                success: false,
                message: "Forbidden! You do not have permission to access this resource.",
            });
        }

        req.user = decodedUser;
        next();
    });
};