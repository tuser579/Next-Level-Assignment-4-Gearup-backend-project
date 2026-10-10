import bcrypt from "bcryptjs";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import httpStatus from "http-status";
import { UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { config } from "../../config";
import { TChangePasswordPayload, TLoginPayload, TRegisterPayload, TUpdateProfilePayload } from "./auth.interface";
import { jwtUtils } from "../../utils/jwt";

const registerUser = async (payload: TRegisterPayload) => {
    const { name, email, password, phone, profileImage, address } = payload;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        const err: any = new Error("An account with this email already exists.");
        err.statusCode = httpStatus.CONFLICT;
        throw err;
    }

    const hashedPassword = await bcrypt.hash(payload.password, config.bcrypt_salt_rounds);

    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            phone: phone || null,
            profileImage: profileImage || null,
            address: address || null,
        },
        select: { id: true, name: true, email: true, role: true, phone: true, address: true, createdAt: true },
    });

    return newUser;
};

const loginUser = async (payload: TLoginPayload) => {
    const user = await prisma.user.findUnique({ where: { email: payload.email } });
    if (!user) {
        const err: any = new Error("Invalid email or password.");
        err.statusCode = httpStatus.UNAUTHORIZED;
        throw err;
    }

    if (user.status === UserStatus.BLOCKED) {
        const err: any = new Error("Your account has been suspended. Please contact support.");
        err.statusCode = httpStatus.FORBIDDEN;
        throw err;
    }

    const isPasswordMatch = await bcrypt.compare(payload.password, user.password);
    if (!isPasswordMatch) {
        const err: any = new Error("Your password not match.");
        err.statusCode = httpStatus.UNAUTHORIZED;
        throw err;
    }

    const { id, name, email, role } = user;

    const jwtPayload = { id, email, role };

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as SignOptions['expiresIn']
    )

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret as string,
        config.jwt_refresh_expires_in as SignOptions['expiresIn']
    )

    return {
        accessToken,
        refreshToken,
        user: { id, name, email, role }
    };
};

const refreshToken = async (token: string) => {
    const verifiedRefreshToken = jwtUtils.verifyToken(token, config.jwt_refresh_secret as string);

    if (!verifiedRefreshToken.success) {
        // throw new Error(verifiedRefreshToken.error);
        throw verifiedRefreshToken.originalError;
    }

    const { id } = verifiedRefreshToken.data as JwtPayload;

    const user = await prisma.user.findUniqueOrThrow({
        where: { id }
    })

    if (user.status === "BLOCKED") {
        throw new Error("Your account has been blocked. Please contact the admin for assistance.");
    }

    const { name, email, role } = user;

    const jwtPayload = {
        id,
        name,
        email,
        role
    }

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as SignOptions['expiresIn']
    )

    return {
        accessToken
    }
}

const getMe = async (userId: string) => {
    return await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: { id: true, name: true, email: true, role: true, status: true, phone: true, address: true, profileImage: true, createdAt: true },
    });
};

const updateProfile = async (userId: string, payload: TUpdateProfilePayload) => {
    return await prisma.user.update({
        where: { id: userId },
        data: payload,
        select: { id: true, name: true, phone: true, address: true, profileImage: true },
    });
};

const changePassword = async (userId: string, payload: TChangePasswordPayload) => {
    const { oldPassword, newPassword } = payload;

    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        const err: any = new Error("Incorrect old password.");
        err.statusCode = httpStatus.BAD_REQUEST;
        throw err;
    }

    const newHashed = await bcrypt.hash(newPassword, config.bcrypt_salt_rounds);
    await prisma.user.update({
        where: { id: userId },
        data: { password: newHashed },
    });

    return { message: "Password updated successfully." };
};

export const authServices = { registerUser, loginUser, refreshToken, getMe, updateProfile, changePassword };