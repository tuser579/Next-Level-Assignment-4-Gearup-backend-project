export type TCreateCategoryPayload = {
    name: string;
    slug: string;
    description?: string;
    iconUrl?: string;
};

export type TUpdateCategoryPayload = {
    name?: string;
    slug?: string;
    description?: string;
    iconUrl?: string;
};
