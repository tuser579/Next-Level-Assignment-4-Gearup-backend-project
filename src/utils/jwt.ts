import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const createToken = (payload: JwtPayload, secret: string, expiresIn: SignOptions["expiresIn"]) => {
    return jwt.sign(payload, secret, { expiresIn });
};

const verifyToken = (token: string, secret: string) => {
    try {
        const verifiedToken = jwt.verify(token, secret);
        return {
            success: true,
            data: verifiedToken as JwtPayload,
        };
    } catch (error: any) {
        return {
            success: false,
            originalError: error,
        };
    }
};

export const jwtUtils = {
    createToken,
    verifyToken,
};