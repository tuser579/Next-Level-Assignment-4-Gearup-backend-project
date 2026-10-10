import { GearStatus, ItemCondition } from "../../../generated/prisma/enums";

export type TGearFilterQuery = {
    search?: string;
    categoryId?: string;
    brand?: string;
    condition?: ItemCondition;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
};

export type TCreateGearPayload = {
    title: string;
    slug: string;
    description: string;
    brand: string;
    model?: string;
    condition?: ItemCondition;
    rentalPricePerDay: number;
    depositFee?: number;
    totalStock: number;
    location: string;
    images: string[];
    specifications?: any;
    categoryId: string;
};

export type TUpdateGearPayload = Partial<TCreateGearPayload> & {
    status?: GearStatus;
};
