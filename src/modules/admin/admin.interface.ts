import { PaymentStatus, RentalOrderStatus, Role, UserStatus } from "../../../generated/prisma/enums";

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

export type TRentalFilterQuery = {
    page?: string;
    limit?: string;
    status?: RentalOrderStatus;
    paymentStatus?: PaymentStatus;
};