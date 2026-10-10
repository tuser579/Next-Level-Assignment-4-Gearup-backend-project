import { UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { rentalServices } from "../rental/rental.service";
import { TAdminRentalFilterQuery, TUserFilterQuery } from "./admin.interface";

const getAllUsers = async (query: TUserFilterQuery) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const whereCondition: any = {};
    if (query.role) whereCondition.role = query.role;
    if (query.status) whereCondition.status = query.status;
    if (query.search) {
        whereCondition.OR = [
            { name: { contains: query.search, mode: "insensitive" } },
            { email: { contains: query.search, mode: "insensitive" } },
        ];
    }

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where: whereCondition,
            skip,
            take: limit,
            select: { id: true, name: true, email: true, role: true, status: true, phone: true, createdAt: true },
            orderBy: { createdAt: "desc" },
        }),
        prisma.user.count({ where: whereCondition }),
    ]);

    return { users, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

const updateUserStatus = async (userId: string, status: UserStatus) => {
    return await prisma.user.update({
        where: { id: userId },
        data: { status },
        select: { id: true, name: true, email: true, status: true, role: true },
    });
};

const getAllRentals = async (query: TAdminRentalFilterQuery) => {
    return await rentalServices.getAllRentalsForAdmin(query);
};

export const adminServices = { getAllUsers, updateUserStatus, getAllRentals };