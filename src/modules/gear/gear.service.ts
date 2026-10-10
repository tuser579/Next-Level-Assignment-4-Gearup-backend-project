import { GearStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { TCreateGearPayload, TGearFilterQuery, TUpdateGearPayload } from "./gear.interface";

const getAllGear = async (filters: TGearFilterQuery) => {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 12;
    const skip = (page - 1) * limit;

    const where: any = { status: GearStatus.AVAILABLE };

    if (filters.search) {
        where.OR = [
            { title: { contains: filters.search, mode: "insensitive" } },
            { description: { contains: filters.search, mode: "insensitive" } },
            { brand: { contains: filters.search, mode: "insensitive" } },
        ];
    }
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.brand) where.brand = { contains: filters.brand, mode: "insensitive" };
    if (filters.condition) where.condition = filters.condition;
    if (filters.minPrice || filters.maxPrice) {
        where.rentalPricePerDay = {};
        if (filters.minPrice) where.rentalPricePerDay.gte = Number(filters.minPrice);
        if (filters.maxPrice) where.rentalPricePerDay.lte = Number(filters.maxPrice);
    }

    const orderBy: any = {};
    if (filters.sortBy) {
        orderBy[filters.sortBy] = filters.sortOrder || "asc";
    } else {
        orderBy.createdAt = "desc";
    }

    const [items, total] = await Promise.all([
        prisma.gearItem.findMany({
            where,
            skip,
            take: limit,
            orderBy,
            include: {
                category: { select: { id: true, name: true } },
                provider: { select: { id: true, name: true } },
            },
        }),
        prisma.gearItem.count({ where }),
    ]);

    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

const getGearById = async (id: string) => {
    return await prisma.gearItem.findUniqueOrThrow({
        where: { id },
        include: {
            category: true,
            provider: { select: { id: true, name: true, phone: true } },
            reviews: {
                include: { customer: { select: { id: true, name: true, profileImage: true } } },
                orderBy: { createdAt: "desc" },
            },
        },
    });
};

const addGearByProvider = async (providerId: string, payload: TCreateGearPayload) => {
    return await prisma.gearItem.create({
        data: {
            ...payload,
            providerId,
            availableStock: payload.totalStock,
        },
    });
};

const updateGearByProvider = async (gearId: string, providerId: string, payload: TUpdateGearPayload) => {
    // Ensure provider owns the item
    await prisma.gearItem.findFirstOrThrow({ where: { id: gearId, providerId } });
    return await prisma.gearItem.update({
        where: { id: gearId },
        data: payload,
    });
};

const deleteGearByProvider = async (gearId: string, providerId: string) => {
    await prisma.gearItem.findFirstOrThrow({ where: { id: gearId, providerId } });
    return await prisma.gearItem.delete({ where: { id: gearId } });
};

const getProviderGear = async (providerId: string) => {
    return await prisma.gearItem.findMany({
        where: { providerId },
        include: { category: { select: { name: true } }, _count: { select: { orderItems: true } } },
        orderBy: { createdAt: "desc" },
    });
};

export const gearServices = {
    getAllGear,
    getGearById,
    addGearByProvider,
    updateGearByProvider,
    deleteGearByProvider,
    getProviderGear,
};
