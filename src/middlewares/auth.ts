import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Role } from "../../generated/prisma/enums";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";
import { config } from "../config";
import { prisma } from "../lib/prisma";

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

        const user = await prisma.user.findUnique({
            where: {
                email: decodedUser.email,
                role: decodedUser.role
            },
            select: {
                id: true,
                email: true,
                role: true,
                status: true,
            }
        })

        if (!user) {
            throw new Error("User not found. Please log in again.");
        }

        if(user.status === "BLOCKED") {
            throw new Error("User is blocked. Please contact the admin for assistance.");
        }

        req.user = decodedUser;
        next();
    });
};