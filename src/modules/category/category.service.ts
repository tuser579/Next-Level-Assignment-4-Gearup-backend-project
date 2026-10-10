import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { TCreateCategoryPayload, TUpdateCategoryPayload } from "./category.interface";

const createCategory = async (payload: TCreateCategoryPayload) => {
    return await prisma.category.create({ data: payload });
};

const getAllCategories = async () => {
    return await prisma.category.findMany({
        include: { _count: { select: { gearItems: true } } },
        orderBy: { name: "asc" },
    });
};

const getCategoryById = async (id: string) => {
    return await prisma.category.findUniqueOrThrow({
        where: { id },
        include: { gearItems: { take: 10 } },
    });
};

const updateCategory = async (id: string, payload: TUpdateCategoryPayload) => {
    return await prisma.category.update({
        where: { id },
        data: payload,
    });
};

const deleteCategory = async (id: string) => {
    const category = await prisma.category.findUniqueOrThrow({
        where: { id },
        include: { _count: { select: { gearItems: true } } },
    });

    if (category._count.gearItems > 0) {
        const err: any = new Error("Cannot delete category with associated gear items. Remove or reassign gear items first.");
        err.statusCode = httpStatus.BAD_REQUEST;
        throw err;
    }

    return await prisma.category.delete({ where: { id } });
};

export const categoryServices = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
