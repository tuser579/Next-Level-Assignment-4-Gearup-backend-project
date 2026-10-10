import { Role, UserStatus } from "../../../generated/prisma/enums";
import { TRentalFilterQuery } from "../rental/rental.interface";

export type TUserFilterQuery = {
    role?: Role;
    status?: UserStatus;
    search?: string;
    page?: string;
    limit?: string;
};

export type TUpdateUserStatusPayload = {
    status: UserStatus;
};

export type TAdminRentalFilterQuery = TRentalFilterQuery;
