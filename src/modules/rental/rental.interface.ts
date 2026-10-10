import { PaymentStatus, RentalOrderStatus } from "../../../generated/prisma/enums";

export type TRentalItemInput = {
    gearItemId: string;
    quantity: number;
};

export type TCreateRentalPayload = {
    startDate: string;
    endDate: string;
    items: TRentalItemInput[];
    notes?: string;
};

export type TRentalFilterQuery = {
    page?: string;
    limit?: string;
    status?: RentalOrderStatus;
    paymentStatus?: PaymentStatus;
};
