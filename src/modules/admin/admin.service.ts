import { UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { TRentalFilterQuery, TUserFilterQuery } from "./admin.interface";

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

    const [ users ] = await Promise.all([
        prisma.user.findMany({
            where: whereCondition,
            skip,
            take: limit,
            select: { id: true, name: true, email: true, role: true, status: true, phone: true, createdAt: true },
            orderBy: { createdAt: "desc" },
        })
    ]);

    const total = users.length; 

    return { users, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

const updateUserStatus = async (userId: string, status: UserStatus) => {
    return await prisma.user.update({
        where: { id: userId },
        data: { status },
        select: { id: true, name: true, email: true, status: true, role: true },
    });
};

const getAllRentalsForAdmin = async (query: TRentalFilterQuery) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.paymentStatus) where.paymentStatus = query.paymentStatus;

    const [rentals, total] = await Promise.all([
        prisma.rentalOrder.findMany({
            where,
            skip,
            take: limit,
            include: {
                customer: { select: { id: true, name: true, email: true } },
                items: { include: { gearItem: { select: { id: true, title: true } } } },
                payments: true,
            },
            orderBy: { createdAt: "desc" },
        }),
        prisma.rentalOrder.count({ where }),
    ]);

    return { rentals, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};


export const adminServices = { getAllUsers, updateUserStatus, getAllRentalsForAdmin };