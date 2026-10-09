import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { config } from "../../config";
import { TCreateUserPayload } from "./user.interface";

const createUser = async (payload: TCreateUserPayload) => {
    const { name, email, password, profilePhoto } = payload;

    const hashedPassword = await bcrypt.hash(password, config.bcrypt_salt_rounds);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            profilePhoto: profilePhoto ?? "",
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            profilePhoto: true,
            createdAt: true,
        },
    });

    return user;
};

const getAllUsers = async () => {
    return await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
};

export const userServices = {
    createUser,
    getAllUsers,
};